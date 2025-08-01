const budgetInput = document.getElementById('budget');
const form = document.getElementById('hdb-form');


function handleFormSubmit(event) {
  event.preventDefault();
  const budget = parseFloat(budgetInput.value);
 
  handleInvalidInput(budget);
  updateDownpayments(budget);
  updateText('BSD', updateBSD(budget));
  updateText('totalCost', budget);
}


function handleInvalidInput(budget) {
  if (isNaN(budget) || budget <= 0) {
    alert("Please enter a valid budget.");
    return;
  }
}

function updateDownpayments(budget) {
  updateText('5downpay', (budget*0.05));
  updateText('20downpay', (budget*0.20));
}

function updateBSD(budget) {
  let bsd = 0;
  let remaining = budget;

  const tiers = [
    {limit: 180000, rate:0.01},
    {limit: 180000, rate:0.02},
    {limit: 640000, rate:0.03},
    {limit: 5000000, rate:0.04},
    {limit: 15000000, rate:0.05},
    {limit: Infinity, rate:0.06},
  ];

  for (const tier of tiers) {
    const taxable = Math.min(tier.limit, remaining);
    bsd += taxable * tier.rate;
    remaining -= taxable;
    if (remaining <= 0) break;
  }

  return bsd;
}

function updateText(id, value) {
  document.getElementById(id).textContent = value.toFixed(2);
}

form.addEventListener('submit', handleFormSubmit);
