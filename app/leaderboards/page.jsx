"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  FaTrophy,
  FaBrain,
  FaHeartbeat,
  FaStar,
  FaFilter,
  FaUserAlt,
  FaFire,
  FaLayerGroup,
} from "react-icons/fa";

const MODULE_TABS = [
  { key: "all", label: "All", icon: <FaStar /> },
  { key: "psychology", label: "Psychology", icon: <FaBrain /> },
  { key: "nursing", label: "Nursing", icon: <FaHeartbeat /> },
];

const RANK_CONFIG = [
  {
    rank: 1,
    medal: "🥇",
    bg: "from-amber-400/20 to-yellow-300/10",
    border: "border-amber-300/60",
    nameColor: "text-amber-700",
    badge: "bg-amber-400 text-white",
  },
  {
    rank: 2,
    medal: "🥈",
    bg: "from-slate-300/20 to-slate-200/10",
    border: "border-slate-300/60",
    nameColor: "text-slate-700",
    badge: "bg-slate-400 text-white",
  },
  {
    rank: 3,
    medal: "🥉",
    bg: "from-orange-300/20 to-amber-200/10",
    border: "border-orange-300/60",
    nameColor: "text-orange-700",
    badge: "bg-orange-400 text-white",
  },
];

function getRankConfig(rank) {
  return RANK_CONFIG[rank - 1] || null;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-100 rounded w-1/5" />
      </div>
      <div className="w-16 h-8 bg-slate-200 rounded-full" />
    </div>
  );
}

