# syntax=docker/dockerfile:1.7
#
# Static site served by a tiny Go binary. Multi-stage build produces
# a ~15 MB distroless image that runs as nonroot.
#
# Build context must be the static-site/ directory:
#
#   docker build --platform linux/amd64 -t <image>:<tag> static-site/

# ── 1. Compile a static Go binary ──────────────────────────────────────
FROM golang:1.24-alpine AS builder
WORKDIR /src

# Cache the module download as its own layer.
COPY go.mod ./
RUN go mod download

# Copy the source and the embedded HTML, then build a static binary.
COPY main.go ./
COPY index.html ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o /out/server .

# ── 2. Lean runtime — distroless, no shell, no package manager ────────
FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=builder /out/server /server

# Match the port the cluster's Service already targets (port name "http",
# containerPort 3000). The Next.js deployment used the same port, so
# swapping the image requires zero changes to the Service/HTTPRoute.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

USER nonroot:nonroot
ENTRYPOINT ["/server"]
