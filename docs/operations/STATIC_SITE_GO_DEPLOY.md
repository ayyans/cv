# Static Site Deploy Manual — Go server + distroless image

> Use this when you have a static frontend (HTML/CSS/JS, or any project that produces a `dist/` folder) and want to ship it to `yeddes.com` via the cheapest possible image: **a 50-line Go binary that embeds the HTML, on distroless, ~15 MB total**.

---

## When to use this

| Use it | Don't use it |
|---|---|
| Plain HTML/CSS/JS | Next.js / Remix / Nuxt / SvelteKit (use their own build pipeline) |
| Astro static output (`dist/`) | SSR apps that need Node at runtime |
| Hugo / Eleventy / 11ty output | Apps with a real API server |
| Vite SPA bundled into HTML | Anything that needs `npm start` |
| Any `dist/` folder you can drop into the container | Projects where the build output is JS-heavy and needs to call out to a backend in-cluster |

For everything else, fall back to the [general runbook](./DEPLOY_RUNBOOK.md).

---

## Prerequisites (one-time per machine)

Same as the general runbook. Quick recap:

```powershell
# Tools
winget install -e --id GitHub.cli
winget install -e --id Docker.DockerDesktop
winget install -e --id Kubernetes.kubectl

# GitHub auth (with packages scope)
gh auth login
gh auth refresh -h github.com -s write:packages -s read:packages

# Docker login to ghcr.io
gh auth token | docker login ghcr.io -u <owner> --password-stdin

# kubectl (k8s namespace `yeddes`)
kubectl get pods     # should work without -n flag
```

If `kubectl get namespace yeddes` returns `Forbidden`, that's correct — you have namespace-scoped access.

---

## Project layout (drop into ANY repo)

```
any-project/
└── static-site/                 ← create this directory fresh
    ├── go.mod                    ← Go module file
    ├── main.go                   ← server (~50 lines)
    ├── index.html                ← your HTML (or whole `dist/` folder)
    ├── Dockerfile                ← multi-stage
    └── .dockerignore
```

The directory name `static-site` is convention — call it `web`, `public`, `dist-server`, whatever. Just remember the path you chose.

---

## File templates

### `go.mod`

```go
module example.com/your-project/static-site

go 1.24
```

The module path doesn't matter for the binary — it just needs a valid module file so `go build` works.

### `main.go` (copy-paste as-is)

```go
// Tiny static-file server that serves embedded files from this directory.
// Build a single binary; ship the HTML/CSS/JS/whatever alongside as
// //go:embed entries below.

package main

import (
	"embed"
	"io"
	"io/fs"
	"log"
	"mime"
	"net/http"
	"os"
	"path"
	"strings"
)

//go:embed index.html assets
var rootFS embed.FS

func main() {
	sub, err := fs.Sub(rootFS, ".")
	if err != nil {
		log.Fatal(err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	mux := http.NewServeMux()
	// Root + any nested path resolves to files inside the embedded FS.
	mux.Handle("/", &staticHandler{fs: sub})

	// Probe for the cluster.
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = io.WriteString(w, "ok")
	})

	addr := ":" + port
	log.Printf("static-server listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}

type staticHandler struct {
	fs fs.FS
}

func (h *staticHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Strip the leading slash, map "/" -> "index.html"
	up := strings.TrimPrefix(r.URL.Path, "/")
	if up == "" || up == "/" {
		up = "index.html"
	}
	// Prevent path traversal: no ".." allowed.
	if strings.Contains(up, "..") {
		http.Error(w, "bad path", http.StatusBadRequest)
		return
	}

	f, err := h.fs.Open(up)
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	defer f.Close()

	stat, err := f.Stat()
	if err != nil {
		http.Error(w, "stat error", http.StatusInternalServerError)
		return
	}

	// If a directory was requested, try index.html inside it.
	if stat.IsDir() {
		up = path.Join(up, "index.html")
		f, err = h.fs.Open(up)
		if err != nil {
			http.Error(w, "not found", http.StatusNotFound)
			return
		}
		defer f.Close()
		stat, _ = f.Stat()
	}

	w.Header().Set("Content-Type", mime.TypeByExtension(path.Ext(up)))
	// Tell caches the file is immutable while this image tag is live.
	w.Header().Set("Cache-Control", "public, max-age=300")
	http.ServeContent(w, r, up, stat.ModTime(), f.(io.ReadSeeker))
}
```

