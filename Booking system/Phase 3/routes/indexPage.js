import { getSession } from "./sessionService.js"; // For sessions
import client from "../db/db.js";

const htmlHeader = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Home</title>
                        <link href="/static/tailwind.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 text-gray-900">
                    <div class="container mx-auto p-4 text-center">
                    <!-- Welcome Box -->
                    <div class="bg-white shadow-md rounded-lg p-6 mt-6 mb-6 max-w-5xl mx-auto">`;
const htmlMiddle = `</div>
                    <!-- Booked Resources Box -->
                    <div class="bg-white shadow-md rounded-lg p-6 mb-6 max-w-5xl mx-auto">
                    <h1 class="text-2xl font-bold mb-4">Booked Resources</h1>
                    <div class="overflow-x-auto">`;
const htmlBottom = `</tbody></table></div></div></div></body></html>`;

async function getReservations() {
    try {
        const query = `
            SELECT resource_name, reservation_start, reservation_end
            FROM zephyr_booked_resources_view;
        `;
        const result = await client.queryObject(query);
        const tableRows = result.rows
            .map(row => `
                <tr>
                    <td class="py-2 px-4 border-b">${row.resource_name}</td>
                    <td class="py-2 px-4 border-b">${new Date(row.reservation_start).toLocaleString('fi-FI')}</td>
                    <td class="py-2 px-4 border-b">${new Date(row.reservation_end).toLocaleString('fi-FI')}</td>
                </tr>
            `)
            .join("");
        return tableRows;
    } catch (error) {
        console.error("Error fetching booked resources:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

async function getReservationsWithUser(role,username) {
    try {
        const query = `
        SELECT
            res.reservation_id,
            r.resource_id,
            r.resource_name,
            res.reservation_start,
            res.reservation_end,
            u.username AS reserver_username
        FROM zephyr_resources r
        JOIN zephyr_reservations res ON r.resource_id = res.resource_id
        JOIN zephyr_users u ON res.reserver_token = u.user_token;
        `;
        const result = await client.queryObject(query);
        let tableRows = "";
        // Generate HTML table dynamically
        for (let row of result.rows) {
            if(role==="administrator" || row.reserver_username===username) {
                tableRows += `<tr>`
                if (role==="administrator") {
                    tableRows += `<td class="py-2 px-4 border-b"><a href="/resources?id=${row.resource_id}" class="font-bold">${row.resource_name}</a></td>`
                } else {
                    tableRows += `<td class="py-2 px-4 border-b">${row.resource_name}</td>`
                }
                tableRows += `<td class="py-2 px-4 border-b"><a href="/reservation?id=${row.reservation_id}" class="font-bold">${new Date(row.reservation_start).toLocaleString('fi-FI')}</a></td>
                    <td class="py-2 px-4 border-b"><a href="/reservation?id=${row.reservation_id}" class="font-bold">${new Date(row.reservation_end).toLocaleString('fi-FI')}</a></td>
                    <td class="py-2 px-4 border-b">${row.reserver_username}</td>
                </tr>`;
            } else {
                tableRows += `<tr>
                    <td class="py-2 px-4 border-b">${row.resource_name}</td>
                    <td class="py-2 px-4 border-b">${new Date(row.reservation_start).toLocaleString('fi-FI')}</td>
                    <td class="py-2 px-4 border-b">${new Date(row.reservation_end).toLocaleString('fi-FI')}</td>
                    <td class="py-2 px-4 border-b">${row.reserver_username}</td>
                </tr>`;
            }

        }





        return tableRows;
    } catch (error) {
        console.error("Error fetching booked resources:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function handleIndex(req) {
    const session = await getSession(req);
    // Generate HTML table dynamically
    const tableRows = await getReservationsWithUser(session.role, session.username);
    // Default HTML response
    let loggedHtml = "";
    loggedHtml += htmlHeader;
    loggedHtml += `<h1 class="text-2xl font-bold mb-4">Welcome to the Booking System ${session.username}</h1><h2 class="text-xl font-bold mb-4">Your role is ${session.role}</h2>`;
    loggedHtml += `<p class="mb-4">Please choose one of the options below:</p>
                   <div class="flex justify-between space-x-4">
                        <a href="/resources" class="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-1/3">Add a new resource</a>
                        <a href="/reservation" class="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-1/3">Add a new reservation</a>
                        <a href="/logout" class="inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-1/3">Log Out</a>
                    </div>`
    loggedHtml += htmlMiddle;
    loggedHtml += `<table class="min-w-full bg-white border border-gray-300">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="py-2 px-4 border-b">Resource name</th>
                            <th class="py-2 px-4 border-b">Reservation start</th>
                            <th class="py-2 px-4 border-b">Reservation end</th>
                            <th class="py-2 px-4 border-b">Reserver</th>
                        </tr>
                    </thead>
                    <tbody>`;
    loggedHtml += `${tableRows}`;
    loggedHtml += htmlBottom;
    return new Response(loggedHtml, {
        headers: { "Content-Type": "text/html" },
    });
}

export async function handleDefaultIndex(req) {
    // Generate HTML table dynamically
    const tableRows = await getReservations();

    // Default HTML response
    let defaultHtml = "";
    defaultHtml += htmlHeader;
    defaultHtml += `<h1 class="text-2xl font-bold mb-4">Welcome to the Booking System</h1>`;
    defaultHtml += `<p class="mb-4">Please choose one of the options below:</p>
                    <div class="flex justify-between space-x-4">
                        <a href="/login" class="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-1/2">Login</a>
                        <a href="/register" class="inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-1/2">Register</a>
                    </div>`
    defaultHtml += htmlMiddle;
    defaultHtml += `<table class="min-w-full bg-white border border-gray-300">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="py-2 px-4 border-b">Resource name</th>
                            <th class="py-2 px-4 border-b">Reservation start</th>
                            <th class="py-2 px-4 border-b">Reservation end</th>
                        </tr>
                    </thead>
                    <tbody>`;
    defaultHtml += `${tableRows}`;
    defaultHtml += htmlBottom;
    return new Response(defaultHtml, {
        headers: { "Content-Type": "text/html" },
    });
}