document.addEventListener('DOMContentLoaded', function () {
  const playersGrid = document.querySelector('.players-grid');
  const searchInput = document.querySelector('.search input');
  const leagueButtons = document.querySelectorAll('.league-btn');

  const API_KEY = "fb3c28c393019151e0308b540abbb43f";

  let currentLeague = 39;
  let allPlayers = [];

  function showLoading() {
    playersGrid.innerHTML = "<p style='text-align:center'>Loading...</p>";
  }

  function showError() {
    playersGrid.innerHTML =
      "<p style='color:red;text-align:center'>Failed to load players</p>";
  }

  function fetchPlayers() {
    showLoading();

    fetch(`https://v3.football.api-sports.io/players/topscorers?league=${currentLeague}&season=2023`, {
      method: "GET",
      headers: {
        "x-apisports-key": API_KEY,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        allPlayers = data.response || [];
        renderPlayers("");
      })
      .catch((err) => {
        console.error(err);
        showError();
      });
  }

  function renderPlayers(filterText) {
    let players = allPlayers;

    if (filterText) {
      players = players.filter((p) =>
        p.player.name.toLowerCase().includes(filterText.toLowerCase()) ||
        p.statistics[0].team.name.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    let html = "";

    players.forEach((item, index) => {
      const player = item.player;
      const stats = item.statistics[0];

      html += `
        <div class="player-card">
          <div class="player-header">
            <img class="player-img" src="${player.photo}" alt="${player.name}">
            <div class="player-number">${index + 1}</div>
          </div>

          <h3>${player.name}</h3>
          <p class="team">${stats.team.name}</p>

          <div class="player-stats">
            <div>
              <h4>${stats.goals.total || 0}</h4>
              <span>Goals</span>
            </div>

            <div>
              <h4>${stats.goals.assists || 0}</h4>
              <span>Assists</span>
            </div>

            <div>
              <h4 class="yellow">${stats.cards.yellow || 0}</h4>
              <span>Yellow</span>
            </div>

            <div>
              <h4 class="red">${stats.cards.red || 0}</h4>
              <span>Red</span>
            </div>
          </div>

          <button class="analytics-btn">View Full Analytics</button>
        </div>
      `;
    });

    if (players.length === 0) {
      html =
        '<p style="text-align:center; color:#777; padding:40px;">No players found.</p>';
    }

    playersGrid.innerHTML = html;
  }

  // 🔥 League switching
  leagueButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      leagueButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      currentLeague = this.dataset.league;
      fetchPlayers();
    });
  });

  // 🔍 Search
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderPlayers(this.value.trim());
    });
  }

  // أول تحميل
  fetchPlayers();
});