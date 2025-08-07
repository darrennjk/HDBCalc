const budgetInput = document.getElementById('budget');
const form = document.getElementById('hdb-form');
const flatType = document.getElementById('flatType');
const ehg = document.getElementById('EHG-select');
let total = 0;

function handleFormSubmit(event) {
    event.preventDefault();
    const budget = parseFloat(budgetInput.value);
    handleInvalidInput(budget);
    handleScheme(budgetInput.value);
    const outerCostBreakdown = document.querySelector('.outer-cost-breakdown');
    outerCostBreakdown.style.display = 'grid';

    set_BSD(budget);
    return;
    const leaseSum = updateLease(budget);
    const keysSum = updateKeys(budget);
    updateTotal(leaseSum, keysSum, ehg)

}

// Handles Nan or less than 0 budgets
function handleInvalidInput(budget) {
    if (isNaN(budget) || budget <= 0) {
        alert("Please enter a valid budget.");
        return;
    }
}

// Handle scheme type
function handleScheme(budget) {
    const types = [
        { schemeType: "", lease: "5%", keys: "20%"}, // Default value
        { schemeType: "staggered", lease: "5%", keys: "20%"},
        { schemeType: "staggeredDiffered", lease: "2.5%", keys: "22.5%"},
        { schemeType: "standard", lease: "10%", keys: "15%"},
    ];

    const current_scheme = get_scheme();

    for (const scheme of types) {
        if (scheme.schemeType == current_scheme) {
            set_leaseDownpayment(scheme.lease);
            set_leaseDownpayment_value(budget, scheme.lease);
            set_collectionDownpayment(scheme.keys);
            set_keysDownpayment_value(budget, scheme.keys);
        }
    }
}

// Updates 5% downpayment value
function update5Downpay(budget) {
    let downpay = (budget * 0.05);
    updateText('5downpay', downpay);
    return downpay;
}

// Updates 20% downpayment value
function update20DownPay(budget) {
    let downpay = (budget * 0.20);
    updateText('20downpay', downpay);
    return downpay;
}


// Updates conveyance fee value
function updateConveyance(budget) {
    let conveyance = 0;
    let remaining = budget;

    const tiers = [
        { limit: 30000, rate: 0.90 },
        { limit: 30000, rate: 0.72 },
        { limit: Infinity, rate: 0.60 },
    ];

    // Adding up fees based on tiers 
    for (const tier of tiers) {
        const taxable = Math.min(tier.limit, remaining);
        conveyance += (taxable / 1000) * tier.rate;
        remaining -= taxable;
        if (remaining <= 0) break;
    }

    conveyance = Math.ceil(conveyance); // Round up
    conveyance = conveyance * 1.09; // Add 9% GST
    if (conveyance < 21.60) { conveyance = 21.60 } // Set minimum coneyance fee

    updateText("leaseConveyance", Math.round(conveyance));
    return Math.round(conveyance);
}

// Updates survey fee value
function updateSurvey() {
    const tiers = [
        { type: "1-room", fee: 163.5 },
        { type: "2-room", fee: 163.5 },
        { type: "3-room", fee: 231.6 },
        { type: "4-room", fee: 299.75 },
        { type: "5-room", fee: 354.25 },
        { type: "Executive", fee: 408.75 },
    ];

    for (const tier of tiers) {
        if (flatType.value == tier.type) {
            updateText("survey", tier.fee);
            return tier.fee;
        }
    }
}

// Updates fire insurance fee value
function updateFire() {
    const tiers = [
        { type: "1-room", fee: 1.11 },
        { type: "2-room", fee: 1.99 },
        { type: "3-room", fee: 3.27 },
        { type: "4-room", fee: 4.59 },
        { type: "5-room", fee: 5.43 },
        { type: "Executive", fee: 6.68 },
    ];

    for (const tier of tiers) {
        if (flatType.value == tier.type) {
            updateText("fireInsurance", tier.fee);
            return tier.fee;
        }
    }
}

// Update cost for signing of lease
function updateLease(budget) {
    // downpay5 = update5Downpay(budget);
    const leaseDownpayment = get_leaseDownpayment_value();
    bsd = updateBSD(budget);
    conveyance = updateConveyance(budget);
    let leaseSum = downpay5 + bsd + conveyance;
    updateText('leaseSum', leaseSum);
    return leaseSum;
}

