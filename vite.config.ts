import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
import formidable from "formidable";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && {
      name: "upload-middleware",
      configureServer(server) {
        // Handle file uploads and save into a dedicated top-level folder (./uploads)
        server.middlewares.use("/api/upload", async (req, res, next) => {
          if (req.method !== "POST") return next();
          try {
            const form = formidable({ multiples: false });
            form.parse(req, (err, fields, files) => {
              if (err) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Parse error" }));
                return;
              }
              const fileInput = (files as any).file;
              const uploaded = Array.isArray(fileInput) ? fileInput[0] : fileInput;
              if (!uploaded) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "No file uploaded" }));
                return;
              }
              const uploadDir = path.resolve(__dirname, "uploads");
              fs.mkdirSync(uploadDir, { recursive: true });
              const orig = uploaded.originalFilename || "image";
              const ext = path.extname(orig);
              const base = path.basename(orig, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
              const uniqueName = `${Date.now()}_${base}${ext}`;
              const destPath = path.join(uploadDir, uniqueName);
              fs.copyFileSync(uploaded.filepath, destPath);
              const urlPath = `/uploads/${uniqueName}`;
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ url: urlPath }));
            });
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Upload failed" }));
          }
        });

        // Serve uploaded files from the dedicated folder at /uploads/*
        server.middlewares.use("/uploads", async (req, res, next) => {
          if ((req.method || "GET") !== "GET") return next();
          try {
            const uploadDir = path.resolve(__dirname, "uploads");
            const rel = decodeURIComponent((req.url || "/").replace(/^\/uploads\/?/, ""));
            const filePath = path.join(uploadDir, rel);
            const normalized = path.normalize(filePath);
            if (!normalized.startsWith(uploadDir)) {
              res.statusCode = 403;
              res.end("Forbidden");
              return;
            }
            if (!fs.existsSync(normalized) || !fs.statSync(normalized).isFile()) {
              res.statusCode = 404;
              res.end("Not Found");
              return;
            }
            const ext = path.extname(normalized).toLowerCase();
            const type =
              ext === ".png" ? "image/png" :
                ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
                  ext === ".gif" ? "image/gif" :
                    ext === ".webp" ? "image/webp" :
                      ext === ".svg" ? "image/svg+xml" :
                        "application/octet-stream";
            res.statusCode = 200;
            res.setHeader("Content-Type", type);
            fs.createReadStream(normalized).pipe(res);
          } catch (e) {
            res.statusCode = 500;
            res.end("Server Error");
          }
        });
      },
    },
    mode === "development" && {
      name: "data-middleware",
      configureServer(server) {
        const dataDir = path.resolve(__dirname, "data");
        const dataFile = path.join(dataDir, "data.json");

        server.middlewares.use("/api/data", async (req, res) => {
          const method = req.method || "GET";

          if (method === "GET") {
            try {
              if (!fs.existsSync(dataFile)) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({}));
                return;
              }
              const buf = fs.readFileSync(dataFile, "utf-8");
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(buf);
            } catch (e) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Read failed" }));
            }
            return;
          }

          if (method === "POST") {
            try {
              let body = "";
              req.on("data", (chunk) => (body += chunk));
              req.on("end", () => {
                try {
                  const obj = JSON.parse(body || "{}");
                  fs.mkdirSync(dataDir, { recursive: true });
                  fs.writeFileSync(dataFile, JSON.stringify(obj, null, 2), "utf-8");
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ ok: true }));
                } catch (err) {
                  res.statusCode = 400;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ error: "Invalid JSON" }));
                }
              });
            } catch (e) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Write failed" }));
            }
            return;
          }

          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Method not allowed" }));
        });
      },
    },
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./",
}));
