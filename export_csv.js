const fs = require('fs');

const data = JSON.parse(fs.readFileSync('conteo_resultados.json', 'utf8'));

// Format as CSV
let csv = "Ranking,Likes,Comentarios,Enlace del Post\n";
data.forEach((r, idx) => {
  csv += `${idx + 1},${r.likes},${r.comments},"${r.url}"\n`;
});

fs.writeFileSync('conteo_likes.csv', '\uFEFF' + csv, 'utf8'); // BOM for Excel UTF-8 support
console.log('CSV generado con éxito: conteo_likes.csv');

