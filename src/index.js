import './style.css';
import day from './assets/day_image.svg';
import night from './assets/night_image.svg';
import { convertToCelsius } from './utils';

// DOM Elements
const searchForm = document.querySelector('.search-location');
const cityInput = document.querySelector('.search-location input');
const cityName = document.querySelector('.city-name p');
const cardBody = document.querySelector('.card-body');
const timeImage = document.querySelector('.card-top img');
const cardInfo = document.querySelector('.back-card');
const errorMessage = document.querySelector('.error-message');

// Update the UI with the requested data
const updateWeatherApp = (city) => {
  const imageName = city.weather[0].icon;
  const iconSrc = `http://openweathermap.org/img/wn/${imageName}@2x.png`;
  cityName.textContent = city.name;
  errorMessage.textContent = '';
  cardBody.innerHTML = `
        <div class="card-mid row">
                <div class="col-8 text-center temp">
                <span>${convertToCelsius(city.main.temp)}&deg;C</span>
                </div>
                <div class="col-4 condition-temp">
                <p class="condition">${city.weather[0].description}</p>
                <p class="high">${convertToCelsius(
                  city.main.temp_max
                )}&deg;C</p>
                <p class="low">${convertToCelsius(city.main.temp_min)}&deg;C</p>
                </div>
            </div>
            <div class="icon-container card shadow mx-auto">
                <img src="${iconSrc}" alt="" />
            </div>
            <div class="card-bottom px-5 py-4 row">
                <div class="col text-center">
                <p>${convertToCelsius(city.main.feels_like)}&deg;C</p>
                <span>Feels Like</span>
                </div>
                <div class="col text-center">
                <p>${city.main.humidity}%</p>
                <span>Humidity</span>
                </div>
          </div>`;

  if (imageName.includes('d')) {
    timeImage.setAttribute('src', `${day}`);
    cityName.classList.contains('text-white')
      ? cityName.classList.remove('text-white')
      : cityName.classList.add('text-black');
  } else {
    timeImage.setAttribute('src', `${night}`);
    cityName.classList.contains('text-black')
      ? cityName.classList.remove('text-black')
      : cityName.classList.add('text-white');
  }

  cardInfo.classList.remove('d-none');
};

const renderError = (msg) => {
  if (!cardInfo.classList.contains('d-none')) cardInfo.classList.add('d-none');

  errorMessage.textContent = msg;
};

// Submit the city
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const citySearched = cityInput.value.trim();
  searchForm.reset();

  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${citySearched}&appid=${process.env.API_KEY}`
  )
    .then((response) => {
      if (!response.ok) throw new Error('That city does not exist. Try again.');
      return response.json();
    })
    .then((data) => {
      updateWeatherApp(data);
    })
    .catch((error) => {
      renderError(error.message);
    });
});
