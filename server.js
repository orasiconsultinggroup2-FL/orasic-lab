const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.argv[2]) || 5050;

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET /api/articulos
  if (pathname === '/api/articulos' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    const data = fs.readFileSync(path.join(__dirname, 'articulos.json'), 'utf8');
    res.writeHead(200);
    res.end(data);
    return;
  }

  // GET /api/leads
  if (pathname === '/api/leads' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    const data = fs.readFileSync(path.join(__dirname, 'leads.json'), 'utf8');
    res.writeHead(200);
    res.end(data);
    return;
  }

  // POST /api/articulos
  if (pathname === '/api/articulos' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const articulos = JSON.parse(body);
      fs.writeFileSync(path.join(__dirname, 'articulos.json'), JSON.stringify(articulos, null, 2));
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // POST /api/leads
  if (pathname === '/api/leads' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const newLeads = JSON.parse(body);
      const leadsPath = path.join(__dirname, 'leads.json');
      const existing = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
      const merged = Array.isArray(existing) ? [...existing, ...newLeads] : newLeads;
      fs.writeFileSync(leadsPath, JSON.stringify(merged, null, 2));
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, pathname);
  if (pathname === '/' || pathname === '') filePath = path.join(__dirname, 'index.html');
  if (pathname === '/content-studio/' || pathname === '/content-studio') filePath = path.join(__dirname, 'content-studio/index.html');

  try {
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2'
    };
    const mimeType = mimeTypes[ext] || 'text/plain';
    res.setHeader('Content-Type', mimeType);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath);
      res.writeHead(200);
      res.end(content);
      return;
    }
  } catch (e) {
    // fallthrough to 404
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor ORASIC Lab corriendo en http://localhost:${PORT}`);
});
