const amountEl = document.getElementById('amount');
const fromEl = document.getElementById('from-currency');
const toEl = document.getElementById('to-currency');
const rateLineEl = document.getElementById('rate-line');
const resultEl = document.getElementById('result');

let ratesData = null;

async function fetchRates(base = 'USD') {
  const res = await fetch(`https://api.exchangerate.host/latest?base=${base}`);
  const data = await res.json();
  return data;
}

function populateSelects(codes) {
  fromEl.innerHTML = '';
  toEl.innerHTML = '';

  codes.forEach(code => {
    const opt1 = document.createElement('option');
    opt1.value = code;
    opt1.textContent = code;

    const opt2 = document.createElement('option');
    opt2.value = code;
    opt2.textContent = code;

    fromEl.appendChild(opt1);
    toEl.appendChild(opt2);
  });

  fromEl.value = 'USD';
  toEl.value = 'NGN';
}

function convert() {
  if (!ratesData) return;

  const amount = Number(amountEl.value) || 0;
  const toCurr = toEl.value;
  const rate = ratesData.rates[toCurr];

  const converted = amount * rate;

  rateLineEl.textContent = `Rate: 1 ${ratesData.base} = ${rate.toFixed(4)} ${toCurr}`;
  resultEl.textContent = `= ${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${toCurr}`;
}

async function init() {
  const data = await fetchRates('USD');
  ratesData = data;
  const codes = Object.keys(data.rates).sort();
  populateSelects(codes);
  convert();
}

init();

amountEl.addEventListener('input', convert);
toEl.addEventListener('change', convert);

fromEl.addEventListener('change', async () => {
  const newBase = fromEl.value;
  const data = await fetchRates(newBase);
  ratesData = data;
  convert();
});
