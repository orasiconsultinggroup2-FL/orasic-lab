const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5051;

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET /api/articulos
  if (pathname === '/api/articulos' && req.method === 'GET') {
    const data = fs.readFileSync(path.join(__dirname, 'articulos.json'), 'utf8');
    res.writeHead(200);
    res.end(data);
    return;
  }

  // GET /api/leads
  if (pathname === '/api/leads' && req.method === 'GET') {
    const data = fs.readFileSync(path.join(__dirname, 'leads.json'), 'utf8');
    res.writeHead(200);
    res.end(data);
    return;
  }

  // POST /api/articulos
  if (pathname === '/api/articulos' && req.method === 'POST') {
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

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor ORASIC Lab corriendo en http://localhost:${PORT}`);
});
