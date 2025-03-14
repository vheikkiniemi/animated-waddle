import { serve } from "https://deno.land/std@0.199.0/http/server.ts";
import { registerUser } from "./routes/register.js"; // Import register logic
import { loginUser } from "./routes/login.js"; // Import login logic
import { registerResource, getResources } from "./routes/resource.js";
import { registerReservation, handleReservationForm } from "./routes/reservation.js";
import { handleIndex, handleDefaultIndex } from "./routes/indexPage.js";
import { getSession, destroySession, getCookieValue } from "./sessionService.js"; // Updated session handling

let connectionInfo = {}; // Store connection details for logging purposes

// Middleware to set security headers globally
async function addSecurityHeaders(req, handler) {
    const response = await handler(req);

    // Set security headers
    response.headers.set("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self'; " +
        "img-src 'self'; " +
        "frame-ancestors 'none'; " +
        "form-action 'self';"); // Allow form submissions only to your domain
    response.headers.set("X-Frame-Options", "DENY"); // Prevent Clickjacking
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

// Handle incoming requests
async function handler(req) {
    const url = new URL(req.url);

    // Retrieve session
    const session = await getSession(req);

    // Route: Serve static files
    if (url.pathname.startsWith("/static/")) {
        const filePath = `.${url.pathname}`;
        const contentType = getContentType(filePath);
        return await serveStaticFile(filePath, contentType);
    }

    // Route: Index page
    if (url.pathname === "/" && req.method === "GET") {
        return session ? await handleIndex(req) : await handleDefaultIndex(req);
    }

    // Route: Registration page
    if (url.pathname === "/register" && req.method === "GET") {
        return await serveStaticFile("./views/register.html", "text/html");
    }

    // Route: Handle user registration
    if (url.pathname === "/register" && req.method === "POST") {
        const formData = await req.formData();
        return await registerUser(formData);
    }

    // Route: Login page
    if (url.pathname === "/login" && req.method === "GET") {
        return await serveStaticFile("./views/login.html", "text/html");
    }

    // Route: Handle user login
    if (url.pathname === "/login" && req.method === "POST") {
        const formData = await req.formData();
        return await loginUser(formData, connectionInfo);
    }

    // Route: Handle user log out
    if (url.pathname === "/logout" && req.method === "GET") {
        // Destroy session
        const cookies = req.headers.get("Cookie") || "";
        const sessionId = getCookieValue(cookies, "session_id");

        if (sessionId) {
            await destroySession(sessionId);
        }

        // Clear the session cookie and redirect to the index page
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
                "Set-Cookie": "session_id=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
            },
        });
    }

    // Route: Resource page (Requires authentication)
    if (url.pathname === "/resources" && req.method === "GET") {
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        return await serveStaticFile("./views/resource.html", "text/html");
    }

    // Route: Handle resources (Requires authentication)
    if (url.pathname === "/resources" && req.method === "POST") {
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        const formData = await req.formData();
        return await registerResource(formData);
    }

    // Route: Reservations page (Requires authentication)
    if (url.pathname === "/reservation" && req.method === "GET") {
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        return await handleReservationForm(req);
    }

    // Route: List of resources (Requires authentication)
    if (url.pathname === "/resourcesList" && req.method === "GET") {
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        return await getResources();
    }

    // Route: Handle reservations (Requires authentication)
    if (url.pathname === "/reservation" && req.method === "POST") {
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        const formData = await req.formData();
        return await registerReservation(formData);
    }

    // Default response for unknown routes
    return new Response("Not Found", { status: 404 });
}

// Utility: Get content type for static files
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

// Start the server with middleware
async function mainHandler(req, info) {
    connectionInfo = info;
    return await addSecurityHeaders(req, handler);
}

serve(mainHandler, { port: 8000 });

// The Web app starts with the command:
// deno run --allow-net --allow-env --allow-read --watch app.js
