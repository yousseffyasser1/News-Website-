document.addEventListener('DOMContentLoaded', function () {
  // Category navigation - switch news category
  var categoryLinks = document.querySelectorAll('.menu a');
  var sectionTitle = document.querySelector('.section-title');
  var grid = document.querySelector('.grid');

  function renderArticles(category) {
    var articles = NewsService.getArticles(category);
    if (articles.length === 0) return;
    sectionTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    grid.innerHTML = '';
    articles.forEach(function (article) {
      var card = document.createElement('div');
      card.className = 'card';
      card.innerHTML =
        '<img src="' + article.image + '" alt="' + article.title + '" />' +
        '<h3>' + article.title + '</h3>' +
        '<p>' + article.description + '</p>';
      grid.appendChild(card);
    });
  }

  // Weather widget
  if (typeof WeatherService !== 'undefined') {
    WeatherService.renderWeather('.weather');
  }

  // Currency widget
  if (typeof CurrencyService !== 'undefined') {
    var rateWidget = document.querySelectorAll('.widget')[1];
    if (rateWidget) {
      CurrencyService.renderRates('.widget:nth-child(2)');
    }
  }

  // Newsletter subscription
  var newsletterBtn = document.querySelector('.newsletter button');
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function () {
      var emailInput = document.querySelector('.newsletter input');
      if (emailInput && emailInput.value.trim()) {
        alert('Thank you for subscribing with: ' + emailInput.value);
        emailInput.value = '';
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }
});
