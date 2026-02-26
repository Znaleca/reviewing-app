"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProfileStats from "@/components/ProfileStats";
import {
    FaUserGraduate,
    FaShieldAlt,
    FaCalendarAlt,
    FaHistory,
    FaBrain,
    FaHeartbeat,
    FaChartLine,
    FaCheckCircle,
    FaArrowLeft,
    FaSignOutAlt
} from "react-icons/fa";
import Link from "next/link";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPoints: 0,
        quizCount: 0,
        accuracy: 0,
        totalAnswered: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                window.location.href = "/login";
                return;
            }

            setUser(session.user);

            // Fetch Profile
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();

            setProfile(profileData);

            // Fetch Quiz Results
            const { data: resultsData } = await supabase
                .from("quiz_results")
                .select("*")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false });

            setResults(resultsData || []);

            // Calculate Stats
            if (resultsData && resultsData.length > 0) {
                const totalScore = resultsData.reduce((acc, r) => acc + r.score, 0);
                const totalQuestions = resultsData.reduce((acc, r) => acc + r.total_questions, 0);

                setStats({
                    totalPoints: profileData?.rank_points || 0,
                    quizCount: resultsData.length,
                    accuracy: Math.round((totalScore / totalQuestions) * 100),
                    totalAnswered: totalQuestions
                });
            } else {
                setStats({
                    totalPoints: profileData?.rank_points || 0,
                    quizCount: 0,
                    accuracy: 0,
                    totalAnswered: 0
                });
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="hero-gradient min-h-screen p-6 md:p-12 pt-24 md:pt-32">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary relative border-4 border-white">
                            <FaUserGraduate size={48} />
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                                <FaCheckCircle size={14} />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {profile?.full_name || user?.user_metadata?.full_name || "Examinee"}
                                </h1>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${profile?.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                                    }`}>
                                    {profile?.role || "Student"}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-slate-300" />
                                    Joined {new Date(profile?.created_at || user?.created_at).toLocaleDateString()}
                                </div>
                                {(profile?.sub_role || user?.user_metadata?.sub_role) && (
                                    <div className="flex items-center gap-2 capitalize">
                                        {(profile?.sub_role || user?.user_metadata?.sub_role) === 'psychology' ? <FaBrain className="text-violet-400" /> : <FaHeartbeat className="text-rose-400" />}
                                        {profile?.sub_role || user?.user_metadata?.sub_role}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                </div>

                {/* Stats */}
                <div className="mb-12">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                        <FaChartLine /> Performance Metrics
                    </h2>
                    <ProfileStats stats={stats} loading={loading} />
                </div>

                {/* History */}
                <div className="grid grid-cols-1 gap-8 animate-fade-in animation-delay-300">
                    <div>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                            <FaHistory /> Recent Quiz Activity
                        </h2>

                        {results.length > 0 ? (
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Module</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Mode</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Score</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {results.map((result) => (
                                                <tr key={result.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <span className="text-sm font-bold text-slate-600">
                                                            {new Date(result.created_at).toLocaleDateString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-2">
                                                            {result.module === 'psychology' ? (
                                                                <div className="p-1.5 rounded-lg bg-violet-50 text-violet-500">
                                                                    <FaBrain size={12} />
                                                                </div>
                                                            ) : (
                                                                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-500">
                                                                    <FaHeartbeat size={12} />
                                                                </div>
                                                            )}
                                                            <span className="text-sm font-black text-slate-800 capitalize">
                                                                {result.module}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${result.mode === 'ranked' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {result.mode || 'Normal'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <span className="text-sm font-black text-slate-800">
                                                            {result.score} / {result.total_questions}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <span className={`text-xs font-black uppercase tracking-widest ${(result.score / result.total_questions) >= 0.75 ? 'text-emerald-500' :
                                                            (result.score / result.total_questions) >= 0.5 ? 'text-amber-500' : 'text-red-500'
                                                            }`}>
                                                            {Math.round((result.score / result.total_questions) * 100)}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                                    <FaHistory size={32} />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-2">No attempts yet</h3>
                                <p className="text-sm font-medium text-slate-500 mb-6">Start reviewing to see your performance history here.</p>
                                <Link href="/courses" className="btn-premium px-8 py-3">
                                    Start Learning
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
