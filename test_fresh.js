const { execSync } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const cmd = `"${chromePath}" --headless=new --disable-gpu --incognito --disable-cache --disk-cache-size=0 --dump-dom "https://www.instagram.com/p/DfTQQT-OWM0/?t=${Date.now()}"`;
const stdout = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

const likesMatch = stdout.match(/([0-9.,]+)\s*(?:likes|me gusta)/gi);
console.log('Matches:', likesMatch);

const ogDesc = stdout.match(/<meta property="og:description" content="([^"]+)"/i);
console.log('og:desc:', ogDesc ? ogDesc[1].slice(0, 100) : 'null');

