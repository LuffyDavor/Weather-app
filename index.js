const searchButton = document.querySelector('button');
const searchInput = document.querySelector('.search-bar');
const weatherCard = document.querySelector('#card');

const cityTitle = weatherCard.querySelector('.card-title');
const weatherIcon = weatherCard.querySelector('.icon');
const degrees = weatherCard.querySelector('.degrees');
const description = weatherCard.querySelector('.description');
const humidity = weatherCard.querySelector('.humidity');
const wind = weatherCard.querySelector('.wind');
const minTemp = weatherCard.querySelector('.min-temp');
const maxTemp = weatherCard.querySelector('.max-temp');
const feelsLike = weatherCard.querySelector('.feels-like');


const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const apiKeyOpenWeather = '3b29dd8348d1ffdf12ff6a41a5f5cf13';
const apiKeyNinja = 'BSdWyU3Q8fWRH+pXVcpykg==6szCuQGX8zQUt8SD';
let apiUrl; let forecastUrl;

// Get user's current location as default city
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKeyOpenWeather}&units=metric`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKeyOpenWeather}&units=metric`;
    updateWeather(apiUrl, forecastUrl);

  }, error => {
    // Set default city to London if there is an error finding user location
    console.error(error);
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Vienna&appid=${apiKeyOpenWeather}&units=metric`; 
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=$Vienna&appid=${apiKeyOpenWeather}&units=metric`;
    updateWeather(apiUrl, forecastUrl);

  });
} else {
  // Set default city to London if user does not share location
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Vienna&appid=${apiKeyOpenWeather}&units=metric`;
  forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Vienna&appid=${apiKeyOpenWeather}&units=metric`;
  updateWeather(apiUrl, forecastUrl);
}

// Add click event listener to search button
searchButton.addEventListener('click', () => {
  const city = searchInput.value;
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyOpenWeather}&units=metric`;
  forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKeyOpenWeather}&units=metric`;
  updateWeather(apiUrl, forecastUrl);
});



class Weather {
  constructor(data) {
    this.city = data.name;
    this.icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    this.temp = `${Math.round(data.main.temp)}°C`;
    this.description = data.weather[0].description;
    this.humidity = `Humidity: ${data.main.humidity}%`;
    this.wind = `Wind speed: ${data.wind.speed} km/h`;
    this.minTemp = `Min: ${Math.round(data.main.temp_min)}°C`;
    this.maxTemp = `Max: ${Math.round(data.main.temp_max)}°C`;
    this.feelsLike = `Feels like: ${Math.round(data.main.feels_like)}°C`;
  }
}


// Functions to update the weather card with the data
function updateWeather(apiUrl, forecastUrl) {

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const weather = new Weather(data);
      displayWeather(weather);
    })
    .catch(displayError);

    fetch(forecastUrl)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        showWeatherData(data);
    })

}

function displayWeather(weather) {
  cityTitle.textContent = `Weather in ${weather.city}`;
  weatherIcon.src = weather.icon;
  degrees.textContent = weather.temp;
  description.textContent = weather.description;
  humidity.textContent = weather.humidity;
  wind.textContent = weather.wind;
  minTemp.textContent = weather.minTemp;
  maxTemp.textContent = weather.maxTemp;
  feelsLike.textContent = weather.feelsLike;
}

function displayError(error) {
  console.error(error);
  alert("Location Does Not Exist!");
}

//FORECAST UPDATE

// FORECAST

// function getWeatherData (forecastUrl) {
//     navigator.geolocation.getCurrentPosition((success) => {
        
//         let latitude = success.coords.latitude;
//         let longitude = success.coords.longitude;

//         fetch(`api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKeyOpenWeather}`)
//         .then(res => res.json())
//         .then(data => {

//             console.log(data)
//             showWeatherData(data);
//         })

//     })
// }
function showWeatherData(data) {
  let forecastHTML = '';

  for (let i = 0; i < 5; i++) {
    const forecast = new Weather(data.list[i*8]);
    forecastHTML += `
      <div class="forecast-item">
        <p class="forecast-day">${getDayOfWeek(i)}</p>
        <div class="forecast-details">
          <img src="${forecast.icon}" alt="${forecast.description}" class="forecast-icon">
          <p class="forecast-temp"><span class="min-temp">${forecast.minTemp}</span> / <span class="max-temp">${forecast.maxTemp}</span></p>
        </div>
      </div>
    `;
  }
  

  weatherForecastEl.innerHTML = forecastHTML;
  currentTempEl.textContent = `Current: ${Math.round(data.list[0].main.temp)}°C`;
}

function getDayOfWeek(offset) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return daysOfWeek[date.getDay()];
}




