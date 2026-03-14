var SportsService = (function () {
  var matches = [
    {
      home: 'Manchester City',
      away: 'Arsenal',
      homeScore: 2,
      awayScore: 1,
      status: 'live',
      minute: 62,
      venue: 'Stadium Arena',
      time: '20:00'
    },
    {
      home: 'Liverpool',
      away: 'Chelsea',
      homeScore: 3,
      awayScore: 0,
      status: 'finished',
      minute: 90,
      venue: 'Anfield',
      time: '14:00'
    },
    {
      home: 'Tottenham',
      away: 'Newcastle',
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      minute: 0,
      venue: 'Tottenham Stadium',
      time: '17:30'
    },
    {
      home: 'Aston Villa',
      away: 'Brighton',
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      minute: 0,
      venue: 'Villa Park',
      time: '20:00'
    }
  ];

  var standings = [
    { rank: 1, team: 'Arsenal', played: 28, won: 20, drawn: 4, lost: 4, gf: 70, ga: 24, gd: '+46', points: 64, zone: 'champions' },
    { rank: 2, team: 'Liverpool', played: 28, won: 19, drawn: 6, lost: 3, gf: 65, ga: 26, gd: '+39', points: 63, zone: 'champions' },
    { rank: 3, team: 'Manchester City', played: 28, won: 19, drawn: 6, lost: 3, gf: 63, ga: 28, gd: '+35', points: 63, zone: 'champions' },
    { rank: 4, team: 'Aston Villa', played: 29, won: 17, drawn: 5, lost: 7, gf: 60, ga: 42, gd: '+18', points: 56, zone: 'champions' },
    { rank: 5, team: 'Tottenham', played: 28, won: 16, drawn: 5, lost: 7, gf: 59, ga: 39, gd: '+20', points: 53, zone: 'europa' },
    { rank: 18, team: 'Nottingham Forest', played: 29, won: 6, drawn: 7, lost: 16, gf: 35, ga: 51, gd: '-16', points: '21*', zone: 'relegation' }
  ];

  var players = [
    {
      name: 'Erling Haaland',
      team: 'Manchester City',
      goals: 27,
      yellowCards: 2,
      redCards: 0,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqDO-JlUZgtKTjslfHhb0-kibqZ2V4o3he_rY-6BVPr4OXxJOI5L1Nz501v1fHZagERTV-zxh0oSFU2LcSdkkKn4awxS1xUapITOSBjPyMrlOo5x5UObcqCeKUFxkEz-3kde7GjuYOUL_PcQd7m7tJL7fe4F2eNEQK-e0nA66N3-731o03_H9q58mf9XzWLmlZg-iYnuEDsY1mfPmejxCHGZ2qSkiJTnDd2DAURvpYK1Q-on9QcnlyWj3JIn90ax_RWwFa8lCsBU0',
      number: '01'
    },
    {
      name: 'Mohamed Salah',
      team: 'Liverpool',
      goals: 19,
      yellowCards: 1,
      redCards: 0,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqDO-JlUZgtKTjslfHhb0-kibqZ2V4o3he_rY-6BVPr4OXxJOI5L1Nz501v1fHZagERTV-zxh0oSFU2LcSdkkKn4awxS1xUapITOSBjPyMrlOo5x5UObcqCeKUFxkEz-3kde7GjuYOUL_PcQd7m7tJL7fe4F2eNEQK-e0nA66N3-731o03_H9q58mf9XzWLmlZg-iYnuEDsY1mfPmejxCHGZ2qSkiJTnDd2DAURvpYK1Q-on9QcnlyWj3JIn90ax_RWwFa8lCsBU0',
      number: '02'
    },
    {
      name: 'Bukayo Saka',
      team: 'Arsenal',
      goals: 16,
      yellowCards: 3,
      redCards: 0,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqDO-JlUZgtKTjslfHhb0-kibqZ2V4o3he_rY-6BVPr4OXxJOI5L1Nz501v1fHZagERTV-zxh0oSFU2LcSdkkKn4awxS1xUapITOSBjPyMrlOo5x5UObcqCeKUFxkEz-3kde7GjuYOUL_PcQd7m7tJL7fe4F2eNEQK-e0nA66N3-731o03_H9q58mf9XzWLmlZg-iYnuEDsY1mfPmejxCHGZ2qSkiJTnDd2DAURvpYK1Q-on9QcnlyWj3JIn90ax_RWwFa8lCsBU0',
      number: '03'
    },
    {
      name: 'Ollie Watkins',
      team: 'Aston Villa',
      goals: 15,
      yellowCards: 4,
      redCards: 0,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqDO-JlUZgtKTjslfHhb0-kibqZ2V4o3he_rY-6BVPr4OXxJOI5L1Nz501v1fHZagERTV-zxh0oSFU2LcSdkkKn4awxS1xUapITOSBjPyMrlOo5x5UObcqCeKUFxkEz-3kde7GjuYOUL_PcQd7m7tJL7fe4F2eNEQK-e0nA66N3-731o03_H9q58mf9XzWLmlZg-iYnuEDsY1mfPmejxCHGZ2qSkiJTnDd2DAURvpYK1Q-on9QcnlyWj3JIn90ax_RWwFa8lCsBU0',
      number: '04'
    }
  ];

  return {
    getMatches: function (filter) {
      if (!filter || filter === 'all') return matches;
      return matches.filter(function (m) { return m.status === filter; });
    },
    getStandings: function () {
      return standings;
    },
    getPlayers: function () {
      return players;
    }
  };
})();
