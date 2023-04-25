var API_KEY = "6879f3075989c23c37f03376a700eee0";

function displayWeather(data) {
  $("#city-name").text(data.city.name);
  var current = data.list[0];
  $("#current-date").text(formatDate(current.dt));
  $("#current-icon").attr(
    "src",
    "https://openweathermap.org/img/w/" + current.weather[0].icon + ".png"
  );
  $("#current-temperature").text(current.main.temp.toFixed(1) + " °F");
  $("#current-humidity").text(current.main.humidity + "%");
  $("#current-wind-speed").text(current.wind.speed.toFixed(1) + " mph");
  
  var tomorrowIndex = data.list.findIndex(function(item) {
    return item.dt_txt.includes("12:00:00") && item.dt_txt.includes(getFormattedDate(new Date(Date.now() + 24 * 60 * 60 * 1000)));
  });
  
  var forecast = data.list.slice(tomorrowIndex, tomorrowIndex + 5 * 8);
  $("#forecast-list").empty();
  for (var i = 0; i < forecast.length; i += 8) {
    var item = $("<li>");
    item.append($("<span>").text(formatDate(forecast[i].dt)));
    item.append($("<br>"))
    item.append(
      $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" +
          forecast[i].weather[0].icon +
          ".png"
      )
    );
    item.append(
      $("<span>").text("   "+forecast[i].main.temp.toFixed(1) + " °F")
    );
    item.append($("<br>"))
    item.append($("<span>").text(forecast[i].wind.speed.toFixed(1) + " mph"));
    item.append($("<br>"))
    item.append($("<span>").text(forecast[i].main.humidity + "%"));
    $("#forecast-list").append(item);
  }
  // Set the storage key for the forecast data
  var storageKey = "weather-forecast-" + data.city.name;
  // Save the forecast data to local storage
  localStorage.setItem(storageKey, JSON.stringify(forecast));
}

function getFormattedDate(date) {
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  return year + "-" + month + "-" + day;
}

function searchCity(city) {
  document.querySelector("#current-weather").classList.remove("hide-div");
  document.querySelector("#forecast").classList.remove("hide-div");
  // add city parameter
  var url =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=6879f3075989c23c37f03376a700eee0";
  $.get(url)
    .done(function (data) {
      console.log (data);
      localStorage.setItem("weatherData", JSON.stringify(data));
      displayWeather(data);
      addToSearchHistory(city);
    })
    .fail(function (jqXHR) {
      alert(
        "Failed to retrieve weather data for " +
          city +
          ". " +
          jqXHR.responseJSON.message
      );
    });
}

$(function () {
  // Define searchCity function and other code here
  $("#search-button").click(function () {    
    searchCity($("#city-input").val()); // pass city parameter
  });

  var data = localStorage.getItem("weatherData");
  if (data) {
    displayWeather(JSON.parse(data));
  }

  var history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  $("#search-history-list").empty();
  for (var i = 0; i < history.length; i++) {
    var item = $("<li>");
    var button = $("<button>")
      .text(history[i])
      .addClass("btn btn-link")
      .attr("onclick", "searchCity('" + history[i] + "')");
    item.append(button);
    $("#search-history-list").append(item);
  }
});

function formatDate(date) {
  var d = new Date(date * 1000);
  var year = d.getFullYear();
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var day = ("0" + d.getDate()).slice(-2);
  return year + "-" + month + "-" + day;
}

function addToSearchHistory(city) {
  var history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 10) {
      history.pop();
    }
    localStorage.setItem("searchHistory", JSON.stringify(history));
    $("#search-history-list").empty();
    for (var i = 0; i < history.length; i++) {
      var item = $("<li>");
      var button = $("<button>")
        .text(history[i])
        .addClass("btn btn-link")
        .attr("onclick", "searchCity('" + history[i] + "')");
      item.append(button);
      $("#search-history-list").append(item);
    }
  }
}