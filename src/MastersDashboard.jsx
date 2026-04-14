import React, { useState, useEffect } from "react";

// ─── API Config ───────────────────────────────────────────────────────────────
const OPENWEATHER_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
const RAPIDAPI_KEY    = process.env.REACT_APP_RAPIDAPI_KEY;

// 2026 PGA Championship — Quail Hollow Club, Charlotte, NC
const WEATHER_URL =
  `https://api.openweathermap.org/data/2.5/weather?q=Charlotte,NC,US&units=imperial&appid=${OPENWEATHER_KEY}`;

const GOLF_URL = `https://golf-leaderboard-data.p.rapidapi.com/leaderboard/25`;

const RAPIDAPI_HEADERS = {
  "x-rapidapi-host": "golf-leaderboard-data.p.rapidapi.com",
  "x-rapidapi-key": RAPIDAPI_KEY,
};

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  azure:      "#003C80",   // Dark Azure — primary
  azureDark:  "#002660",   // deeper azure for gradient
  azureMid:   "#004499",   // mid azure for hover states
  red:        "#F1373D",   // Shiny Red — accent
  redDark:    "#C42D32",   // darker red for over-par scores
  white:      "#FFFFFF",   // Full White
  pageBg:     "#EEF2FA",   // very light azure tint — page background
  border:     "#D0DBEE",   // light blue border
  rowAlt:     "#F5F8FD",   // subtle alternate row
  silver:     "#7A8CA8",   // blue-grey muted text
  textDark:   "#0D1F3C",   // near-black for body text
  scoreUnder: "#0055C8",   // bright azure for under-par
};

