let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    locationBtn = document.getElementById('locationBtn'),
    api_key = 'e223b5017feac2c19a224de3be88410c',
    currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
    fiveDaysForecastCard = document.querySelector('.day-forecast'),
    aqiCard = document.querySelectorAll('.highlight .card')[0],
    sunriseCard = document.querySelectorAll('.highlight .card')[1],
    humidityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('pressureVal'),
    visabilityVal = document.getElementById('visabilityVal'),
    windSpeedVal = document.getElementById('windSpeedVal'),
    feelsVal = document.getElementById('feelsVal'),
    hourlyForecastCard = document.querySelector('.hourly-Forecast'),
    aqilist = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    let AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            let date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${data.main.temp.toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" />
                    </div>
                </div>
                <hr />
                <div class="card-footer">
                    <p><i class="fas fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${name}, ${country}</p>
                </div>
            `;

            let { sunrise, sunset } = data.sys;
            let { timezone, visibility } = data;
            let { humidity, pressure, feels_like } = data.main;
            let { speed } = data.wind;

            let sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A');
            let sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

            sunriseCard.innerHTML = `
                <div class="card-head">
                    <p>Sunrise & Sunset</p>
                </div>
                <div class="sunrise-sunset">
                    <div class="item">
                        <div class="icon"><i class="fas fa-sun"></i></div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                    <div class="item">
                        <div class="icon"><i class="fas fa-moon"></i></div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            `;

            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure}hpa`;
            visabilityVal.innerHTML = `${visibility / 1000}km`;
            windSpeedVal.innerHTML = `${speed}m/s`;
            feelsVal.innerHTML = `${feels_like.toFixed(2)}&deg;C`;
        })
        .catch(() => {
            alert('❌ Failed to fetch current weather');
        });

    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            let hourlyForecaste = data.list;
            hourlyForecastCard.innerHTML = '';

            for (let i = 0; i <= 7; i++) {
                let hrForecastDate = new Date(hourlyForecaste[i].dt_txt);
                let hr = hrForecastDate.getHours();
                let a = hr < 12 ? 'AM' : 'PM';
                if (hr === 0) hr = 12;
                if (hr > 12) hr -= 12;

                hourlyForecastCard.innerHTML += `
                    <div class="card">
                        <p>${hr} ${a}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyForecaste[i].weather[0].icon}.png" alt="" />
                        <p>${hourlyForecaste[i].main.temp.toFixed(2)}&deg;C</p>
                    </div>
                `;
            }

            let uniqueForecastDays = [];
            let fiveDaysForecast = data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            fiveDaysForecastCard.innerHTML = '';
            for (let i = 1; i < fiveDaysForecast.length; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="" />
                            <span>${fiveDaysForecast[i].main.temp.toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(() => {
            alert('❌ Failed to fetch weather forecast');
        });

    fetch(AIR_POLLUTION_API_URL)
        .then(res => res.json())
        .then(data => {
            const aqiLevel = data.list[0].main.aqi;
            const { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;

            aqiCard.innerHTML = `
                <div class="card-head">
                    <p>Air Quality Index</p>
                    <p class="air-index aqi-${aqiLevel}">${aqilist[aqiLevel - 1]}</p>
                </div>
                <div class="air-indices">
                    <div class="item"><p>PM2.5</p><h2>${pm2_5}</h2></div>
                    <div class="item"><p>PM10</p><h2>${pm10}</h2></div>
                    <div class="item"><p>SO2</p><h2>${so2}</h2></div>
                    <div class="item"><p>CO</p><h2>${co}</h2></div>
                    <div class="item"><p>NO</p><h2>${no}</h2></div>
                    <div class="item"><p>NO2</p><h2>${no2}</h2></div>
                    <div class="item"><p>NH3</p><h2>${nh3}</h2></div>
                    <div class="item"><p>O3</p><h2>${o3}</h2></div>
                </div>
            `;
        })
        .catch(() => {
            alert("❌ Failed to fetch air pollution data");
        });
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;

    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) {
                alert(`City "${cityName}" not found`);
                return;
            }
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => {
            alert(`❌ Failed to fetch coordinates of ${cityName}`);
        });
}

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URL)
            .then(res => res.json())
            .then(data => {
                let { name, country, state } = data[0];
                getWeatherDetails(name, latitude, longitude, country, state);
            })
            .catch(() => {
                alert('❌ Failed to fetch user coordinates');
            });
    }, error => {
        if (error.code === error.PERMISSION_DENIED) {
            alert('Geolocation permission denied. Please enable location permission to access local weather.');
        }
    });
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);
