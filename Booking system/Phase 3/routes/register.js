import client from "../db/db.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts";
import { createSession } from "../sessionService.js"; // Import session handling

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
});

// Check if username (email) is unique
async function isUniqueUsername(email) {
    const result = await client.queryArray(
        `SELECT username FROM zephyr_users WHERE username = $1`, [email]
    );
    return result.rows.length === 0;
}

// Register user
export async function registerUser(c) {
    const username = c.get('username');
    const password = c.get('password');
    const birthdate = c.get('birthdate');
    const role = c.get('role');

    try {
        // Validate input
        registerSchema.parse({ username, password, birthdate, role });

        // Check if email already exists
        if (!(await isUniqueUsername(username))) {
            return new Response("Email already in use!", { status: 400 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into database
        await client.queryArray(
            `INSERT INTO zephyr_users (username, password_hash, role, birthdate) VALUES ($1, $2, $3, $4)`,
            [username, hashedPassword, role, birthdate]
        );

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
