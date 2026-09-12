const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load .env then .env.local
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

const DEFAULT_ADMINS = [
  {
    email: "admin@csdenterprises.in",
    password: "CSD#Admin94!mK8x",
    name: "Master Administrator",
    role: "superadmin",
  },
  {
    email: "support@csdenterprises.in",
    password: "CSD#Supp28*vR7q",
    name: "Operations & Support Admin",
    role: "admin",
  },
];

async function seedAdmins() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB cluster.");
    const db = client.db("csd_enterprises");
    const adminsCol = db.collection("admins");

    // Ensure unique index on email
    await adminsCol.createIndex({ email: 1 }, { unique: true });

    for (const admin of DEFAULT_ADMINS) {
      const emailLower = admin.email.toLowerCase().trim();
      const passwordHash = await bcrypt.hash(admin.password, 10);

      const existing = await adminsCol.findOne({ email: emailLower });
      if (!existing) {
        await adminsCol.insertOne({
          email: emailLower,
          passwordHash,
          name: admin.name,
          role: admin.role,
          mustChangePassword: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created Admin: ${emailLower} | Initial Password: ${admin.password} (mustChangePassword: true)`);
      } else {
        // Update password if initial sync is requested or keep if already updated
        console.log(`ℹ️ Admin already exists: ${emailLower} (keeping existing document)`);
      }
    }

    console.log("\n🎉 Admin accounts check and seed completed!");
  } catch (err) {
    console.error("❌ Failed to seed admins:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedAdmins();
