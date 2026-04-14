import React from "react";

// --- API Config ---
// Create React App: set REACT_APP_OPENWEATHER_KEY in your .env file
// Vite: set VITE_OPENWEATHER_KEY in .env and use import.meta.env.VITE_OPENWEATHER_KEY
const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=Augusta,GA,US&units=imperial&appid=${OPENWEATHER_API_KEY}`;

const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
const GOLF_TOURNAMENT_ID = "25"; // PGA Championship sample; swap for current tournament
const GOLF_URL = `https://golf-leaderboard-data.p.rapidapi.com/leaderboard/${GOLF_TOURNAMENT_ID}`;

const COLORS = {
  mastersGreen: "#006747",
  yellow: "#F5D130",
  azalea: "#E8A0B0",
  deepBlue: "#1B3A6B",
  white: "#FFFFFF",
  khaki: "#C2B280",
  lightKhaki: "#EDE8DA",
  darkGreen: "#004D35",
};

const styles = {
  app: {
    fontFamily: "'Georgia', serif",
    backgroundColor: COLORS.lightKhaki,
    minHeight: "100vh",
    color: COLORS.deepBlue,
  },
  header: {
    backgroundColor: COLORS.mastersGreen,
    color: COLORS.white,
    textAlign: "center",
    padding: "24px 16px 16px",
    borderBottom: `6px solid ${COLORS.yellow}`,
  },
  headerTitle: {
    fontSize: "2.4rem",
    fontWeight: "bold",
    letterSpacing: "0.05em",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "0.95rem",
    color: COLORS.khaki,
    marginTop: "6px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  badge: {
    display: "inline-block",
    backgroundColor: COLORS.yellow,
    color: COLORS.deepBlue,
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "3px 10px",
    borderRadius: "12px",
    marginTop: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "28px 16px",
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "24px",
    alignItems: "start",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: COLORS.mastersGreen,
    color: COLORS.white,
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: "bold",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  cardTitleAccent: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: COLORS.yellow,
    display: "inline-block",
    marginLeft: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    backgroundColor: COLORS.lightKhaki,
  },
  th: {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: COLORS.mastersGreen,
    borderBottom: `2px solid ${COLORS.khaki}`,
  },
  thRight: {
    textAlign: "right",
  },
  tr: {
    borderBottom: `1px solid ${COLORS.lightKhaki}`,
  },
  trHighlight: {
    borderBottom: `1px solid ${COLORS.lightKhaki}`,
    backgroundColor: "#FFF9E6",
  },
  td: {
    padding: "12px 16px",
    fontSize: "0.95rem",
  },
  tdRight: {
    textAlign: "right",
  },
  positionCell: {
    fontWeight: "bold",
    color: COLORS.mastersGreen,
    width: "40px",
  },
  playerName: {
    fontWeight: "bold",
    color: COLORS.deepBlue,
  },
  playerCountry: {
    fontSize: "0.78rem",
    color: COLORS.khaki,
    marginTop: "2px",
  },
  scoreUnder: {
    color: COLORS.mastersGreen,
    fontWeight: "bold",
    fontSize: "1rem",
  },
  scoreOver: {
    color: "#C0392B",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  scoreEven: {
    color: COLORS.deepBlue,
    fontWeight: "bold",
    fontSize: "1rem",
  },
  todayCell: {
    color: COLORS.deepBlue,
    fontSize: "0.9rem",
  },
  thruCell: {
    color: COLORS.khaki,
    fontSize: "0.85rem",
  },
  cutLine: {
    backgroundColor: COLORS.azalea,
    textAlign: "center",
    padding: "6px 16px",
    fontSize: "0.78rem",
    fontWeight: "bold",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: COLORS.deepBlue,
  },
  loadingBox: {
    textAlign: "center",
    padding: "40px 20px",
    color: COLORS.mastersGreen,
    fontSize: "1rem",
    letterSpacing: "0.08em",
  },
  errorBox: {
    textAlign: "center",
    padding: "24px",
    color: "#C0392B",
    fontSize: "0.9rem",
  },
  weatherCard: {
    backgroundColor: COLORS.white,
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
    overflow: "hidden",
  },
  weatherBody: {
    padding: "20px",
  },
  weatherMain: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: `1px solid ${COLORS.lightKhaki}`,
  },
  weatherIcon: {
    fontSize: "3.5rem",
    lineHeight: 1,
  },
  weatherTemp: {
    fontSize: "2.4rem",
    fontWeight: "bold",
    color: COLORS.deepBlue,
    lineHeight: 1,
  },
  weatherDesc: {
    fontSize: "0.95rem",
    color: COLORS.mastersGreen,
    marginTop: "4px",
    fontStyle: "italic",
  },
  weatherLocation: {
    fontSize: "0.78rem",
    color: COLORS.khaki,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginTop: "4px",
  },
  weatherGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  weatherStat: {
    backgroundColor: COLORS.lightKhaki,
    borderRadius: "6px",
    padding: "10px 12px",
  },
  weatherStatLabel: {
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: COLORS.khaki,
    marginBottom: "4px",
  },
  weatherStatValue: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: COLORS.deepBlue,
  },
  footer: {
    backgroundColor: COLORS.darkGreen,
    color: COLORS.khaki,
    textAlign: "center",
    padding: "14px",
    fontSize: "0.78rem",
    letterSpacing: "0.06em",
  },
};

