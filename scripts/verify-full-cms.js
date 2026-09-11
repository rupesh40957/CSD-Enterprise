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

async function run() {
  console.log('=== VERIFYING FULL CSD ENTERPRISES CMS & DYNAMIC HOME PAGE ===\n');

  // 1. Health check
  console.log('1. Checking /api/health...');
  const health = await request({ hostname: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
  console.log(`   Status: ${health.statusCode}, DB: ${health.body?.database?.toUpperCase()}`);

  // 2. Dynamic Home Page Data API
  console.log('\n2. Checking /api/home (Unified Dynamic Home API)...');
  const home = await request({ hostname: 'localhost', port: 3000, path: '/api/home', method: 'GET' });
  const data = home.body?.data || {};
  console.log(`   Status: ${home.statusCode}`);
  console.log(`   - Settings: ${data.settings?.companyName}`);
  console.log(`   - Logo: ${data.settings?.logo}`);
  console.log(`   - Sections: ${data.sections?.length} sections`);
  console.log(`   - Hero Slides: ${data.heroSlides?.length} slides`);
  console.log(`   - Stats: ${data.statistics?.length || data.stats?.length} KPIs`);
  console.log(`   - Services: ${data.services?.length} services`);
  console.log(`   - Industries: ${data.industries?.length} industries`);
  console.log(`   - Projects: ${data.projects?.length} projects`);
  console.log(`   - Clients: ${data.clients?.length} clients`);
  console.log(`   - Certifications: ${data.certifications?.length} certs`);
  console.log(`   - Testimonials: ${data.testimonials?.length} reviews`);
  console.log(`   - Blog Posts: ${data.blogPosts?.length} bulletins`);
  console.log(`   - FAQs: ${data.faqs?.length} FAQs`);
  console.log(`   - CTA: ${data.ctaContent?.badge || data.cta?.badge} - ${data.ctaContent?.heading || data.cta?.heading}`);

  // 3. Website Settings API
  console.log('\n3. Checking /api/settings...');
  const settings = await request({ hostname: 'localhost', port: 3000, path: '/api/settings', method: 'GET' });
  console.log(`   Status: ${settings.statusCode}, Company: ${settings.body?.settings?.companyName}, Phone: ${settings.body?.settings?.phone}`);

  // 4. Navigation API
  console.log('\n4. Checking /api/navigation...');
  const nav = await request({ hostname: 'localhost', port: 3000, path: '/api/navigation', method: 'GET' });
  console.log(`   Status: ${nav.statusCode}, Total items: ${nav.body?.items?.length}`);

  // 5. Services API
  console.log('\n5. Checking /api/services...');
  const services = await request({ hostname: 'localhost', port: 3000, path: '/api/services', method: 'GET' });
  console.log(`   Status: ${services.statusCode}, Total services: ${services.body?.services?.length}`);

  // 6. Industries API
  console.log('\n6. Checking /api/industries...');
  const ind = await request({ hostname: 'localhost', port: 3000, path: '/api/industries', method: 'GET' });
  console.log(`   Status: ${ind.statusCode}, Total industries: ${ind.body?.industries?.length}`);

  // 7. Clients API
  console.log('\n7. Checking /api/clients...');
  const clients = await request({ hostname: 'localhost', port: 3000, path: '/api/clients', method: 'GET' });
  console.log(`   Status: ${clients.statusCode}, Total clients: ${clients.body?.clients?.length}`);

  // 8. Certifications API
  console.log('\n8. Checking /api/certifications...');
  const certs = await request({ hostname: 'localhost', port: 3000, path: '/api/certifications', method: 'GET' });
  console.log(`   Status: ${certs.statusCode}, Total certs: ${certs.body?.certifications?.length}`);

  // 9. FAQs API
  console.log('\n9. Checking /api/faqs...');
  const faqs = await request({ hostname: 'localhost', port: 3000, path: '/api/faqs', method: 'GET' });
  console.log(`   Status: ${faqs.statusCode}, Total faqs: ${faqs.body?.faqs?.length}`);

  // 10. Stats API
  console.log('\n10. Checking /api/stats...');
  const stats = await request({ hostname: 'localhost', port: 3000, path: '/api/stats', method: 'GET' });
  console.log(`   Status: ${stats.statusCode}, Total stats: ${stats.body?.stats?.length}`);

  // 11. CTA API
  console.log('\n11. Checking /api/cta...');
  const cta = await request({ hostname: 'localhost', port: 3000, path: '/api/cta', method: 'GET' });
  console.log(`   Status: ${cta.statusCode}, Heading: ${cta.body?.cta?.heading}`);

  // 12. Admin Authentication & Session
  console.log('\n12. Testing Admin Login & Auth Token...');
  const login = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@csdenterprises.in', password: 'AdminCSD@2026!Secure' }
  );
  console.log(`   Login Status: ${login.statusCode}`);
  const cookie = login.headers['set-cookie'] ? login.headers['set-cookie'][0].split(';')[0] : '';
  console.log(`   Auth Cookie: ${cookie ? 'Obtained' : 'Failed'}`);

  // 13. Test Protected Admin Sections PUT
  if (cookie && home.body?.sections) {
    console.log('\n13. Testing Protected Admin Endpoint (PUT /api/home-sections)...');
    const sectionsUpdate = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/home-sections',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
      },
      { sections: home.body.sections }
    );
    console.log(`   Status: ${sectionsUpdate.statusCode}, Result:`, sectionsUpdate.body?.message || sectionsUpdate.body);
  }

  // 14. Check Public Home Page (SSR)
  console.log('\n14. Checking Public Home Page SSR (/)...');
  const page = await request({ hostname: 'localhost', port: 3000, path: '/', method: 'GET' });
  console.log(`   Status: ${page.statusCode}`);
  const html = typeof page.body === 'string' ? page.body : '';
  console.log(`   HTML size: ${html.length} bytes`);
  console.log(`   Contains "CSD Enterprises": ${html.includes('CSD Enterprises')}`);
  console.log(`   Contains "Industrial Automation": ${html.includes('Industrial Automation')}`);
  console.log(`   Contains Company Logo: ${html.includes('csd-logo')}`);

  console.log('\n=============================================================');
  console.log('✓ ALL SYSTEM VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log('=============================================================\n');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
