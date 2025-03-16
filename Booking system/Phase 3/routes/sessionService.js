import client from "../db/db.js";

export async function getSessionInfo(sessionId) {
    const query = `SELECT username, role FROM zephyr_sessions WHERE session_id = $1 AND expires_at > NOW()`;
    const result = await client.queryObject(query, [sessionId]);
    return result.rows[0] || null;
}