### `Dockerfile`

```dockerfile
# syntax=docker/dockerfile:1.7
#
# Build context = the static-site/ directory itself. Example:
#   docker build --platform linux/amd64 -t ghcr.io/<owner>/<repo>:<tag> static-site

FROM golang:1.24-alpine AS builder
WORKDIR /src
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o /out/server .

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /out/server /server
USER nonroot:nonroot
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000
ENTRYPOINT ["/server"]
```

### `.dockerignore`

```
server
server.exe
*.test
*.out

README.md
.env.example
.dockerignore
.git
```

---

## Variations

### A. Just `index.html`

If your project is a single HTML file:

```go
//go:embed index.html
var rootFS embed.FS
```

The server above expects this pattern. Single file = top-level `index.html`, anything else 404s.

### B. Whole folder (`dist/` from a framework)

If `npm run build` outputs to `dist/`, copy the contents into `static-site/dist/` and:

```go
//go:embed dist
var rootFS embed.FS
```

And change the `fs.Sub` call to:

```go
sub, err := fs.Sub(rootFS, "dist")
```

Same `ServeHTTP` logic. Browsers will get `dist/index.html` on `/`, `dist/about/index.html` on `/about`, etc.

### C. Multiple top-level assets (CSS, JS, fonts)

```text
static-site/
├── index.html
├── assets/
│   ├── style.css
│   ├── app.js
│   └── fonts/
│       └── inter.woff2
```

```go
//go:embed index.html assets
var rootFS embed.FS
```

The handler above serves everything under `assets/` automatically. `Content-Type` is set from extension via `mime.TypeByExtension`. `Cache-Control: public, max-age=300` is set on every response — bump it for hashed assets.

### D. Hashed asset caching (production-grade)

If your framework produces hashed filenames (`app-a3f9b2.js`), you want those cached forever. Tell the handler:

```go
type staticHandler struct {
    fs          fs.FS
    longCache   []string  // path prefixes that get long cache
}

func (h *staticHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // ... open file as before ...
    cache := "public, max-age=300"
    for _, p := range h.longCache {
        if strings.HasPrefix(r.URL.Path, p) {
            cache = "public, max-age=31536000, immutable"
        }
    }
    w.Header().Set("Cache-Control", cache)
    // ...
}
```

And `longCache: []string{"/assets/", "/_next/static/"}` for Next.js outputs, etc.

### E. SPA fallback (any unknown route → index.html)

For client-side routers (React Router, Vue Router, SvelteKit SPA mode):

```go
mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    // Try to serve the requested file. If not found, fall back to index.html.
    up := strings.TrimPrefix(r.URL.Path, "/")
    if up == "" || strings.Contains(up, "..") {
        http.Error(w, "bad path", http.StatusBadRequest)
        return
    }

    data, err := fs.ReadFile(rootFS, up)
    if err != nil {
        // Fall back to index.html for SPA routing.
        data, err = fs.ReadFile(rootFS, "index.html")
        if err != nil {
            http.Error(w, "not found", http.StatusNotFound)
            return
        }
        w.Header().Set("Content-Type", "text/html; charset=utf-8")
    } else {
        w.Header().Set("Content-Type", mime.TypeByExtension(path.Ext(up)))
    }
    w.Header().Set("Cache-Control", "public, max-age=300")
    w.Write(data)
})
```

