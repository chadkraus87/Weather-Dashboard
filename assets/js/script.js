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
  var forecast = data.list.slice(1, 6);
  $("#forecast-list").empty();
  for (var i = 0; i < forecast.length; i++) {
    var item = $("<li>");
    item.append($("<span>").text(formatDate(forecast[i].dt)));
    item.append(
      $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" +
          forecast[i].weather[0].icon +
          ".png"
      )
    );
    item.append(
      $("<span>").text(forecast[i].main.temp.toFixed(1) + " °F")
    );
    item.append($("<span>").text(forecast[i].wind.speed.toFixed(1) + " mph"));
    item.append($("<span>").text(forecast[i].main.humidity + "%"));
    $("#forecast-list").append(item);
  }
}

function searchCity(city) {
  // add city parameter
  var url =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=6879f3075989c23c37f03376a700eee0";
  $.get(url)
    .done(function (data) {
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
  $("#search-history").empty();
  for (var i = 0; i < history.length; i++) {
    var item = $("<li>");
    var button = $("<button>")
      .text(history[i])
      .addClass("btn btn-link")
      .click(function () {
        // pass city parameter to searchCity function
        searchCity($(this).text());
      });
    item.append(button);
    $("#search-history").append(item);
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
    if (history.length > 5) {
      history.pop();
    }
    localStorage.setItem("searchHistory", JSON.stringify(history));
    $("#search-history").empty();
    for (var i = 0; i < history.length; i++) {
      var item = $("<li>");
      var button = $("<button>")
        .text(history[i])
        .addClass("btn btn-link")
        .attr("onclick", "searchCity('" + history[i] + "')");
      item.append(button);
      $("#search-history").append(item);
    }
  }
}

