const fs = require('fs');
const path = require('path');

const token = process.env.META_TOKEN || "EAAQ2m5P4VKUBSZBiZAkjWHvvGsi1WfRM6NZBSggcU7kriM08Qolr2pL4IDE8jenbVbjeTmwyQZAI30rRt3xCeMV9eytAstmNqCCM9B8iN0nU8g2bB0GM5ZBWz8BbYFAiu0ZC2sNj6PT6cM8trTsvQk5EKvShg5Aycwq0PzPx4aIrh6h6g7PVJp8mO0TBKSOFodi8lzzsjt3IzGP9Kb4trk4A7LYaQOUCIjnHvJ";
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

// Caché en memoria compartido por instancia serverless (Anti-Rate-Limit)
let memoryCache = {
  data: null,
  timestamp: 0
};
const CACHE_TTL_MS = 10000; // 10 segundos para máxima frescura

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Vercel Edge CDN guardará el resultado por 10s para miles de usuarios simultáneos
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');

  const now = Date.now();

  // 1. Si tenemos datos en caché válidos de hace menos de 25s, responder al instante
  if (memoryCache.data && (now - memoryCache.timestamp) < CACHE_TTL_MS) {
    return res.status(200).json({
      data: memoryCache.data,
      lastUpdate: memoryCache.timestamp,
      source: 'memory_cache'
    });
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${igId}/media?fields=id,shortcode,like_count,comments_count,permalink,media_url,thumbnail_url&limit=50&access_token=${token}`;
    const apiRes = await fetch(url);
    const json = await apiRes.json();

    if (!apiRes.ok || json.error) {
      throw new Error(json.error ? json.error.message : 'Error en API de Meta');
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

    // Actualizar caché en memoria
    memoryCache = {
      data: contestants,
      timestamp: now
    };

    return res.status(200).json({
      data: contestants,
      lastUpdate: now,
      source: 'meta_official_api'
    });
  } catch (err) {
    console.error('Error Meta API:', err.message);

    // ESCUDO DE SEGURIDAD: Si Meta se cae o da límite, usar caché anterior o archivo local
    if (memoryCache.data) {
      return res.status(200).json({
        data: memoryCache.data,
        lastUpdate: memoryCache.timestamp,
        source: 'fallback_memory_cache',
        warning: 'Servicio en caché temporal'
      });
    }

    try {
      const filePath = path.resolve(process.cwd(), 'conteo_resultados.json');
      if (fs.existsSync(filePath)) {
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return res.status(200).json({
          data: fileData,
          lastUpdate: now,
          source: 'fallback_disk_file'
        });
      }
    } catch (e) {}

    return res.status(200).json({
      data: [],
      error: err.message,
      source: 'error_fallback'
    });
  }
};