This is the drop-in version you use when `npm run build` outputs a SPA bundle that handles its own routing.

---

## Build, push, deploy (one script)

Save this as `static-site/deploy.ps1` if you want a one-liner:

```powershell
# static-site/deploy.ps1 — run from the project root.
param(
    [Parameter(Mandatory=$true)][string]$Image,   # ghcr.io/<owner>/<repo>
    [string]$Registry = "ghcr.io"
)

$ErrorActionPreference = "Stop"

# --- pre-flight ---
if (-not (Test-Path "static-site/main.go")) {
    throw "Run this from the repo root; static-site/main.go not found."
}
$token = (gh auth token).Trim()
$tag = (git rev-parse --short HEAD).Trim()
$fullImage = "${Image}:$tag"

Write-Host "==> Building $fullImage (context: static-site/)" -ForegroundColor Cyan
docker build --platform linux/amd64 -t $fullImage static-site
if ($LASTEXITCODE) { throw "docker build failed" }

Write-Host "==> Logging in to ghcr.io" -ForegroundColor Cyan
$token | docker login $Registry -u (gh api user -q .login) --password-stdin | Out-Null

Write-Host "==> Pushing $fullImage" -ForegroundColor Cyan
docker push $fullImage
if ($LASTEXITCODE) { throw "docker push failed" }

Write-Host "==> Bumping k8s manifest" -ForegroundColor Cyan
(Get-Content "k8s/manifest.yaml" -Raw) `
    -replace 'ghcr\.io/[^:]+:[a-f0-9]+', $fullImage | `
    Set-Content "k8s/manifest.yaml" -NoNewline

Write-Host "==> Applying" -ForegroundColor Cyan
kubectl apply -f k8s/manifest.yaml
kubectl rollout status deployment/yeddes-com -n yeddes --timeout=120s

Write-Host "==> Smoke test" -ForegroundColor Cyan
$code = (curl.exe -sS -o NUL -w "%{http_code}" https://yeddes.com/)
Write-Host "    https://yeddes.com/ -> $code"

Write-Host "==> Done. Image $fullImage is live." -ForegroundColor Green
Write-Host "    Commit the manifest bump and git push."
```

Run it from the repo root:

```powershell
.\static-site\deploy.ps1 -Image ghcr.io/ayyans/cv
```

That's the whole loop — ~30s of build + push + 30s rolling restart.

### Manual version (no script)

```powershell
cd "C:\path\to\project"
$tag = (git rev-parse --short HEAD)
$image = "ghcr.io/<owner>/<repo>:$tag"

docker build --platform linux/amd64 -t $image static-site
docker push $image

# Edit k8s/manifest.yaml:
#   image: ghcr.io/<owner>/<repo>:<old-tag>
# becomes:
#   image: ghcr.io/<owner>/<repo>:<new-tag>

kubectl apply -f k8s/manifest.yaml
kubectl rollout status deployment/yeddes-com -n yeddes

curl.exe -sS -o NUL -w "%{http_code}`n" https://yeddes.com/
```

---

## Image naming conventions

| Pattern | When |
|---|---|
| `ghcr.io/<owner>/<repo>:tag` | Per-project single image. Tag = git short SHA. |
| `ghcr.io/<owner>/<repo>:v1.0.0` | Stable releases. Tag + push, then `kubectl set image`. |
| `ghcr.io/<owner>/<repo>:latest` | **Never.** K8s can't detect changes; rollouts silently do nothing. |

`<owner>` must be lowercase. Image and tag must be lowercase. Container port stays at **3000** unless you change the cluster's Service — which means changing the manifest, which means redeploy. Pick a port and stick to it.

---

## Rollback

Bad deploy? Two ways:

**Use the previous git tag:**

```powershell
git log --oneline -10 k8s/manifest.yaml   # find the image tag that worked
# edit the manifest to that SHA
kubectl apply -f k8s/manifest.yaml
kubectl rollout status deployment/yeddes-com -n yeddes
```

**Use kubectl's built-in history:**

```powershell
kubectl rollout undo deployment/yeddes-com -n yeddes
kubectl rollout status deployment/yeddes-com -n yeddes
```

`rollout undo` only works as long as the previous ReplicaSet still exists (default 10 revision history). Beyond that, you have to redeploy manually with an older image tag.

---

## Cluster config cheatsheet

This stack assumes you've already done the one-time `ghcr` secret per the general runbook:

```yaml
spec:
  imagePullSecrets:
    - name: ghcr   # omit if your package is public
  containers:
    - name: app
      image: ghcr.io/<owner>/<repo>:<tag>
      ports:
        - name: http
          containerPort: 3000
      readinessProbe:
        httpGet: { path: /healthz, port: http }
        initialDelaySeconds: 2     # distroless cold-starts in <1s
        periodSeconds: 5
      livenessProbe:
        httpGet: { path: /healthz, port: http }
        initialDelaySeconds: 10
        periodSeconds: 30
      resources:
        requests:  { cpu: "10m", memory: "32Mi" }   # go+distroless is small
        limits:    { cpu: "200m", memory: "128Mi" }
