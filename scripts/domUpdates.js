// Update total cost
function set_combined_total() {
    const leaseTotal = get_leaseTotal();
    const keysTotal = get_keysTotal();
    const ehg = get_ehg();
    let combined_total = leaseTotal + keysTotal;

    combined_total_element = document.querySelector('#combined_total');
    combined_total_element.textContent = combined_total.toString();

    // Check if li arleady exists to prevent duplication
    let existing = document.getElementById("afterGrant");
    if (existing) { existing.remove() };

    if (ehg && ehg > 0) {
        const afterGrant = combined_total - ehg;

        // Create new list item
        let finalTotal = document.createElement("li");
        finalTotal.innerHTML = `
            <div id="afterGrant">
                <div>After Grant:</div> 
                <div class="amount">$${afterGrant}</div>
            </div>
            `;

        // Append to list
        let list_element = document.getElementById("totalList");
        list_element.appendChild(finalTotal);
    }
    return;
}

// Setters
function set_leaseDownpayment(leasePercentage) {
    const leasePercent = document.querySelector('.duringSigning #leasePercent');
    leasePercent.textContent = leasePercentage;
}

function set_collectionDownpayment(keysPercentage) {
    const keysPercent = document.querySelector('.duringCollection #keysPercent');
    keysPercent.textContent = keysPercentage;
}

function set_leaseDownpayment_value(budget_string, leaseValue_string) {
    const leaseValue = parseFloat(leaseValue_string);
    const budgetValue = parseFloat(budget_string);
    let new_total = budgetValue * (leaseValue / 100);
    new_total = new_total.toString();
    const leaseDownpayment_value = document.querySelector('.duringSigning #leaseDownpayment_value');
    leaseDownpayment_value.textContent = new_total;

}

function set_keysDownpayment_value(budget_string, keysValue_string) {
    const keysValue = parseFloat(keysValue_string);
    const budgetValue = parseFloat(budget_string);
    let new_total = budgetValue * (keysValue / 100);
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

    bsd_element = document.querySelector('.duringSigning #BSD');
    bsd_element.textContent = bsd.toString();
    return;
}

// Set conveyance fee value
function set_conveyance(budget) {
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
    conveyance = Math.round(conveyance);
    if (conveyance < 21.60) { conveyance = 21.60 } // Set minimum coneyance fee

    conveyance_element = document.querySelector('.duringSigning #leaseConveyance');
    conveyance_element.textContent = conveyance.toString();
    return;
}

function set_leaseTotal() {
    const leaseDownpayment = get_leaseDownpayment_value();
    const bsd = get_BSD();
    const conveyance = get_conveyance();
    let total = leaseDownpayment + bsd + conveyance;

    leaseTotal_element = document.querySelector('.duringSigning #leaseSum');
    leaseTotal_element.textContent = total.toString();
}

// Updates survey fee value
function set_survey() {
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
            survey_element = document.querySelector('.duringCollection #survey');
            survey_element.textContent = tier.fee.toString();
            return;
        }
    }
}

// Updates fire insurance fee value
function set_fire() {
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
            fireInsurance_element = document.querySelector('.duringCollection #fireInsurance');
            fireInsurance_element.textContent = tier.fee.toString();
            return;
        }
    }
}

// Set total cost during collection of keys
function set_keysTotal() {
    const survey = get_survey();
    const leaseReg = get_leaseReg();
    const mortgageReg = get_mortgageReg();
    const fire = get_fire();
    const collectionDownpayment = get_keysDownpayment_value();
    let total = survey + leaseReg + mortgageReg + fire + collectionDownpayment;

    keysTotal_element = document.querySelector('.duringCollection #keysSum');
    keysTotal_element.textContent = total.toString();
    return;
}

// ALL GETTERS
// Getters for scheme type
function get_scheme() {
    const schemeType = document.getElementById("scheme-select");
    return schemeType.value
}

function get_leaseDownpayment_value() {
    const leaseDownpayment_value = document.querySelector('.duringSigning #leaseDownpayment_value');
    // console.log(leaseDownpayment_value.textContent);
    return parseFloat(leaseDownpayment_value.textContent);
}

function get_keysDownpayment_value() {
    const keysDownpayment_value = document.querySelector('.duringCollection #keysDownpayment_value');
    return parseFloat(keysDownpayment_value.textContent);
}

function get_BSD() {
    const bsd = document.querySelector('.duringSigning #BSD');
    return parseFloat(bsd.textContent);
}

function get_conveyance() {
    const conveyance = document.querySelector('.duringSigning #leaseConveyance');
    return parseFloat(conveyance.textContent);
}

function get_survey() {
    const survey = document.querySelector('.duringCollection #survey');
    return parseFloat(survey.textContent);
}

function get_fire() {
    const fire = document.querySelector('.duringCollection #fireInsurance');
    return parseFloat(fire.textContent);
}

function get_leaseReg() {
    const leaseReg = document.querySelector('.duringCollection #leaseReg');
    return parseFloat(leaseReg.textContent);
}

function get_mortgageReg() {
    const mortgageReg = document.querySelector('.duringCollection #mortgageReg');
    return parseFloat(mortgageReg.textContent);
}

function get_leaseTotal() {
    const leaseTotal = document.querySelector('.duringSigning #leaseSum');
    return parseFloat(leaseTotal.textContent);
}

function get_keysTotal() {
    const keysTotal = document.querySelector('.duringCollection #keysSum');
    return parseFloat(keysTotal.textContent);
}

function get_ehg() {
    const ehg = document.querySelector('#EHG-select');
    return parseFloat(ehg.value);
}

function get_grant() {
    const ehg = document.querySelector('#EHG-select');
    return parseFloat(ehg.value);
}

