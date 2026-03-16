const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    // Ignora requisições internas do Chrome DevTools para não poluir o log
    if (req.url.startsWith('/.well-known/appspecific')) {
        res.writeHead(404);
        res.end();
        return;
    }

    // Limpa a URL de parâmetros de consulta (ex: ?v=1) e decodifica espaços
    const safeUrl = decodeURI(req.url.split('?')[0]);
    
    // Segurança: Evita acesso a pastas pai (..)
    if (safeUrl.includes('..')) {
        res.writeHead(403);
        res.end('Acesso negado');
        return;
    }
    
    let filePath = path.join(__dirname, safeUrl === '/' ? 'index.html' : safeUrl);
    
    // Obtém a extensão para definir o Content-Type correto
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log(`[404] Arquivo não encontrado: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Arquivo não encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Erro no servidor: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});