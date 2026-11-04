const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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

const urls = Object.keys(namesMap).map(code => `https://www.instagram.com/p/${code}/`);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function scrapeOne(url) {
  const code = url.split('/p/')[1].replace(/\//g, '');
  const tempProfile = path.join(os.tmpdir(), `ch_sc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
  const rnd = Math.random().toString(36).substring(2, 9);
  
  // Parámetros de bypass de caché de CDN de Instagram
  const targetUrl = `${url}?feed_type=popular&utm_source=ig_web_copy_link&v=${rnd}`;
  const cmd = `"${chromePath}" --headless=new --disable-gpu --incognito --disable-cache --disk-cache-size=0 --user-data-dir="${tempProfile}" --dump-dom "${targetUrl}"`;
  
  try {
    const stdout = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024, timeout: 20000 });
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (e) {}

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

    return {
      url,
      shortcode: code,
      name: namesMap[code] || 'PARTICIPANTE',
      likes,
      comments,
      localImage: `fotos/${code}.jpg`,
      image,
      success: likes > 0
    };
  } catch (err) {
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (e) {}
    return { url, shortcode: code, name: namesMap[code], likes: 0, comments: 0, success: false };
  }
}

async function run() {
  console.log(`[${new Date().toLocaleTimeString('es-CL')}] Extrayendo datos frescos sin caché con bypass de CDN...`);
  const results = [];
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const code = url.split('/p/')[1].replace(/\//g, '');
    const res = scrapeOne(url);
    console.log(`[${i+1}/17] ${namesMap[code]}: ${res.likes} likes, ${res.comments} coms`);
    results.push(res);
    // Pequeña pausa de 800ms para evitar rate limiting de Instagram
    if (i < urls.length - 1) await sleep(800);
  }

  let prevData = [];
  try { prevData = JSON.parse(fs.readFileSync('conteo_resultados.json', 'utf8')); } catch(e) {}

  const finalData = results.map(r => {
    const prev = prevData.find(p => p.shortcode === r.shortcode) || {};
    return {
      url: r.url,
      shortcode: r.shortcode,
      name: r.name,
      likes: r.success && r.likes > 0 ? r.likes : (prev.likes || r.likes || 0),
      comments: r.success ? r.comments : (prev.comments || r.comments || 0),
      localImage: r.localImage,
      image: r.image || prev.image || '',
      success: true
    };
  });

  finalData.sort((a, b) => b.likes - a.likes);

  fs.writeFileSync('conteo_resultados.json', JSON.stringify(finalData, null, 2));

  let csv = 'Ranking,Concursante,Likes (Votos),Comentarios,Enlace\n';
  finalData.forEach((item, idx) => {
    csv += `${idx + 1},"${item.name}",${item.likes},${item.comments},"${item.url}"\n`;
  });
  fs.writeFileSync('conteo_likes.csv', '\uFEFF' + csv, 'utf8');

  console.log('\n--- CONTEO ACTUALIZADO Y GUARDADO ---');
  finalData.forEach((r, idx) => {
    console.log(`#${idx + 1}: ${r.name.padEnd(30)} -> ${r.likes} likes`);
  });
}

run();
