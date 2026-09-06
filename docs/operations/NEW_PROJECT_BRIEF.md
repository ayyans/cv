# New Project Brief — `yeddes.com` Deploy

> Copy-paste this into a **new chat with Mavis** to start any new project that needs to deploy to `yeddes.com` or `*.yeddes.com`. Fill in every section before asking for code. If a question doesn't apply, write `N/A` and explain why in one line.

---

## 0. Skills to mention in your first message

Always name these two skills up front so they get loaded:

- **`ghcr-images`** — building + pushing the container to `ghcr.io`
- **`yeddes-deploy`** — Kubernetes manifests, HTTPRoute, cluster access

> Open with: *"Use the `ghcr-images` and `yeddes-deploy` skills. Here's the brief…"*

If your project also needs:
- A design system / Tailwind / component library → mention **`frontend-design`**
- A full app scaffold from scratch → mention **`app-builder`** or **`web-app-builder`**
- A long spec / design doc → mention **`brainstorming`** first
- A research or analysis task → mention **`deep-research`**
- A Word/PDF deliverable → mention **`docx`** or **`pdf`**

---

## 1. Project basics

| Field | Value |
|---|---|
| **Project name** (kebab-case) | e.g. `inventory-tracker` |
| **Local path** (Windows) | e.g. `C:\Users\ayman yeddes\Projects\inventory-tracker` |
| **GitHub repo URL** | e.g. `https://github.com/ayyans/inventory-tracker.git` |
| Public or private? | public / private |
| Default branch | `main` (assumed) |
| Existing code? | greenfield (new) / has code (point to commit) |

---

## 2. Domain choice

The cluster only serves `yeddes.com` and `*.yeddes.com`. Pick one:

- [ ] **Apex** — `yeddes.com` (replaces the current portfolio, only do this if retiring the old one)
- [ ] **Subdomain** — `<name>.yeddes.com` (e.g. `inventory.yeddes.com`)

Subdomain name: `__________________.yeddes.com`

> If the apex is already taken by another app, you can't add a second one to the same hostname. Talk to the cluster owner.

---

## 3. Image registry

GHCR is the default. Fill in:

