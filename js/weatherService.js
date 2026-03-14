var WeatherService = (function () {
  var weatherData = {
    temperature: 24,
    condition: 'Sunny',
    high: 28,
    low: 19,
    icon: 'light_mode'
  };

  return {
    getWeather: function () {
      return weatherData;
    },
    renderWeather: function (containerSelector) {
      var container = document.querySelector(containerSelector);
      if (!container) return;
      var data = this.getWeather();
      container.innerHTML =
        '<span class="material-symbols-outlined weather-icon">' + data.icon + '</span>' +
        '<div><h2>' + data.temperature + '°C</h2>' +
        '<p>' + data.condition + ' • High ' + data.high + '° / Low ' + data.low + '°</p></div>';
    }
  };
})();
