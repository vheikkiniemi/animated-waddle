import client from "../db/db.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts";
import { createSession } from "./sessionService.js"; // Import session handling

// Define validation schema
const loginSchema = z.object({
    username: z.string().email({ message: "Invalid email address" }),
});

// Log successful login attempts
async function logLogin(userUUID, ipAddress) {
    try {
        await client.queryArray(
            `INSERT INTO zephyr_login_logs (user_token, ip_address) VALUES ($1, $2)`,
            [userUUID, ipAddress]
        );
    } catch (error) {
        console.error("Error logging login event:", error);
    }
}

// Retrieve user by email
async function getUserByEmail(email) {
    const result = await client.queryArray(
        `SELECT username, password_hash, role, user_token FROM zephyr_users WHERE username = $1`,
        [email]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
}

// Handle user login
export async function loginUser(c, info) {
    const username = c.get('username');
    const password = c.get('password');

    try {
        // Validate input
        loginSchema.parse({ username });

        // Fetch user details
        const user = await getUserByEmail(username);
        if (!user) {
            return new Response("Invalid email or password", { status: 400 });
        }

        const [storedUsername, storedPasswordHash, role, userUUID] = user;

        // Verify password
        const passwordMatches = await bcrypt.compare(password, storedPasswordHash);
        if (!passwordMatches) {
            return new Response("Invalid email or password", { status: 400 });
        }

        // Log successful login
        const ipAddress = info.remoteAddr.hostname;
        await logLogin(userUUID, ipAddress);


        // Create session and wait for the sessionId
        const sessionId = await createSession({ username: storedUsername, role });

        // Return response with redirection
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
                "Set-Cookie": `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/`,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                `Validation Error: ${error.errors.map(e => e.message).join(", ")}`,
                { status: 400 }
            );
        }
        console.error(error);
        return new Response("Error during login", { status: 500 });
    }
}
