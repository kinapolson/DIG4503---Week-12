import React, { useState, useEffect } from "react";

// ─── API Config ────────────────────────────────────────────────────────────────
const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
const TOURNAMENT_ID = "25";
const GOLF_URL = `https://golf-leaderboard-data.p.rapidapi.com/leaderboard/${TOURNAMENT_ID}`;

// ─── Mock Data ─────────────────────────────────────────────────────────────────
// This is the exact sample response from RapidAPI.
// When RAPIDAPI_KEY is a real key, swap useMockData to false and live fetch kicks in.
const USE_MOCK_DATA = true;

const MOCK_RESPONSE = {
  results: {
    tournament: {
      name: "PGA Championship",
      course: "TPC Harding Park",
      live_details: {
        status: "completed",
        current_round: 4,
        total_rounds: 4,
      },
    },
    leaderboard: [
      {
        position: 1,
        player_id: 151591,
        first_name: "Collin",
        last_name: "Morikawa",
        country: "USA",
        holes_played: 18,
        current_round: 4,
        status: "active",
        rounds: [
          { round_number: 1, total_to_par: -1 },
          { round_number: 2, total_to_par: -1 },
          { round_number: 3, total_to_par: -5 },
          { round_number: 4, total_to_par: -6 },
        ],
      },
      {
        position: 2,
        player_id: 92791,
        first_name: "Dustin",
        last_name: "Johnson",
        country: "USA",
        holes_played: 18,
        current_round: 4,
        status: "active",
        rounds: [
          { round_number: 1, total_to_par: -1 },
          { round_number: 2, total_to_par: -3 },
          { round_number: 3, total_to_par: -5 },
          { round_number: 4, total_to_par: -2 },
        ],
      },
      {
        position: 2,
        player_id: 76108,
        first_name: "Paul",
        last_name: "Casey",
        country: "ENG",
        holes_played: 18,
        current_round: 4,
        status: "active",
        rounds: [
          { round_number: 1, total_to_par: -2 },
          { round_number: 2, total_to_par: -3 },
          { round_number: 3, total_to_par: -2 },
          { round_number: 4, total_to_par: -4 },
        ],
      },
      {
        position: 4,
        player_id: 138154,
        first_name: "Scottie",
        last_name: "Scheffler",
        country: "USA",
        holes_played: 18,
        current_round: 4,
        status: "active",
        rounds: [
          { round_number: 1, total_to_par: -4 },
          { round_number: 2, total_to_par: 1 },
          { round_number: 3, total_to_par: -5 },
          { round_number: 4, total_to_par: -2 },
        ],
      },
      {
        position: 4,
        player_id: 89191,
        first_name: "Tony",
        last_name: "Finau",
        country: "USA",
        holes_played: 18,
        current_round: 4,
        status: "active",
        rounds: [
          { round_number: 1, total_to_par: -3 },
          { round_number: 2, total_to_par: 0 },
          { round_number: 3, total_to_par: -3 },
          { round_number: 4, total_to_par: -4 },
        ],
      },
      {
        position: 4,
        player_id: 26395,
        first_name: "Tiger",
        last_name: "Woods",
        country: "USA",
        holes_played: 18,
        current_round: 4,
        status: "active",
        rounds: [
          { round_number: 1, total_to_par: -2 },
          { round_number: 2, total_to_par: 2 },
          { round_number: 3, total_to_par: 2 },
          { round_number: 4, total_to_par: -3 },
        ],
      },
      {
        position: 9,
        player_id: 67231,
        first_name: "Justin",
        last_name: "Rose",
        country: "ENG",
        holes_played: 18,
        current_round: 4,
        status: "active",
        rounds: [
          { round_number: 1, total_to_par: -4 },
          { round_number: 2, total_to_par: -2 },
          { round_number: 3, total_to_par: 0 },
          { round_number: 4, total_to_par: -3 },
        ],
      },
      {
        position: 10,
        player_id: 144259,
        first_name: "Xander",
        last_name: "Schauffele",
        country: "USA",
        holes_played: 18,
        current_round: 4,
        status: "active",
        rounds: [
          { round_number: 1, total_to_par: -4 },
          { round_number: 2, total_to_par: 0 },
          { round_number: 3, total_to_par: -1 },
          { round_number: 4, total_to_par: -3 },
        ],
      },
      {
        position: 80,
        player_id: 136582,
        first_name: "Christiaan",
        last_name: "Bezuidenhout",
        country: "RSA",
        holes_played: 0,
        current_round: 4,
        status: "cut",
        rounds: [
          { round_number: 1, total_to_par: 2 },
          { round_number: 2, total_to_par: 0 },
        ],
      },
      {
        position: 84,
        player_id: 96322,
        first_name: "Rickie",
        last_name: "Fowler",
        country: "USA",
        holes_played: 0,
        current_round: 4,
        status: "cut",
        rounds: [
          { round_number: 1, total_to_par: 3 },
          { round_number: 2, total_to_par: -1 },
        ],
      },
    ],
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

// total_to_par at the player level is 0 in the API response (not populated).
// Calculate it by summing each round's total_to_par instead.
function calcTotal(rounds) {
  return rounds.reduce((sum, r) => sum + (r.total_to_par || 0), 0);
}

function formatScore(score) {
  if (score === null || score === undefined) return "-";
  if (score === 0) return "E";
  return score > 0 ? `+${score}` : `${score}`;
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const COLORS = {
  mastersGreen: "#006747",
  yellow: "#F5D130",
  azalea: "#E8A0B0",
  deepBlue: "#1B3A6B",
  white: "#FFFFFF",
  khaki: "#C2B280",
  lightKhaki: "#EDE8DA",
};

const s = {
  wrapper: {
    fontFamily: "'Georgia', serif",
    backgroundColor: COLORS.white,
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
    overflow: "hidden",
    maxWidth: "700px",
    margin: "0 auto",
  },
  header: {
    backgroundColor: COLORS.mastersGreen,
    color: COLORS.white,
    padding: "14px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: "bold",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: "0.78rem",
    color: COLORS.khaki,
    letterSpacing: "0.05em",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    backgroundColor: COLORS.lightKhaki,
  },
  th: {
    padding: "9px 16px",
    textAlign: "left",
    fontSize: "0.72rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: COLORS.mastersGreen,
    borderBottom: `2px solid ${COLORS.khaki}`,
  },
  thCenter: {
    textAlign: "center",
  },
  row: {
    borderBottom: `1px solid ${COLORS.lightKhaki}`,
    transition: "background 0.15s",
  },
  rowLeader: {
    borderBottom: `1px solid ${COLORS.lightKhaki}`,
    backgroundColor: "#FFF9E6",
  },
  td: {
    padding: "11px 16px",
    fontSize: "0.95rem",
    color: COLORS.deepBlue,
  },
  tdCenter: {
    textAlign: "center",
  },
  pos: {
    fontWeight: "bold",
    color: COLORS.mastersGreen,
    width: "36px",
  },
  name: {
    fontWeight: "bold",
  },
  country: {
    fontSize: "0.75rem",
    color: COLORS.khaki,
    marginTop: "2px",
  },
  scoreUnder: {
    fontWeight: "bold",
    color: COLORS.mastersGreen,
  },
  scoreOver: {
    fontWeight: "bold",
    color: "#C0392B",
  },
  scoreEven: {
    fontWeight: "bold",
    color: COLORS.deepBlue,
  },
  cutRow: {
    backgroundColor: COLORS.azalea,
    textAlign: "center",
    padding: "5px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: COLORS.deepBlue,
  },
  center: {
    textAlign: "center",
    padding: "36px 20px",
    fontSize: "0.95rem",
    color: COLORS.mastersGreen,
    letterSpacing: "0.06em",
  },
  error: {
    textAlign: "center",
    padding: "24px",
    color: "#C0392B",
    fontSize: "0.9rem",
  },
};

// ─── Score Cell ────────────────────────────────────────────────────────────────

function ScoreCell({ score }) {
  const style =
    score < 0 ? s.scoreUnder : score > 0 ? s.scoreOver : s.scoreEven;
  return <span style={style}>{formatScore(score)}</span>;
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function GolfLeaderboard() {
  // ── state ──
  const [players, setPlayers] = useState([]);       // full leaderboard array
  const [tournament, setTournament] = useState(null); // tournament meta
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── fetch ──
  useEffect(() => {
    // Swap USE_MOCK_DATA to false once you have a real RAPIDAPI_KEY in .env
    if (USE_MOCK_DATA) {
      // Simulate network delay so the loading state is visible
      const timer = setTimeout(() => {
        setTournament(MOCK_RESPONSE.results.tournament);
        setPlayers(MOCK_RESPONSE.results.leaderboard);
        setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }

    // ── live fetch ──
    // API response shape:
    //   data.results.tournament → tournament metadata
    //   data.results.leaderboard → array of player objects
    //
    // Player fields we use:
    //   player.position          → ranking (integer; tied players share same value)
    //   player.first_name        → first name
    //   player.last_name         → last name
    //   player.country           → country code (e.g. "USA")
    //   player.rounds[]          → array of round objects
    //   rounds[].total_to_par    → score for that round (note: player.total_to_par is 0
    //                              in the API response and must be summed from rounds)
    //   player.holes_played      → 0 = not started, 18 = finished, 1–17 = in progress
    //   player.status            → "active" | "cut" | "wd" | "dsq"
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
        setTournament(data.results.tournament);
        setPlayers(data.results.leaderboard);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ── split active vs cut ──
  const activePlayers = players.filter((p) => p.status === "active");
  const cutPlayers = players.filter((p) => p.status === "cut");

  const roundInfo = tournament
    ? `Round ${tournament.live_details.current_round} / ${tournament.live_details.total_rounds} · ${
        tournament.live_details.status === "completed"
          ? "Final"
          : tournament.live_details.status === "inprogress"
          ? "In Progress"
          : tournament.live_details.status
      }`
    : "";

  // ── render ──
  return (
    <div style={s.wrapper}>

      {/* Header */}
      <div style={s.header}>
        <h2 style={s.title}>
          {tournament ? tournament.name : "Leaderboard"}
        </h2>
        <span style={s.subtitle}>{roundInfo}</span>
      </div>

      {/* Loading */}
      {loading && <div style={s.center}>Loading...</div>}

      {/* Error */}
      {error && <div style={s.error}>⚠ {error}</div>}

      {/* Table */}
      {!loading && !error && (
        <table style={s.table}>
          <thead style={s.thead}>
            <tr>
              <th style={s.th}>Pos</th>
              <th style={s.th}>Player</th>
              <th style={{ ...s.th, ...s.thCenter }}>Score</th>
            </tr>
          </thead>
          <tbody>

            {/* Active players */}
            {activePlayers.map((player) => {
              const total = calcTotal(player.rounds);
              const isLeader = player.position === 1;

              return (
                <tr key={player.player_id} style={isLeader ? s.rowLeader : s.row}>

                  {/* Position */}
                  <td style={{ ...s.td, ...s.pos }}>
                    {player.position}
                  </td>

                  {/* Name + country */}
                  <td style={s.td}>
                    <div style={s.name}>
                      {player.first_name} {player.last_name}
                    </div>
                    <div style={s.country}>{player.country}</div>
                  </td>

                  {/* Total score */}
                  <td style={{ ...s.td, ...s.tdCenter }}>
                    <ScoreCell score={total} />
                  </td>

                </tr>
              );
            })}

            {/* Cut line divider */}
            {cutPlayers.length > 0 && (
              <tr>
                <td colSpan={3} style={s.cutRow}>
                  ✂ Cut — {cutPlayers.length} player{cutPlayers.length !== 1 ? "s" : ""} eliminated
                </td>
              </tr>
            )}

            {/* Cut players */}
            {cutPlayers.map((player) => {
              const total = calcTotal(player.rounds);
              return (
                <tr key={player.player_id} style={{ ...s.row, opacity: 0.55 }}>
                  <td style={{ ...s.td, ...s.pos }}>{player.position}</td>
                  <td style={s.td}>
                    <div style={s.name}>
                      {player.first_name} {player.last_name}
                    </div>
                    <div style={s.country}>{player.country} · CUT</div>
                  </td>
                  <td style={{ ...s.td, ...s.tdCenter }}>
                    <ScoreCell score={total} />
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      )}
    </div>
  );
}
