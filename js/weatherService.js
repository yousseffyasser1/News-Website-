// ================= WEATHER =================
async function fetchWeatherData() {
  try {
    let weatherApiKey = "b354cbdc88f11813cc7f54f6ddd43b55";
    let weatherApiCityName = "Cairo";
    let countryCode = "EG";

    let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${weatherApiCityName},${countryCode}&appid=${weatherApiKey}&units=metric`;

    const response = await fetch(weatherApiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch weather");
    }

    const data = await response.json();

    document.getElementById("desc").textContent = data.weather[0].description;
    document.getElementById("temp").innerHTML = data.main.temp.toFixed(0) + "°C";
    document.querySelector("#weather-icon").src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById("location").textContent =
      `${data.name}, ${data.sys.country}`;

  } catch (error) {
    console.error("Weather Error:", error);
    document.getElementById("desc").textContent = "Weather unavailable";
  }
}

// ================= NEWS =================
let newsApiKey = `dbf89e299aa785448036a9d4e5e7e544`;
const imageExtensions = ["jpg","jpeg","png","gif","webp","svg","avif"];
let defaultImage = `../assets/download.png`;

async function getNewData(endpoint) {
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${endpoint}&lang=en&max=3&apikey=${newsApiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();
    const articles = Array.isArray(data.articles) ? data.articles : [];

    disNews(endpoint, articles);

  } catch (error) {
    console.error(`News Error (${endpoint}):`, error);
  }
}

function disNews(section, articles) {
  let allNews = ``;

  for (let article of articles) {

    let validImage = imageExtensions.some(ext =>
      article.image && article.image.includes(ext)
    );

    if (!validImage) {
      article.image = defaultImage;
    }

    const titleText = article.title
      ? article.title.split(" ", 8).join(" ")
      : "Untitled";

    const descriptionText = article.description
      ? article.description.split(" ", 20).join(" ") + "..."
      : "";

    allNews += `
      <div class="card">
        <a href="${article.url}" target="_blank">
          <img src="${article.image}" />
        </a>
        <h3>${titleText}</h3>
        <p>${descriptionText}</p>
      </div>
    `;
  }

  document.querySelector(`#${section} .grid`).innerHTML = allNews;
  document.querySelector(`#${section} .section-title`).textContent = section;
}

// ================= EXCHANGE =================
async function fetchExchangeRates() {
  try {
    let exchangeApiUrl = `https://v6.exchangerate-api.com/v6/9bd25c05315d56fea5e2ee2a/latest/USD`;

    const response = await fetch(exchangeApiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();

    if (data.result === "success") {
      const rates = data.conversion_rates;

      const usdToEgp = rates.EGP;
      const sarToUsd = 1 / rates.SAR;
      const sarToEgp = sarToUsd * rates.EGP;

      document.querySelector(".widget .rate:nth-child(2) span:last-child").textContent = usdToEgp.toFixed(2);
      document.querySelector(".widget .rate:nth-child(3) span:last-child").textContent = sarToEgp.toFixed(2);
    }

  } catch (error) {
    console.error("Exchange Error:", error);
  }
}

// ================= INIT =================
function initApp() {
  // Loading placeholders
  document.querySelectorAll(".grid").forEach(grid => {
    grid.innerHTML = "<p>Loading...</p>";
  });

  fetchWeatherData();
  fetchExchangeRates();

  getNewData('Sports');
  getNewData('Health');
  getNewData('Technology');
}

initApp();