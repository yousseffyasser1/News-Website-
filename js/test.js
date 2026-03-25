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

//  ======== News API ========

// let NewsData = [];
// function fetchNewsData() {
//   // let newsApiKey = "16bf8cdda6e7133c95f1f68f78604358";
//   let newsApiKey = "dbf89e299aa785448036a9d4e5e7e544";
//   let newsApiUrl = `https://gnews.io/api/v4/search?q=Google&lang=en&max=5&apikey=${newsApiKey}`;

//   fetch(newsApiUrl)
//     .then((newsResponse) => {
//       return newsResponse.json();
//     })
//     .then((newsData) => {
//       console.log(newsApiUrl);
//       NewsData = newsData.articles;
//       displayNews();
//     })
//     .catch((error) => {
//       console.error("Error fetching news data:", error);
//     });
// }

// fetchNewsData();

// function displayNews() {
//   NewsData =  NewsData.slice(1, 4);
//   console.log(NewsData);
//   let AllNews = ``;
//   for (let i = 0; i < NewsData.length; i++) {
//     AllNews += `
//           <div class="card">
//             <a href="${NewsData[i].url}" target="_blank">
//               <img
//                 src="${NewsData[i].image}"
//               />
//             </a>

//             <h3>${NewsData[i].title.split(" ", 5).join(" ")}</h3>

//             <p>${NewsData[i].content.split(" ", 15).join(" ")}...</p>
//           </div>
//     `;
//   }
//   let grids = document.querySelectorAll(".grid");
//   grids.forEach((grid) => {
//     grid.innerHTML = AllNews;
//   });
//   console.log(AllNews);
// }


let newsApiKey = `16bf8cdda6e7133c95f1f68f78604358`;
// let baseUrl = `https://gnews.io/api/v4/search?q=${endpoint}&lang=en&max=3&apikey=${newsApiKey}`;
const newsRequestControllers = {};
const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "tiff",
  "tif",
  "ico",
  "avif",
  "heic"
];
let defaultImage = `../assets/download.png`
async function getNewData(endpoint) {
  if (newsRequestControllers[endpoint]) {
    newsRequestControllers[endpoint].abort();
  }

  const controller = new AbortController();
  newsRequestControllers[endpoint] = controller;

  return fetch(`https://gnews.io/api/v4/search?q=${endpoint}&lang=en&max=3&apikey=${newsApiKey}`, {
    signal: controller.signal
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (newsRequestControllers[endpoint] !== controller) {
        return;
      }
      const articles = Array.isArray(data.articles) ? data.articles : [];
      console.log(articles)
      disNews(endpoint, articles);
    })
    .catch((error) => {
      if (error && error.name === 'AbortError') {
        return;
      }
      console.error(`Error fetching news data for ${endpoint}:`, error);
    })
    .finally(() => {
      if (newsRequestControllers[endpoint] === controller) {
        delete newsRequestControllers[endpoint];
      }
    });
}

getNewData('Sports');
getNewData('Health');
getNewData('Technology');
function disNews(data, articles){
    let allNews = ``;

    for (let i = 0; i < articles.length; i++) {
        let article = articles[i];

        let validImage = imageExtensions.some(ext => 
            article.image && article.image.includes(ext)
        );

        if(!validImage){
            article.image = defaultImage;
        }

        const titleText = article.title ? article.title.split(" ",8).join(" ") : "Untitled";
        const descriptionText = article.description ? `${article.description.split(" ",20).join(" ")}...` : "";

        allNews +=`
        <div class="card">
            <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                <img src="${article.image}"/>
            </a>

            <h3>${titleText}</h3>

            <p>
            ${descriptionText}
            </p>
        </div>
        `;
    }

    if(data =="Sports"){
        document.querySelector('#Sports .grid').innerHTML = allNews;
        document.querySelector("#Sports .section-title").innerHTML = data;
    } 
    else if(data == "Health"){
        document.querySelector('#Health .grid').innerHTML = allNews;
        document.querySelector("#Health .section-title").innerHTML = data;
    }
    else if(data == "Technology"){
        document.querySelector('#Technology .grid').innerHTML = allNews;
        document.querySelector("#Technology .section-title").innerHTML = data;
    }
}



