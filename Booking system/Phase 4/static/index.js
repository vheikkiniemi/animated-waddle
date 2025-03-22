async function init() {
    let session = null;

    try {
        const response = await fetch('/api/session');
        if (response.status === 200) {
            session = await response.json();
        }
    } catch (err) {
        console.error('Network error:', err);
    }

    const userBox = document.getElementById('userBox');

    if (session) {
        userBox.innerHTML = `
            <h2 class="text-xl font-bold mb-4">You are ${session.username}</h2>
            <p class="mb-4">Your role is ${session.role}</p>
            <div  id="action-links" class="flex justify-between space-x-4 mt-4">
                <a href="/account" class="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-1/2">Account</a>
                <a href="/logout" class="inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-1/2">Log out</a>
            </div>`;
    }

    // Retrieve reservations from the API and update the table
    try {
        const reservationsRes = await fetch('/api/reservations');
        if (reservationsRes.ok) {
            const reservations = await reservationsRes.json();
            const tableBody = document.getElementById('reservationTable');
            tableBody.innerHTML = ""; // Clear table before update
            if (session) {
                const tableHead = document.getElementById('reservationTableHead').querySelector('tr');
                // Create a new th element
                const reserverHead = document.createElement('th');
                reserverHead.className = 'py-2 px-4 border-b';
                reserverHead.textContent = 'Reserver';
                // Append the new th element to the table head
                tableHead.appendChild(reserverHead);

                reservations.forEach(r => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                    <td class="py-2 px-4 border-b"><a href="/resources?id=${r.resource_id}" class="font-bold">${r.resource_name}</a></td>
                    <td class="py-2 px-4 border-b"><a href="/reservation?id=${r.reservation_id}" class="font-bold">${new Date(r.reservation_start).toLocaleString('fi-FI')}</a></td>
                    <td class="py-2 px-4 border-b"><a href="/reservation?id=${r.reservation_id}" class="font-bold">${new Date(r.reservation_end).toLocaleString('fi-FI')}</a></td>
                    <td class="py-2 px-4 border-b">${r.reserver_username}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            } else {
                reservations.forEach(r => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                    <td class="py-2 px-4 border-b">${r.resource_name}</td>
                    <td class="py-2 px-4 border-b">${new Date(r.reservation_start).toLocaleString('fi-FI')}</td>
                    <td class="py-2 px-4 border-b">${new Date(r.reservation_end).toLocaleString('fi-FI')}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            }



        } else {
            console.warn("No reservations found.");
        }
    } catch (err) {
        console.error("Error fetching reservations:", err);
    }

    const addResourceLink = document.getElementById('add-resource');
    const addReservationLink = document.getElementById('add-reservation');
    if (session) {
        // Prevents clicking and makes it visually "disabled"
        [addResourceLink, addReservationLink].forEach(link => {
            link.classList.remove('bg-gray-400', 'cursor-not-allowed', 'pointer-events-none');
            link.classList.add('bg-blue-500', 'hover:bg-blue-600');
            link.setAttribute('title', 'Login required');
        });
    }
}

init();
