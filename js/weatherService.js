// var WeatherService = (function () {
//   var weatherData = {
//     temperature: 24,
//     condition: 'Sunny',
//     high: 28,
//     low: 19,
//     icon: 'light_mode'
//   };

// fetch
//    returtn promise
//   //  res ==> json
//   //   res.json() ==> promise
//   const apiKey = "fceeccc809b9c51e8e3d550f2ba66dcd";

//  async function getWeather(apiKey, city = "Cairo") {
//   const response = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
//   );

//   // readable stream
//   const data = await response.json();

//   console.log(data)

//   if (!response.ok) {
//     throw new Error("Weather data not found");
//   }

// }

//  map ==>

// getWeather(apiKey , "London")

//   return {
//     getWeather: function () {
//       return weatherData;
//     },
//     renderWeather: function (containerSelector) {
//       var container = document.querySelector(containerSelector);
//       if (!container) return;
//       var data = this.getWeather();
//       container.innerHTML =
//         '<span class="material-symbols-outlined weather-icon">' + data.icon + '</span>' +
//         '<div><h2>' + data.temperature + '°C</h2>' +
//         '<p>' + data.condition + ' • High ' + data.high + '° / Low ' + data.low + '°</p></div>';
//     }
//   };
// })();

// ==============================================================================================

// const apiKey = "fceeccc809b9c51e8e3d550f2ba66dcd";
// const urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
// console.log(urlApi);

function fetchWeatherData() {
  let weatherApiKey = "b354cbdc88f11813cc7f54f6ddd43b55";
  let weatherApiCityName = "Cairo";
  let countryCode = "EG";
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${weatherApiCityName},${countryCode}&appid=${weatherApiKey}&units=metric`;

  fetch(weatherApiUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data.main.temp);
      // console.log(data.weather[0].description);
      document.getElementById("desc").textContent = data.weather[0].description;
      document.getElementById("temp").innerHTML =
        data.main.temp.toFixed(0) + "°C";
      document.querySelector("#weather-icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      document.getElementById("location").textContent =
        `${data.name}, ${data.sys.country}`;
    });
}

fetchWeatherData();

let NewsData = [];
function fetchNewsData() {
  // let newsApiKey = "16bf8cdda6e7133c95f1f68f78604358";
  let newsApiKey = "e14ef99edc2094fe65a1486e4cc6611d";
  let newsApiUrl = `https://gnews.io/api/v4/search?q=Google&lang=en&max=5&apikey=${newsApiKey}`;

  fetch(newsApiUrl)
    .then((newsResponse) => {
      return newsResponse.json();
    })
    .then((newsData) => {
      console.log(newsApiUrl);
      NewsData = newsData.articles;
      displayNews();
    })
    .catch((error) => {
      console.error("Error fetching news data:", error);
    });
}

fetchNewsData();

function displayNews() {
  NewsData =  NewsData.slice(1, 4);
  console.log(NewsData);
  let AllNews = ``;
  for (let i = 0; i < NewsData.length; i++) {
    AllNews += `
          <div class="card">
            <a href="${NewsData[i].url}" target="_blank">
              <img
                src="${NewsData[i].image}"
              />
            </a>

            <h3>${NewsData[i].title.split(" ", 5).join(" ")}</h3>

            <p>${NewsData[i].content.split(" ", 15).join(" ")}...</p>
          </div>
    `;
  }
  let grids = document.querySelectorAll(".grid");
  grids.forEach((grid) => {
    grid.innerHTML = AllNews;
  });
  console.log(AllNews);
}
