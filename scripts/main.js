document.addEventListener("DOMContentLoaded", () => {
    setYearsSelection();

    const form = document.getElementById('hdb-form');
    form.addEventListener('submit', handleFormSubmit);
});
