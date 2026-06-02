// Minimal static server for the exported web app (dist/) with SPA fallback.
// Used by Playwright's webServer for E2E. No external deps.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const PORT = Number(process.env.PORT ?? 8082);

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const send = (res, file) => {
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
};

createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let file = join(DIST, normalize(urlPath));
  if (existsSync(file) && statSync(file).isFile()) return send(res, file);
  // SPA fallback
  return send(res, join(DIST, 'index.html'));
}).listen(PORT, () => console.log(`serving dist on http://localhost:${PORT}`));
