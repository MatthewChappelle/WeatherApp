const apiKey = "a845c0b5de766c390829f107917f1a25";
const searchBtn = document.getElementById('search-btn');
const searchValue = document.getElementById('search-field');


//find data for current weather
async function findWeather(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const response = await fetch(apiURL);

    if (!response.ok) {
        throw new Error('Error fetching weather data');
    };

    var data = await response.json();

    //if weather cloudy, icon cloudy etc
    const displayIcon = new Image();
    displayIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    //set all information into proper div using jQuerry
    $('.city').html(data.name);
    $('.weather-icon').empty().append(displayIcon);
    $('.date').html(dayjs().format("MMM DD, YYYY"));
    $('.temp').html(data.main.temp + "F" + " currently");
    $('.humidity').html(data.main.humidity + "%" + " humidity");
    $('.wind-speed').html(data.wind.speed + "mph" + " winds");

    return data;
};

//find weather info for next 5 days
async function findForecast(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Error fetching forecast data');
    };
    var data = await response.json();

    $.getJSON(apiUrl, function (data) {
        var forecast = data.list;

        //clear any old information before rendering
        $(".future-weather").empty();

        //loop over the next 5 days. (3 hour intervals , skipping to every 8 for a 24 hour difference between days)
        for (var i = 0; i < forecast.length; i += 8) {

            var date = new Date(forecast[i].dt * 1000);
            const displayIcon = new Image();
            displayIcon.src = `https://openweathermap.org/img/wn/${forecast[i].weather[0].icon}.png`;

            var day = date.toLocaleDateString("en-US", { weekday: 'long' });
            var date = forecast[i].dt_txt.split(" ")[0];
            var temp = forecast[i].main.temp;
            var windSpeed = forecast[i].wind.speed;
            var humidity = forecast[i].main.humidity + "%" + " humidity";

            //set up id for each day block
            var dayID = i;

            // Create each block div with styling and inner text/icons 
            var dayBlock = $("<div>").attr("id", dayID).addClass("city DOM").text(day + " ");
            var dateBlock = $("<div>").attr("id", dayID).addClass("sub date inline").text(date);
            var iconBlock = $("<img>").attr("id", dayID).addClass("sub weather-icon inline").attr("src", displayIcon.src);
            var tempBlock = $("<div>").attr("id", dayID).addClass("sub temp").text(`${temp}°F`);
            var windBlock = $("<div>").attr("id", dayID).addClass("sub wind-speed").text(`${windSpeed}MPH`);
            var humidityBlock = $("<div>").attr("id", dayID).addClass("sub humidity").text(humidity);

            //append in layers to the main container
            dayBlock.append(dateBlock, iconBlock, tempBlock, windBlock, humidityBlock);
            $(".future-weather").append(dayBlock);
        };
    });
    return data;
}

//add listener to search button. also adds text to history and local storage
$('#search-btn').on("click", () => {
    performSearch(searchValue.value);
    updateHistory();
});

//alternatively press 'enter' to search
$('#search-field').on('keypress', function (e) {
    if (e.which == 13) {
        $('#search-btn').click();
        return false;
    }
});

//adds listener to history items
$(document).on('click', '.prev-search', function () {
    var input = $(this).text();
    performSearch(input);
    updateHistory(input);
});

//on webpage load, focus on search box and show history from local storage
$(document).ready(function () {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.forEach(function (searchValue) {
        $('.history').prepend('<button class="prev-search">' + searchValue + '</button>');
    });
    $('#search-field').focus();
});

//run both search functions and reset page for another search. updated local storage and history
async function performSearch(input) {
    try {
        const weatherData = await findWeather(input);

        const forecastData = await findForecast(input);

        //if no error, save to local storage
        if (weatherData.cod == 200 && forecastData.cod == 200) {
            $('.history').prepend('<button class="prev-search">' + input + '</button>');
            updateHistory();

            //save search to local storage
            let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
            searchHistory.push(input);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }

        // Set focus on the search box
        $('#search-field').focus();
        // Clear the search box
        $('#search-field').val('');

    } catch (err) {
        console.log(err);
    }
}

//keep max history at 5
function updateHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    while (searchHistory.length > 5) {
        searchHistory.pop();
        $('.history').children().last().remove();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}