import client from "../db/db.js";

export async function getResources(req) {
    const query = `SELECT resource_id, resource_name, resource_description FROM zephyr_resources`;
    try {
        const result = await client.queryObject(query);
        return new Response(JSON.stringify(result.rows), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Error fetching resources:', error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function getResourceById(id) {
    try {
        const query = `SELECT resource_id, resource_name, resource_description FROM zephyr_resources WHERE resource_id = $1`;
        const result = await client.queryObject(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error fetching resource by id:', error);
        return null;
    }
}

export async function updateResource(formData) {
    const resourceId = formData.get("resource_id");
    const resourceName = formData.get("resource_name");
    const resourceDescription = formData.get("resource_description");
    try {
        const query = `UPDATE zephyr_resources SET resource_name = $1, resource_description = $2 WHERE resource_id = $3`;
        await client.queryArray(query, [resourceName, resourceDescription, resourceId]);
        return new Response(null, { status: 302, headers: { Location: "/", }, });
    } catch (error) {
        console.error(error);
        return new Response("Error during updating resource", { status: 500 });
    }
}

export async function registerResource(formData) {
    const resourceName = formData.get("resource_name");
    const resourceDescription = formData.get("resource_description");
    try {
        const query = `INSERT INTO zephyr_resources (resource_name, resource_description) VALUES ($1, $2)`;
        await client.queryArray(query, [resourceName, resourceDescription]);
        return new Response(null, { status: 302, headers: { Location: "/", }, });
    } catch (error) {
        console.error(error);
        return new Response("Error during adding resource", { status: 500 });
    }
}

