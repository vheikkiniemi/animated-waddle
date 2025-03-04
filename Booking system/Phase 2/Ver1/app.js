import { serve } from "https://deno.land/std@0.199.0/http/server.ts";
import { registerUser } from "./routes/register.js"; // Import register logic
import { loginUser } from "./routes/login.js"; // Import login logic

let connectionInfo = {}; // Store connection details for logging purposes

// Middleware to set security headers globally
async function addSecurityHeaders(req, handler) {
    const response = await handler(req);

    // Set security headers to enhance protection against attacks
    response.headers.set("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self'; " +
        "img-src 'self'; " +
        "frame-ancestors 'none'; " +
        "form-action 'self';"); // Restrict form submissions to the same origin
    response.headers.set("X-Frame-Options", "DENY"); // Prevent Clickjacking
    response.headers.set("X-Content-Type-Options", "nosniff"); // Prevent MIME type sniffing

    return response;
}

// Serve static files from the file system
async function serveStaticFile(path, contentType) {
    try {
        const data = await Deno.readFile(path);
        return new Response(data, {
            headers: { "Content-Type": contentType },
        });
    } catch {
        return new Response("File not found", { status: 404 }); // Return 404 if file is not found
    }
}

// Handle incoming HTTP requests
async function handler(req) {
    const url = new URL(req.url);

    // Serve static files if requested
    if (url.pathname.startsWith("/static/")) {
        const filePath = `.${url.pathname}`;
        const contentType = getContentType(filePath);
        return await serveStaticFile(filePath, contentType);
    }

    // Serve the index page
    if (url.pathname === "/" && req.method === "GET") {
        return await serveStaticFile("./views/index.html", "text/html");
    }

    // Serve the registration page
    if (url.pathname === "/register" && req.method === "GET") {
        return await serveStaticFile("./views/register.html", "text/html");
    }

    // Handle user registration submission
    if (url.pathname === "/register" && req.method === "POST") {
        const formData = await req.formData();
        return await registerUser(formData);
    }

    // Serve the login page
    if (url.pathname === "/login" && req.method === "GET") {
        return await serveStaticFile("./views/login.html", "text/html");
    }

    // Handle user login submission
    if (url.pathname === "/login" && req.method === "POST") {
        const formData = await req.formData();
        return await loginUser(formData, connectionInfo);
    }

    // Default response for unrecognized routes
    return new Response("Not Found", { status: 404 });
}

// Utility function: Determine the content type based on file extension
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
    return mimeTypes[ext] || "application/octet-stream"; // Default to binary stream if unknown
}

// Start the server with security middleware
async function mainHandler(req, info) {
    connectionInfo = info; // Store connection details
    return await addSecurityHeaders(req, handler); // Apply security headers
}

// Start the web server on port 8000
serve(mainHandler, { port: 8000 });

// The Web app starts with the command:
// deno run --allow-net --allow-env --allow-read --watch app.js
