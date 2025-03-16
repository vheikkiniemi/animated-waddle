document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    async function loadUsers(selectedUserToken = null) {
        try {
            const userField = document.getElementById('reserver_token');
            if (selectedUserToken) {
                // Dropdown tilanne (edit mode)
                const response = await fetch('/api/users');
                const users = await response.json();
                const dropdown = document.createElement('select');
                dropdown.name = "reserver_token";
                dropdown.id = "reserver_token";

                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.user_token;
                    option.textContent = `${user.username}`;
                    if (user.user_token == selectedUserToken) {
                        option.selected = true;
                    }
                    dropdown.appendChild(option);
                });

                // Korvaa nykyinen input dropdownilla
                userField.replaceWith(dropdown);

            } else {
                // Text input tilanne (create mode)
                const response = await fetch('/api/session');
                const session = await response.json();
                userField.value = session.username;
                userField.readOnly = true;
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    // 1. Lataa kaikki resurssit dropdowniin
    async function loadResources(selectedResourceId = null) {
        try {
            const response = await fetch('/api/resources');
            const resources = await response.json();
            const resourceDropdown = document.getElementById('resource_id');
            resources.forEach(resource => {
                const option = document.createElement('option');
                option.value = resource.resource_id;
                option.textContent = `${resource.resource_name} (${resource.resource_description})`;
                // Merkitään valituksi, jos reservationissa on resource_id valmiina
                if (resource.resource_id == selectedResourceId) {
                    option.selected = true;
                }
                resourceDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading resources:', error);
        }
    }

    // 2. Jos URL:ssa on id, lataa reservation tiedot
    if (id) {
        try {
            const response = await fetch(`/api/reservations/${id}`);
            if (!response.ok) throw new Error("Reservation not found");
            const data = await response.json();
            document.getElementById('reservation_id').value = data.reservation_id;
            document.getElementById('reservation_start').value = data.reservation_start.substring(0, 16);
            document.getElementById('reservation_end').value = data.reservation_end.substring(0, 16);
            // ladataan resurssit ja esivalitaan oikea resurssi
            await loadUsers(data.reserver_token);
            await loadResources(data.resource_id);
        } catch (err) {
            console.error('Error loading reservation data:', err);
            await loadResources(); // fallback, lataa resurssit silti
        }
    } else {
        // Jos ei id:tä, pelkkä resurssien lataus
        await loadUsers();
        await loadResources();
    }
});
