const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

async function reset() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("csd_enterprises");

  const h1 = await bcrypt.hash("CSD#Admin94!mK8x", 10);
  const h2 = await bcrypt.hash("CSD#Supp28*vR7q", 10);

  await db.collection("admins").updateOne(
    { email: "admin@csdenterprises.in" },
    { $set: { passwordHash: h1, mustChangePassword: true, updatedAt: new Date() } }
  );

  await db.collection("admins").updateOne(
    { email: "support@csdenterprises.in" },
    { $set: { passwordHash: h2, mustChangePassword: true, updatedAt: new Date() } }
  );

  console.log("Both admin accounts have been reset with initial passwords and mustChangePassword = true.");
  await client.close();
}

reset().catch(console.error);
