const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "48336baaf9501606abfd8dbec72a9ce8";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const searchBox = document.getElementById("search-box");
const searchButton = document.getElementById("search-btn");
const todayWeatherSection = document.getElementById("today-weather-sec");
const forecastWeatherSection = document.getElementById("forecast-weather-sec");
const locationIcon = document.getElementById("location-icon");

const getCurrentweatherByCityName = async (cityName) => {
  const url = `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};
const getCurrentweatherByCoordinate = async (lat, lng) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};
const getForecastweatherByCityName = async (cityName) => {
  const url = `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};
const getForecastweatherByCoordinate = async (lat, lng) => {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
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
  <span>${Math.round(data.main.temp)} °C</span>
  </div>
  <div class="info">
  <p>Humidity: <span>${data.main.humidity} %</span></p>
  <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
  </div>`;
  todayWeatherSection.innerHTML = curentWeatherJSX;
};
const getDayOfWeek = (data) => {
  return DAYS[new Date(data * 1000).getDay()];
};
const showForecastWeather = (data) => {
  forecastWeatherSection.innerHTML = "";
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  data.forEach((item) => {
    const forecastJSX = `
    <div class="forecast-card">
    <img alt="weather-icon" src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" >
    <h3>${getDayOfWeek(item.dt)}</h3>
    <span>${Math.round(item.main.temp)} °C</span>
    <p>${item.weather[0].main}</p>
    </div>`;
    forecastWeatherSection.innerHTML += forecastJSX;
  });
};
const PositionCallback = async (position) => {
  const { latitude, longitude } = position.coords;
  const currentWeather = await getCurrentweatherByCoordinate(latitude, longitude);
  const forecastWeather = await getForecastweatherByCoordinate(latitude, longitude);

  showCurrentWeather(currentWeather);
  showForecastWeather(forecastWeather);
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
  searchBox.value = "";
  if (!cityName) {
    alert("Please enter a city name!");
  }
  const currentWeather = await getCurrentweatherByCityName(cityName); // This function takes time to be done, so it is better to write it as async
  showCurrentWeather(currentWeather);
  const forecastWeather = await getForecastweatherByCityName(cityName);
  showForecastWeather(forecastWeather);
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
