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

const namesMap = {
  'DfTRB7DOhP5': 'MAITTE OPAZO',
  'DfTQ_Yku8UC': 'PALOMA ALVARADO',
  'DfTQ7cLOoRa': 'ISADORA MARTINEZ',
  'DfTQ4VWOgnQ': 'LUCIA SOTO',
  'DfTQ173OYef': 'LEONOR GONZALEZ',
  'DfTQzO9O8bc': 'ISIADORA LEIVA',
  'DfTQwh-u8jD': 'EMILIA FRITSCH',
  'DfTQtpwumd2': 'EMILIA BORQUEZ',
  'DfTQqfYOlUD': 'ESTEFANI CARCAMO',
  'DfTQnVYuKlp': 'VICTOR VEGA',
  'DfTQlOMuffA': 'JAVIERA ACUÑA Y DAYHARY PEREZ',
  'DfTQie5Onwa': 'DAMARYS ALVAREZ',
  'DfTQe-NOAZX': 'GIANELLA MONSALVE',
  'DfTQcjBu1HN': 'KEVIN DOMKE Y MATILDA ESPINOZA',
  'DfTQZ4BuX8u': 'ROSA HARO',
  'DfTQT1eOlfE': 'FERNANDA GALLARDO',
  'DfTQQT-OWM0': 'RENATA ARRIAGADA'
};

let isScraping = false;
let lastUpdate = Date.now();

// Cargar datos actuales si existen
let currentData = [];
if (fs.existsSync('conteo_resultados.json')) {
  try {
    currentData = JSON.parse(fs.readFileSync('conteo_resultados.json', 'utf8'));
    currentData.forEach(item => {
      const code = item.shortcode || item.url.split('/p/')[1].replace(/\//g, '');
      item.shortcode = code;
      item.name = namesMap[code] || item.name || 'PARTICIPANTE';
      item.localImage = `fotos/${code}.jpg`;
    });
  } catch (e) {
    currentData = [];
  }
}

const os = require('os');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function scrapeUrl(url) {
  return new Promise((resolve) => {
    const code = url.split('/p/')[1].replace(/\//g, '');
    const tempProfile = path.join(os.tmpdir(), `ch_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
    const rnd = Math.random().toString(36).substring(2, 9);
    const targetUrl = `${url}?feed_type=popular&utm_source=ig_web_copy_link&v=${rnd}`;
    
    const cmd = `"${chromePath}" --headless=new --disable-gpu --incognito --disable-cache --disk-cache-size=0 --user-data-dir="${tempProfile}" --dump-dom "${targetUrl}"`;

    exec(cmd, { maxBuffer: 15 * 1024 * 1024, timeout: 25000 }, (error, stdout) => {
      try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (e) {}

      if (error || !stdout) {
        return resolve({ url, shortcode: code, success: false });
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

      const localImage = `fotos/${code}.jpg`;
      if (image && !fs.existsSync(localImage)) {
        fetch(image, { headers: { 'User-Agent': 'Mozilla/5.0' } })
          .then(r => r.arrayBuffer())
          .then(buf => fs.writeFileSync(localImage, Buffer.from(buf)))
          .catch(() => {});
      }

      resolve({
        url,
        shortcode: code,
        name: namesMap[code] || 'PARTICIPANTE',
        likes,
        comments,
        localImage,
        image,
        success: likes > 0
      });
    });
  });
}

async function updateAll() {
  if (isScraping) return currentData;
  isScraping = true;
  console.log(`[${new Date().toLocaleTimeString('es-CL')}] Verificando votos frescos en vivo (bypass CDN)...`);

  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const res = await scrapeUrl(urls[i]);
    results.push(res);
    if (i < urls.length - 1) await sleep(800);
  }

  const merged = results.map(r => {
    const prev = currentData.find(p => p.shortcode === r.shortcode) || {};
    const code = r.shortcode || prev.shortcode || r.url.split('/p/')[1].replace(/\//g, '');
    return {
      url: r.url,
      shortcode: code,
      name: namesMap[code] || prev.name || 'PARTICIPANTE',
      likes: r.success && r.likes > 0 ? r.likes : (prev.likes || r.likes || 0),
      comments: r.success ? r.comments : (prev.comments || 0),
      localImage: r.localImage || prev.localImage || `fotos/${code}.jpg`,
      image: r.image || prev.image || '',
      success: true
    };
  });

  merged.sort((a, b) => b.likes - a.likes);
  currentData = merged;
  lastUpdate = Date.now();
  isScraping = false;

  try {
    fs.writeFileSync('conteo_resultados.json', JSON.stringify(currentData, null, 2));
    let csv = "Ranking,Concursante,Likes (Votos),Comentarios,Enlace\n";
    currentData.forEach((item, idx) => {
      csv += `${idx + 1},"${item.name}",${item.likes},${item.comments},"${item.url}"\n`;
    });
    fs.writeFileSync('conteo_likes.csv', '\uFEFF' + csv, 'utf8');
  } catch (e) {
    console.error('Error guardando archivos:', e.message);
  }

  console.log(`[${new Date().toLocaleTimeString('es-CL')}] Conteo actualizado con éxito.`);
  return currentData;
}

// Auto-actualización cada 90 segundos para evitar bloqueos de Instagram
setInterval(() => {
  updateAll().catch(e => console.error(e));
}, 90000);

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

  // Endpoint para editar un número manualmente
  if (pathname === '/api/edit' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const item = currentData.find(p => p.shortcode === payload.shortcode);
        if (item && typeof payload.likes === 'number') {
          item.likes = payload.likes;
          currentData.sort((a, b) => b.likes - a.likes);
          lastUpdate = Date.now();
          fs.writeFileSync('conteo_resultados.json', JSON.stringify(currentData, null, 2));

          let csv = "Ranking,Concursante,Likes (Votos),Comentarios,Enlace\n";
          currentData.forEach((it, idx) => {
            csv += `${idx + 1},"${it.name}",${it.likes},${it.comments},"${it.url}"\n`;
          });
          fs.writeFileSync('conteo_likes.csv', '\uFEFF' + csv, 'utf8');

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, data: currentData }));
        }
      } catch (e) {}
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid data' }));
    });
    return;
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

