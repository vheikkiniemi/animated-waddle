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
                <a href="/logout" class="inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-1/2">Log Out</a>
            </div>`;
    } else {
        userBox.innerHTML = `
            <h2 class="text-xl font-bold mb-4">You are not logged in</h2>
            <p class="mb-4">You need to log in or register first</p>
            <div id="action-links" class="flex justify-between space-x-4 mt-4">
                <a href="/login" class="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-1/2">Login</a>
                <a href="/register" class="inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-1/2">Register</a>
            </div>`;
    }

    // Haetaan varaukset API:sta ja päivitetään taulukko
    try {
        const reservationsRes = await fetch('/api/reservations');
        if (reservationsRes.ok) {
            const reservations = await reservationsRes.json();
            const tableBody = document.getElementById('reservationTable');
            tableBody.innerHTML = ""; // Tyhjennä taulukko ennen päivitystä
            if (session) {            
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
                    const reserverHead = document.getElementById('reserverHead');
                    reserverHead.remove();
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
    if (!session) {
        // Estetään klikkaus ja tehdään visuaalisesti "disabled"
        [addResourceLink, addReservationLink].forEach(link => {
            link.classList.remove('bg-blue-500', 'hover:bg-blue-600');
            link.classList.add('bg-gray-400', 'cursor-not-allowed', 'pointer-events-none');
            link.setAttribute('title', 'Login required');
        });
    }

    // Voit lisätä tähän myös taulukon hakemisen
}

init();
