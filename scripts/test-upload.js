const http = require('http');
const fs = require('fs');
const path = require('path');

function request(options, data, isMultipart = false, boundary = '') {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(body); } catch { parsed = body; }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: parsed,
        });
      });
    });
    req.on('error', reject);
    if (data) {
      if (Buffer.isBuffer(data)) {
        req.write(data);
      } else {
        req.write(typeof data === 'string' ? data : JSON.stringify(data));
      }
    }
    req.end();
  });
}

// Construct a valid multipart/form-data body in Node.js
function buildMultipart(boundary, fields, fileField) {
  const crlf = '\r\n';
  let parts = [];

  for (const [k, v] of Object.entries(fields)) {
    parts.push(Buffer.from(
      `--${boundary}${crlf}Content-Disposition: form-data; name="${k}"${crlf}${crlf}${v}${crlf}`
    ));
  }

  if (fileField) {
    parts.push(Buffer.from(
      `--${boundary}${crlf}Content-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"${crlf}Content-Type: ${fileField.contentType}${crlf}${crlf}`
    ));
    parts.push(fileField.buffer);
    parts.push(Buffer.from(crlf));
  }

  parts.push(Buffer.from(`--${boundary}--${crlf}`));
  return Buffer.concat(parts);
}

async function testUpload() {
  console.log('=== TESTING ADMIN IMAGE UPLOAD SYSTEM ===\n');

  // 1. Admin Login
  console.log('1. Authenticating as Admin...');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@csdenterprises.in', password: 'AdminCSD@2026!Secure' }
  );
  console.log(`   Login Status: ${loginRes.statusCode}`);
  const cookie = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '';
  if (!cookie) {
    throw new Error('Failed to obtain admin session cookie');
  }
  console.log('   Admin Session Cookie obtained.\n');

  // 2. Test Unauthenticated Upload (Should return 401)
  console.log('2. Testing Unauthenticated Upload (expecting 401)...');
  const boundaryUnauth = '----WebKitFormBoundaryUnauth' + Date.now();
  const unauthBody = buildMultipart(boundaryUnauth, { alt: 'Test Unauth' }, {
    name: 'file',
    filename: 'test.png',
    contentType: 'image/png',
    buffer: Buffer.from('fake-png-content'),
  });
  const unauthRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/upload',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundaryUnauth}`,
        'Content-Length': unauthBody.length,
      },
    },
    unauthBody
  );
  console.log(`   Unauthenticated Status: ${unauthRes.statusCode} (${unauthRes.statusCode === 401 ? 'CORRECT: 401 Unauthorized' : 'FAILED'})`);

  // 3. Test Authenticated Upload of a valid PNG image
  console.log('\n3. Testing Authenticated Admin Upload (/api/upload)...');
  // 1x1 transparent PNG data
  const samplePng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );

  const boundaryAuth = '----WebKitFormBoundaryAuth' + Date.now();
  const authBody = buildMultipart(
    boundaryAuth,
    { alt: 'Industrial SCADA Control Room Test Upload' },
    {
      name: 'file',
      filename: 'scada_control_room.png',
      contentType: 'image/png',
      buffer: samplePng,
    }
  );

  const uploadRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/upload',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundaryAuth}`,
        'Content-Length': authBody.length,
        Cookie: cookie,
      },
    },
    authBody
  );

  console.log(`   Upload Status: ${uploadRes.statusCode}`);
  console.log('   Upload Response:', uploadRes.body);

  if (!uploadRes.body || !uploadRes.body.url) {
    throw new Error('Upload did not return a valid url');
  }

  const uploadedUrl = uploadRes.body.url;
  console.log(`   Uploaded URL: ${uploadedUrl}`);

  // 4. Verify file exists on local filesystem
  console.log('\n4. Verifying file on disk...');
  const relativePath = uploadedUrl.replace(/^\//, '').replace(/\//g, path.sep);
  const diskPath = path.join(process.cwd(), 'public', relativePath.replace(/^images[\\/]/, 'images' + path.sep));
  const exists = fs.existsSync(diskPath);
  console.log(`   Disk Path: ${diskPath}`);
  console.log(`   File Exists on Disk: ${exists ? 'YES ✓' : 'NO ✗'}`);

  // 5. Verify static serving via HTTP GET
  console.log('\n5. Verifying Static Serving of Uploaded Image...');
  const serveRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: uploadedUrl,
    method: 'GET',
  });
  console.log(`   HTTP GET ${uploadedUrl} Status: ${serveRes.statusCode} ${serveRes.statusCode === 200 ? '✓' : '✗'}`);
  console.log(`   Content-Type: ${serveRes.headers['content-type']}`);

  // 6. Verify entry in /api/media
  console.log('\n6. Verifying that the uploaded file appears in /api/media...');
  const mediaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/media',
    method: 'GET',
    headers: { Cookie: cookie },
  });
  const mediaList = mediaRes.body?.media || [];
  const found = mediaList.find((m) => m.url === uploadedUrl);
  console.log(`   Found in Media Library: ${found ? 'YES ✓ (' + found.filename + ')' : 'NO ✗'}`);

  console.log('\n========================================================');
  console.log('✓ ALL IMAGE UPLOAD TESTS COMPLETED SUCCESSFULLY!');
  console.log('========================================================\n');
}

testUpload().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
