import client from "../db/db.js";

export async function getAllUsers() {
    const result = await client.queryObject(`SELECT user_token, username, role FROM zephyr_users`);
    return result.rows;
}

export async function getAccountInfo(username) {
    try {
        // Fetch account details from the database
        const result = await client.queryObject(
            `SELECT username, role, terms_accepted, created_at FROM zephyr_users WHERE username = $1`,
            [username]
        );

        if (result.rows.length === 0) {
            return new Response("Account not found", { status: 404 });
        }

        // Respond with the account details
        return new Response(JSON.stringify(result.rows[0]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching account information:", error);
        return new Response("Error fetching account information", { status: 500 });
    }
}