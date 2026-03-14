document.addEventListener('DOMContentLoaded', function () {
  var tabButtons = document.querySelectorAll('.tabs button');
  var matchesSection = document.querySelector('.matches');

  function renderMatches(filter) {
    var matches = SportsService.getMatches(filter);
    var html = '<h3 class="day-title">Today, March 14</h3>';

    matches.forEach(function (match) {
      var statusClass = match.status === 'live' ? 'live' : (match.status === 'finished' ? 'finished' : 'upcoming');
      var statusText = '';
      if (match.status === 'live') {
        statusText = '<span class="live-dot"></span> LIVE ' + match.minute + "'" + '<p>' + match.venue + '</p>';
      } else if (match.status === 'finished') {
        statusText = 'FINISHED <p>' + match.time + '</p>';
      } else {
        statusText = 'UPCOMING <p>' + match.time + '</p>';
      }

      var scoreText = match.status === 'upcoming' ? 'vs' : match.homeScore + ' - ' + match.awayScore;

      html +=
        '<div class="match-card ' + statusClass + '">' +
          '<div class="match-status">' + statusText + '</div>' +
          '<div class="teams">' +
            '<div class="team left"><span>' + match.home + '</span></div>' +
            '<div class="score">' + scoreText + '</div>' +
            '<div class="team right"><span>' + match.away + '</span></div>' +
          '</div>' +
          '<div class="match-actions">' +
            '<span class="material-symbols-outlined">star</span>' +
            '<span class="material-symbols-outlined">chevron_right</span>' +
          '</div>' +
        '</div>';
    });

    if (matches.length === 0) {
      html += '<p style="text-align:center; color:#777; padding:40px;">No matches found for this filter.</p>';
    }

    matchesSection.innerHTML = html;
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filterText = btn.textContent.trim().toLowerCase();
      var filter = 'all';
      if (filterText === 'live') filter = 'live';
      else if (filterText === 'upcoming') filter = 'upcoming';
      else if (filterText === 'finished') filter = 'finished';

      renderMatches(filter);
    });
  });
});
