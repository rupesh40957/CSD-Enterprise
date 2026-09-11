const https = require('https');

https.get('https://csdenterprises.in', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const urls = new Set();
    // match all wsimg images
    const wsMatches = html.match(/https?:\/\/[^\s"'<>]+\.(?:png|jpg|jpeg|webp|svg|gif)[^\s"'<>]*/gi) || [];
    wsMatches.forEach(u => urls.add(u));
    // match any getty or isteam
    const gettyMatches = html.match(/https:\/\/img1\.wsimg\.com\/isteam\/[^\s"'<>\)]+/gi) || [];
    gettyMatches.forEach(u => urls.add(u));

    console.log('Found ' + urls.size + ' images:');
    Array.from(urls).forEach(u => console.log(u));
  });
});
