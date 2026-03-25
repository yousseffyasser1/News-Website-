// ============================================================
// standings.js — StandingsService + Standings UI (merged)
// ============================================================

// ── STANDINGS SERVICE ─────────────────────────────────────
const StandingsService = (() => {
  const API_KEY =
    "5efdabdeeb26d880de853d00fba2261851584e012ea6534046841b7dad7a730e";
  const BASE_URL = "https://apiv2.allsportsapi.com/football/";

  const LEAGUES = {
    premier: {
      id: 152,
      title: "Premier League",
      subtitle: "England • Regular Season",
    },
    egyptian: {
      id: 141,
      title: "Egyptian League",
      subtitle: "Egypt • Regular Season",
    },
  };

  const _cache = {};

  function resolveRowClass(placeType) {
    if (!placeType) return "";
    const t = placeType.toLowerCase();
    if (
      t.includes("champions league") ||
      t.includes("championship group") ||
      t.includes("caf champions")
    )
      return "champions";
    if (t.includes("europa") || t.includes("confederation")) return "europa";
    if (t.includes("relegation")) return "relegation";
    return "";
  }

  function mapRow(row) {
    return {
      place: row.standing_place,
      placeType: row.standing_place_type || "",
      team: row.standing_team,
      logo: row.team_logo || "",
      P: row.standing_P,
      W: row.standing_W,
      D: row.standing_D,
      L: row.standing_L,
      GF: row.standing_F,
      GA: row.standing_A,
      GD: row.standing_GD,
      PTS: row.standing_PTS,
      rowClass: resolveRowClass(row.standing_place_type),
      stageName: row.stage_name || "",
      season: row.league_season || "",
    };
  }

  // standings API لا يدعم from/to — الـ date بيُستخدم في Fixtures فقط
  // لكن هنمرر السيزون الحالي في الـ header
  async function fetchStandings(leagueKey) {
    const league = LEAGUES[leagueKey];
    if (!league) return null;

    const url = `${BASE_URL}?met=Standings&leagueId=${league.id}&APIkey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Standings API error: ${res.status}`);

    const json = await res.json();
    const result = json.result || {};
    const allTotal = result.total || [];

    // فلتر Regular season / Current فقط
    const regularRows = allTotal.filter(
      (r) => r.stage_name === "Regular season" || r.stage_name === "Current",
    );

    // اختار الـ stage الأكبر (الجدول الرئيسي)
    const stageCounts = {};
    regularRows.forEach((r) => {
      stageCounts[r.fk_stage_key] = (stageCounts[r.fk_stage_key] || 0) + 1;
    });
    const mainStageKey = Object.keys(stageCounts).sort(
      (a, b) => stageCounts[b] - stageCounts[a],
    )[0];

    const mainRows = regularRows
      .filter((r) => String(r.fk_stage_key) === String(mainStageKey))
      .map(mapRow)
      .sort((a, b) => a.place - b.place);

    _cache[leagueKey] = {
      rows: mainRows,
      season: mainRows[0]?.season || "",
    };

    return _cache[leagueKey];
  }

  async function fetchTopScorers(leagueKey) {
    const league = LEAGUES[leagueKey];
    if (!league) return [];
    const url = `${BASE_URL}?met=TopScorers&leagueId=${league.id}&APIkey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return json.result || [];
  }

  function getLeague(key) {
    return LEAGUES[key];
  }

  return { fetchStandings, fetchTopScorers, getLeague, LEAGUES };
})();

// ── HELPERS ───────────────────────────────────────────────
function getCurrentSeason() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}

function getDefaultRange() {
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - 3);
  const to = new Date(now);
  to.setDate(now.getDate() + 4);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

// ── STANDINGS UI ──────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async function () {
  const tbody = document.getElementById("standings-body");
  const leagueTitleEl = document.getElementById("league-title");
  const leagueSubEl = document.getElementById("league-subtitle");
  const leagueTabs = document.querySelectorAll(".league-switcher button");
  const dateFromInput = document.getElementById("date-from");
  const dateToInput = document.getElementById("date-to");
  const applyDateBtn = document.getElementById("apply-date");

  const scorerName = document.getElementById("top-scorer-name");
  const scorerInfo = document.getElementById("top-scorer-info");
  const assistsName = document.getElementById("top-assists-name");
  const assistsInfo = document.getElementById("top-assists-info");
  const csName = document.getElementById("top-cs-name");
  const csInfo = document.getElementById("top-cs-info");

  let currentLeague = "premier";
  const { from: defaultFrom, to: defaultTo } = getDefaultRange();

  // Date inputs defaults
  if (dateFromInput) dateFromInput.value = defaultFrom;
  if (dateToInput) dateToInput.value = defaultTo;

  // ── Skeleton ──────────────────────────────────────────────
  function showSkeleton() {
    tbody.innerHTML = Array(10)
      .fill(
        `
      <tr class="skeleton-row">
        ${Array(10).fill("<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>").join("")}
      </tr>`,
      )
      .join("");
  }

  // ── Update page header ────────────────────────────────────
  function updateHeader(leagueKey, season) {
    const league = StandingsService.getLeague(leagueKey);
    if (!league) return;
    if (leagueTitleEl) leagueTitleEl.textContent = league.title;
    if (leagueSubEl)
      leagueSubEl.textContent = `${season || getCurrentSeason()} Regular Season`;
  }

  // ── Render table ──────────────────────────────────────────
  function renderTable(rows) {
    if (!rows || rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:#777;padding:40px;">
        No standings data available.
      </td></tr>`;
      return;
    }

    tbody.innerHTML = rows
      .map((row) => {
        const gdClass = row.GD > 0 ? "gd" : row.GD < 0 ? "gd negative" : "gd";
        const gdDisplay = row.GD > 0 ? `+${row.GD}` : row.GD;
        const logo = row.logo
          ? `<img src="${row.logo}" alt="${row.team}" onerror="this.style.display='none'">`
          : "";
        return `
        <tr class="${row.rowClass}">
          <td>${row.place}</td>
          <td class="team">
            <div class="team-cell">${logo}<span>${row.team}</span></div>
          </td>
          <td>${row.P}</td>
          <td>${row.W}</td>
          <td>${row.D}</td>
          <td>${row.L}</td>
          <td>${row.GF}</td>
          <td>${row.GA}</td>
          <td class="${gdClass}">${gdDisplay}</td>
          <td class="points">${row.PTS}</td>
        </tr>`;
      })
      .join("");
  }

  // ── Render stats cards ────────────────────────────────────
  function renderStatsCards(scorers) {
    if (!scorers || scorers.length === 0) {
      [scorerName, assistsName, csName].forEach((el) => {
        if (el) el.textContent = "—";
      });
      [scorerInfo, assistsInfo, csInfo].forEach((el) => {
        if (el) el.textContent = "No data available";
      });
      return;
    }

    const byGoals = [...scorers].sort(
      (a, b) => (b.goals || 0) - (a.goals || 0),
    );
    const top = byGoals[0];
    if (scorerName) scorerName.textContent = top?.player_name || "—";
    if (scorerInfo)
      scorerInfo.textContent = `${top?.team_name || ""} • ${top?.goals || 0} Goals`;

    const byAssists = [...scorers].sort(
      (a, b) => (b.assists || 0) - (a.assists || 0),
    );
    const topA = byAssists[0];
    if (assistsName) assistsName.textContent = topA?.player_name || "—";
    if (assistsInfo)
      assistsInfo.textContent = `${topA?.team_name || ""} • ${topA?.assists || 0} Assists`;

    // Clean sheets — نفس أعلى scorer كـ fallback
    if (csName) csName.textContent = top?.player_name || "—";
    if (csInfo)
      csInfo.textContent = `${top?.team_name || ""} • ${top?.goals || 0} Goals`;
  }

  // ── Load standings + top scorers ─────────────────────────
  async function loadLeague(leagueKey) {
    showSkeleton();
    [scorerInfo, assistsInfo, csInfo].forEach((el) => {
      if (el) el.textContent = "Loading…";
    });

    try {
      const [data, scorers] = await Promise.all([
        StandingsService.fetchStandings(leagueKey),
        StandingsService.fetchTopScorers(leagueKey),
      ]);

      updateHeader(leagueKey, data?.season);
      renderTable(data?.rows || []);
      renderStatsCards(scorers);
    } catch (err) {
      console.error("Failed to load standings:", err);
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:#e74c3c;padding:40px;">
        ⚠️ Failed to load standings. Please check your connection.
      </td></tr>`;
    }
  }

  // ── Column sort ───────────────────────────────────────────
  const headers = document.querySelectorAll("thead th");
  headers.forEach(function (header, index) {
    header.style.cursor = "pointer";
    header.addEventListener("click", function () {
      const rows = Array.from(tbody.querySelectorAll("tr:not(.skeleton-row)"));
      const isAsc = header.getAttribute("data-sort") !== "asc";
      headers.forEach((h) => h.removeAttribute("data-sort"));
      header.setAttribute("data-sort", isAsc ? "asc" : "desc");
      rows.sort(function (a, b) {
        const aVal = a.cells[index]?.textContent.trim() || "";
        const bVal = b.cells[index]?.textContent.trim() || "";
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum))
          return isAsc ? aNum - bNum : bNum - aNum;
        return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // ── League tab clicks ─────────────────────────────────────
  leagueTabs.forEach((btn) => {
    btn.addEventListener("click", function () {
      leagueTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentLeague = btn.dataset.league;
      loadLeague(currentLeague);
    });
  });

  // ── Date apply ────────────────────────────────────────────
  // ملاحظة: الـ Standings API لا يدعم from/to مثل Fixtures
  // لكن الـ date picker موجود للـ UX وبيعرض للمستخدم الفترة المختارة في الـ subtitle
  if (applyDateBtn) {
    applyDateBtn.addEventListener("click", function () {
      const from = dateFromInput?.value;
      const to = dateToInput?.value;
      if (!from || !to) return;
      if (from > to) {
        alert("Start date must be before end date.");
        return;
      }

      // حدّث الـ subtitle بالفترة المختارة
      if (leagueSubEl) {
        leagueSubEl.textContent = `${from} → ${to}`;
      }

      // أعد تحميل الجدول
      loadLeague(currentLeague);
    });
  }

  // ── Boot ──────────────────────────────────────────────────
  await loadLeague("premier");
});