// Exchange Rate API

let exchangeApiKey = "9bd25c05315d56fea5e2ee2a";
let exchangeApiUrl = `https://v6.exchangerate-api.com/v6/9bd25c05315d56fea5e2ee2a/latest/USD`;

fetch(exchangeApiUrl)
  .then((exchangeResponse) => {
    return exchangeResponse.json();
  })
  .then((exchangeData) => {
    console.log(exchangeData);
    if (exchangeData.result === "success") {
      const rates = exchangeData.conversion_rates;
    }

    const usdToEgp = exchangeData.conversion_rates.EGP;
    const sarToUsd = 1 / exchangeData.conversion_rates.SAR;
    const sarToEgp = sarToUsd * exchangeData.conversion_rates.EGP;
    document.querySelector(".widget .rate:nth-child(2) span:last-child").textContent = usdToEgp.toFixed(2);
    document.querySelector(".widget .rate:nth-child(3) span:last-child").textContent = sarToEgp.toFixed(2);
  })
  .catch((error) => {
    console.error("Error fetching exchange rate data:", error);
  });





// async function getExchangeRates() {
//   try {
//     const exchangeResponse = await fetch(exchangeApiUrl);
//     const exchangeData = await exchangeResponse.json();

//     if (exchangeData.result === "success") {
//       const rates = exchangeData.conversion_rates;

//       // USD to EGP
//       const usdToEgp = rates.EGP;

//       // SAR to EGP
//       const sarToUsd = 1 / rates.SAR; // قيمة الدولار مقابل الريال
//       const sarToEgp = sarToUsd * rates.EGP;

//       document.querySelector(".widget .rate:nth-child(2) span:last-child").textContent = usdToEgp.toFixed(2);
//       document.querySelector(".widget .rate:nth-child(3) span:last-child").textContent = sarToEgp.toFixed(2);
//     }
//   } catch (error) {
//     console.error("Error fetching exchange rates:", error);
//   }
// }

// getExchangeRates();




// const url = `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=5efdabdeeb26d880de853d00fba2261851584e012ea6534046841b7dad7a730e&from=2026-03-20&to=2026-03-25`;
// const urll = `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=5efdabdeeb26d880de853d00fba2261851584e012ea6534046841b7dad7a730e&from=2026-02-01&to=2026-03-30&leagueId=152`;

const API_KEY = "fb3c28c393019151e0308b540abbb43f";

const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const table = document.getElementById("table");
const tableBody = document.getElementById("playersTable");

fetch("https://v3.football.api-sports.io/players/topscorers?league=39&season=2023", {
  method: "GET",
  headers: {
    "x-apisports-key": API_KEY
  }
})
.then(res => {
  if (!res.ok) throw new Error("API Error");
  return res.json();
})
.then(data => {
  loading.classList.add("d-none");

  const players = data.response;

  if (!players || players.length === 0) {
    errorDiv.classList.remove("d-none");
    errorDiv.innerText = "No data found";
    return;
  }

  table.classList.remove("d-none");

  let rows = "";

  players.forEach(playerData => {
    const player = playerData.player;
    const stats = playerData.statistics[0];

    rows += `
      <tr>
        <td>
          <div class="player-cell" title="${player.name}">
            <img src="${player.photo}" class="player-img">
            <span class="player-name">${player.name}</span>
          </div>
        </td>
        <td class="stat">${stats.goals.total || 0}</td>
        <td class="stat">${stats.goals.assists || 0}</td>
        <td class="stat">${stats.cards.yellow || 0}</td>
        <td class="stat">${stats.cards.red || 0}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = rows;
})
.catch(err => {
  loading.classList.add("d-none");
  errorDiv.classList.remove("d-none");
  errorDiv.innerText = "Failed to load data";
  console.error(err);
});
