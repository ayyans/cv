# Manual Deploy Runbook — `yeddes` namespace

> Do-it-yourself version of the deploy flow. Use this when you want to ship a container to `yeddes.com` or a `*.yeddes.com` subdomain without going through the assistant.
> The cluster is the **`softdigitaledge`** cluster, namespace **`yeddes`**. TLS for `yeddes.com` and `*.yeddes.com` is pre-provisioned; you don't manage certs.

---

## 0. One-time setup (per Windows machine)

### 0.1 Install the tools

```powershell
winget install -e --id GitHub.cli
winget install -e --id Docker.DockerDesktop
winget install -e --id Kubernetes.kubectl
```

Open Docker Desktop and let the Linux VM boot before running any `docker` command.

### 0.2 GitHub CLI auth with package scope

```powershell
gh auth login                       # GitHub.com, HTTPS, browser-based
gh auth refresh -h github.com -s write:packages -s read:packages
```

The second step needs a browser — the device-code pop-up times out in a non-interactive shell.

Verify:

```powershell
gh auth status
# Token scopes: 'gist', 'read:org', 'repo', 'workflow', 'write:packages'
```

### 0.3 Docker login to GHCR

```powershell
gh auth token | docker login ghcr.io -u <your-github-username> --password-stdin
# Login Succeeded
```

### 0.4 kubectl kubeconfig

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.kube" | Out-Null
# Copy your kubeconfig into place (ask cluster owner if you don't have it)
Copy-Item .\kubeconfig.yaml "$env:USERPROFILE\.kube\config"
```

Verify:

```powershell
kubectl get pods                     # should list pods in the yeddes namespace
kubectl auth can-i create deployments -n yeddes   # should print "yes"
```

If `kubectl get namespace yeddes` returns `Forbidden`, that's correct — you have namespace-scoped access, not cluster-scoped.

### 0.5 (First time only per namespace) Create the pull secret

If you keep the image **private** (recommended):

```powershell
$token = (gh auth token).Trim()
kubectl create secret docker-registry ghcr `
  --docker-server=ghcr.io `
  --docker-username=<your-github-username> `
  --docker-password=$token `
  --namespace=yeddes
```

For production, replace this with a **read-only** GitHub PAT (fine-grained, only `read:packages` on the chosen package).

If you make the package **public** (Settings → Change visibility on github.com), you can skip the secret and omit `imagePullSecrets` from the pod spec.

---

## 1. Per-app workflow

### 1.1 Project structure

Every project should look like this at minimum:

```
my-app/
├── (source code)
├── Dockerfile
├── .dockerignore
└── k8s/
    ├── manifest.yaml     # Deployment + Service + HTTPRoute
    └── (optional) www-manifest.yaml, redirect-manifest.yaml
```

### 1.2 Dockerfile (multi-stage template)

For a Node app (`pnpm` example; swap for npm/yarn/pip/cargo as needed):

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

`.dockerignore` (key lines):

```
node_modules
.next
.git
.env.local
*.log
docs
README.md
```

### 1.3 k8s manifest template

`k8s/manifest.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: yeddes
  labels:
    app: my-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      imagePullSecrets:
        - name: ghcr            # omit if image is public
      containers:
        - name: app
          image: ghcr.io/<owner>/<repo>:<tag>
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 3000
          env:
            - name: NODE_ENV
              value: production
          resources:
            requests:
              cpu: 50m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          readinessProbe:
            httpGet:
              path: /
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /
              port: http
            initialDelaySeconds: 30
            periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: my-app
  namespace: yeddes
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - name: http
      port: 80
      targetPort: http
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: my-app
  namespace: yeddes
spec:
  parentRefs:
    - name: softdigitaledge
      namespace: softdigitaledge
      # Pick ONE sectionName based on hostname:
      #   - "https-yeddes"          for apex yeddes.com
      #   - "https-yeddes-wildcard" for any *.yeddes.com subdomain
      sectionName: https-yeddes-wildcard
  hostnames:
    - myapp.yeddes.com
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /
      backendRefs:
        - name: my-app
          port: 80
```

Every object **must** set `namespace: yeddes`. Missing it = silent failure.

### 1.4 Build, push, deploy

```powershell
# From the project root
$tag = (git rev-parse --short HEAD)
$image = "ghcr.io/<owner>/<repo>:$tag"

# Build for the cluster (cluster is x86_64)
docker build --platform linux/amd64 -t $image .
docker push $image

# Substitute the tag in your manifest, then apply
# (or use sed/Find-Replace to swap IMAGE_TAG_PLACEHOLDER -> $tag)
kubectl apply -f k8s/manifest.yaml

# Wait for the new pods to come up
kubectl rollout status deployment/my-app -n yeddes --timeout=120s

