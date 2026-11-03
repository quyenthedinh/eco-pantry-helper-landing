import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
let portValue = process.env.PORT || '5173';
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port') portValue = args[++i];
  else if (args[i].startsWith('--port=')) portValue = args[i].slice(7);
  else {
    console.error('Cách chạy: npm run dev -- --port 5173');
    process.exit(1);
  }
}
const port = Number(portValue);
if (!/^\d+$/.test(portValue ?? '') || !Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Cổng không hợp lệ. Hãy chọn số từ 1 đến 65535, ví dụ: npm run dev -- --port 5174');
  process.exit(1);
}
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.apk': 'application/vnd.android.package-archive' };
const publicFiles = new Set(['index.html', 'styles.css', 'polish.css', 'header.css', 'marketing.css', 'typography.css', 'receipt.css', 'main.js', 'motion.js', 'feedback.js', 'app-release.js']);

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Máy chủ localhost chỉ phục vụ nội dung của landing page.');
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    if (!publicFiles.has(relative) && !relative.startsWith('assets/')) throw new Error('Not found');
    const target = path.resolve(root, relative);
    const assetPath = path.relative(path.join(root, 'assets'), target);
    const isAsset = relative.startsWith('assets/') && assetPath !== '..' && !assetPath.startsWith(`..${path.sep}`) && !path.isAbsolute(assetPath);
    if (!publicFiles.has(relative) && !isAsset) throw new Error('Not found');
    const file = await stat(target);
    if (!file.isFile()) throw new Error('Not found');
    const extension = path.extname(target);
    const headers = { 'Content-Type': types[extension] || 'application/octet-stream', 'Content-Length': file.size, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' };
    if (extension === '.apk') headers['Content-Disposition'] = 'attachment; filename="Eco-Pantry.apk"';
    res.writeHead(200, headers);
    if (req.method === 'HEAD') res.end();
    else await pipeline(createReadStream(target), res);
  } catch {
    if (res.headersSent || res.destroyed) { res.destroy(); return; }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Không tìm thấy trang.');
  }
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Cổng ${port} đang được sử dụng. Dừng server đang chạy bằng Ctrl+C hoặc dùng: npm run dev -- --port ${port === 65535 ? 5173 : port + 1}`);
  } else {
    console.error(`Không thể mở localhost: ${error.message}`);
  }
  process.exitCode = 1;
});

console.log('Đang khởi động Eco-Pantry...');
server.listen(port, '127.0.0.1', () => {
  console.log(`Local: http://localhost:${port}`);
  console.log('Giữ terminal này mở. Sửa file, lưu lại rồi tải lại trình duyệt để xem thay đổi.');
  console.log('Nhấn Ctrl+C để dừng server.');
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
