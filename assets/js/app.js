const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "48336baaf9501606abfd8dbec72a9ce8";

const searchBox = document.getElementById("search-box");
const searchButton = document.getElementById("search-btn");
const todayWeatherSection = document.getElementById("today-weather-sec");
const locationIcon = document.getElementById("location-icon");

const getcurrentweatherByCityName = async (cityName) => {
  const url = `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};
const getcurrentweatherByCoordinate = async (lat, lng) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

const showCurrentWeather = (data) => {
  const curentWeatherJSX = `
  <h1>${data.name}, ${data.sys.country} </h1>
  <div class="main">
  <img alt="weather-icon" src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" >
  <p>${data.weather[0].main}</p>
  <span>${Math.round(data.main.temp)}°C</span>
  </div>
  <div class="info">
  <p>Humidity: <span>${data.main.humidity} %</span></p>
  <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
  </div>`;
  todayWeatherSection.innerHTML = curentWeatherJSX;
};
const PositionCallback = async (position) => {
  let { latitude, longitude } = position.coords;
  const currentWeather = await getcurrentweatherByCoordinate(latitude, longitude);
  showCurrentWeather(currentWeather);
};
const PositionErrorCallback = (error) => {
  console.log(error);
};
const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(PositionCallback, PositionErrorCallback);
  } else {
    alert("navigator.geolocation is not available");
  }
};

const searchHandler = async () => {
  const cityName = searchBox.value;
  if (!cityName) {
    alert("Please enter a city name!");
  }
  const currentWeather = await getcurrentweather(cityName); // This function takes time to be done, so it is better to write it as async
  showCurrentWeather(currentWeather);
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
