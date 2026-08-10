import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const port = Number.parseInt(process.env.PORT ?? '4173', 10);

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.mjs', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.ico', 'image/x-icon'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function sendFile(response, filePath) {
  const type = contentTypes.get(extname(filePath)) ?? 'application/octet-stream';
  response.writeHead(200, { 'Content-Type': type });
  createReadStream(filePath).pipe(response);
}

function resolveRequestPath(urlPath) {
  const candidate = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const resolved = resolve(root, `.${sep}${candidate}`);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

createServer((request, response) => {
  const requestUrl = new URL(request.url ?? '/', 'http://localhost');
  const requestPath = requestUrl.pathname;
  const filePath = resolveRequestPath(requestPath);

  if (!filePath) {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
    return;
  }

  const isFile = existsSync(filePath) && statSync(filePath).isFile();
  const assetPath = isFile ? filePath : resolve(root, 'index.html');

  if (!existsSync(assetPath)) {
    response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Build output not found. Run npm run build first.');
    return;
  }

  sendFile(response, assetPath);
}).listen(port, '0.0.0.0', () => {
  process.stdout.write(`Frontend server listening on port ${port}\n`);
});