export default function LeaderboardsPage() {
  const [activeModule, setActiveModule] = useState("all");
  const [sortBy, setSortBy] = useState("points"); // "points" or "questions"
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setCurrentUserId(session.user.id);
    };
    init();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // 1. Fetch profiles
        let profileQuery = supabase
          .from("profiles")
          .select("id, full_name, sub_role, rank_points");

        if (activeModule !== "all") {
          profileQuery = profileQuery.eq("sub_role", activeModule);
        }

        const { data: profiles, error: profileError } = await profileQuery;

        if (profileError || !profiles) {
          setEntries([]);
          setLoading(false);
          return;
        }

        // 2. Fetch question counts
        let questionQuery = supabase
          .from("questions")
          .select("user_id, module");

        if (activeModule !== "all") {
          questionQuery = questionQuery.eq("module", activeModule);
        }

        const { data: questions, error: questionError } = await questionQuery;

        // 3. Merge data
        const questionCounts = {};
        if (questions) {
          questions.forEach(q => {
            questionCounts[q.user_id] = (questionCounts[q.user_id] || 0) + 1;
          });
        }

        const merged = profiles.map(p => ({
          user_id: p.id,
          full_name: p.full_name || "Anonymous",
          sub_role: p.sub_role,
          points: p.rank_points || 0,
          questionCount: questionCounts[p.id] || 0,
        }));

        // 4. Filter out users with zero data in BOTH criteria if needed, 
        // or just keep those with at least one contribution/point
        const activeEntries = merged.filter(e => e.points > 0 || e.questionCount > 0);

        // 5. Sort based on selection
        const sorted = activeEntries.sort((a, b) => {
          if (sortBy === "points") {
            return b.points - a.points || b.questionCount - a.questionCount;
          } else {
            return b.questionCount - a.questionCount || b.points - a.points;
          }
        });

        setEntries(sorted);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setEntries([]);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [activeModule, sortBy]);

  const topThree = entries.slice(0, 3);

  return (
    <div className="hero-gradient min-h-[calc(100vh-5rem)] p-6 md:p-12">
      {/* Background glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-300/10 blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex p-4 rounded-3xl bg-amber-400/10 text-amber-500 mb-5 ring-1 ring-amber-300/30">
            <FaTrophy size={36} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Leaderboards
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            The top performers ranked by points and contributions.
          </p>

          {!loading && entries.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/5 text-amber-600 text-xs font-black uppercase tracking-widest border border-amber-400/10">
                <FaFire />
                {entries.reduce((s, e) => s + e.points, 0).toLocaleString()} points earned
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-black uppercase tracking-widest border border-primary/10">
                <FaLayerGroup />
                {entries.reduce((s, e) => s + e.questionCount, 0).toLocaleString()} questions contributed
              </div>
            </div>
          )}
        </header>

        {/* Filters and Search - Two separate rows */}
        <div className="space-y-6 mb-10 animate-fade-in animation-delay-200">
          {/* Module Filter */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-slate-400 mr-1">
              <FaFilter size={11} />
            </span>
            {MODULE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveModule(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 ${activeModule === tab.key
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-white text-slate-500 border-slate-200 hover:border-primary/40 hover:text-primary"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Toggle */}
          <div className="flex flex-col items-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Rank users by</h2>
            <div className="inline-flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setSortBy("points")}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${sortBy === "points"
                  ? "bg-white text-amber-600 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <FaFire className={sortBy === "points" ? "text-amber-500" : ""} /> Points
              </button>
              <button
                onClick={() => setSortBy("questions")}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${sortBy === "questions"
                  ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <FaLayerGroup className={sortBy === "questions" ? "text-primary" : ""} /> Questions
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="glass-panel p-16 text-center animate-fade-in">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-black text-slate-700 mb-2">No questions yet!</h2>
            <p className="text-slate-400 text-sm font-medium">
              Be the first to contribute questions and claim the #1 spot.
            </p>
          </div>
        ) : (
          <>
            {/* ── Podium: Top 3 ── */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in animation-delay-200">
                {[topThree[1], topThree[0], topThree[2]].map((entry, i) => {
                  if (!entry) return <div key={i} />;
                  const actualRank = topThree.indexOf(entry) + 1;
                  const cfg = getRankConfig(actualRank);
                  const isFirst = actualRank === 1;
                  const isMe = entry.user_id === currentUserId;

                  return (
                    <div
                      key={entry.user_id}
                      className={`relative flex flex-col items-center p-4 rounded-3xl bg-gradient-to-b border shadow-lg transition-all duration-300 hover:-translate-y-1 ${cfg.bg} ${cfg.border} ${
                        isFirst ? "scale-105 -mt-3 pb-6" : "pb-4 mt-3"
                      }`}
                    >
                      {isMe && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          You
                        </div>
                      )}
                      <div className="text-3xl mb-2">{cfg.medal}</div>
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-white font-black text-lg ${cfg.badge}`}
                      >
                        {entry.full_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className={`text-[11px] font-black text-center leading-tight mb-2 ${cfg.nameColor}`}>
                        {entry.full_name}
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <FaFire className="text-amber-500 text-xs" />
                          <span className="text-xl font-black text-slate-800">{entry.points.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaLayerGroup className="text-primary/60 text-[10px]" />
                          <span className="text-sm font-bold text-slate-500">{entry.questionCount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Perfomance Metrics
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Full Rankings List ── */}
            <div className="glass-panel p-2 animate-fade-in animation-delay-300">
              {entries.map((entry, idx) => {
                const rank = idx + 1;
                const cfg = getRankConfig(rank);
                const isMe = entry.user_id === currentUserId;

                return (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 hover:bg-slate-50 group ${
                      isMe ? "bg-accent/5 hover:bg-accent/10" : ""
                    }`}
                  >
                    {/* Rank */}
                    <div
                      className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-black transition-all ${
                        cfg
                          ? `${cfg.badge} shadow-md`
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}
                    >
                      {cfg ? cfg.medal : rank}
                    </div>

                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center font-black text-white text-sm ${
                        isMe ? "bg-accent" : "bg-primary/80"
                      }`}
                    >
                      {entry.full_name?.[0]?.toUpperCase() || <FaUserAlt size={12} />}
                    </div>

                    {/* Name & meta */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-black text-sm truncate flex items-center gap-2 ${
                          isMe ? "text-accent" : "text-slate-800"
                        }`}
                      >
                        {entry.full_name || "Anonymous"}
                        {isMe && (
                          <span className="text-[9px] bg-accent text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                        {entry.sub_role ? (
                          <span
                            className={
                              entry.sub_role === "psychology"
                                ? "text-accent"
                                : "text-secondary"
                            }
                          >
                            {entry.sub_role}
                          </span>
                        ) : (
                          "contributor"
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-shrink-0 flex gap-2">
                      <div className={`flex flex-col items-center px-4 py-1.5 rounded-xl border transition-all duration-300 min-w-[70px] ${sortBy === 'points' ? 'bg-amber-50 border-amber-200 scale-105' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                        <span className={`text-sm font-black leading-none flex items-center gap-1 ${sortBy === 'points' ? 'text-amber-600' : 'text-slate-500'}`}>
                          <FaFire className="text-amber-400 text-[10px]" />
                          {entry.points.toLocaleString()}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Points</span>
                      </div>
                      <div className={`flex flex-col items-center px-4 py-1.5 rounded-xl border transition-all duration-300 min-w-[70px] ${sortBy === 'questions' ? 'bg-primary/10 border-primary/20 scale-105' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                        <span className={`text-sm font-black leading-none flex items-center gap-1 ${sortBy === 'questions' ? 'text-primary' : 'text-slate-500'}`}>
                          <FaLayerGroup className="text-primary/60 text-[10px]" />
                          {entry.questionCount.toLocaleString()}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Quests</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p className="text-center text-[10px] text-slate-300 font-medium uppercase tracking-widest mt-10">
          Rankings based on total points and question contributions
        </p>
      </div>
    </div>
  );
}
