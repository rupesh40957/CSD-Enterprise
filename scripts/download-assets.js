const fs = require('fs');
const https = require('https');
const path = require('path');

const downloads = [
  {
    url: 'https://img1.wsimg.com/isteam/ip/94ade243-1b72-439d-a333-081e9720fcb9/blob-8035ff6.png',
    dest: 'd:/CSD Enterprice/csd-enterprises/public/logo/csd-logo.png'
  },
  {
    url: 'https://img1.wsimg.com/isteam/ip/94ade243-1b72-439d-a333-081e9720fcb9/blob-8e1d0ed.png',
    dest: 'd:/CSD Enterprice/csd-enterprises/public/logo/csd-favicon.png'
  },
  {
    url: 'https://img1.wsimg.com/isteam/getty/2185337504/:/rs=w:1200,m',
    dest: 'd:/CSD Enterprice/csd-enterprises/public/images/automation-hero.jpg'
  },
  {
    url: 'https://img1.wsimg.com/isteam/getty/1892183310/:/rs=w:1000,h:600',
    dest: 'd:/CSD Enterprice/csd-enterprises/public/images/network-cabling.jpg'
  },
  {
    url: 'https://img1.wsimg.com/isteam/getty/163727881/:/rs=w:1000,h:600',
    dest: 'd:/CSD Enterprice/csd-enterprises/public/images/industrial-facility.jpg'
  }
];

fs.mkdirSync('d:/CSD Enterprice/csd-enterprises/public/logo', { recursive: true });
fs.mkdirSync('d:/CSD Enterprice/csd-enterprises/public/images', { recursive: true });

function downloadFile(item) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(item.dest);
    https.get(item.url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => { file.close(); resolve(item.dest); });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(item.dest); });
      }
    }).on('error', reject);
  });
}

(async () => {
  for (const item of downloads) {
    try {
      await downloadFile(item);
      console.log('Downloaded:', item.dest, fs.statSync(item.dest).size, 'bytes');
    } catch (e) {
      console.error('Failed to download:', item.url, e.message);
    }
  }
})();
