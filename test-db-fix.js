const { MongoClient } = require("mongodb");

// Load environment variables
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });

let uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

// URL encode the password properly
// Replace the password section with URL-encoded version
const passwordMatch = uri.match(/\/\/([^:]+):([^@]+)@/);
if (passwordMatch) {
  const username = passwordMatch[1];
  const password = passwordMatch[2];
  const encodedPassword = encodeURIComponent(password);

  if (password !== encodedPassword) {
    console.log("🔧 URL-encoding password...");
    uri = uri.replace(
      `://${username}:${password}@`,
      `://${username}:${encodedPassword}@`,
    );
  }
}

console.log("🔍 Testing MongoDB connection with Node.js v22 workaround...");
console.log(
  "📍 Connection string (masked):",
  uri.replace(/\/\/[^@]+@/, "//***:***@"),
);

// Try with environment variable to disable OpenSSL 3.0 strict mode
process.env.NODE_OPTIONS = "--openssl-legacy-provider";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  tls: true,
  tlsAllowInvalidCertificates: false,
  retryWrites: true,
});

async function testConnection() {
  try {
    console.log("\n⏳ Connecting to MongoDB Atlas...");
    console.log("🔧 Using Node.js version:", process.version);

    await client.connect();

    console.log("✅ Successfully connected to MongoDB!");

    const db = client.db();
    console.log("📊 Database name:", db.databaseName);

    const collections = await db.listCollections().toArray();
    console.log("📁 Collections found:", collections.length);
    collections.forEach((col) => console.log("  -", col.name));

    const levels = await db.collection("levels").countDocuments();
    console.log("📈 Total levels:", levels);

    console.log("\n✅ All tests passed! MongoDB connection is working.");
    console.log(
      "\n📝 To fix your build, update your .env file with the properly encoded URI:",
    );
    console.log('MONGODB_URI="' + uri + '"');
  } catch (error) {
    console.error("\n❌ Connection failed!");
    console.error("Error:", error.message);

    console.error("\n🔍 Troubleshooting steps:");
    console.error("\n1. CHECK MONGODB ATLAS NETWORK ACCESS:");
    console.error("   → Go to https://cloud.mongodb.com/");
    console.error("   → Navigate to Network Access");
    console.error('   → Click "Add IP Address"');
    console.error(
      "   → Add your current IP or use 0.0.0.0/0 (allows all - for testing)",
    );

    console.error("\n2. VERIFY DATABASE USER:");
    console.error("   → Go to Database Access in MongoDB Atlas");
    console.error('   → Verify username "admin" exists');
    console.error("   → Verify user has read/write permissions");
    console.error("   → Try resetting the password");

    console.error("\n3. NODE.JS VERSION (Current: " + process.version + "):");
    console.error("   → Node v22 has OpenSSL compatibility issues");
    console.error("   → Recommended: Downgrade to Node v20 LTS or v18 LTS");
    console.error("   → Download from: https://nodejs.org/");

    console.error("\n4. TRY RELAXED TLS SETTINGS (temporary workaround):");
    const altUri = uri.includes("?")
      ? uri + "&tlsAllowInvalidCertificates=true"
      : uri + "?tlsAllowInvalidCertificates=true";
    console.error('   MONGODB_URI="' + altUri + '"');

    process.exit(1);
  } finally {
    await client.close();
    console.log("\n🔌 Connection closed.");
  }
}

testConnection();
