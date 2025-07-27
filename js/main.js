"use strict";

const main = document.querySelector(".app");
const form = document.querySelector(".form");
const input = document.querySelector(".form__input");
const API_KEY = "9fd3b5f9f5e5bfa13d8f38b3acf0edd3";

form.onsubmit = submitHandler;

// Делаем дефолтный вызов для Мариуполя
input.value = "Мариуполь";
// submitHandler(new Event("submit"));
// input.value = "";

// Функции

async function submitHandler(event) {
    event.preventDefault(); // Убираем обновление страницы

    if (input.value === "") {
        return;
    }

    const locationInfo = await getWeather(input.value.trim());

    const time = renderCurrentTime(locationInfo);
    console.log(time);
    // Достаём информацию для отображения на странице
    const weatherFullInfo = {
        temp: locationInfo.main.temp,
        cityName: locationInfo.name,
        countryName: locationInfo.sys.country,
        humidity: locationInfo.main.humidity,
        windSpeed: locationInfo.wind.speed,
        weatherCondition: locationInfo.weather[0].main,
        time: time,
    };

    if (weatherFullInfo.cityName === "Novosibirsk") alert("ГОВНОСИБИРСК");

    renderWeatherData(weatherFullInfo);
}

// Получаем данные о погоде в городе
async function getWeather(cityName) {
    const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
    // Делаем запрос
    const response = await fetch(geoUrl);
    const data = await response.json();
    console.log(data);
    return data;
}

function renderWeatherData(data) {
    const tempEl = main.querySelector(".weather__temp");
    const locationEl = main.querySelector(".weather__location");
    const humidityEl = main.querySelector("[data-humidity]");
    const windSpeedEl = main.querySelector("[data-wind-speed]");
    const weatherConditionImg = main.querySelector(".weather__img");
    const timeEl = main.querySelector(".location__time");

    tempEl.textContent = `${Math.round(data.temp)}°C`;
    locationEl.textContent = `${data.cityName}, ${data.countryName}`;
    humidityEl.textContent = `${data.humidity}%`;
    const windSpeedRounded = Math.round(data.windSpeed * 10) / 10;
    windSpeedEl.textContent = `${windSpeedRounded} km/h`;
    timeEl.textContent = data.time;

    console.log(data.weatherCondition);
    // img

    const fileNames = {
        Clouds: "mist",
        Clear: "clear",
        Rain: "rain",
        Snow: "snow",
    };

    weatherConditionImg.src = `./img/weather/${fileNames[data.weatherCondition]}.png`;
}

function renderCurrentTime(info) {
    const now = new Date(); // Текущее время

    let userHours = now.getUTCHours() + info.timezone / 3600;

    if (userHours >= 24) userHours -= 24;
    if (userHours < 0) userHours += 24;
    userHours = userHours < 10 ? `0${userHours}` : userHours;

    let userMinutes = now.getUTCMinutes();
    userMinutes = userMinutes < 10 ? `0${userMinutes}` : userMinutes;

    return `${userHours}:${userMinutes}`;
}
