const https = require('https');
const fs = require('fs');

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

async function fetchFromMeta() {
  const url = `https://graph.facebook.com/v21.0/${igId}/media?fields=id,shortcode,like_count,comments_count,permalink,media_url,thumbnail_url&limit=50&access_token=${token}`;
  
  const res = await fetch(url);
  const json = await res.json();
  
  if (!res.ok || json.error) {
    throw new Error(json.error ? json.error.message : 'Error en API de Meta');
  }

  const posts = json.data || [];
  console.log(`Recibidos ${posts.length} posts desde la API oficial de Meta.`);

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
    } else {
      console.warn(`Post ${code} no encontrado en los primeros 50 posts`);
    }
  }

  contestants.sort((a, b) => b.likes - a.likes);

  fs.writeFileSync('conteo_resultados.json', JSON.stringify(contestants, null, 2));

  // CSV
  let csv = 'Ranking,Concursante,Likes (Votos Oficiales),Comentarios,Enlace\n';
  contestants.forEach((item, idx) => {
    csv += `${idx + 1},"${item.name}",${item.likes},${item.comments},"${item.url}"\n`;
  });
  fs.writeFileSync('conteo_likes.csv', '\uFEFF' + csv, 'utf8');

  console.log('\n=============================================');
  console.log('   RANKING OFICIAL EN TIEMPO REAL (META API)');
  console.log('=============================================');
  contestants.forEach((r, idx) => {
    console.log(`#${idx + 1}: ${r.name.padEnd(30)} -> ${r.likes} likes (${r.comments} comentarios)`);
  });
}

fetchFromMeta().catch(err => console.error(err));

