const API_KEY = '1adc581bb1fcbe756a43386105271b92';

async function getWeather(city) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('City not found');
  }
  const data = await res.json();
  return data;
}
