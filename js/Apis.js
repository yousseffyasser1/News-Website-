let API_KEY = `d3a8026612fd7d8fd8dd9a7eb7182597`;
// let baseUrl = `https://gnews.io/api/v4/search?q=${endpoint}&lang=en&max=3&apikey=${API_KEY}`;
let newsData = [];
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
 await fetch(`https://gnews.io/api/v4/search?q=${endpoint}&lang=en&max=3&apikey=${API_KEY}`)
    .then( (res) => {
       return  res.json();
    })
    .then((data) => {
      newsData = data.articles;
      console.log(newsData)
      disNews(endpoint);
    });
}

getNewData('Sports');
getNewData('Health');
getNewData('Technology');
function disNews(data){
    let allNews = ``;

    for (let i = 0; i < newsData.length; i++) {

        let validImage = imageExtensions.some(ext => 
            newsData[i].image && newsData[i].image.includes(ext)
        );

        if(!validImage){
            newsData[i].image = defaultImage;
        }

        allNews +=`
        <div class="card">
            <a href="${newsData[i].url}" target="_blank">
                <img src="${newsData[i].image}"/>
            </a>

            <h3>${newsData[i].title.split(" ",8).join(" ")}</h3>

            <p>
            ${newsData[i].description.split(" ",20).join(" ")}...
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