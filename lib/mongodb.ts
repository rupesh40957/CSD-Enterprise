import { MongoClient, Db } from "mongodb";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 4000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 5000,
};

let cachedClient: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (cachedClient) {
    try {
      // Test existing connection
      await cachedClient.db("admin").command({ ping: 1 });
      return cachedClient;
    } catch {
      try {
        await cachedClient.close();
      } catch {}
      cachedClient = null;
    }
  }

  const client = new MongoClient(uri, options);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDatabase(dbName = "csd_enterprises"): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}

export default getMongoClient;
