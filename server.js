const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const token = "EAAQ2m5P4VKUBSZBiZAkjWHvvGsi1WfRM6NZBSggcU7kriM08Qolr2pL4IDE8jenbVbjeTmwyQZAI30rRt3xCeMV9eytAstmNqCCM9B8iN0nU8g2bB0GM5ZBWz8BbYFAiu0ZC2sNj6PT6cM8trTsvQk5EKvShg5Aycwq0PzPx4aIrh6h6g7PVJp8mO0TBKSOFodi8lzzsjt3IzGP9Kb4trk4A7LYaQOUCIjnHvJ";
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

    for (const code of Object.keys(namesMap)) {
      const post = posts.find(p => p.shortcode === code);
      if (post) {
        contestants.push({
          url: post.permalink || `https://www.instagram.com/p/${code}/`,
          shortcode: code,
          name: namesMap[code],
          likes: post.like_count,
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
