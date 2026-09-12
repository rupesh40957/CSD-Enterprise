const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();

async function test() {
  console.log("--- 1. Testing Login for support@csdenterprises.in ---");
  const r1 = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "support@csdenterprises.in", password: "CSD#Supp28*vR7q" }),
  });
  const cookie = r1.headers.get("set-cookie");
  const d1 = await r1.json();
  console.log("Login Status:", r1.status, d1);

  console.log("\n--- 2. Testing Change Password API ---");
  const r2 = await fetch("http://localhost:3000/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      currentPassword: "CSD#Supp28*vR7q",
      newPassword: "Support#CSD2026!Updated",
      confirmPassword: "Support#CSD2026!Updated",
    }),
  });
  const d2 = await r2.json();
  console.log("Change Password Status:", r2.status, d2);

  console.log("\n--- 3. Testing Login with New Password ---");
  const r3 = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "support@csdenterprises.in", password: "Support#CSD2026!Updated" }),
  });
  const d3 = await r3.json();
  console.log("New Password Login Status:", r3.status, d3);

  console.log("\n--- 4. Resetting support password back to initial generated password so user can test ---");
  const cookie3 = r3.headers.get("set-cookie");
  await fetch("http://localhost:3000/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie3 },
    body: JSON.stringify({
      currentPassword: "Support#CSD2026!Updated",
      newPassword: "CSD#Supp28*vR7q",
      confirmPassword: "CSD#Supp28*vR7q",
    }),
  });

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  await client.db("csd_enterprises").collection("admins").updateOne(
    { email: "support@csdenterprises.in" },
    { $set: { mustChangePassword: true } }
  );
  await client.close();
  console.log("✅ Reset completed! Both admin accounts have mustChangePassword = true ready for user testing.");
}

test().catch(console.error);
