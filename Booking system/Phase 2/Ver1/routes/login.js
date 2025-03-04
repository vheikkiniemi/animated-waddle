import client from "../db/db.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"; // For password comparison
import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts"; // For validation
import crypto from "node:crypto"; // Import the Node.js crypto module

// Define a schema for validating login input using Zod
const loginSchema = z.object({
    username: z.string().email({ message: "Invalid email address" }), // Ensure username is a valid email
});

// Function to log successful login attempts
async function logLogin(userUUID, ipAddress) {
    try {
        await client.queryArray(
            `INSERT INTO zephyr_login_logs (user_token, ip_address) VALUES ($1, $2)`,
            [userUUID, ipAddress]
        );
    } catch (error) {
        console.error("Error logging login event:", error); // Log any errors that occur during logging
    }
}

// Helper function to retrieve a user by email from the database
async function getUserByEmail(email) {
    const result = await client.queryArray(
        `SELECT username, password_hash, user_token FROM zephyr_users WHERE username = $1`,
        [email]
    );
    return result.rows.length > 0 ? result.rows[0] : null; // Return user data if found, otherwise null
}

// Function to handle user login
export async function loginUser(c, info) {
    const username = c.get('username'); // Get username from the request context
    const password = c.get('password'); // Get password from the request context
    try {
        // Validate the input data using Zod
        loginSchema.parse({ username });

        // Fetch user details from the database
        const user = await getUserByEmail(username);
        if (!user) {
            return new Response("Invalid email or password", { status: 400 }); // Return generic error message to prevent information leaks
        }

        const [storedUsername, storedPasswordHash, userUUID] = user;

        // Compare the provided password with the stored hashed password
        //const passwordMatches = await bcrypt.compare(password, storedPasswordHash);

        // Hash the provided password using MD5 and compare with stored hash (Only for testing!)
        const passwordMatches = crypto.createHash("md5").update(password).digest("hex") === storedPasswordHash;

        if (!passwordMatches) {
            return new Response("Invalid email or password", { status: 400 }); // Return generic error to avoid exposing valid emails
        }

        // Retrieve IP address from request info
        const ipAddress = info.remoteAddr.hostname;
        await logLogin(userUUID, ipAddress); // Log successful login attempt

        // Authentication successful, redirect user to the index page
        return new Response(null, {
            status: 302,
            headers: { Location: "/" },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle validation errors from Zod
            return new Response(
                `Validation Error: ${error.errors.map(e => e.message).join(", ")}`,
                { status: 400 }
            );
        }
        console.error(error); // Log any unexpected errors
        return new Response("Error during login", { status: 500 }); // Return a generic error message
    }
}
