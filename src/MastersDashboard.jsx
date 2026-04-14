import React, { useState, useEffect } from "react";

// ─── API Config ───────────────────────────────────────────────────────────────
const WEATHER_URL =
  `https://api.openweathermap.org/data/2.5/weather?q=Augusta,GA,US&units=imperial&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`;

const GOLF_URL =
  `https://golf-leaderboard-data.p.rapidapi.com/leaderboard/25`;

const RAPIDAPI_HEADERS = {
  "x-rapidapi-host": "golf-leaderboard-data.p.rapidapi.com",
  "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
};

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  green:      "#006747",
  greenDark:  "#004D35",
  yellow:     "#F5D130",
  azalea:     "#E8A0B0",
  blue:       "#1B3A6B",
  white:      "#FFFFFF",
  khaki:      "#C2B280",
  khakiLight: "#EDE8DA",
  red:        "#C0392B",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// The API does not populate player.total_to_par — sum from rounds[] instead
function totalScore(rounds = []) {
  return rounds.reduce((sum, r) => sum + (r.total_to_par || 0), 0);
}

function fmtScore(n) {
  if (n === null || n === undefined) return "-";
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
}

function weatherIcon(id) {
  if (!id) return "🌤";
  if (id >= 200 && id < 300) return "⛈";
  if (id >= 300 && id < 400) return "🌦";
  if (id >= 500 && id < 600) return "🌧";
  if (id >= 600 && id < 700) return "❄️";
  if (id >= 700 && id < 800) return "🌫";
  if (id === 800) return "☀️";
  return "⛅";
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function CardShell({ title, subtitle, children }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHead}>
        <h2 style={styles.cardTitle}>{title}</h2>
        {subtitle && <span style={styles.cardSub}>{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function Loading() {
  return <div style={styles.loading}>Loading...</div>;
}

function Err({ msg }) {
  return <div style={styles.err}>⚠ {msg}</div>;
}

function ScoreBadge({ score }) {
  const color = score < 0 ? C.green : score > 0 ? C.red : C.blue;
  return <span style={{ ...styles.score, color }}>{fmtScore(score)}</span>;
}

// ─── Leaderboard Section ──────────────────────────────────────────────────────

function LeaderboardSection({ data, tournament, loading, error }) {
  if (loading) return <Loading />;
  if (error)   return <Err msg={error} />;

  const active = data.filter((p) => p.status === "active");
  const cut    = data.filter((p) => p.status === "cut");

  return (
    <table style={styles.table}>
      <thead>
        <tr style={{ backgroundColor: C.khakiLight }}>
          <th style={styles.th}>Pos</th>
          <th style={styles.th}>Player</th>
          <th style={{ ...styles.th, textAlign: "right" }}>Total</th>
          <th style={{ ...styles.th, textAlign: "right" }}>Today</th>
          <th style={{ ...styles.th, textAlign: "right" }}>Thru</th>
        </tr>
      </thead>
      <tbody>
        {active.map((p) => {
          const total = totalScore(p.rounds);
          const todayRound = p.rounds.find((r) => r.round_number === p.current_round);
          const today = todayRound ? todayRound.total_to_par : null;
          const thru  = p.holes_played === 18 ? "F" : p.holes_played === 0 ? "-" : p.holes_played;
          const rowBg = p.position === 1 ? "#FFFBEA" : C.white;

          return (
            <tr key={p.player_id} style={{ ...styles.row, backgroundColor: rowBg }}>
              <td style={{ ...styles.td, ...styles.pos }}>{p.position}</td>
              <td style={styles.td}>
                <div style={styles.playerName}>{p.first_name} {p.last_name}</div>
                <div style={styles.playerSub}>{p.country}</div>
              </td>
              <td style={{ ...styles.td, textAlign: "right" }}>
                <ScoreBadge score={total} />
              </td>
              <td style={{ ...styles.td, textAlign: "right", opacity: 0.8 }}>
                <ScoreBadge score={today} />
              </td>
              <td style={{ ...styles.td, textAlign: "right", color: C.khaki, fontSize: "0.85rem" }}>
                {thru}
              </td>
            </tr>
          );
        })}

        {cut.length > 0 && (
          <tr>
            <td colSpan={5} style={styles.cutBar}>
              ✂ Cut — {cut.length} players eliminated
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// ─── Weather Section ──────────────────────────────────────────────────────────

function WeatherSection({ data, loading, error }) {
  if (loading) return <Loading />;
  if (error)   return <Err msg={error} />;
  if (!data)   return null;

  return (
    <div style={styles.weatherBody}>
      {/* Main temp row */}
      <div style={styles.weatherTop}>
        <span style={styles.weatherEmoji}>{data.icon}</span>
        <div>
          <div style={styles.weatherTemp}>{data.temp}</div>
          <div style={styles.weatherDesc}>{data.description}</div>
          <div style={styles.weatherLoc}>Augusta, GA · Live</div>
        </div>
      </div>

      {/* Stat grid */}
      <div style={styles.statGrid}>
        {[
          { label: "Wind",       value: data.wind      },
          { label: "Humidity",   value: data.humidity  },
          { label: "Feels Like", value: data.feelsLike },
        ].map(({ label, value }) => (
          <div key={label} style={styles.statBox}>
            <div style={styles.statLabel}>{label}</div>
            <div style={styles.statValue}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MastersDashboard() {

  // ── Weather state ──
  const [weather,        setWeather]        = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError,   setWeatherError]   = useState(null);

  // ── Leaderboard state ──
  const [leaderboard,        setLeaderboard]        = useState([]);
  const [tournament,         setTournament]          = useState(null);
  const [boardLoading,       setBoardLoading]        = useState(true);
  const [boardError,         setBoardError]          = useState(null);

  // ── Fetch both on mount ──
  useEffect(() => {

    // 1. Weather fetch
    fetch(WEATHER_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Weather API ${res.status}`);
        return res.json();
      })
      .then((d) => {
        setWeather({
          temp:        `${Math.round(d.main.temp)}°F`,
          feelsLike:   `${Math.round(d.main.feels_like)}°F`,
          humidity:    `${d.main.humidity}%`,
          wind:        `${Math.round(d.wind.speed)} mph`,
          description: d.weather[0].description
            .split(" ")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" "),
          icon: weatherIcon(d.weather[0].id),
        });
      })
      .catch((e) => setWeatherError(e.message))
      .finally(() => setWeatherLoading(false));

    // 2. Golf leaderboard fetch
    fetch(GOLF_URL, { method: "GET", headers: RAPIDAPI_HEADERS })
      .then((res) => {
        if (!res.ok) throw new Error(`Golf API ${res.status}`);
        return res.json();
      })
      .then((d) => {
        setTournament(d.results.tournament);
        setLeaderboard(d.results.leaderboard);
      })
      .catch((e) => setBoardError(e.message))
      .finally(() => setBoardLoading(false));

  }, []); // empty array = run once on mount

  // ── Round subtitle ──
  const roundLabel = tournament
    ? `Round ${tournament.live_details.current_round} · ${
        tournament.live_details.status === "completed"   ? "Final"       :
        tournament.live_details.status === "inprogress"  ? "In Progress" :
        tournament.live_details.status
      }`
    : null;

  // ── Render ──
  return (
    <div style={styles.page}>

      {/* ── Header ── */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>The Masters Live Dashboard</h1>
        <p style={styles.headerSub}>Augusta National Golf Club · April 2026</p>
        <span style={styles.liveBadge}>● Live</span>
      </header>

      {/* ── Two-column layout ── */}
      <main style={styles.main}>

        {/* Left: leaderboard */}
        <CardShell
          title={tournament ? tournament.name : "Leaderboard"}
          subtitle={roundLabel}
        >
          <LeaderboardSection
            data={leaderboard}
            tournament={tournament}
            loading={boardLoading}
            error={boardError}
          />
        </CardShell>

        {/* Right: weather */}
        <CardShell title="Course Weather">
          <WeatherSection
            data={weather}
            loading={weatherLoading}
            error={weatherError}
          />
        </CardShell>

      </main>

      <footer style={styles.footer}>
        Augusta National Golf Club · Data via RapidAPI &amp; OpenWeather
      </footer>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  page: {
    fontFamily: "'Georgia', serif",
    backgroundColor: C.khakiLight,
    minHeight: "100vh",
    color: C.blue,
  },
  header: {
    backgroundColor: C.green,
    color: C.white,
    textAlign: "center",
    padding: "24px 16px 16px",
    borderBottom: `6px solid ${C.yellow}`,
  },
  headerTitle: {
    fontSize: "2.4rem",
    fontWeight: "bold",
    letterSpacing: "0.05em",
    margin: 0,
  },
  headerSub: {
    fontSize: "0.9rem",
    color: C.khaki,
    marginTop: "6px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  liveBadge: {
    display: "inline-block",
    backgroundColor: C.yellow,
    color: C.blue,
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "3px 12px",
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
    gridTemplateColumns: "1fr 360px",
    gap: "24px",
    alignItems: "start",
  },
  card: {
    backgroundColor: C.white,
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.09)",
    overflow: "hidden",
  },
  cardHead: {
    backgroundColor: C.green,
    color: C.white,
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: "bold",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  cardSub: {
    fontSize: "0.75rem",
    color: C.khaki,
    letterSpacing: "0.05em",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: C.green,
    fontSize: "0.95rem",
    letterSpacing: "0.08em",
  },
  err: {
    textAlign: "center",
    padding: "24px",
    color: C.red,
    fontSize: "0.9rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "9px 16px",
    textAlign: "left",
    fontSize: "0.72rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: C.green,
    borderBottom: `2px solid ${C.khaki}`,
  },
  row: {
    borderBottom: `1px solid ${C.khakiLight}`,
  },
  td: {
    padding: "11px 16px",
    fontSize: "0.93rem",
  },
  pos: {
    fontWeight: "bold",
    color: C.green,
    width: "36px",
  },
  score: {
    fontWeight: "bold",
    fontSize: "1rem",
  },
  playerName: {
    fontWeight: "bold",
    color: C.blue,
  },
  playerSub: {
    fontSize: "0.75rem",
    color: C.khaki,
    marginTop: "2px",
  },
  cutBar: {
    backgroundColor: C.azalea,
    textAlign: "center",
    padding: "5px 16px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: C.blue,
  },
  weatherBody: {
    padding: "20px",
  },
  weatherTop: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    paddingBottom: "20px",
    marginBottom: "20px",
    borderBottom: `1px solid ${C.khakiLight}`,
  },
  weatherEmoji: {
    fontSize: "3.5rem",
    lineHeight: 1,
  },
  weatherTemp: {
    fontSize: "2.4rem",
    fontWeight: "bold",
    color: C.blue,
    lineHeight: 1,
  },
  weatherDesc: {
    fontSize: "0.95rem",
    color: C.green,
    marginTop: "4px",
    fontStyle: "italic",
  },
  weatherLoc: {
    fontSize: "0.75rem",
    color: C.khaki,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginTop: "4px",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  statBox: {
    backgroundColor: C.khakiLight,
    borderRadius: "6px",
    padding: "10px 12px",
  },
  statLabel: {
    fontSize: "0.68rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: C.khaki,
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: C.blue,
  },
  footer: {
    backgroundColor: C.greenDark,
    color: C.khaki,
    textAlign: "center",
    padding: "14px",
    fontSize: "0.78rem",
    letterSpacing: "0.06em",
  },
};
