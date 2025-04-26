const apiKey = "6f67a4499aacda7155de95ee5649fca7"; // Replace with your OpenWeatherMap API key
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherContainer = document.getElementById("weather-container");
const cityName = document.getElementById("city-name");
const weatherDesc = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const details = document.getElementById("details");
const errorMessage = document.getElementById("error-message");

const celsiusBtn = document.getElementById("celsius-btn");
const fahrenheitBtn = document.getElementById("fahrenheit-btn");

let currentTemp = null;
let isCelsius = true;

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherByCity(cityInput.value.trim());
});

celsiusBtn.addEventListener("click", () => {
  isCelsius = true;
  updateTempDisplay();
});

fahrenheitBtn.addEventListener("click", () => {
  isCelsius = false;
  updateTempDisplay();
});

function getWeatherByCity(city) {
  if (!city) return;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetchWeather(url);
}

function getWeatherByLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      fetchWeather(url);
    },
    () => {
      showError("Geolocation not available.");
    }
  );
}

function fetchWeather(url) {
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => {
      displayWeather(data);
      setBackground(data.weather[0].main);
    })
    .catch((err) => {
      showError(err.message);
    });
}

function displayWeather(data) {
  errorMessage.classList.add("hidden");
  weatherContainer.classList.remove("hidden");

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  weatherDesc.textContent = data.weather[0].description;
  currentTemp = data.main.temp;
  updateTempDisplay();
  details.textContent = `Humidity: ${data.main.humidity}%, Wind: ${data.wind.speed} m/s`;
}

function updateTempDisplay() {
  if (currentTemp === null) return;

  const temp = isCelsius
    ? currentTemp
    : (currentTemp * 9) / 5 + 32;

  const unit = isCelsius ? "°C" : "°F";
  temperature.textContent = `Temperature: ${temp.toFixed(1)} ${unit}`;
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove("hidden");
  weatherContainer.classList.add("hidden");
}

function setBackground(condition) {
  let image = "default.jpg";
  if (condition.includes("Cloud")) image = "cloudy.jpg";
  else if (condition.includes("Rain")) image = "rainy.jpg";
  else if (condition.includes("Snow")) image = "snowy.jpg";
  else if (condition.includes("Clear")) image = "sunny.jpg";

  document.body.style.backgroundImage = `url('./assets/${image}')`;
}

// Get weather by location on page load
window.addEventListener("load", getWeatherByLocation);
