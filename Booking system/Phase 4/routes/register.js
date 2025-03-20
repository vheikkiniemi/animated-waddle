import client from "../db/db.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts";
import { createSession } from "./sessionService.js"; // Import session handling

// Define validation schema
const registerSchema = z.object({
    username: z.string()
        .email({ message: "Invalid email address" })
        .max(50, "Email must not exceed 50 characters"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long"),
    birthdate: z.string().refine((date) => {
        const birthDateObj = new Date(date);
        return !isNaN(birthDateObj.getTime());
    }, { message: "Invalid birthdate" }),
    role: z.enum(["reserver", "administrator"], { message: "Invalid role" }),
    terms_accepted: z.enum(["on"], { message: "You must accept the terms of service." }),
});

// Check if username (email) is unique
async function isUniqueUsername(email) {
    const result = await client.queryArray(
        `SELECT username FROM zephyr_users WHERE username = $1`, [email]
    );
    return result.rows.length === 0;
}

// Log successful resigister attempts
async function logRegistering(userUUID, ipAddress) {
    try {
        await client.queryArray(
            `INSERT INTO zephyr_login_logs (user_token, ip_address) VALUES ($1, $2)`,
            [userUUID, ipAddress]
        );
    } catch (error) {
        console.error("Error logging login event:", error);
    }
}

// Register user
export async function registerUser(c, info) {
    const username = c.get('username');
    const password = c.get('password');
    const birthdate = c.get('birthdate');
    const role = c.get('role');
    const terms_accepted = c.get('accept_terms');

    try {
        // Validate input
        registerSchema.parse({ username, password, birthdate, role, terms_accepted  });

        // Check if email already exists
        if (!(await isUniqueUsername(username))) {
            return new Response("Email already in use!", { status: 400 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into database
        const result = await client.queryObject(
            `INSERT INTO zephyr_users (username, password_hash, role, birthdate, terms_accepted) VALUES ($1, $2, $3, $4, TRUE) RETURNING user_token`,
            [username, hashedPassword, role, birthdate]
        );
        const newUser = result.rows[0];

        // Log successful registering
        const ipAddress = info.remoteAddr.hostname;
        await logRegistering(newUser.user_token, ipAddress);

        // Create session after successful registration
        const sessionId = await createSession({ username, role });

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
        return new Response("Error during registration", { status: 500 });
    }
}
