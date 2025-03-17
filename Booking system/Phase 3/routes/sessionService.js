import client from "../db/db.js";

export async function getSessionInfo(sessionId) {
    const query = `SELECT username, role FROM zephyr_sessions WHERE session_id = $1 AND expires_at > NOW()`;
    const result = await client.queryObject(query, [sessionId]);
    return result.rows[0] || null;
}

const SESSION_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

// Create a session for the user
export async function createSession(user) {
    const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_TIME);

    // Extracting username and role
    const { username, role } = user;

    // Insert the session record and retrieve the generated session_id
    const result = await client.queryArray(
        "INSERT INTO zephyr_sessions (username, role, expires_at) VALUES ($1, $2, $3) RETURNING session_id",
        [username, role, expiresAt]
    );

    // Extract and return the session_id from the result
    const sessionId = result.rows[0][0];
    return sessionId;
}


// Retrieve session data by HTTP request
export async function getSession(req) {
    const cookies = req.headers.get("Cookie") || "";
    const sessionId = getCookieValue(cookies, "session_id");
    if (!sessionId) return null;
    const result = await client.queryObject(
        "SELECT username, role FROM zephyr_sessions WHERE session_id = $1 AND expires_at > NOW()", [sessionId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
}

// Helper function to parse cookies
export function getCookieValue(cookies, name) {
    const cookieArr = cookies.split(";").map(cookie => cookie.trim());
    for (const cookie of cookieArr) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return value;
        }
    }
    return null;
}

// Destroy a session
export async function destroySession(sessionId) {
    await client.queryArray("DELETE FROM zephyr_sessions WHERE session_id = $1", [sessionId]);
}

// Cleanup expired sessions periodically
setInterval(async () => {
    await client.queryArray("DELETE FROM zephyr_sessions WHERE expires_at < NOW()");
}, 60 * 60 * 1000); // Run every hour