var CurrencyService = (function () {
  var rates = [
    { pair: 'USD / EUR', value: '0.92', trend: 'up' },
    { pair: 'SAR / USD', value: '0.27', trend: 'neutral' }
  ];

  return {
    getRates: function () {
      return rates;
    },
    renderRates: function (containerSelector) {
      var container = document.querySelector(containerSelector);
      if (!container) return;
      var html = '<h3>Exchange Rates</h3>';
      rates.forEach(function (rate) {
        var cssClass = rate.trend === 'up' ? ' class="green"' : '';
        html += '<div class="rate"><span>' + rate.pair + '</span><span' + cssClass + '>' + rate.value + '</span></div>';
      });
      container.innerHTML = html;
    }
  };
})();