- **Image name:** `ghcr.io/<owner>/<repo>` (e.g. `ghcr.io/ayyans/inventory-tracker`)
- **Visibility:**
  - [ ] **Public** — simpler, no pull secret needed (you'll flip the visibility in the GitHub UI after first push)
  - [ ] **Private** — requires the `ghcr` image pull secret in the `yeddes` namespace (created on first deploy)

> The assistant can also push to Docker Hub, GitLab Container Registry, or AWS ECR if you have those — but GHCR is the default and fastest.

---

## 4. Tech stack

| Field | Value |
|---|---|
| **Language + framework** | e.g. Node 22 + Next.js / Python 3.12 + FastAPI / Go 1.23 / Rust / etc. |
| **Package manager** | pnpm / npm / yarn / bun / poetry / cargo |
| **Container port** (what the app listens on) | e.g. `3000`, `8080`, `80` |
| **Start command** | e.g. `node server.js`, `gunicorn -b 0.0.0.0:8000 app:app`, `./server` |
| **Build command** (if any) | e.g. `pnpm build`, `npm run build`, `go build -o server` |
| **Health check path** | e.g. `/health`, `/`, `/api/ping` |
| **Static assets folder** (if any) | e.g. `public/`, `dist/`, `static/` |
| **Standalone / self-contained build?** | e.g. Next.js `output: "standalone"`, Go binary, Rust release — anything that lets the final image drop `node_modules` |

---

## 5. Environment variables

List every env var the running app needs. Mark which are **secrets**.

| Name | Value (or `from: secretName` for secrets) | Secret? |
|---|---|---|
| `NODE_ENV` | `production` | no |
| `DATABASE_URL` | from secret `db-url` | **yes** |
| `NEXT_PUBLIC_SITE_URL` | `https://inventory.yeddes.com` | no |
| | | |

> Secrets should be stored as **Kubernetes Secrets** in the `yeddes` namespace, not baked into the image. The assistant will create them as needed.

---

## 6. Resource requirements

| Field | Value |
|---|---|
| **Replica count** | 2 (default), or higher for HA |
| **CPU request / limit** | e.g. `50m / 500m` |
| **Memory request / limit** | e.g. `128Mi / 512Mi` |
| **Persistent storage needed?** | yes / no — if yes, how much (e.g. `5Gi`) and read-write mode |
| **Long-running requests?** (>30s) | yes / no — if yes, mention it (timeouts may need tuning) |
| **WebSockets?** | yes / no |
| **Cron / scheduled jobs?** | yes / no — if yes, schedule (e.g. `0 3 * * *`) and command |

---

## 7. Networking & TLS

- [ ] **HTTPS** is always on (cluster-managed cert for `*.yeddes.com`).
- [ ] **CORS** — if your app calls external APIs from the browser, list the allowed origins.
- [ ] **Auth** — does the app need a login? (NextAuth, Clerk, Auth0, custom?) Provide the relevant env vars.
- [ ] **External integrations** — list any third-party APIs the app talks to.

---

## 8. Database / state

| Question | Answer |
|---|---|
| Does the app need a database? | yes / no |
| If yes, what kind? | Postgres / MySQL / SQLite / Redis / Mongo / etc. |
| Where will it run? | Same cluster (request PVC) / external managed (Supabase, Neon, RDS) / etc. |
| Connection string? | (provide) |
| Migrations? | yes / no — if yes, how are they run (CLI command, init container, etc.) |

> The cluster has no managed database. SQLite works on a `ReadWriteOnce` PVC; Postgres/MySQL need either a same-cluster deployment or an external provider.

---

## 9. Pre-flight checks the assistant will run

Expect the assistant to:

1. Confirm `gh auth status` has `write:packages` scope (may ask you to run `gh auth refresh` in your terminal)
2. Confirm Docker Desktop is running
3. Confirm `kubectl get pods` works in the `yeddes` namespace
4. Confirm the GitHub repo exists and is reachable
5. Verify the desired hostname is available (no existing HTTPRoute owns it)

If any of these fail, the assistant will stop and ask you to fix it.

---

## 10. What the assistant will deliver

- `Dockerfile` (multi-stage, non-root, healthcheck)
- `.dockerignore`
- `k8s/manifest.yaml` (Deployment + Service + HTTPRoute) and any siblings (e.g. `www-manifest.yaml` for redirects)
- A live URL at the chosen hostname, returning HTTP 200
- A README section with deploy + rollback commands

If the project is a Next.js / web app: `next.config.mjs` may be updated to add `output: "standalone"` (smaller image). No other app code is touched unless you ask.

---

## 11. After the first deploy — re-deploying

Every subsequent change is the same three commands:

```powershell
$tag = (git rev-parse --short HEAD)
$image = "ghcr.io/<owner>/<repo>:$tag"
docker build --platform linux/amd64 -t $image .
docker push $image
kubectl set image deployment/<name> app=$image -n yeddes
kubectl rollout status deployment/<name> -n yeddes
```

Or let the assistant do it.

---

## 12. Paste-ready first message

```
Use the ghcr-images and yeddes-deploy skills. I want to deploy a new app to
yeddes.com. Here's the brief:

1. Project: <name>
2. Local path: <path>
3. GitHub repo: <url> (public/private)
4. Domain: <name>.yeddes.com (or apex)
5. Image: ghcr.io/<owner>/<repo> (public or private)
6. Stack: <lang + framework>
7. Container port: <port>
8. Health check: <path>
9. Start command: <cmd>
10. Env vars: <list>
11. Resources: <replicas, cpu, memory>
12. Database: <yes/no, type, where>
13. Persistent storage: <yes/no, how much>
14. Special: <cors, websocket, cron, long-running, etc.>
```

The assistant will confirm understanding, list assumptions, then ask for any missing info before writing code.