// --- Helpers ---

// total_to_par at the player level is 0 in this API response (not populated).
// Calculate it by summing each completed round's total_to_par instead.
function calcTotalToPar(rounds) {
  return rounds.reduce((sum, r) => sum + (r.total_to_par || 0), 0);
}

// Get today's (current round) score from the rounds array
function getTodayScore(player) {
  const round = player.rounds.find(
    (r) => r.round_number === player.current_round
  );
  return round ? round.total_to_par : null;
}

function getWeatherIcon(code) {
  if (!code) return "🌤";
  if (code >= 200 && code < 300) return "⛈";
  if (code >= 300 && code < 400) return "🌦";
  if (code >= 500 && code < 600) return "🌧";
  if (code >= 600 && code < 700) return "❄️";
  if (code >= 700 && code < 800) return "🌫";
  if (code === 800) return "☀️";
  if (code > 800) return "⛅";
  return "🌤";
}

// --- Sub-components ---

function ScoreDisplay({ score }) {
  if (score === null || score === undefined)
    return <span style={styles.scoreEven}>-</span>;
  if (score < 0) return <span style={styles.scoreUnder}>{score}</span>;
  if (score > 0) return <span style={styles.scoreOver}>+{score}</span>;
  return <span style={styles.scoreEven}>E</span>;
}

