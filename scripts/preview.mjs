// Local static preview with Cloudflare Pages redirect and 404 behavior.
import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../out/", import.meta.url)));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
};
const redirects = fs
  .readFileSync(path.join(root, "_redirects"), "utf8")
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("#"))
  .map((line) => line.trim().split(/\s+/));
export function route(url) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  } catch {
    return { status: 404 };
  }
  for (const [from, to, status] of redirects) {
    if (
      from === pathname ||
      (from.endsWith("*") && pathname.startsWith(from.slice(0, -1)))
    )
      return { status: Number(status), location: to };
  }
  const requested = path.resolve(root, `.${pathname}`);
  if (
    (requested !== root && !requested.startsWith(root + path.sep)) ||
    pathname.includes("..")
  )
    return { status: 404 };
  let file = requested;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory())
    file = path.join(file, "index.html");
  if (fs.existsSync(file) && fs.statSync(file).isFile())
    return { status: 200, file };
  return { status: 404, file: path.join(root, "404.html") };
}

export function serve(port = 3000) {
  const server = createServer((req, res) => {
    const result = route(req.url);
    res.statusCode = result.status;
    res.setHeader("Cache-Control", "no-store");
    if (result.location) {
      res.setHeader("Location", result.location);
      res.end();
      return;
    }
    if (!result.file || !fs.existsSync(result.file)) {
      res.end("Not found");
      return;
    }
    res.setHeader(
      "Content-Type",
      mime[path.extname(result.file)] ?? "application/octet-stream",
    );
    if (req.method === "HEAD") res.end();
    else fs.createReadStream(result.file).pipe(res);
  });
  server.listen(port, "127.0.0.1", () =>
    console.log(
      `Musashi feed preview: http://127.0.0.1:${server.address().port}`,
    ),
  );
  return server;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  serve(Number(process.env.PORT ?? 3000));
