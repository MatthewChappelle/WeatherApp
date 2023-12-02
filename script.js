const apiKey = "a845c0b5de766c390829f107917f1a25";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";
const SearchBtn = document.getElementById('search-btn');
const city = document.querySelector(".city")
const date = document.querySelector(".date")
const icon = document.querySelector(".weather-icon")
const temp = document.querySelector(".temp")
const humidity = document.querySelector(".humidity")
const windSpeed = document.querySelector(".windspeed")


async function findWeather(city) {
    const response = await fetch(apiURL + city + `&appid=${apiKey}`);
    var data = await response.json();

    city.innerHTML =
        date.innerHTML =
        icon.innerHTML =
        temp.innerHTML =
        humidity.innerHTML =
        windSpeed.innerHTML =  
};

$('#search-btn').on("click", () => {
    findWeather
});