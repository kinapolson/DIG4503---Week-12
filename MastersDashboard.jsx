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
    transition: "background 0.15s",
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

// --- Placeholder data ---
const leaderboardData = [
  { pos: 1,  name: "Scottie Scheffler",  country: "USA",   total: -12, today: -4, thru: 18 },
  { pos: 2,  name: "Rory McIlroy",       country: "NIR",   total: -10, today: -3, thru: 14 },
  { pos: 3,  name: "Collin Morikawa",    country: "USA",   total: -9,  today: -2, thru: 18 },
  { pos: 4,  name: "Ludvig Åberg",       country: "SWE",   total: -8,  today: -1, thru: 16 },
  { pos: 5,  name: "Tommy Fleetwood",    country: "ENG",   total: -7,  today:  0, thru: 18 },
  { pos: 6,  name: "Xander Schauffele",  country: "USA",   total: -6,  today: +1, thru: 18 },
  { pos: 7,  name: "Jon Rahm",           country: "ESP",   total: -5,  today: +2, thru: 12 },
  { pos: 8,  name: "Brooks Koepka",      country: "USA",   total: -4,  today:  0, thru: 18 },
  { pos: "CUT", name: "— Cut Line —",   country: "",      total: "+1", today: "", thru: "" },
  { pos: 9,  name: "Patrick Reed",       country: "USA",   total: +2,  today: +3, thru: 18 },
];

const weatherData = {
  temp: "74°F",
  description: "Partly Cloudy",
  location: "Augusta, GA",
  icon: "⛅",
  wind: "12 mph SW",
  humidity: "58%",
  feelsLike: "76°F",
  forecast: "Sunny",
};

function ScoreDisplay({ score }) {
  if (typeof score !== "number") return <span style={styles.scoreEven}>{score}</span>;
  if (score < 0) return <span style={styles.scoreUnder}>{score}</span>;
  if (score > 0) return <span style={styles.scoreOver}>+{score}</span>;
  return <span style={styles.scoreEven}>E</span>;
}

function Leaderboard() {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>
          Leaderboard
          <span style={styles.cardTitleAccent} />
        </h2>
        <span style={{ fontSize: "0.78rem", color: COLORS.khaki, letterSpacing: "0.06em" }}>
          Round 4 · In Progress
        </span>
      </div>

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
          {leaderboardData.map((player, i) => {
            if (player.pos === "CUT") {
              return (
                <tr key="cut">
                  <td colSpan={5} style={styles.cutLine}>
                    ✂ Projected Cut Line
                  </td>
                </tr>
              );
            }
            const rowStyle = player.pos === 1 ? styles.trHighlight : styles.tr;
            return (
              <tr key={i} style={rowStyle}>
                <td style={{ ...styles.td, ...styles.positionCell }}>{player.pos}</td>
                <td style={styles.td}>
                  <div style={styles.playerName}>{player.name}</div>
                  <div style={styles.playerCountry}>{player.country}</div>
                </td>
                <td style={{ ...styles.td, ...styles.tdRight }}>
                  <ScoreDisplay score={player.total} />
                </td>
                <td style={{ ...styles.td, ...styles.tdRight, ...styles.todayCell }}>
                  <ScoreDisplay score={player.today} />
                </td>
                <td style={{ ...styles.td, ...styles.tdRight, ...styles.thruCell }}>
                  {player.thru === 18 ? "F" : player.thru}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function WeatherPanel() {
  return (
    <div style={styles.weatherCard}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>
          Course Weather
          <span style={styles.cardTitleAccent} />
        </h2>
      </div>

      <div style={styles.weatherBody}>
        <div style={styles.weatherMain}>
          <div style={styles.weatherIcon}>{weatherData.icon}</div>
          <div>
            <div style={styles.weatherTemp}>{weatherData.temp}</div>
            <div style={styles.weatherDesc}>{weatherData.description}</div>
            <div style={styles.weatherLocation}>{weatherData.location}</div>
          </div>
        </div>

        <div style={styles.weatherGrid}>
          <div style={styles.weatherStat}>
            <div style={styles.weatherStatLabel}>Wind</div>
            <div style={styles.weatherStatValue}>{weatherData.wind}</div>
          </div>
          <div style={styles.weatherStat}>
            <div style={styles.weatherStatLabel}>Humidity</div>
            <div style={styles.weatherStatValue}>{weatherData.humidity}</div>
          </div>
          <div style={styles.weatherStat}>
            <div style={styles.weatherStatLabel}>Feels Like</div>
            <div style={styles.weatherStatValue}>{weatherData.feelsLike}</div>
          </div>
          <div style={styles.weatherStat}>
            <div style={styles.weatherStatLabel}>Forecast</div>
            <div style={styles.weatherStatValue}>{weatherData.forecast}</div>
          </div>
        </div>
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
        Augusta National Golf Club · All scores are placeholder data
      </footer>
    </div>
  );
}
