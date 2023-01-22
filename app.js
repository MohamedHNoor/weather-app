const APIKey = 'a6a092cbb8512585f35d4cde342e5a7a';

const form = document.getElementById('form-submit');
const seachInput = document.querySelector('#search-input');
const lists = document.getElementById('lists');
const weather = document.getElementById('weather');
const city = document.getElementById('city');
const degrees = document.getElementById('degrees');
const feelsLikeValue = document.getElementById('feelsLikeValue');
const humidityValue = document.getElementById('humidityValue');
const windSpeedValue = document.getElementById('windValue');
const weatherIcon = document.getElementById('icon');
const changeBtn = document.getElementById('change');

const search = async () => {
  const phrase = seachInput.value;
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${APIKey}`,
  );
  const data = await response.json();
  lists.innerHTML = '';
  data.forEach((item) => {
    const {
      name, country, lat, lon,
    } = item;
    lists.innerHTML += `
    <li 
      data-lat=${lat} 
      data-lon=${lon} 
      data-name=${name}>
      ${name}<span>${country}</span>
    </li>`;
  });
};

// eslint-disable-next-line no-undef
const debouncedSearch = _.debounce(() => {
  search();
}, 600);

seachInput.addEventListener('keyup', debouncedSearch);

const showWeather = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`,
  );
  const data = await response.json();
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = Math.round(data.main.humidity);
  const windSpeed = Math.round(data.wind.speed);
  const { icon } = data.weather[0];

  city.innerHTML = data.name;
  degrees.innerHTML = `${temp}&#8451;`;
  feelsLikeValue.innerHTML = `${feelsLike}<span>&#8451;</span>`;
  humidityValue.innerHTML = `${humidity}<span>%</span>`;
  windSpeedValue.innerHTML = `${windSpeed}<span>kh/h</span>`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  form.style.display = 'none';
  weather.style.display = 'block';
};

document.body.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const { lat, lon, name } = e.target.dataset;
    localStorage.setItem('lat', lat);
    localStorage.setItem('lon', lon);
    localStorage.setItem('name', name);
    showWeather(lat, lon);
  }
  seachInput.value = '';
});

changeBtn.addEventListener('click', () => {
  form.style.display = 'block';
  weather.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
  const lat = localStorage.getItem('lat');
  const lon = localStorage.getItem('lon');
  const name = localStorage.getItem('name');

  if (lat && lon && name) {
    showWeather(lat, lon, name);
  }
});
