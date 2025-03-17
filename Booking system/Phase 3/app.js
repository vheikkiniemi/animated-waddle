import { serve } from "https://deno.land/std@0.199.0/http/server.ts";
import { registerUser } from "./routes/register.js"; // Handles user registration logic
import { loginUser } from "./routes/login.js"; // Handles user login logic
import { getAllUsers } from "./routes/user.js";  // CRUD for users
import { registerResource, getResources, getResourceById, updateResource } from "./routes/resource.js"; // CRUD for resources
import { registerReservation, handleReservationForm, getReservationById, updateReservation } from "./routes/reservation.js"; // CRUD for reservations
import { handleIndex, handleDefaultIndex } from "./routes/indexPage.js"; // Render main pages
import { getSessionInfo, getSession, destroySession, getCookieValue, saveCsrfTokenToSession, getCsrfTokenFromSession } from "./routes/sessionService.js"; // Session management

let connectionInfo = {}; // Store connection details for logging purposes

// Middleware: Apply security headers globally to all responses
async function addSecurityHeaders(req, handler) {
    const response = await handler(req);
    response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; frame-ancestors 'none'; form-action 'self';");
    response.headers.set("X-Frame-Options", "DENY"); // Prevent clickjacking
    response.headers.set("X-Content-Type-Options", "nosniff"); // Prevent MIME type sniffing
    return response;
}

// Serve static files
async function serveStaticFile(path, contentType) {
    try {
        const data = await Deno.readFile(path);
        return new Response(data, {
            headers: { "Content-Type": contentType },
        });
    } catch {
        return new Response("File not found", { status: 404 });
    }
}

