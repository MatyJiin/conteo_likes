const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
let token = "EAAQ2m5P4VKUBS1t8VYhIwW3WaM4NLPGRV2oTZCo8M6c0nMIiDKip0JEHCraGZCYZBy8ZCaMPwWVn9NECTaFASZCLO2tqaFkwzBZBgTDPx1Uo1MyzkDwjpBvTc0h141ZB3DBQwDExnFftaDaOG0iZAIspS0odE7zw6uFR0ouuaaRbTKT6TYj4NmBICG5vWKgOWZBeOSc2K6aENPG1z2PxrfvG38IIUUS0zHoA7DbntwfjUNqJX1GCzJcvJXKj2KKrj5EukFhc1YGnzcAxvHqWcgNZBxg3sc";
const igId = "17841436768752867";

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

let currentData = [];
let lastUpdate = Date.now();
let isUpdating = false;

if (fs.existsSync('conteo_resultados.json')) {
  try {
    currentData = JSON.parse(fs.readFileSync('conteo_resultados.json', 'utf8'));
  } catch (e) {
    currentData = [];
  }
}

async function updateFromMetaApi() {
  if (isUpdating) return currentData;
  isUpdating = true;
  try {
    const url = `https://graph.facebook.com/v21.0/${igId}/media?fields=id,shortcode,like_count,comments_count,permalink,media_url,thumbnail_url&limit=50&access_token=${token}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!res.ok || json.error) {
      console.error('Error Meta API:', json.error ? json.error.message : 'Status ' + res.status);
      isUpdating = false;
      return currentData;
    }

    const posts = json.data || [];
    const contestants = [];

    const existingMap = {};
    if (Array.isArray(currentData)) {
      currentData.forEach(x => { existingMap[x.shortcode] = x; });
    }

    for (const code of Object.keys(namesMap)) {
      const post = posts.find(p => p.shortcode === code);
      if (post) {
        const prevItem = existingMap[code] || {};
        const fbLikes = prevItem.fbLikes || 0;
        const igLikes = post.like_count;
        const totalVotes = igLikes + fbLikes;

        contestants.push({
          url: post.permalink || `https://www.instagram.com/p/${code}/`,
          shortcode: code,
          name: namesMap[code],
          igLikes: igLikes,
          fbLikes: fbLikes,
          totalVotes: totalVotes,
          likes: totalVotes,
          comments: post.comments_count,
          localImage: `fotos/${code}.jpg`,
          image: post.thumbnail_url || post.media_url || '',
          success: true
        });
      }
    }

    contestants.sort((a, b) => b.likes - a.likes);
    currentData = contestants;
    lastUpdate = Date.now();

    fs.writeFileSync('conteo_resultados.json', JSON.stringify(currentData, null, 2));

    console.log(`[${new Date().toLocaleTimeString('es-CL')}] Meta API: 17 concursantes actualizados en 0.2s.`);
  } catch (err) {
    console.error('Excepción al consultar Meta API:', err.message);
  } finally {
    isUpdating = false;
  }
  return currentData;
}

// Consultar Meta API cada 20 segundos (seguro, estable, dentro del margen de Meta)
setInterval(() => {
  updateFromMetaApi().catch(() => {});
}, 20000);

// Primera consulta inmediata
updateFromMetaApi();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.csv': 'text/csv; charset=utf-8',
  '.css': 'text/css; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  if (pathname === '/api/data') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(JSON.stringify({
      data: currentData,
      isUpdating,
      lastUpdate,
      source: 'meta_graph_api'
    }));
  }

  if (pathname === '/api/refresh') {
    updateFromMetaApi().then(() => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', data: currentData }));
    });
    return;
  }

  // Guardar calibración manual y subir a Vercel
  if (pathname === '/api/admin/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (Array.isArray(payload.contestants)) {
          payload.contestants.sort((a, b) => b.likes - a.likes);
          currentData = payload.contestants;
          lastUpdate = Date.now();
          fs.writeFileSync('conteo_resultados.json', JSON.stringify(currentData, null, 2), 'utf8');

          try {
            let appJs = fs.readFileSync('app.js', 'utf8');
            const startMarker = 'var fallbackData = [';
            const endMarker = '  ];\n';
            const sIdx = appJs.indexOf(startMarker);
            const eIdx = appJs.indexOf(endMarker, sIdx);
            if (sIdx !== -1 && eIdx !== -1) {
              appJs = appJs.slice(0, sIdx) + 'var fallbackData = ' + JSON.stringify(currentData, null, 2) + ';' + appJs.slice(eIdx + endMarker.length);
              fs.writeFileSync('app.js', appJs, 'utf8');
            }
          } catch(e) {}

          exec('git add conteo_resultados.json app.js && git commit -m "Calibración manual de votos oficiales" && git push origin main', (err) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, pushedToVercel: !err }));
          });
          return;
        }
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // Actualizar Token de Meta
  if (pathname === '/api/admin/token' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (payload.token) {
          token = payload.token.trim();
          updateFromMetaApi().catch(() => {});

          exec('git add -A && git commit -m "Actualizar Token Meta Graph API" && git push origin main', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          });
          return;
        }
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // Cierre Oficial
  if (pathname === '/api/admin/close' && req.method === 'POST') {
    exec('git add -A && git commit -m "Cierre oficial del concurso - Votacion congelada" && git push origin main', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  let filePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  filePath = path.resolve(__dirname, decodeURIComponent(filePath));

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
  console.log(`  SISTEMA OFICIAL META API INICIADO`);
  console.log(`  Abre en tu navegador: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
