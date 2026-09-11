require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function test(options, label) {
  console.log(`Testing ${label}...`);
  const client = new MongoClient(process.env.MONGODB_URI, options);
  try {
    await client.connect();
    console.log(`✓ ${label} connected successfully!`);
    await client.db().admin().ping();
    console.log(`✓ ${label} pinged successfully!`);
  } catch (err) {
    console.log(`✗ ${label} failed:`, err.message);
  } finally {
    await client.close();
  }
}

(async () => {
  await test({ family: 4, serverSelectionTimeoutMS: 5000 }, 'family: 4');
  await test({ serverSelectionTimeoutMS: 5000 }, 'default');
})();
