const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const urls = [
  "https://www.instagram.com/p/DfTQQT-OWM0/",
  "https://www.instagram.com/p/DfTRB7DOhP5/",
  "https://www.instagram.com/p/DfTQwh-u8jD/",
  "https://www.instagram.com/p/DfTQZ4BuX8u/",
  "https://www.instagram.com/p/DfTQ173OYef/",
  "https://www.instagram.com/p/DfTQzO9O8bc/",
  "https://www.instagram.com/p/DfTQT1eOlfE/",
  "https://www.instagram.com/p/DfTQqfYOlUD/",
  "https://www.instagram.com/p/DfTQtpwumd2/",
  "https://www.instagram.com/p/DfTQ4VWOgnQ/",
  "https://www.instagram.com/p/DfTQ_Yku8UC/",
  "https://www.instagram.com/p/DfTQlOMuffA/",
  "https://www.instagram.com/p/DfTQ7cLOoRa/",
  "https://www.instagram.com/p/DfTQe-NOAZX/",
  "https://www.instagram.com/p/DfTQnVYuKlp/",
  "https://www.instagram.com/p/DfTQcjBu1HN/",
  "https://www.instagram.com/p/DfTQie5Onwa/"
];

let isScraping = false;
let lastUpdate = Date.now();

// Cargar datos actuales si existen
let currentData = [];
if (fs.existsSync('conteo_resultados.json')) {
  try {
    currentData = JSON.parse(fs.readFileSync('conteo_resultados.json', 'utf8'));
  } catch (e) {
    currentData = [];
  }
}

function scrapeUrl(url) {
  return new Promise((resolve) => {
    const cmd = `"${chromePath}" --headless=new --disable-gpu --dump-dom "${url}"`;
    exec(cmd, { maxBuffer: 15 * 1024 * 1024, timeout: 15000 }, (error, stdout) => {
      if (error || !stdout) {
        return resolve({ url, success: false });
      }
      
      const likesMatch = stdout.match(/([0-9.,]+)\s*(?:likes|me gusta)/i);
      let likes = 0;
      if (likesMatch) {
        likes = parseInt(likesMatch[1].replace(/[.,]/g, ''), 10) || 0;
      }

      const commentsMatch = stdout.match(/([0-9.,]+)\s*(?:comments|comentarios)/i);
      let comments = 0;
      if (commentsMatch) {
        comments = parseInt(commentsMatch[1].replace(/[.,]/g, ''), 10) || 0;
      }

      const ogImg = stdout.match(/<meta property="og:image" content="([^"]+)"/i);
      const image = ogImg ? ogImg[1].replace(/&amp;/g, '&') : '';

      const code = url.split('/p/')[1].replace(/\//g, '');
      const localImage = `fotos/${code}.jpg`;

      // Si la foto no existe localmente pero la tenemos de og:image, la descargamos
      if (image && !fs.existsSync(localImage)) {
        fetch(image, { headers: { 'User-Agent': 'Mozilla/5.0' } })
          .then(r => r.arrayBuffer())
          .then(buf => fs.writeFileSync(localImage, Buffer.from(buf)))
          .catch(() => {});
      }

      resolve({ url, likes, comments, localImage, image, shortcode: code, success: true });
    });
  });
}

async function updateAll() {
  if (isScraping) return currentData;
  isScraping = true;
  console.log(`[${new Date().toLocaleTimeString('es-CL')}] Verificando votos de las 17 publicaciones...`);

  // Ejecutamos en tandas de 3 concurrentes para ser rápidos y respetuosos
  const results = [];
  const batchSize = 3;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(scrapeUrl));
    results.push(...batchResults);
  }

  // Fusionar con datos previos para preservar imágenes si alguna llamada falló
  const merged = results.map(r => {
    const prev = currentData.find(p => p.url === r.url) || {};
    return {
      url: r.url,
      shortcode: r.shortcode || prev.shortcode || r.url.split('/p/')[1].replace(/\//g, ''),
      likes: r.success ? r.likes : (prev.likes || 0),
      comments: r.success ? r.comments : (prev.comments || 0),
      localImage: r.localImage || prev.localImage || `fotos/${r.url.split('/p/')[1].replace(/\//g, '')}.jpg`,
      image: r.image || prev.image || '',
      success: r.success
    };
  });

  merged.sort((a, b) => b.likes - a.likes);
  currentData = merged;
  lastUpdate = Date.now();
  isScraping = false;

  try {
    fs.writeFileSync('conteo_resultados.json', JSON.stringify(currentData, null, 2));
    // Guardar CSV
    let csv = "Ranking,Likes,Comentarios,Enlace\n";
    currentData.forEach((item, idx) => {
      csv += `${idx + 1},${item.likes},${item.comments},"${item.url}"\n`;
    });
    fs.writeFileSync('conteo_likes.csv', '\uFEFF' + csv, 'utf8');
  } catch (e) {
    console.error('Error guardando archivos:', e.message);
  }

  console.log(`[${new Date().toLocaleTimeString('es-CL')}] Conteo actualizado con éxito.`);
  return currentData;
}

// Auto-actualización cada 45 segundos
setInterval(() => {
  updateAll().catch(e => console.error(e));
}, 45000);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.csv': 'text/csv; charset=utf-8',
  '.css': 'text/css'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // Endpoint de datos
  if (pathname === '/api/data') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(JSON.stringify({
      data: currentData,
      isScraping,
      lastUpdate
    }));
  }

  // Endpoint para forzar actualización inmediata
  if (pathname === '/api/refresh') {
    if (!isScraping) {
      updateAll();
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'updating' }));
  }

  // Servir archivos estáticos
  let filePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  filePath = path.resolve(__dirname, decodeURIComponent(filePath));

  // Seguridad: evitar directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Acceso denegado');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Archivo no encontrado');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  SISTEMA DE CONTEO EN VIVO INICIADO`);
  console.log(`  Abre en tu navegador: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});

