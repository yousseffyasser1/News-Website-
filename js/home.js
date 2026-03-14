document.addEventListener('DOMContentLoaded', function () {
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
      var email = emailInput ? emailInput.value.trim() : '';
      if (email) {
        newsletterBtn.textContent = 'Subscribed!';
        newsletterBtn.disabled = true;
        emailInput.value = '';
      }
    });
  }
});
