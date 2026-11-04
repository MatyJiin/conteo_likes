const { execSync } = require('child_process');
const fs = require('fs');

const urls = [
  "https://www.instagram.com/p/DfTRB7DOhP5/",
  "https://www.instagram.com/p/DfTQ_Yku8UC/",
  "https://www.instagram.com/p/DfTQ7cLOoRa/",
  "https://www.instagram.com/p/DfTQ4VWOgnQ/",
  "https://www.instagram.com/p/DfTQ173OYef/",
  "https://www.instagram.com/p/DfTQzO9O8bc/",
  "https://www.instagram.com/p/DfTQwh-u8jD/",
  "https://www.instagram.com/p/DfTQtpwumd2/",
  "https://www.instagram.com/p/DfTQqfYOlUD/",
  "https://www.instagram.com/p/DfTQnVYuKlp/",
  "https://www.instagram.com/p/DfTQlOMuffA/",
  "https://www.instagram.com/p/DfTQie5Onwa/",
  "https://www.instagram.com/p/DfTQe-NOAZX/",
  "https://www.instagram.com/p/DfTQcjBu1HN/",
  "https://www.instagram.com/p/DfTQZ4BuX8u/",
  "https://www.instagram.com/p/DfTQT1eOlfE/",
  "https://www.instagram.com/p/DfTQQT-OWM0/"
];

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function fetchOne(url) {
  try {
    const cmd = `"${chromePath}" --headless=new --disable-gpu --dump-dom "${url}"`;
    const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });
    
    // Parse likes
    const likesMatch = out.match(/([0-9.,]+)\s*(?:likes|me gusta)/i);
    let likes = 0;
    if (likesMatch) {
      likes = parseInt(likesMatch[1].replace(/[.,]/g, ''), 10) || 0;
    }
    
    // Parse comments
    const commentsMatch = out.match(/([0-9.,]+)\s*(?:comments|comentarios)/i);
    let comments = 0;
    if (commentsMatch) {
      comments = parseInt(commentsMatch[1].replace(/[.,]/g, ''), 10) || 0;
    }

    // Parse image
    const ogImg = out.match(/<meta property="og:image" content="([^"]+)"/i);
    const image = ogImg ? ogImg[1].replace(/&amp;/g, '&') : '';

    // Parse caption text or participant details if any
    const ogDesc = out.match(/<meta property="og:description" content="([^"]+)"/i);
    const desc = ogDesc ? ogDesc[1] : '';

    return { url, likes, comments, image, desc, success: true };
  } catch (err) {
    return { url, likes: 0, comments: 0, error: err.message, success: false };
  }
}

async function run() {
  console.log(`Iniciando conteo de ${urls.length} publicaciones...`);
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    process.stdout.write(`[${i + 1}/${urls.length}] Procesando ${url.slice(28, 40)}... `);
    const res = await fetchOne(url);
    console.log(`-> ${res.likes} likes, ${res.comments} comentarios`);
    results.push(res);
  }

  // Ordenar por ranking de likes (mayor a menor)
  results.sort((a, b) => b.likes - a.likes);
  fs.writeFileSync('conteo_resultados.json', JSON.stringify(results, null, 2));
  console.log('\n--- RANKING ACTUAL ---');
  results.forEach((r, idx) => {
    console.log(`#${idx + 1}: ${r.likes} likes | ${r.comments} coms | ${r.url}`);
  });
}

run();

