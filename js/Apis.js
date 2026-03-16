let API_KEY = `d3a8026612fd7d8fd8dd9a7eb7182597`;
// let baseUrl = `https://gnews.io/api/v4/search?q=${endpoint}&lang=en&max=3&apikey=${API_KEY}`;
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

  return fetch(`https://gnews.io/api/v4/search?q=${endpoint}&lang=en&max=3&apikey=${API_KEY}`, {
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
