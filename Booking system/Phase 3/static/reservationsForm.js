document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    async function loadUsers(selectedUserToken = null) {
        try {
            const userField = document.getElementById('reserver_token');
            if (selectedUserToken) {
                const response = await fetch('/api/users');
                const users = await response.json();
                const dropdown = document.createElement('select');
                dropdown.name = "reserver_token";
                dropdown.id = "reserver_token";
                dropdown.classList.add('mt-1', 'block', 'w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-md', 'shadow-sm', 'focus:outline-none', 'focus:ring-indigo-500', 'focus:border-indigo-500', 'sm:text-sm');
                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.user_token;
                    option.textContent = `${user.username}`;
                    if (user.user_token == selectedUserToken) {
                        option.selected = true;
                    }
                    dropdown.appendChild(option);
                });

                userField.replaceWith(dropdown);

            } else {
                const response = await fetch('/api/session');
                const session = await response.json();
                userField.value = session.username;
                userField.readOnly = true;
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    async function loadResources(selectedResourceId = null) {
        try {
            const response = await fetch('/api/resources');
            const resources = await response.json();
            const resourceDropdown = document.getElementById('resource_id');
            resources.forEach(resource => {
                const option = document.createElement('option');
                option.value = resource.resource_id;
                option.textContent = `${resource.resource_name} (${resource.resource_description})`;
                if (resource.resource_id == selectedResourceId) {
                    option.selected = true;
                }
                resourceDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading resources:', error);
        }
    }

    if (id) {
        try {
            const response = await fetch(`/api/reservations/${id}`);
            if (!response.ok) throw new Error("Reservation not found");
            const data = await response.json();
            document.getElementById('reservation_id').value = data.reservation_id;
            document.getElementById('reservation_start').value = data.reservation_start.substring(0, 16);
            document.getElementById('reservation_end').value = data.reservation_end.substring(0, 16);
            await loadUsers(data.reserver_token);
            await loadResources(data.resource_id);
        } catch (err) {
            console.error('Error loading reservation data:', err);
            await loadResources();
        }
    } else {
        await loadUsers();
        await loadResources();
    }
});
