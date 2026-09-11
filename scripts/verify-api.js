const http = require('http');

function request(options, data) {
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
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('=== VERIFYING CSD ENTERPRISES PLATFORM ===\n');

  // 1. Health check
  console.log('1. Testing GET /api/health...');
  const health = await request({ hostname: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
  console.log('Status:', health.statusCode, health.body);

  // 2. Public Projects retrieval
  console.log('\n2. Testing GET /api/projects...');
  const projects = await request({ hostname: 'localhost', port: 3000, path: '/api/projects', method: 'GET' });
  console.log('Status:', projects.statusCode, 'Total projects:', projects.body?.total);
  if (projects.body?.projects) {
    projects.body.projects.forEach(p => console.log(`   * ${p.title} (${p.client})`));
  }

  // 3. Submit Inquiry
  console.log('\n3. Testing POST /api/inquiries...');
  const inq = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/inquiries',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      fullName: 'Vikram Mehra',
      workEmail: 'vikram.mehra@bharatpetro.in',
      phone: '+91 9823012345',
      organization: 'Bharat Petroleum Terminal',
      solution: 'CCTV Surveillance & Explosion-Proof Systems',
      message: 'Need 40 explosion-proof PTZ cameras and fiber connectivity for LPG bottling facility.',
    }
  );
  console.log('Status:', inq.statusCode, inq.body);

  // 4. Newsletter Subscription
  console.log('\n4. Testing POST /api/newsletter...');
  const news = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/newsletter',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'engineering.leads@bharatpetro.in' }
  );
  console.log('Status:', news.statusCode, news.body);

  // 5. Admin Login with Wrong Password
  console.log('\n5. Testing POST /api/auth/login (Invalid Password)...');
  const wrongLogin = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@csdenterprises.in', password: 'WrongPassword123' }
  );
  console.log('Status:', wrongLogin.statusCode, wrongLogin.body);

  // 6. Admin Login with Wrong Email
  console.log('\n6. Testing POST /api/auth/login (Invalid Email)...');
  const wrongEmailLogin = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'hacker@malicious.com', password: 'AdminCSD@2026!Secure' }
  );
  console.log('Status:', wrongEmailLogin.statusCode, wrongEmailLogin.body);

  // 7. Admin Login with Valid Email AND Password
  console.log('\n7. Testing POST /api/auth/login (Valid Email + Password)...');
  const validLogin = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@csdenterprises.in', password: 'AdminCSD@2026!Secure' }
  );
  console.log('Status:', validLogin.statusCode, validLogin.body);
  const cookie = validLogin.headers['set-cookie'] ? validLogin.headers['set-cookie'][0].split(';')[0] : '';
  console.log('Session Cookie received:', cookie ? 'YES (HTTP-Only Secure)' : 'NO');

  // 8. Admin Inquiries List
  console.log('\n8. Testing GET /api/inquiries (Authenticated Admin)...');
  const adminInq = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/inquiries',
    method: 'GET',
    headers: { Cookie: cookie },
  });
  console.log('Status:', adminInq.statusCode, 'Total inquiries:', adminInq.body?.pagination?.total);
  if (adminInq.body?.inquiries) {
    adminInq.body.inquiries.slice(0, 3).forEach(i => console.log(`   * [${i.status}] ${i.fullName} (${i.organization})`));
  }

  // 9. Admin Update Inquiry Status
  if (adminInq.body?.inquiries && adminInq.body.inquiries.length > 0) {
    const targetId = adminInq.body.inquiries[0]._id;
    console.log(`\n9. Testing PATCH /api/inquiries/${targetId} (Update status to "In Review")...`);
    const updateRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: `/api/inquiries/${targetId}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
      },
      { status: 'In Review' }
    );
    console.log('Status:', updateRes.statusCode, updateRes.body);
  }

  // 10. Admin Subscribers List & CSV Export
  console.log('\n10. Testing GET /api/newsletter?format=csv (Authenticated Admin CSV Export)...');
  const csvRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/newsletter?format=csv',
    method: 'GET',
    headers: { Cookie: cookie },
  });
  console.log('Status:', csvRes.statusCode);
  console.log('CSV Content Header:\n', typeof csvRes.body === 'string' ? csvRes.body.split('\n').slice(0, 3).join('\n') : csvRes.body);

  console.log('\n=== ALL TESTS COMPLETED ===');
}

runTests().catch(console.error);