function Leaderboard() {
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [tournament, setTournament] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch(GOLF_URL, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "golf-leaderboard-data.p.rapidapi.com",
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Golf API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // response.results.tournament → tournament meta
        // response.results.leaderboard → array of player objects
        setTournament(data.results.tournament);
        setLeaderboard(data.results.leaderboard);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Map API player object → display row
  // Fields used:
  //   player.position          → ranking/position
  //   player.first_name + last_name → full name
  //   player.country           → country code
  //   calcTotalToPar(rounds)   → total score (player.total_to_par is 0 in API response)
  //   getTodayScore(player)    → current round score
  //   player.holes_played      → holes completed (0/1-17/18)
  //   player.status            → "active" | "cut" | "wd" | "dsq"
  const activeRows = leaderboard.filter((p) => p.status === "active");
  const cutRows = leaderboard.filter((p) => p.status === "cut");
  const firstCutPos = cutRows.length > 0 ? cutRows[0].position : null;

  const roundLabel = tournament
    ? `Round ${tournament.live_details.current_round} · ${
        tournament.live_details.status === "completed"
          ? "Final"
          : tournament.live_details.status === "inprogress"
          ? "In Progress"
          : tournament.live_details.status
      }`
    : "Live";

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>
          {tournament ? tournament.name : "Leaderboard"}
          <span style={styles.cardTitleAccent} />
        </h2>
        <span
          style={{
            fontSize: "0.78rem",
            color: COLORS.khaki,
            letterSpacing: "0.06em",
          }}
        >
          {roundLabel}
        </span>
      </div>

      {loading && <div style={styles.loadingBox}>Loading...</div>}
      {error && <div style={styles.errorBox}>⚠ {error}</div>}

      {!loading && !error && (
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Pos</th>
              <th style={styles.th}>Player</th>
              <th style={{ ...styles.th, ...styles.thRight }}>Total</th>
              <th style={{ ...styles.th, ...styles.thRight }}>Today</th>
              <th style={{ ...styles.th, ...styles.thRight }}>Thru</th>
            </tr>
          </thead>
          <tbody>
            {activeRows.map((player, i) => {
              const total = calcTotalToPar(player.rounds);
              const today = getTodayScore(player);
              const thru =
                player.holes_played === 18
                  ? "F"
                  : player.holes_played === 0
                  ? "-"
                  : player.holes_played;
              const rowStyle =
                player.position === 1 ? styles.trHighlight : styles.tr;
              const fullName = `${player.first_name} ${player.last_name}`;

              return (
                <tr key={player.player_id} style={rowStyle}>
                  <td style={{ ...styles.td, ...styles.positionCell }}>
                    {player.position}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.playerName}>{fullName}</div>
                    <div style={styles.playerCountry}>{player.country}</div>
                  </td>
                  <td style={{ ...styles.td, ...styles.tdRight }}>
                    <ScoreDisplay score={total} />
                  </td>
                  <td style={{ ...styles.td, ...styles.tdRight, ...styles.todayCell }}>
                    <ScoreDisplay score={today} />
                  </td>
                  <td style={{ ...styles.td, ...styles.tdRight, ...styles.thruCell }}>
                    {thru}
                  </td>
                </tr>
              );
            })}

            {cutRows.length > 0 && (
              <tr>
                <td colSpan={5} style={styles.cutLine}>
                  ✂ Cut — {cutRows.length} players eliminated
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

function WeatherPanel() {
  const [weather, setWeather] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch(WEATHER_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setWeather({
          temp: `${Math.round(data.main.temp)}°F`,
          feelsLike: `${Math.round(data.main.feels_like)}°F`,
          description: data.weather[0].description
            .split(" ")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" "),
          humidity: `${data.main.humidity}%`,
          wind: `${Math.round(data.wind.speed)} mph`,
          icon: getWeatherIcon(data.weather[0].id),
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.weatherCard}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>
          Course Weather
          <span style={styles.cardTitleAccent} />
        </h2>
      </div>

      <div style={styles.weatherBody}>
        {loading && <div style={styles.loadingBox}>Loading...</div>}
        {error && <div style={styles.errorBox}>⚠ {error}</div>}

        {!loading && !error && weather && (
          <>
            <div style={styles.weatherMain}>
              <div style={styles.weatherIcon}>{weather.icon}</div>
              <div>
                <div style={styles.weatherTemp}>{weather.temp}</div>
                <div style={styles.weatherDesc}>{weather.description}</div>
                <div style={styles.weatherLocation}>Augusta, GA · Live</div>
              </div>
            </div>

            <div style={styles.weatherGrid}>
              <div style={styles.weatherStat}>
                <div style={styles.weatherStatLabel}>Wind</div>
                <div style={styles.weatherStatValue}>{weather.wind}</div>
              </div>
              <div style={styles.weatherStat}>
                <div style={styles.weatherStatLabel}>Humidity</div>
                <div style={styles.weatherStatValue}>{weather.humidity}</div>
              </div>
              <div style={styles.weatherStat}>
                <div style={styles.weatherStatLabel}>Feels Like</div>
                <div style={styles.weatherStatValue}>{weather.feelsLike}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MastersDashboard() {
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>The Masters Live Dashboard</h1>
        <p style={styles.headerSubtitle}>Augusta National Golf Club · April 2026</p>
        <span style={styles.badge}>● Live</span>
      </header>

      <main style={styles.main}>
        <Leaderboard />
        <WeatherPanel />
      </main>

      <footer style={styles.footer}>
        Augusta National Golf Club · Data via RapidAPI & OpenWeather
      </footer>
    </div>
  );
}
