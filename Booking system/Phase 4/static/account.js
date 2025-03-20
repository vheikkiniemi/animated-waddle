document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch account information from the server
        const response = await fetch("/api/account");
        if (!response.ok) {
            throw new Error("Failed to fetch account information");
        }
        const accountData = await response.json();

        // Populate account information on the page
        document.getElementById("username").value = accountData.username;
        document.getElementById("role").value = accountData.role;
        document.getElementById("terms_accepted").value = accountData.terms_accepted ? "Yes" : "No";
        document.getElementById("created_at").value = new Date(accountData.created_at).toLocaleString('fi-FI');
    } catch (error) {
        console.error("Error loading account information:", error);
    }
});
