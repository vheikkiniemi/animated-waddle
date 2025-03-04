import client from "../db/db.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts"; // Import Zod for validation
import crypto from "node:crypto"; // Import the Node.js crypto module


// Define a schema for validating the registration form using Zod
const registerSchema = z.object({
    username: z.string()
        .email({ message: "Invalid email address" })
        .max(50, "Email must not exceed 50 characters"), // Ensure email format and length
    password: z.string()
        .min(8, "Password must be at least 8 characters long"), // Ensure password length
    birthdate: z.string().refine((date) => {
        // Ensure birthdate is a valid date
        const birthDateObj = new Date(date);
        return !isNaN(birthDateObj.getTime()); // Check if it's a valid date
    }, { message: "Invalid birthdate" }),
    role: z.enum(["reserver", "administrator"], { message: "Invalid role" }), // Restrict role to allowed values
});

// Helper function to check if a username (email) already exists in the database
async function isUniqueUsername(email) {
    const result = await client.queryArray(
        `SELECT username FROM zephyr_users WHERE username = $1`,
        [email]
    );
    return result.rows.length === 0; // Return true if the username does not exist
}

// Function to handle user registration
export async function registerUser(c) {
    const username = c.get('username'); // Retrieve username from request context
    const password = c.get('password'); // Retrieve password from request context
    const birthdate = c.get('birthdate'); // Retrieve birthdate from request context
    const role = c.get('role'); // Retrieve role from request context
    try {
        // Validate the input data using Zod
        registerSchema.parse({ username, password, birthdate, role });

        // Check if the email is already in use
        if (!(await isUniqueUsername(username))) {
            return new Response("Email already in use!", { status: 400 }); // Prevent duplicate accounts
        }

        // Generate a salt and hash the user's password securely
        //const salt = await bcrypt.genSalt(10);
        //const hashedPassword = await bcrypt.hash(password, salt);

        // Hash the user's password using MD5 (Only for testing!)
        const hashedPassword = crypto.createHash("md5").update(password).digest("hex");

        // Insert the new user record into the database
        await client.queryArray(
            `INSERT INTO zephyr_users (username, password_hash, role, birthdate) VALUES ($1, $2, $3, $4)`,
            [username, hashedPassword, role, birthdate]
        );

        // Successfully registered, redirect user to the index page
        return new Response(null, {
            status: 302,
            headers: { Location: "/" },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle validation errors from Zod and return messages
            return new Response(
                `Validation Error: ${error.errors.map(e => e.message).join(", ")}`,
                { status: 400 }
            );
        }
        console.error(error); // Log unexpected errors
        return new Response("Error during registration", { status: 500 }); // Return a generic error message
    }
}
