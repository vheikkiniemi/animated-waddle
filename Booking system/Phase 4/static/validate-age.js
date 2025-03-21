document.addEventListener("DOMContentLoaded", function() {
    // Laske päivämäärä 15 vuotta sitten
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    const maxDate = minAgeDate.toISOString().split("T")[0];

    // Aseta max-attribuutti syntymäpäiväkenttään
    const birthdateInput = document.getElementById("birthdate");
    if (birthdateInput) {
        birthdateInput.setAttribute("max", maxDate);
    }

    // Tarkista client-puolella että käyttäjä on vähintään 15
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function(e) {
            const birthdateValue = birthdateInput.value;
            const birthdate = new Date(birthdateValue);

            if (birthdate > minAgeDate) {
                e.preventDefault();
                alert("You must be at least 15 years old to register.");
            }
        });
    }
});
