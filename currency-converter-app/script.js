const amountEl = document.getElementById('amount');
const fromEl = document.getElementById('from-currency');
const toEl = document.getElementById('to-currency');
const rateLineEl = document.getElementById('rate-line');
const resultEl = document.getElementById('result');

let ratesData = null;

async function fetchRates(base = 'USD') {
  const url = `https://api.exchangerate.host/latest?base=${base}`;
  console.log('fetching:', url);
  const res = await fetch(url);
  if (!res.ok) {
    console.log('fetch failed:', res.status, res.statusText);
    throw new Error('Could not fetch rates');
  }
  const data = await res.json();
  console.log('data from API:', data);
  return data;
}

function populateSelects(codes) {
  console.log('populating with codes:', codes.length);
  fromEl.innerHTML = '';
  toEl.innerHTML = '';

  codes.forEach(code => {
    const opt1 = document.createElement('option');
    opt1.value = code;
    opt1.textContent = code;
    fromEl.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = code;
    opt2.textContent = code;
    toEl.appendChild(opt2);
  });

  // defaults only if they exist
  if (codes.includes('USD')) fromEl.value = 'USD';
  if (codes.includes('NGN')) toEl.value = 'NGN';
}

function convert() {
  if (!ratesData) return;

  const amount = Number(amountEl.value) || 0;
  const toCurr = toEl.value;
  const rate = ratesData.rates[toCurr];

  if (!rate) {
    rateLineEl.textContent = 'Rate: --';
    resultEl.textContent = '= --';
    return;
  }

  const converted = amount * rate;

  rateLineEl.textContent = `Rate: 1 ${ratesData.base} = ${rate.toFixed(4)} ${toCurr}`;
  resultEl.textContent = `= ${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${toCurr}`;
}

async function init() {
  try {
    const data = await fetchRates('USD');
    ratesData = data;

    const codes = Object.keys(data.rates).sort();
    populateSelects(codes);

    convert();
  } catch (err) {
    console.log('init error:', err);
    rateLineEl.textContent = 'Rate: error';
    resultEl.textContent = '= --';
  }
}

init();

// listeners
amountEl.addEventListener('input', convert);
toEl.addEventListener('change', convert);

fromEl.addEventListener('change', async () => {
  try {
    const newBase = fromEl.value;
    const data = await fetchRates(newBase);
    ratesData = data;
    convert();
  } catch (err) {
    console.log('error refetching base:', err);
  }
});