# Smoke test
curl.exe -sS -o NUL -w "%{http_code}`n" https://myapp.yeddes.com/
```

Expected: `200`. If you see `503`, the pods aren't ready yet; if `404`, the HTTPRoute `hostnames` is wrong; if TLS warning, you're on the wrong hostname.

---

## 2. Rolling updates (subsequent deploys)

```powershell
$tag = (git rev-parse --short HEAD)
$image = "ghcr.io/<owner>/<repo>:$tag"
docker build --platform linux/amd64 -t $image .
docker push $image
kubectl set image deployment/my-app app=$image -n yeddes
kubectl rollout status deployment/my-app -n yeddes
```

**Never reuse the same tag** for a different image — K8s won't pick it up.

Roll back:

```powershell
kubectl rollout undo deployment/my-app -n yeddes
```

---

## 3. Redirect (www → apex, or any host → any host)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: my-app-redirect
  namespace: yeddes
spec:
  parentRefs:
    - name: softdigitaledge
      namespace: softdigitaledge
      sectionName: https-yeddes-wildcard   # or https-yeddes for apex
  hostnames:
    - www.myapp.yeddes.com
  rules:
    - filters:
        - type: RequestRedirect
          requestRedirect:
            hostname: myapp.yeddes.com
            statusCode: 301
```

---

## 4. Hard constraints (don't fight these)

- **Every object needs `namespace: yeddes`.**
- **Hostname must be `yeddes.com` or `*.yeddes.com`.** Anything else is rejected by the gateway.
- **Use `HTTPRoute` (Gateway API), not Ingress.** Ingress does not work on this cluster.
- **Don't create Certificate / ClusterIssuer / TLS Secret.** TLS is platform-managed.
- **Don't add cert-manager, ingress-nginx, or kubernetes.io/ingress.class annotations** — they fail silently.
- **Set `resources.requests` and `resources.limits` on every container.** No quota but shared nodes.
- **Pods can't reach other namespaces.** Internet egress and cluster DNS work.

---

## 5. Common commands

```powershell
# What's running in the namespace
kubectl get all -n yeddes

# Logs from a deployment
kubectl logs deployment/my-app --tail=100
kubectl logs deployment/my-app --previous     # last crashed container

# Live shell into a pod
kubectl exec -it deployment/my-app -- sh

# Describe a stuck pod
kubectl describe pod <pod-name> -n yeddes
kubectl get events -n yeddes --sort-by=.lastTimestamp

# Inspect a route
kubectl describe httproute my-app -n yeddes
kubectl get httproute my-app -n yeddes -o jsonpath='{range .status.parents[*]}{range .conditions[*]}{.type}={.status} {end}{end}'

# Tear it all down
kubectl delete httproute my-app my-app-redirect
kubectl delete service my-app
kubectl delete deployment my-app
```

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `docker push` → `denied` | token missing `write:packages` | `gh auth refresh -s write:packages`, then re-login to ghcr.io |
| `invalid reference format` | uppercase in image name | lowercase the whole reference: `ghcr.io/ayyans/cv:tag` |
| `ImagePullBackOff` + `unauthorized` | image private, no pull secret | create the `ghcr` secret (section 0.5) and reference it |
| `ImagePullBackOff` + `manifest unknown` | wrong tag | verify the tag exists: `docker pull ghcr.io/<owner>/<repo>:<tag>` |
| `exec format error` | built for wrong CPU arch | rebuild with `--platform linux/amd64` |
| HTTPRoute `Accepted=False`, `NotAllowedByListeners` | hostname not under yeddes.com, or wrong `sectionName` | use a `*.yeddes.com` hostname and the matching section (`https-yeddes` for apex, `https-yeddes-wildcard` for subdomains) |
| HTTPRoute `ResolvedRefs=False`, `BackendNotFound` | Service name/port mismatch | match `backendRefs.name` and `.port` to the Service |
| HTTP 503 from gateway | no ready endpoints | check pod readiness + that `targetPort` matches the container's listening port |
| HTTP 404 from gateway | no HTTPRoute matches that hostname | confirm the HTTPRoute `hostnames` entry equals the requested host |
| Pod `Pending` forever | node can't satisfy the request | lower `resources.requests`, or free up nodes |
| TLS warning in browser | hostname not under `yeddes.com` | the cert only covers `yeddes.com` and `*.yeddes.com`; ask the owner for other domains |
| Push rolled out but page unchanged | reused the same tag with a new image | always push a new tag (e.g. the git short SHA) |

---

## 7. About the platform

- **DNS:** `yeddes.com`, `www.yeddes.com`, and `*.yeddes.com` all resolve to the cluster (handled by the platform).
- **TLS:** one cert covers all of the above, auto-renewed via Let's Encrypt DNS-01.
- **Gateway:** shared Envoy Gateway in the `softdigitaledge` namespace, section names `http-yeddes` / `http-yeddes-wildcard` / `https-yeddes` / `https-yeddes-wildcard`.
- **You don't create or manage** ClusterIssuer, Certificate, Gateway, or DNS — they exist and are owned by the platform.

For anything cluster-scoped (new domains outside `yeddes.com`, new namespaces, CRDs, etc.) — ask the platform owner.
