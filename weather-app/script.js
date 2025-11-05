// const API_KEY = '1adc581bb1fcbe756a43386105271b92';

async function getWeather(city) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent('Lagos')}&units=metric&appid=${'1adc581bb1fcbe756a43386105271b92'}`;

  const res = await fetch(url);
  const data = await res.json();     // read body anyway

  if (!res.ok) {
    console.log('API error:', data); // <-- SEE real reason in console
    throw new Error(data.message || 'Request failed');
  }

  return data;
}



const cityEl = document.getElementById('city');
const tempEl = document.getElementById('temp');
const headlineEl = document.getElementById('headline');
const iconEl = document.getElementById('icon');
const form = document.getElementById('city-form');
const input = document.getElementById('city-input');


function updateUI(data) {
  const city = data.name;
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;

  cityEl.textContent = city;
  tempEl.textContent = temp + '°C';

  // crude “fun” headline like the screenshot
  // you can swap strings based on desc
  if (desc.includes('rain')) {
    headlineEl.textContent = "It's raining.";
  } else if (desc.includes('cloud')) {
    headlineEl.textContent = "It's cloudy.";
  } else {
    headlineEl.textContent = "It's nice out.";
  }

  iconEl.innerHTML =
    `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">`;
}


async function loadCity(city) {
  try {
    const data = await getWeather(city);
    updateUI(data);
  } catch (err) {
    headlineEl.textContent = 'Could not load city.';
    cityEl.textContent = city;
    tempEl.textContent = '--';
    iconEl.innerHTML = '';
  }
}

// initial load
loadCity('Lagos');



form.addEventListener('submit', e => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return;
  loadCity(city);
  input.value = '';
});

