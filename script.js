const budgetInput = document.getElementById('budget');
const form = document.getElementById('hdb-form');
const flatType = document.getElementById('flatType');
const ehg = document.getElementById('EHG-select');
let total = 0;

function handleFormSubmit(event) {
    event.preventDefault();
    const budget = parseFloat(budgetInput.value);
    handleInvalidInput(budget);

    const leaseSum = updateLease(budget);
    const keysSum = updateKeys(budget);
    updateTotal(leaseSum, keysSum, ehg)

}


function handleInvalidInput(budget) {
    if (isNaN(budget) || budget <= 0) {
        alert("Please enter a valid budget.");
        return;
    }
}

function update5Downpay(budget) {
    let downpay = (budget * 0.05);
    updateText('5downpay', downpay);
    return downpay;
}

function update20DownPay(budget) {
    let downpay = (budget * 0.20);
    updateText('20downpay', downpay);
    return downpay;
}

function updateBSD(budget) {
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

    updateText('BSD', bsd);
    return bsd;
}

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

    // updateTotal(Math.round(conveyance));
    updateText("leaseConveyance", Math.round(conveyance));
    return Math.round(conveyance);
}

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

function updateLease(budget) {
    downpay5 = update5Downpay(budget);
    bsd = updateBSD(budget);
    conveyance = updateConveyance(budget);
    let leaseSum = downpay5 + bsd + conveyance;
    updateText('leaseSum', leaseSum);
    return leaseSum;
}

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

function updateTotal(leaseSum, keysSum, ehg) {
    const total = leaseSum + keysSum;
    updateText('totalCost', total);

    if (ehg.value && parseFloat(ehg.value) > 0) {
        const grant = parseFloat(ehg.value);
        const afterGrant = total - grant;

        // Check if li arleady exists to prevent duplication
        let existing = document.getElementById("afterGrant");
        if (existing) { existing.remove() };

        // Create new list item
        let finalTotal = document.createElement("li");
        finalTotal.innerHTML = `<strong>Total cost after grant is: $${afterGrant}</strong>`;

        // Append to list
        let cost = document.getElementById("totalList");
        cost.appendChild(finalTotal);
    }
    return total;
}

function updateText(id, value) {
    document.getElementById(id).textContent = value.toFixed(2);
}

form.addEventListener('submit', handleFormSubmit);
