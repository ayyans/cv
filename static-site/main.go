// Package main implements a tiny static-file server that serves a single
// embedded HTML file. Built into a distroless container image ~15 MB total.
//
// Endpoints:
//
//	GET /              -> the embedded index.html
//	GET /healthz       -> 200 "ok" (used by the cluster readiness/liveness probes)
//	anything else      -> 404
package main

import (
	_ "embed"
	"log"
	"net/http"
	"os"
)

// indexHTML is baked into the binary at build time. Keep the file named
// exactly "index.html" in the same directory as this source file.
//
//go:embed index.html
var indexHTML []byte

func main() {
	mux := http.NewServeMux()

	// Serve the embedded HTML on the root path. Trailing-slash match only
	// (Go 1.22+ pattern syntax) so /favicon.ico etc. still 404 cleanly.
	mux.HandleFunc("GET /{$}", serveIndex)
	mux.HandleFunc("GET /index.html", serveIndex)

	// Liveness + readiness probe for Kubernetes.
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	addr := ":" + port
	log.Printf("listening on %s (serving %d bytes of HTML)", addr, len(indexHTML))
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func serveIndex(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	// Tell shared caches (and Cloudflare) the file is immutable for the
	// lifetime of the image tag. When the image tag changes, the URL
	// effectively changes too because we serve from the root.
	w.Header().Set("Cache-Control", "public, max-age=300")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(indexHTML)
}