// ─── Keyframe injection ────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes pulse {
    0%, 100% { opacity: 1;   transform: scale(1);    }
    50%       { opacity: 0.3; transform: scale(0.75); }
  }
  @keyframes fadein {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .lb-row { animation: fadein 0.3s ease both; }
  .lb-row:hover { background-color: #E8EFF9 !important; }
  .refresh-btn:hover { background-color: rgba(255,255,255,0.25) !important; }
  .refresh-btn:active { transform: scale(0.93); }
  .refresh-btn.spinning svg { animation: spin 0.7s linear infinite; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function totalScore(rounds = []) {
  return rounds.reduce((sum, r) => sum + (r.total_to_par || 0), 0);
}

function fmtScore(n) {
  if (n === null || n === undefined) return "-";
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
}

function weatherIcon(id) {
  if (!id)                   return "🌤";
  if (id >= 200 && id < 300) return "⛈";
  if (id >= 300 && id < 400) return "🌦";
  if (id >= 500 && id < 600) return "🌧";
  if (id >= 600 && id < 700) return "❄️";
  if (id >= 700 && id < 800) return "🌫";
  if (id === 800)             return "☀️";
  return "⛅";
}

// ─── Shared UI Primitives ─────────────────────────────────────────────────────

function RefreshButton({ onClick, spinning }) {
  return (
    <button
      className={`refresh-btn${spinning ? " spinning" : ""}`}
      onClick={onClick}
      title="Refresh"
      style={S.refreshBtn}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    </button>
  );
}

function Card({ title, subtitle, accent, children, onRefresh, refreshing }) {
  return (
    <div style={S.card}>
      <div style={{ height: 4, backgroundColor: accent || C.red }} />
      <div style={S.cardHead}>
        <div>
          <h2 style={S.cardTitle}>{title}</h2>
          {subtitle && <span style={S.cardSub}>{subtitle}</span>}
        </div>
        {onRefresh && <RefreshButton onClick={onRefresh} spinning={refreshing} />}
      </div>
      {children}
    </div>
  );
}

function Loading() {
  const dotStyle = (delay) => ({
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: C.azure,
    margin: "0 4px",
    animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
  });
  return (
    <div style={S.loadingWrap}>
      <span style={dotStyle(0)} />
      <span style={dotStyle(0.2)} />
      <span style={dotStyle(0.4)} />
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div style={S.errWrap}>
      <div style={S.errIcon}>⚠</div>
      <div style={S.errText}>{msg}</div>
    </div>
  );
}

function ScorePill({ score }) {
  if (score === null || score === undefined) {
    return <span style={{ ...S.pill, backgroundColor: "#D8E2EF", color: C.silver }}>–</span>;
  }
  const bg    = score < 0 ? C.scoreUnder : score > 0 ? C.redDark : "#4A6080";
  const label = fmtScore(score);
  return <span style={{ ...S.pill, backgroundColor: bg, color: C.white }}>{label}</span>;
}

function PosBadge({ position }) {
  const medal = position === 1 ? { bg: "#C9963A", color: C.white }
              : position === 2 ? { bg: "#9E9E9E", color: C.white }
              : position === 3 ? { bg: "#A0744C", color: C.white }
              : null;

  if (medal) {
    return (
      <span style={{ ...S.posBadge, backgroundColor: medal.bg, color: medal.color }}>
        {position}
      </span>
    );
  }
  return <span style={S.posPlain}>{position}</span>;
}

// ─── Leaderboard Section ──────────────────────────────────────────────────────

function LeaderboardSection({ data, loading, error }) {
  if (loading) return <Loading />;
  if (error)   return <ErrorMsg msg={error} />;

  const active = data.filter((p) => p.status === "active");
  const cut    = data.filter((p) => p.status === "cut");

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={S.table}>
        <thead>
          <tr style={{ backgroundColor: "#E4ECF7" }}>
            <th style={{ ...S.th, width: 52 }}>Pos</th>
            <th style={S.th}>Player</th>
            <th style={{ ...S.th, textAlign: "center", width: 76 }}>Total</th>
            <th style={{ ...S.th, textAlign: "center", width: 76 }}>Today</th>
            <th style={{ ...S.th, textAlign: "center", width: 60 }}>Thru</th>
          </tr>
        </thead>
        <tbody>
          {active.map((p, i) => {
            const total      = totalScore(p.rounds);
            const todayRound = p.rounds.find((r) => r.round_number === p.current_round);
            const today      = todayRound ? todayRound.total_to_par : null;
            const thru       = p.holes_played === 18 ? "F"
                             : p.holes_played === 0  ? "–"
                             : p.holes_played;
            const isLeader   = p.position === 1;
            const rowBg      = isLeader ? "#EAF0FB" : i % 2 === 0 ? C.white : C.rowAlt;

            return (
              <tr
                key={p.player_id}
                className="lb-row"
                style={{ ...S.row, backgroundColor: rowBg, animationDelay: `${i * 0.04}s` }}
              >
                <td style={{ ...S.td, textAlign: "center" }}>
                  <PosBadge position={p.position} />
                </td>
                <td style={S.td}>
                  <div style={S.playerName}>{p.first_name} {p.last_name}</div>
                  <div style={S.playerSub}>{p.country}</div>
                </td>
                <td style={{ ...S.td, textAlign: "center" }}>
                  <ScorePill score={total} />
                </td>
                <td style={{ ...S.td, textAlign: "center", opacity: 0.85 }}>
                  <ScorePill score={today} />
                </td>
                <td style={{ ...S.td, textAlign: "center", color: C.silver, fontSize: "0.85rem", fontWeight: 600 }}>
                  {thru}
                </td>
              </tr>
            );
          })}

          {cut.length > 0 && (
            <tr>
              <td colSpan={5} style={S.cutBar}>
                ✂&nbsp;&nbsp;Cut — {cut.length} players eliminated
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Weather Section ──────────────────────────────────────────────────────────

function WeatherSection({ data, loading, error }) {
  if (loading) return <Loading />;
  if (error)   return <ErrorMsg msg={error} />;
  if (!data)   return null;

  const stats = [
    { icon: "💨", label: "Wind",       value: data.wind      },
    { icon: "💧", label: "Humidity",   value: data.humidity  },
    { icon: "🌡️", label: "Feels Like", value: data.feelsLike },
  ];

  return (
    <div style={S.weatherBody}>
      <div style={S.weatherHero}>
        <div style={S.weatherEmoji}>{data.icon}</div>
        <div style={S.weatherInfo}>
          <div style={S.weatherTemp}>{data.temp}</div>
          <div style={S.weatherDesc}>{data.description}</div>
          <div style={S.weatherLoc}>📍 Charlotte, NC &nbsp;·&nbsp; Live</div>
        </div>
      </div>
      <div style={S.divider} />
      <div style={S.statGrid}>
        {stats.map(({ icon, label, value }) => (
          <div key={label} style={S.statTile}>
            <div style={S.statIcon}>{icon}</div>
            <div style={S.statValue}>{value}</div>
            <div style={S.statLabel}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MastersDashboard() {

  const [weather,        setWeather]        = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError,   setWeatherError]   = useState(null);

  const [leaderboard,  setLeaderboard]  = useState([]);
  const [tournament,   setTournament]   = useState(null);
  const [boardLoading, setBoardLoading] = useState(true);
  const [boardError,   setBoardError]   = useState(null);

  const [refreshCount, setRefreshCount] = useState(0);

  function refresh() {
    setWeatherLoading(true);
    setWeatherError(null);
    setBoardLoading(true);
    setBoardError(null);
    setRefreshCount((n) => n + 1);
  }

  useEffect(() => {

    // 1. Weather
    if (!OPENWEATHER_KEY) {
      setWeatherError("REACT_APP_OPENWEATHER_KEY is not set. Add it to .env or the Netlify dashboard.");
      setWeatherLoading(false);
    } else {
      fetch(WEATHER_URL)
        .then((res) => {
          if (res.status === 401) throw new Error("Invalid OpenWeather API key (401).");
          if (!res.ok)            throw new Error(`Weather API error: ${res.status}`);
          return res.json();
        })
        .then((d) => {
          setWeather({
            temp:        `${Math.round(d.main.temp)}°F`,
            feelsLike:   `${Math.round(d.main.feels_like)}°F`,
            humidity:    `${d.main.humidity}%`,
            wind:        `${Math.round(d.wind.speed)} mph`,
            description: d.weather[0].description
              .split(" ").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
            icon: weatherIcon(d.weather[0].id),
          });
        })
        .catch((e) => setWeatherError(e.message))
        .finally(() => setWeatherLoading(false));
    }

    // 2. Golf leaderboard
    if (!RAPIDAPI_KEY) {
      setBoardError("REACT_APP_RAPIDAPI_KEY is not set. Add it to .env or the Netlify dashboard.");
      setBoardLoading(false);
    } else {
      fetch(GOLF_URL, { method: "GET", headers: RAPIDAPI_HEADERS })
        .then((res) => {
          if (res.status === 403) throw new Error("RapidAPI key rejected (403). Confirm your Golf Leaderboard subscription at rapidapi.com.");
          if (res.status === 401) throw new Error("RapidAPI key invalid (401).");
          if (!res.ok)            throw new Error(`Golf API error: ${res.status}`);
          return res.json();
        })
        .then((d) => {
          setTournament(d.results.tournament);
          setLeaderboard(d.results.leaderboard);
        })
        .catch((e) => setBoardError(e.message))
        .finally(() => setBoardLoading(false));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCount]);

  const roundLabel = tournament
    ? `Round ${tournament.live_details.current_round} of ${tournament.live_details.total_rounds} · ${
        tournament.live_details.status === "completed"  ? "Final"       :
        tournament.live_details.status === "inprogress" ? "In Progress" :
        tournament.live_details.status
      }`
    : null;

  return (
    <div style={S.page}>
      <style>{KEYFRAMES}</style>

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <p style={S.headerEyebrow}>Quail Hollow Club · Charlotte, NC</p>
          <h1 style={S.headerTitle}>PGA Golf Live Leaderboard</h1>
          <p style={S.headerYear}>May 2026</p>
          <span style={S.liveBadge}>
            <span style={S.liveDot} />
            Live
          </span>
        </div>
      </header>

      {/* ── Body ── */}
      <main style={S.main}>

        <Card
          title={tournament ? tournament.name : "Leaderboard"}
          subtitle={roundLabel}
          accent={C.red}
          onRefresh={refresh}
          refreshing={boardLoading}
        >
          <LeaderboardSection
            data={leaderboard}
            loading={boardLoading}
            error={boardError}
          />
        </Card>

        <div style={S.sidebar}>
          <Card
            title="Course Weather"
            accent={C.red}
            onRefresh={refresh}
            refreshing={weatherLoading}
          >
            <WeatherSection
              data={weather}
              loading={weatherLoading}
              error={weatherError}
            />
          </Card>
        </div>

      </main>

      <footer style={S.footer}>
        <span>Quail Hollow Club</span>
        <span style={S.footerDot}>·</span>
        <span>Weather by OpenWeather</span>
        <span style={S.footerDot}>·</span>
        <span>Scores by RapidAPI</span>
      </footer>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  page: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: C.pageBg,
    minHeight: "100vh",
    color: C.textDark,
  },

  // Header
  header: {
    background: `linear-gradient(160deg, ${C.azureDark} 0%, ${C.azure} 100%)`,
    borderBottom: `5px solid ${C.red}`,
    padding: "40px 20px 32px",
    textAlign: "center",
  },
  headerInner: {
    maxWidth: 700,
    margin: "0 auto",
  },
  headerEyebrow: {
    margin: "0 0 8px",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
  },
  headerTitle: {
    margin: 0,
    fontFamily: "Georgia, serif",
    fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
    fontWeight: "bold",
    letterSpacing: "0.03em",
    color: C.white,
    lineHeight: 1.2,
  },
  headerYear: {
    margin: "8px 0 16px",
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.06em",
  },
  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: C.white,
    fontSize: "0.72rem",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 20,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    backgroundColor: C.red,
    display: "inline-block",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  // Layout
  main: {
    maxWidth: 1160,
    margin: "0 auto",
    padding: "32px 20px",
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 24,
    alignItems: "start",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  // Card
  card: {
    backgroundColor: C.white,
    borderRadius: 12,
    boxShadow: "0 4px 6px rgba(0,60,128,0.06), 0 10px 30px rgba(0,60,128,0.10)",
    overflow: "hidden",
    border: `1px solid ${C.border}`,
  },
  cardHead: {
    backgroundColor: C.azure,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    margin: 0,
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: C.white,
  },
  cardSub: {
    display: "block",
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.6)",
    marginTop: 3,
    letterSpacing: "0.05em",
  },
  refreshBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 6,
    color: C.white,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 8px",
    transition: "background 0.15s, transform 0.1s",
    flexShrink: 0,
  },

  // Loading
  loadingWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px 20px",
    gap: 4,
  },

  // Error
  errWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 24px",
    gap: 10,
  },
  errIcon: {
    fontSize: "1.6rem",
  },
  errText: {
    color: C.red,
    fontSize: "0.85rem",
    textAlign: "center",
    lineHeight: 1.5,
    maxWidth: 360,
  },

  // Table
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "0.68rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: C.silver,
    borderBottom: `2px solid ${C.border}`,
    whiteSpace: "nowrap",
  },
  row: {
    borderBottom: `1px solid ${C.border}`,
    transition: "background 0.15s",
  },
  td: {
    padding: "12px 14px",
    fontSize: "0.93rem",
    verticalAlign: "middle",
  },

  // Position badges
  posBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    borderRadius: "50%",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  posPlain: {
    display: "inline-block",
    fontSize: "0.88rem",
    fontWeight: 700,
    color: C.azure,
    width: 26,
    textAlign: "center",
  },

  // Score pill
  pill: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: "0.8rem",
    fontWeight: 700,
    minWidth: 40,
    textAlign: "center",
    letterSpacing: "0.02em",
  },

  // Player
  playerName: {
    fontWeight: 600,
    color: C.textDark,
    fontSize: "0.93rem",
  },
  playerSub: {
    fontSize: "0.72rem",
    color: C.silver,
    marginTop: 2,
    fontWeight: 500,
    letterSpacing: "0.04em",
  },

  // Cut bar
  cutBar: {
    backgroundColor: C.red,
    textAlign: "center",
    padding: "7px 16px",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: C.white,
  },

  // Weather
  weatherBody: {
    padding: "24px 20px 20px",
  },
  weatherHero: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 4,
  },
  weatherEmoji: {
    fontSize: "4rem",
    lineHeight: 1,
    flexShrink: 0,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: "3rem",
    fontWeight: 700,
    color: C.azure,
    lineHeight: 1,
    fontFamily: "Georgia, serif",
  },
  weatherDesc: {
    fontSize: "1rem",
    color: C.azure,
    marginTop: 4,
    fontStyle: "italic",
    fontFamily: "Georgia, serif",
    opacity: 0.75,
  },
  weatherLoc: {
    fontSize: "0.72rem",
    color: C.silver,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginTop: 6,
    fontWeight: 600,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    margin: "20px 0",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },
  statTile: {
    backgroundColor: C.pageBg,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "14px 10px",
    textAlign: "center",
  },
  statIcon: {
    fontSize: "1.3rem",
    marginBottom: 6,
    lineHeight: 1,
  },
  statValue: {
    fontSize: "1rem",
    fontWeight: 700,
    color: C.azure,
    lineHeight: 1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: C.silver,
    fontWeight: 600,
  },

  // Footer
  footer: {
    backgroundColor: C.azureDark,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    padding: "16px 20px",
    fontSize: "0.75rem",
    letterSpacing: "0.05em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0 10px",
  },
  footerDot: {
    color: C.red,
    fontWeight: "bold",
  },
};
