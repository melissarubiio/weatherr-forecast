const APIKey = "dce148177c5e70e67a20f88549f200bd";

const cityEntered = document.querySelector('#cityEntered');
const searchButton = document.querySelector('#searchButton');
const todaysWeather = document.querySelector('#todaysWeather');
const forecastHeader = document.querySelector('#forecast');
const fiveDayForecast = document.querySelector('#fiveDayForecast');
const previousSearch = document.querySelector('#previousSearch');

let previousSearchList = [];
let city;

function citybutton(event) {
    event.preventDefault();
    city = cityEntered.value.trim().toLowerCase();
    if (city === '') {
        alert('Please enter a city name');
        return;
    }
    getCityData(city);
}

function previousButton(event) {
    city = event.target.textContent;
    getCityData(city);
}

function clearPreviousSearch() {
    fiveDayForecast.innerHTML = '';
    forecastHeader.textContent = '';
    cityEntered.value = '';
    todaysWeather.textContent = '';
}

function getCityData(city) {
    const geoAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;

    fetch(geoAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!previousSearchList.includes(city)) {
                previousSearchList.push(city);
                window.localStorage.setItem('storedSearches', JSON.stringify(previousSearchList));
                displayPreviousSearch();
            }
            getWeatherData(data[0].lat, data[0].lon);
        })
}

function getWeatherData(lat, lon) {
    const oneCallAPI = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${APIKey}&units=imperial`;

    fetch(oneCallAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            clearPreviousSearch();
            displayToday(data.current, data.daily);
            displayFiveDay(data.daily);
        })
}

function displayFiveDay(data) {
    forecastHeader.textContent = '5-Day Forecast';
    for (let i = 1; i < 6; i++) {
        const card = document.createElement('div');
        card.setAttribute('class', 'fiveDay');
        card.innerHTML = `<div>
                            <h4>${formatDate(data[i].dt)}</h4>
                            <img src=http://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png />
                            <ul class="details">
                                <li>Temp: ${data[i].temp.max} &degF</li>
                                <li>Wind: ${data[i].wind_speed} MPH</li>
                                <li>Humidity: ${data[i].humidity} %</li>
                            </ul>`
        fiveDayForecast.appendChild(card);
    }
}

function displayToday(data) {
    const cityCurrentInfo = document.createElement('div');
    cityCurrentInfo.innerHTML = `<div class='todaysWeatherDirection'>
                                <h2>${city}</h2>
                                 <img src=http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png />
                                 </div>
                                 <h3>Today's Weather</h3>
                                    <ul class="details">
                                        <li>Temp: ${data.temp} &degF</li>
                                        <li>Wind Speed: ${data.wind_speed} MPH</li>
                                        <li>Humidity: ${data.humidity} %</li>
                                        <li>UV Index: ${data.uvi}</li>
                                        </ul>`;
        todaysWeather.appendChild(cityCurrentInfo);
    }
    function displayPreviousSearch() {
        previousSearch.innerHTML = '';
            for (let i = previousSearchList.length - 1; i >= 0; i--) {
                const button = document.createElement('button');
                button.setAttribute('class', 'previousSearchButton');
                button.textContent = previousSearchList[i];
                button.addEventListener('click', previousButton);
                previousSearch.appendChild(button);
                }}
    
    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        }
    
    searchButton.addEventListener('click', citybutton);

    previousSearchList = JSON.parse(window.localStorage.getItem('storedSearches')) || [];

    displayPreviousSearch();
