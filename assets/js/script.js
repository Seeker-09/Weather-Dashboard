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

    // get longitude and latitude 
    fetch(forwardGeocodingApiUrl).then(function(response) {
        response.json().then(function(data) {
            var longitude = data.data[0].longitude;
            var latitude = data.data[0].latitude;

            var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + "&appid=b66a992ae0e57963932f26da84d5a86f";

            // apply longitude and latitude to weather api
            fetch(weatherApiUrl).then(function(response) {
                response.json().then(function(data) {
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

    // create header element
    var weatherH1El = document.createElement("h1");
    weatherH1El.textContent = data.current.temp;
    weatherContainerEl.appendChild(weatherH1El);

    // create 5 day forcast 
    // need to start at one because of the api daily array
    for(var i = 1; i < 6; i++) { 
        // creat data elements
        var fiveDayForcastH1El = document.createElement("h1");
        fiveDayForcastH1El.textContent = data.daily[i].temp.day;
        fiveDayForcastEl.appendChild(fiveDayForcastH1El);
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
    savedSearchButton.addEventListener("click", function() {
        citySearch(city);

        // clear old content
        weatherContainerEl.textContent = "";
        fiveDayForcastEl.textContent = "";
        cityInputEl.value = "";
    });
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

        savedSearchButton.addEventListener("click", function() {
            citySearch(cities[i]);
    
            // clear old content
            weatherContainerEl.textContent = "";
            fiveDayForcastEl.textContent = "";
            cityInputEl.value = "";
        });
    }
}
loadSearches();

cityFormEl.addEventListener("submit", formSubmitHandler);