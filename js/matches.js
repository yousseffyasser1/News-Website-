// ============================================================
// matches.js — SportsService + Matches UI (merged)
// ============================================================
 
// ── SPORTS SERVICE ────────────────────────────────────────
const SportsService = (() => {
 
  const API_KEY  = '5efdabdeeb26d880de853d00fba2261851584e012ea6534046841b7dad7a730e';
  const BASE_URL = 'https://apiv2.allsportsapi.com/football/';
 
  const _cache = {};
 
  const LEAGUES = {
    premier: {
      id:       152,
      title:    'Premier League',
      subtitle: 'England',
    },
    egyptian: {
      id:       141,
      title:    'Egyptian League',
      subtitle: 'Egypt',
    },
  };
 
  function mapFixture(fixture) {
    const status = resolveStatus(fixture.event_status);
    return {
      id:        fixture.event_key,
      date:      fixture.event_date,
      time:      fixture.event_time,
      home:      fixture.event_home_team,
      away:      fixture.event_away_team,
      homeLogo:  fixture.home_team_logo  || '',
      awayLogo:  fixture.away_team_logo  || '',
      homeScore: fixture.event_final_result ? fixture.event_final_result.split(' - ')[0] : null,
      awayScore: fixture.event_final_result ? fixture.event_final_result.split(' - ')[1] : null,
      minute:    fixture.event_time || '',
      venue:     fixture.event_stadium || 'TBD',
      status,
      league:    fixture.league_name  || '',
      country:   fixture.country_name || '',
    };
  }
 
  function resolveStatus(raw) {
    if (!raw) return 'upcoming';
    const s = raw.toString().toLowerCase();
    if (s === 'finished' || s === 'ft')               return 'finished';
    if (s === 'cancelled' || s === 'postponed')       return 'cancelled';
    if (/^\d/.test(s) || s === 'ht' || s === 'live') return 'live';
    return 'upcoming';
  }
 
  async function fetchLeague(leagueId, from, to) {
    if (!leagueId) return [];
    const url      = `${BASE_URL}?met=Fixtures&APIkey=${API_KEY}&leagueId=${leagueId}&from=${from}&to=${to}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const json       = await response.json();
    _cache[leagueId] = (json.result || []).map(mapFixture);
    console.log(`📦 League ${leagueId}: ${_cache[leagueId].length} matches`);
    return _cache[leagueId];
  }
 
  async function fetchAll(from, to) {
    await Promise.all(
      Object.values(LEAGUES).map(l => fetchLeague(l.id, from, to))
    );
  }
 
  function getMatches(leagueKey, statusFilter = 'all') {
    const league  = LEAGUES[leagueKey];
    if (!league) return [];
    const matches = _cache[league.id] || [];
    return statusFilter === 'all'
      ? matches
      : matches.filter(m => m.status === statusFilter);
  }
 
  function getLeague(key) { return LEAGUES[key]; }
 
  return { fetchAll, getMatches, getLeague, LEAGUES };
 
})();
 
 
// ── HELPERS ───────────────────────────────────────────────
function getCurrentSeason() {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}
 
function getDefaultRange() {
  const now  = new Date();
  const from = new Date(now); from.setDate(now.getDate() - 3);
  const to   = new Date(now); to.setDate(now.getDate() + 4);
  return {
    from: from.toISOString().slice(0, 10),
    to:   to.toISOString().slice(0, 10),
  };
}
 
 
// ── MATCHES UI ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function () {
 
  const matchesSection = document.querySelector('.matches');
  const loadMoreBtn    = document.querySelector('.load-more button');
  const loadMoreCount  = document.querySelector('.load-more p');
  const leagueTabs     = document.querySelectorAll('.league-tabs button');
  const statusTabs     = document.querySelectorAll('.status-tabs button');
  const dateFromInput  = document.getElementById('date-from');
  const dateToInput    = document.getElementById('date-to');
  const applyDateBtn   = document.getElementById('apply-date');
 
  // ✅ عناصر الـ header اللي هتتحدث
  const leagueTitleEl    = document.getElementById('league-title');
  const leagueSubtitleEl = document.getElementById('league-subtitle');
 
  const PAGE_SIZE   = 10;
  let currentLeague = 'premier';
  let currentStatus = 'all';
  let currentPage   = 1;
 
  const today = new Date().toISOString().slice(0, 10);
  const { from: defaultFrom, to: defaultTo } = getDefaultRange();
  let currentFrom = defaultFrom;
  let currentTo   = defaultTo;
 
  // ── Set initial values ────────────────────────────────────
  if (leagueTitleEl)    leagueTitleEl.textContent    = 'Premier League';
  if (leagueSubtitleEl) leagueSubtitleEl.textContent = `Regular Season ${getCurrentSeason()}`;
  if (dateFromInput)    dateFromInput.value = defaultFrom;
  if (dateToInput)      dateToInput.value   = defaultTo;
 
  // ── Update header when league changes ─────────────────────
  function updateLeagueHeader(leagueKey) {
    const league = SportsService.getLeague(leagueKey);
    if (!league) return;
    if (leagueTitleEl)    leagueTitleEl.textContent    = league.title;
    if (leagueSubtitleEl) leagueSubtitleEl.textContent = `Regular Season ${getCurrentSeason()}`;
  }
 
  // ── Skeleton ──────────────────────────────────────────────
  function showSkeleton() {
    matchesSection.innerHTML = `
      <h3 class="day-title">Loading matches…</h3>
      ${Array(4).fill(`
        <div class="match-card finished" style="opacity:.4;pointer-events:none">
          <div class="match-status">── <p>──:──</p></div>
          <div class="teams">
            <div class="team left"><span>Team A</span></div>
            <div class="score">– : –</div>
            <div class="team right"><span>Team B</span></div>
          </div>
          <div class="match-actions">
            <span class="material-symbols-outlined">star</span>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        </div>`).join('')}`;
  }
 
  // ── Build card ────────────────────────────────────────────
  function buildCard(match) {
    const statusClass = match.status === 'live' ? 'live'
      : match.status === 'finished' ? 'finished' : 'upcoming';
 
    let statusHTML;
    if (match.status === 'live') {
      statusHTML = `<span class="live-dot"></span> LIVE ${match.minute}'<p>${match.venue}</p>`;
    } else if (match.status === 'finished') {
      statusHTML = `FINISHED<p>${match.time || '–'}</p>`;
    } else {
      statusHTML = `UPCOMING<p>${match.time || 'TBD'}</p>`;
    }
 
    const scoreHTML = match.status === 'upcoming'
      ? `<span class="vs-text">vs</span>`
      : `${match.homeScore} - ${match.awayScore}`;
 
    const homeLogo = match.homeLogo
      ? `<img src="${match.homeLogo}" alt="${match.home}" class="team-logo" onerror="this.style.display='none'">` : '';
    const awayLogo = match.awayLogo
      ? `<img src="${match.awayLogo}" alt="${match.away}" class="team-logo" onerror="this.style.display='none'">` : '';
 
    return `
      <div class="match-card ${statusClass}" data-id="${match.id}">
        <div class="match-status">${statusHTML}</div>
        <div class="teams">
          <div class="team left">
            <span>${match.home}</span>
            ${homeLogo}
          </div>
          <div class="score">${scoreHTML}</div>
          <div class="team right">
            ${awayLogo}
            <span>${match.away}</span>
          </div>
        </div>
        <div class="match-actions">
          <span class="material-symbols-outlined">star</span>
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </div>`;
  }
 
  // ── Group by date ─────────────────────────────────────────
  function groupByDate(matches) {
    return matches.reduce((acc, m) => {
      (acc[m.date] = acc[m.date] || []).push(m);
      return acc;
    }, {});
  }
 
  function formatDateLabel(dateStr) {
    const d = new Date(dateStr);
    if (dateStr === today) {
      return `Today, ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
    }
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
 
  // ── Render ────────────────────────────────────────────────
  function renderMatches(page = 1) {
    const allFiltered = SportsService.getMatches(currentLeague, currentStatus);
    const sliced      = allFiltered.slice(0, page * PAGE_SIZE);
    const grouped     = groupByDate(sliced);
 
    if (allFiltered.length === 0) {
      matchesSection.innerHTML = `
        <p style="text-align:center;color:#777;padding:60px 20px;">
          No matches found — try a different date range or filter.
        </p>`;
      if (loadMoreBtn) loadMoreBtn.parentElement.style.display = 'none';
      return;
    }
 
    let html = '';
    Object.keys(grouped).sort().forEach(date => {
      html += `<h3 class="day-title">${formatDateLabel(date)}</h3>`;
      grouped[date].forEach(m => { html += buildCard(m); });
    });
 
    matchesSection.innerHTML = html;
 
    if (loadMoreBtn) {
      const showing = sliced.length;
      const total   = allFiltered.length;
      if (loadMoreCount) loadMoreCount.textContent = `Showing ${showing} of ${total} matches`;
      loadMoreBtn.parentElement.style.display = showing >= total ? 'none' : 'flex';
    }
  }
 
  // ── Fetch + render ────────────────────────────────────────
  async function fetchAndRender() {
    showSkeleton();
    try {
      await SportsService.fetchAll(currentFrom, currentTo);
      currentPage = 1;
      renderMatches(currentPage);
    } catch (err) {
      console.error('Failed to load matches:', err);
      matchesSection.innerHTML = `
        <p style="text-align:center;color:#e74c3c;padding:60px 20px;">
          ⚠️ Failed to load matches. Please check your connection.
        </p>`;
    }
  }
 
  // ── League tabs ───────────────────────────────────────────
  leagueTabs.forEach(btn => {
    btn.addEventListener('click', function () {
      leagueTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLeague = btn.dataset.league;
      currentPage   = 1;
 
      // ✅ تحديث الـ header
      updateLeagueHeader(currentLeague);
 
      renderMatches(currentPage);
    });
  });
 
  // ── Status tabs ───────────────────────────────────────────
  statusTabs.forEach(btn => {
    btn.addEventListener('click', function () {
      statusTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const text = btn.textContent.trim().toLowerCase();
      currentStatus = text === 'live'     ? 'live'
        : text === 'upcoming'  ? 'upcoming'
        : text === 'finished'  ? 'finished'
        : 'all';
      currentPage = 1;
      renderMatches(currentPage);
    });
  });
 
  // ── Date apply ────────────────────────────────────────────
  if (applyDateBtn) {
    applyDateBtn.addEventListener('click', function () {
      const from = dateFromInput?.value;
      const to   = dateToInput?.value;
      if (!from || !to) return;
      if (from > to) { alert('Start date must be before end date.'); return; }
      currentFrom = from;
      currentTo   = to;
      fetchAndRender();
    });
  }
 
  // ── Load more ─────────────────────────────────────────────
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      currentPage++;
      renderMatches(currentPage);
    });
  }
 
  // ── Boot ──────────────────────────────────────────────────
  await fetchAndRender();
 
});