// Main request handler
async function handler(req) {
    const url = new URL(req.url);
    const session = await getSession(req);

    // Serve static assets (CSS, JS, images)
    if (url.pathname.startsWith("/static/")) {
        const filePath = `.${url.pathname}`;
        const contentType = getContentType(filePath);
        return await serveStaticFile(filePath, contentType);
    }

    // Render index page depending on session
    if (url.pathname === "/" && req.method === "GET") {
        return session ? await handleIndex(req) : await handleDefaultIndex(req);
    }

    // Serve registration form
    if (url.pathname === "/register" && req.method === "GET") {
        //return await serveStaticFile("./views/register.html", "text/html");
        // Enabling CSRF protection
        const rawHtml = await Deno.readTextFile("./views/register.html");
        // registering GET handler
        const csrfToken = crypto.randomUUID();
        const htmlWithToken = rawHtml.replace("{{csrf_token}}", csrfToken);
        return new Response(htmlWithToken, {
            headers: {
                "Content-Type": "text/html",
                "Set-Cookie": `csrf_token=${csrfToken}; HttpOnly; SameSite=Strict; Path=/; Secure`
            }
        });
    }

    // Handle user registration form submission
    if (url.pathname === "/register" && req.method === "POST") {
        // Enabling CSRF protection
        const formData = await req.formData();
        const tokenFromForm = formData.get("csrf_token");
        const cookies = req.headers.get("Cookie") || "";
        const tokenFromCookie = getCookieValue(cookies, "csrf_token");
        // CSRF check
        if (!tokenFromForm || !tokenFromCookie || tokenFromForm !== tokenFromCookie) {
            return new Response("Invalid CSRF Token", { status: 403 });
        }
        return await registerUser(formData, connectionInfo);
    }

    // Serve login form
    if (url.pathname === "/login" && req.method === "GET") {
        // Enabling CSRF protection
        const rawHtml = await Deno.readTextFile("./views/login.html");
        // login GET handler
        const csrfToken = crypto.randomUUID();
        const htmlWithToken = rawHtml.replace("{{csrf_token}}", csrfToken);

        return new Response(htmlWithToken, {
            headers: {
                "Content-Type": "text/html",
                "Set-Cookie": `csrf_token=${csrfToken}; HttpOnly; SameSite=Strict; Path=/; Secure`
            }
        });
    }

    // Handle login form submission
    if (url.pathname === "/login" && req.method === "POST") {
        // Enabling CSRF protection
        const formData = await req.formData();
        const tokenFromForm = formData.get("csrf_token");
        const cookies = req.headers.get("Cookie") || "";
        const tokenFromCookie = getCookieValue(cookies, "csrf_token");
        // CSRF check
        if (!tokenFromForm || !tokenFromCookie || tokenFromForm !== tokenFromCookie) {
            return new Response("Invalid CSRF Token", { status: 403 });
        }
        return await loginUser(formData, connectionInfo);
    }

    // Handle user logout and session destruction
    if (url.pathname === "/logout" && req.method === "GET") {
        const cookies = req.headers.get("Cookie") || "";
        const sessionId = getCookieValue(cookies, "session_id");
        if (sessionId) {
            await destroySession(sessionId);
        }
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
                "Set-Cookie": "session_id=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
            },
        });
    }

    // Serve resource management form
    if (url.pathname === "/resources" && req.method === "GET") {
        if (!session) return new Response("Unauthorized", { status: 401 });
        const id = url.searchParams.get("id");
        return await serveStaticFile("./views/resource.html", "text/html");
    }

    // Handle resource creation or update
    if (url.pathname === "/resources" && req.method === "POST") {
        if (!session) return new Response("Unauthorized", { status: 401 });
        const formData = await req.formData();
        if (formData.get("resource_id")) {
            return await updateResource(formData);
        } else {
            return await registerResource(formData);
        }
    }

    // API: return single resource details by ID (AJAX calls)
    if (url.pathname.startsWith("/api/resources/") && req.method === "GET") {
        if (!session) return new Response("Unauthorized", { status: 401 });
        const id = url.pathname.split("/").pop();
        const resource = await getResourceById(id);
        if (resource) {
            return new Response(JSON.stringify(resource), { headers: { "Content-Type": "application/json" } });
        } else {
            return new Response("Not found", { status: 404 });
        }
    }

    // API: return all resources in JSON (for dropdowns etc.)
    if (url.pathname === "/api/resources" && req.method === "GET") {
        // Just for testing!!!
        // if (!session) { return new Response("Unauthorized", { status: 401 }); }
        return await getResources();
    }

    // Serve reservation form
    if (url.pathname === "/reservation" && req.method === "GET") {
        if (!session) return new Response("Unauthorized", { status: 401 });
        const id = url.searchParams.get("id");
        if (id) return await handleReservationForm(req);
        return await serveStaticFile("./views/reservation.html", "text/html");
    }

    // Handle reservation creation
    if (url.pathname === "/reservation" && req.method === "POST") {
        if (!session) { return new Response("Unauthorized", { status: 401 }); }
        const formData = await req.formData();
        if (formData.get("reservation_id")) {
            return await updateReservation(formData);
        } else {
            return await registerReservation(formData);
        }
    }

    // API: return single resource details by ID (AJAX calls)
    if (url.pathname.startsWith("/api/reservations/") && req.method === "GET") {
        // Just for testing!!!
        //if (!session) return new Response("Unauthorized", { status: 401 });
        const id = url.pathname.split("/").pop();
        const reservation = await getReservationById(id);
        if (reservation) {
            return new Response(JSON.stringify(reservation), { headers: { "Content-Type": "application/json" } });
        } else { return new Response("Not found", { status: 404 }); }
    }

    // API: return all users in JSON (for dropdowns etc.)
    if (url.pathname === "/api/users" && req.method === "GET") {
        // Just for testing!!!
        //if (!session) return new Response("Unauthorized", { status: 401 });
        const users = await getAllUsers();
        return new Response(JSON.stringify(users), { headers: { "Content-Type": "application/json" } });
    }

    // API: return session informations
    if (url.pathname === "/api/session" && req.method === "GET") {
        const cookies = req.headers.get("Cookie") || "";
        const sessionId = getCookieValue(cookies, "session_id");
        if (!sessionId) { return new Response("Unauthorized", { status: 401 }); }
        const sessionData = await getSessionInfo(sessionId);
        if (!sessionData) { return new Response("Session not found", { status: 404 }); }
        return new Response(JSON.stringify(sessionData), { headers: { "Content-Type": "application/json" } });
    }

    // Fallback for unknown routes
    return new Response("Not Found", { status: 404 });
}

// Map file extension to Content-Type header
function getContentType(filePath) {
    const ext = filePath.split(".").pop();
    const mimeTypes = {
        html: "text/html",
        css: "text/css",
        js: "application/javascript",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        svg: "image/svg+xml",
        json: "application/json",
    };
    return mimeTypes[ext] || "application/octet-stream";
}

// Entry point: wraps the handler with security headers
async function mainHandler(req, info) {
    connectionInfo = info;
    return await addSecurityHeaders(req, handler);
}

// Start HTTP server on port 8000
serve(mainHandler, { port: 8000 });

// The Web app starts with the command:
// deno run --allow-net --allow-env --allow-read --watch app.js
