document.addEventListener('DOMContentLoaded', function () {
  var playersGrid = document.querySelector('.players-grid');
  var searchInput = document.querySelector('.search input');

  function renderPlayers(filterText) {
    var players = SportsService.getPlayers();
    if (filterText) {
      players = players.filter(function (p) {
        return p.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1 ||
               p.team.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
      });
    }

    var html = '';
    players.forEach(function (player) {
      html +=
        '<div class="player-card">' +
          '<div class="player-header">' +
            '<img class="player-img" src="' + player.image + '" alt="' + player.name + '">' +
            '<div class="player-number">' + player.number + '</div>' +
          '</div>' +
          '<h3>' + player.name + '</h3>' +
          '<p class="team">' + player.team + '</p>' +
          '<div class="player-stats">' +
            '<div><h4>' + player.goals + '</h4><span>Goals</span></div>' +
            '<div><h4 class="yellow">' + player.yellowCards + '</h4><span>Yellow</span></div>' +
            '<div><h4 class="red">' + player.redCards + '</h4><span>Red</span></div>' +
          '</div>' +
          '<button class="analytics-btn">View Full Analytics</button>' +
        '</div>';
    });

    if (players.length === 0) {
      html = '<p style="text-align:center; color:#777; padding:40px; grid-column:1/-1;">No players found.</p>';
    }

    playersGrid.innerHTML = html;
  }

  // Render all players initially
  renderPlayers('');

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderPlayers(searchInput.value.trim());
    });
  }
});
