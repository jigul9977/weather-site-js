import { getWeatherData } from "../../utils/httpreq.js";
import { removeModal, showModal } from "../../utils/modal.js";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const searchBox = document.getElementById("search-box");
const searchButton = document.getElementById("search-btn");
const todayWeatherSection = document.getElementById("today-weather-sec");
const forecastWeatherSection = document.getElementById("forecast-weather-sec");
const locationIcon = document.getElementById("location-icon");
const closeModalButton = document.getElementById("close-modal");
const documentLoader = document.getElementById("document-loader");

const showCurrentWeather = (data) => {
  if (!data) return;
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
  if (!data) return;
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
  const currentWeather = await getWeatherData("current", position.coords);
  const forecastWeather = await getWeatherData("forecast", position.coords);

  showCurrentWeather(currentWeather);
  showForecastWeather(forecastWeather);
};
const PositionErrorCallback = (error) => {
  showModal(error.message);
};
const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(PositionCallback, PositionErrorCallback);
  } else {
    showModal("navigator.geolocation is not available!");
  }
};

const searchHandler = async () => {
  const cityName = searchBox.value;
  searchBox.value = "";
  if (!cityName) {
    showModal("Please enter a city name!");
    return;
  }
  const currentWeather = await getWeatherData("current", cityName); // This function takes time to be done, so it is better to write it as async
  showCurrentWeather(currentWeather);
  const forecastWeather = await getWeatherData("forecast", cityName);
  showForecastWeather(forecastWeather);
};

const initHandler = async () => {
  const currentWeather = await getWeatherData("current", "tehran"); // This function takes time to be done, so it is better to write it as async
  showCurrentWeather(currentWeather);
  const forecastWeather = await getWeatherData("forecast", "tehran");
  showForecastWeather(forecastWeather);
  documentLoader.style.display = "none";
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
closeModalButton.addEventListener("click", removeModal);
document.addEventListener("DOMContentLoaded", initHandler);
