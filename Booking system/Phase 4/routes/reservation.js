import { getSession } from "./sessionService.js"; // Session management
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
        <link href="/static/tailwind.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 text-gray-900">
        <div class="container mx-auto p-4">
            <div class="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
                <h1 class="text-2xl font-bold mb-4 text-center">Create reservation</h1>
                <form action="/reservation" method="POST">
                    <!-- Reservation ID (hidden for new entries) -->
                    <input type="hidden" name="reservation_id" id="reservation_id">

                    <!-- Reserver username (pre-filled) -->
                    <div class="mb-4">
                        <label for="reserver_token" class="block text-sm font-medium text-gray-700 font-bold">Reserver username</label>
                        <select name="reserver_token" id="reserver_token" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></select>
                    </div>

                    <!-- Resource ID -->
                    <div class="mb-4">
                        <label for="resource_id" class="block text-sm font-medium text-gray-700 font-bold">Resource</label>
                        <select name="resource_id" id="resource_id" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></select>
                    </div>

                    <!-- Reservation Start -->
                    <div class="mb-4">
                        <label for="reservation_start" class="block text-sm font-medium text-gray-700 font-bold">Reservation start</label>
                        <input type="datetime-local" name="reservation_start" id="reservation_start" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>

                    <!-- Reservation End -->
                    <div class="mb-4">
                        <label for="reservation_end" class="block text-sm font-medium text-gray-700 font-bold">Reservation end</label>
                        <input type="datetime-local" name="reservation_end" id="reservation_end" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-between space-x-4">
                        <button type="submit" class="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-1/2">Save reservation</button>
                        <a href="/" class="inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-1/2 text-center">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
        <script src="/static/reservationsForm.js"></script>
    </body>
    </html>
    `;

    return new Response(formHtml, {
        headers: { "Content-Type": "text/html" },
    });
}