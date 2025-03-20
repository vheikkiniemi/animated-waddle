import { Client } from "https://deno.land/x/postgres/mod.ts";

// PostgreSQL connection settings
const DATABASE_CONFIG = {
    user: "postgres",
    database: "postgres",
    //hostname: "host.docker.internal", // Change to "postgres" if using Docker Compose
    hostname: "192.168.1.203",
    password: "Secret1234!",
    port: 5432,
};

// Function to retry database connection
async function connectWithRetry(maxRetries = 10, delay = 5000) {
    let attempt = 0;
    let client;

    while (attempt < maxRetries) {
        try {
            console.log(`🔄 Attempting to connect to DB (try ${attempt + 1}/${maxRetries})...`);
            client = new Client(DATABASE_CONFIG);
            await client.connect();
            console.log("✅ Database connection successful!");
            return client; // Return the connected client
        } catch (err) {
            console.error("❌ Database connection failed. Retrying in 5 seconds...", err);
            await new Promise((res) => setTimeout(res, delay)); // Wait before retrying
        }
        attempt++;
    }

    console.error("❌ Could not connect to the database after multiple attempts. Exiting.");
    Deno.exit(1);
}

// Connect to the database before exporting
const client = await connectWithRetry();

export default client;