```

Adjust the deploy manifest in `k8s/manifest.yaml` accordingly. The simplest path is to copy the existing one and tweak.

---

## Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| `docker build` fails with `index.html: no such file or directory` | file not next to `main.go` | `static-site/index.html` must sit next to `main.go`; //go:embed is relative |
| Image works locally but 404 in cluster | distroless image is built without shell, can't `exec` | Use `kubectl logs deployment/yeddes-com` to debug; if logs are empty, port mismatch |
| Push fails with 403 | gh token lost `write:packages` scope | `gh auth refresh -h github.com -s write:packages -s read:packages` |
| Build takes ages | Wrong context (including `node_modules` etc.) | `docker build ... static-site`, never `.` from repo root |
| `exec format error` in pod logs | Built on ARM (Apple Silicon), deployed on amd64 | Add `--platform linux/amd64` to `docker build` |
| Browser shows old HTML | Cloudflare cached the previous tag | `curl "https://yeddes.com/?cb=$random"` once, hard refresh in browser |
| Pod `ImagePullBackOff` + `unauthorized` | Pull secret expired or removed | `kubectl create secret docker-registry ghcr --docker-server=ghcr.io --docker-username=<owner> --docker-password=$token --namespace=yeddes` (see general runbook §0.5) |
| `//go:embed` complains about `pattern matched no files` | You're trying to embed a file that's gitignored or in a subfolder with no init | Add the file to the embed target, or remove `.dockerignore` patterns that exclude it |

---

## Tearing it down

```powershell
kubectl delete httproute yeddes-com yeddes-com-www -n yeddes
kubectl delete service yeddes-com -n yeddes
kubectl delete deployment yeddes-com -n yeddes
```

The `ghcr` secret, the package in GHCR, and the GitHub repo all stay where they are.

---

## Reference: file tree of this repo

```
yeddes.com/
├── ayman-portfolio-preview.html     ← source HTML (the one you build)
├── static-site/                    ← Go server + Dockerfile (this guide)
│   ├── go.mod
│   ├── main.go
│   ├── index.html                  ← COPY of ayman-portfolio-preview.html
│   ├── Dockerfile
│   └── .dockerignore
├── k8s/
│   ├── manifest.yaml               ← Deployment + Service + HTTPRoute
│   └── www-manifest.yaml
└── docs/
    ├── operations/
    │   ├── DEPLOY_RUNBOOK.md            ← general runbook (any app)
    │   ├── NEW_PROJECT_BRIEF.md         ← fresh-chat template
    │   └── STATIC_SITE_GO_DEPLOY.md     ← this file
    └── superpowers/{specs,plans}/       ← design + implementation plans
```