// Update cost/ during collection of keys
function updateKeys(budget) {
    survey = updateSurvey();
    const leaseReg = document.getElementById('leaseReg');
    const mortgageReg = document.getElementById('mortgageReg');
    fire = updateFire();
    downpay20 = update20DownPay(budget);

    let keysSum = survey + parseFloat(leaseReg.textContent) + parseFloat(mortgageReg.textContent) + fire + downpay20
    updateText('keysSum', keysSum);
    return keysSum;
}

// Update total cost
function updateTotal(leaseSum, keysSum, ehg) {
    const total = leaseSum + keysSum;
    updateText('totalCost', total);

    // Check if li arleady exists to prevent duplication
    let existing = document.getElementById("afterGrant");
    if (existing) { existing.remove() };

    if (ehg.value && parseFloat(ehg.value) > 0) {
        const grant = parseFloat(ehg.value);
        const afterGrant = total - grant;

        // Create new list item
        let finalTotal = document.createElement("li");
        finalTotal.innerHTML = `
            <div id="afterGrant">
                <div>Total cost after grant is:</div> 
                <div class="amount">$${afterGrant}</div>
            </div>
            `;

        // Append to list
        let cost = document.getElementById("totalList");
        cost.appendChild(finalTotal);
    }
    return total;
}

// Setters
function set_leaseDownpayment(leasePercentage) {
    const leasePercent = document.querySelector('.duringSigning #leasePercent');
    leasePercent.textContent = leasePercentage;
}

function set_collectionDownpayment(keysPercentage) {
    const leasePercent = document.querySelector('.duringCollection #keysPercent');
    keysPercent.textContent = keysPercentage;
}

function set_leaseDownpayment_value(budget_string, leaseValue_string) {
    const leaseValue = parseFloat(leaseValue_string);
    const budgetValue = parseFloat(budget_string);
    let new_total = budgetValue * (leaseValue/100);
    new_total = new_total.toString();
    const leaseDownpayment_value = document.querySelector('.duringSigning #leaseDownpayment_value');
    leaseDownpayment_value.textContent = new_total;

}

function set_keysDownpayment_value(budget_string, keysValue_string) {
    const keysValue = parseFloat(keysValue_string);
    const budgetValue = parseFloat(budget_string);
    let new_total = budgetValue * (keysValue/100);
    new_total = new_total.toString();
    const keysDownpayment_value = document.querySelector('.duringCollection #keysDownpayment_value');
    keysDownpayment_value.textContent = new_total;
}

// Set Buyer's Stamp Duty value
function set_BSD(budget) {
    let bsd = 0;
    let remaining = budget;

    const tiers = [
        { limit: 180000, rate: 0.01 },
        { limit: 180000, rate: 0.02 },
        { limit: 640000, rate: 0.03 },
        { limit: 5000000, rate: 0.04 },
        { limit: 15000000, rate: 0.05 },
        { limit: Infinity, rate: 0.06 },
    ];
    for (const tier of tiers) {
        const taxable = Math.min(tier.limit, remaining);
        bsd += taxable * tier.rate;
        remaining -= taxable;
        if (remaining <= 0) break;
    }
    
    console.log(budget);
    console.log(bsd.toString());
    bsd_element = document.querySelector('.duringSigning #BSD');
    bsd_element.textContent = bsd.toString();
    return;
}

// Getters for scheme type
function get_scheme() {
    const schemeType = document.getElementById("scheme-select");
    return schemeType.value
}

function get_leaseDownpayment_value() {
    const leaseDownpayment_value = document.querySelector('.duringSigning #leaseDownpayment_value');
    return parseFloat(leaseDownpayment_value.value);
}

function get_keysDownpayment_value() {
    const keysDownpayment_value = document.querySelector('.duringCollection #keysDownpayment_value');
    return parseFloat(keysDownpayment_value.value);
}

function get_BSD() {
    const bsd = document.querySelector('.duringSigning #BSD');
    return parseFloat(bsd.value);
}

// Helper function for updating HTML values
function updateText(id, value) {
    document.getElementById(id).textContent = value.toFixed(2);
}

form.addEventListener('submit', handleFormSubmit);
