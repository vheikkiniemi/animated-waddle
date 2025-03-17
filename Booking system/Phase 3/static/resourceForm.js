document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        fetch(`/api/resources/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Resource not found or unauthorized');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('resource_id').value = data.resource_id;
                document.getElementById('resource_name').value = data.resource_name;
                document.getElementById('resource_description').value = data.resource_description;
            })
            .catch(err => console.error('Error loading resource data:', err));
    }
});
