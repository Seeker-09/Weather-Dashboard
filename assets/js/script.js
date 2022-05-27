var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#weather-container");
var weatherSearchTerm = document.querySelector("#weather-search-term");
var fiveDayForcastEl = document.querySelector("#fiveDayForcast");
var searchHistoryEl = document.querySelector("#searchHistory");

var searchHistoryArray = [];

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    // get city weather info
    citySearch(city);

    // clear old content
    weatherContainerEl.textContent = "";
    fiveDayForcastEl.textContent = "";
    cityInputEl.value = "";

    // add city to search history
    saveSearch(city);
}

// search for city and add to search history 
var citySearch = function(city) {
    var forwardGeocodingApiUrl = "http://api.positionstack.com/v1/forward?access_key=06b4b41ae1b10125007229899332ca78&query=" + city;
    
    console.log(city);

    // get longitude and latitude 
    fetch(forwardGeocodingApiUrl).then(function(response) {
        response.json().then(function(data) {
            var longitude = data.data[0].longitude;
            var latitude = data.data[0].latitude;

            var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + "&appid=b66a992ae0e57963932f26da84d5a86f";

            // apply longitude and latitude to weather api
            fetch(weatherApiUrl).then(function(response) {
                response.json().then(function(data) {
                    console.log(data);
                    console.log(data.daily[0].dt);
                    displayWeather(data, city);
                })
            })
        })
    })
}

var displayWeather = function(data, city) {
    // display city 
    weatherSearchTerm.textContent = city;

    // display date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var todayString = mm + "/" + dd;

    var weatherH1El = document.createElement("h1");
    weatherH1El.classList.add("card-header");
    weatherH1El.textContent = todayString;

    weatherContainerEl.appendChild(weatherH1El);

    // display icon for today's weather
    var weatherIconEl = document.createElement("img");
    weatherIconEl.src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    weatherContainerEl.appendChild(weatherIconEl);

    // display current temp
    var currentTempEl = document.createElement("h2");
    currentTempEl.innerHTML = "Temperature: " + data.current.temp + " " + "&deg;F";
    weatherContainerEl.appendChild(currentTempEl);

    // display Humidity 
    var currentHumidity = document.createElement("h2");
    currentHumidity.innerHTML = "Humidity: " + data.current.humidity + "%";
    weatherContainerEl.appendChild(currentHumidity);

    // display wind speed
    var currentWindSpeed = document.createElement("h2");
    currentWindSpeed.innerHTML = "Wind Speed: " + data.current.wind_speed + " MPH";
    weatherContainerEl.appendChild(currentWindSpeed);

    // display UVI
    var uvi = data.current.uvi;
    var currentUVI = document.createElement("h2");
    currentUVI.innerHTML = "UVI: " + uvi;

    // check the current uvi and change backgroundColor to match intensity
    if(uvi < 5) {
        currentUVI.style.backgroundColor = "green";
    }
    else if(uvi > 8) {
        currentUVI.style.backgroundColor = "red";
    }
    else {
        currentUVI.style.backgroundColor = "yellow";
    }

    weatherContainerEl.appendChild(currentUVI);

    // create 5 day forcast 
    // need to start at one because of the api daily array
    for(var i = 1; i < 6; i++) { 
        // display date
        var futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + i);
        var futureDD = futureDate.getDate();
        var futureMM = futureDate.getMonth() + 1;
        var futureDateString = futureMM + "/" + futureDD;

        var futureForcastDate = document.createElement("h1");
        futureForcastDate.innerHTML = futureDateString;
        futureForcastDate.classList.add("card-header");
        fiveDayForcastEl.appendChild(futureForcastDate);

        // display icon for future weather
        var weatherIconEl = document.createElement("img");
        weatherIconEl.src = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
        fiveDayForcastEl.appendChild(weatherIconEl);

        // display current temp
        var currentTempEl = document.createElement("h2");
        currentTempEl.innerHTML = "Temperature: " + data.daily[i].temp.day + " " + "&deg;F";
        fiveDayForcastEl.appendChild(currentTempEl);

        // display Humidity 
        var currentHumidity = document.createElement("h2");
        currentHumidity.innerHTML = "Humidity: " + data.daily[i].humidity + "%";
        fiveDayForcastEl.appendChild(currentHumidity);

        // display wind speed
        var currentWindSpeed = document.createElement("h2");
        currentWindSpeed.innerHTML = "Wind Speed: " + data.daily[i].wind_speed + " MPH";
        fiveDayForcastEl.appendChild(currentWindSpeed);
    }
}

// save search to search history as a
var saveSearch = function(city) {
    // create button element
    var savedSearchButton = document.createElement("button");
    savedSearchButton.classList.add("btn", "searchBtn");
    savedSearchButton.textContent = city;

    // append button to container
    searchHistoryEl.appendChild(savedSearchButton);

    // save to local storage 
    var searchHistoryArrayCounter = searchHistoryArray.length;
    searchHistoryArray[searchHistoryArrayCounter] = city;
    localStorage.setItem("cities", JSON.stringify(searchHistoryArray));
}

// load from local storage
var loadSearches = function() {
    var cities = [];
    cities = JSON.parse(localStorage.getItem("cities"));
    for(i = 0; i < cities.length; i++) {
        // create button element
        var savedSearchButton = document.createElement("button");
        savedSearchButton.classList.add("btn", "searchBtn");
        savedSearchButton.textContent = cities[i];

        // append button to container
        searchHistoryEl.appendChild(savedSearchButton);
    }
}

// listener for saved searches
searchHistoryEl.addEventListener("click", function(event) {
    citySearch(event.target.textContent);

    // clear old content
    weatherContainerEl.textContent = "";
    fiveDayForcastEl.textContent = "";
    cityInputEl.value = "";
})

loadSearches();
cityFormEl.addEventListener("submit", formSubmitHandler);