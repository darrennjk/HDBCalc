function handleFormSubmit(event) {
    event.preventDefault();

    const budgetInput = document.getElementById('budget');
    const budget = parseFloat(budgetInput.value);
    if (!handleInvalidInput(budget)) { return; };

    handleScheme(budgetInput.value);
    showCostBreakdown();
    updateAllCosts(budget);
}

// Handles Nan or less than 0 budgets
function handleInvalidInput(budget) {
    if (isNaN(budget) || budget <= 0) {
        alert("Please enter a valid budget.");
        return false;
    }
    return true;
}

function showCostBreakdown() {
    const outerCostBreakdown = document.querySelector('.outer-cost-breakdown');
    outerCostBreakdown.style.display = 'grid';
}

function updateAllCosts(budget) {
    // During Signing of Lease portion
    set_BSD(budget);
    set_conveyance(budget);
    set_leaseTotal();

    // During keys collection portion
    set_survey();
    set_fire();
    set_keysTotal();
    set_combined_total();
}
