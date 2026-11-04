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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');

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

    return res.status(200).json({
      data: contestants,
      lastUpdate: Date.now(),
      source: 'meta_official_api'
    });
  } catch (err) {
    // Si falla, responder con datos cacheados
    return res.status(500).json({ error: err.message });
  }
};
