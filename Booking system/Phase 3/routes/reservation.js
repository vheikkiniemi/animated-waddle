import { getSession } from "../sessionService.js"; // Session management
import client from "../db/db.js";

// Get user UUID
async function getUserUUID(username) {
    const result = await client.queryArray(`SELECT user_token FROM zephyr_users WHERE username = $1`, [username]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export async function registerReservation(req) {
    const reserverUsername = req.get("reserver_token");
    const resourceId = req.get("resource_id");
    const reservationStart = req.get("reservation_start");
    const reservationEnd = req.get("reservation_end");
    try {
        const userUUID = await getUserUUID(reserverUsername);
        const query = `INSERT INTO zephyr_reservations (reserver_token, resource_id, reservation_start, reservation_end) VALUES ($1, $2, $3, $4)`;
        await client.queryArray(query, [userUUID[0], resourceId, reservationStart, reservationEnd]);
        return new Response(null, { status: 302, headers: { Location: "/", }, });
    } catch (error) {
        return new Response(error.message || "Error during reservations", { status: 500 });
    }
}

export async function getReservationById(id) {
    const query = `SELECT reservation_id, reserver_token, resource_id, reservation_start, reservation_end FROM zephyr_reservations WHERE reservation_id = $1`;
    const result = await client.queryObject(query, [id]);
    return result.rows[0] || null;
}

export async function updateReservation(formData) {
    const reservationId = formData.get("reservation_id");
    const reserver = formData.get("reserver_token");
    const resourceId = formData.get("resource_id");
    const reservationStart = formData.get("reservation_start");
    const reservationEnd = formData.get("reservation_end");
    try {
        const query = `UPDATE zephyr_reservations SET reserver_token = $2, resource_id = $3, reservation_start = $4, reservation_end = $5 WHERE reservation_id = $1`;
        await client.queryArray(query, [reservationId, reserver, resourceId, reservationStart, reservationEnd]);
        return new Response(null, { status: 302, headers: { Location: "/", }, });
    } catch (error) {
        console.error(error);
        return new Response("Error during updating resource", { status: 500 });
    }
}


export async function handleReservationForm(req) {
    const session = await getSession(req);
    if (!session || !session.username) {
        return new Response("Unauthorized", { status: 401 });
    }

    const formHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Manage Reservations</title>
        <link rel="stylesheet" href="/static/styles.css">
    </head>
    <body>
        <div class="container">
            <h1>Create Reservation</h1>
            <form action="/reservation" method="POST">

                <!-- Reservation ID (hidden for new entries) -->
                <div class="form-group">
                    <input type="hidden" name="reservation_id" id="reservation_id">
                </div>

                <!-- Reserver username (pre-filled) -->
                <div class="form-group">
                    <label for="reserver_token">Reserver username:</label>
                    <select name="reserver_token" id="reserver_token" required></select>
                </div>

                <!-- Other form fields -->
                <div class="form-group">
                    <label for="resource_id">Resource:</label>
                    <select name="resource_id" id="resource_id" required></select>
                </div>
                <div class="form-group">
                    <label for="reservation_start">Reservation Start:</label>
                    <input type="datetime-local" name="reservation_start" id="reservation_start" required>
                </div>
                <div class="form-group">
                    <label for="reservation_end">Reservation End:</label>
                    <input type="datetime-local" name="reservation_end" id="reservation_end" required>
                </div>
                <div class="form-group">
                    <button type="submit">Save Reservation</button>
                </div>
            </form>
        </div>
        <script src="/static/reservationsForm.js"></script>

    </body>
    </html>
    `;

    return new Response(formHtml, {
        headers: { "Content-Type": "text/html" },
    });
}