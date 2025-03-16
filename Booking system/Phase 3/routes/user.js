import client from "../db/db.js";

export async function getAllUsers() {
    const result = await client.queryObject(`SELECT user_token, username FROM zephyr_users`);
    return result.rows;
}
