"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import QuizCard from "@/components/QuizCard";
import {
    FaBookOpen,
    FaPlusCircle,
    FaHistory,
    FaChartLine,
    FaArrowLeft
} from "react-icons/fa";
import Link from "next/link";

export default function MyFlashcards() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [stats, setStats] = useState({ total: 0, psychology: 0, nursing: 0 });
    const [subRole, setSubRole] = useState(null);

    useEffect(() => {
        const fetchMyQuestions = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }

            // Fetch user's sub_role from profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("sub_role")
                .eq("id", session.user.id)
                .single();
            if (profile) setSubRole(profile.sub_role);

            const { data, error } = await supabase
                .from("questions")
                .select("*")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setQuestions(data);
                const psychCount = data.filter(q => q.module === 'psychology').length;
                const nursingCount = data.filter(q => q.module === 'nursing').length;
                setStats({
                    total: data.length,
                    psychology: psychCount,
                    nursing: nursingCount
                });
            }
            setLoading(false);
        };

        fetchMyQuestions();
    }, [router]);

    return (
        <div className="hero-gradient min-h-[calc(100vh-5rem)] p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="animate-fade-in">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-4 hover:translate-x-1 transition-transform"
                        >
                            <FaArrowLeft /> Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            My Contributions
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg font-medium">
                            Your personal library of review cards
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4 animate-fade-in animation-delay-300">
                        <div className="bg-white/60 backdrop-blur-md px-6 py-4 rounded-3xl border border-white shadow-sm ring-1 ring-slate-200/50 flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <FaChartLine size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Cards</div>
                                <div className="text-2xl font-black text-slate-800 leading-none">{stats.total}</div>
                            </div>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading your cards...</p>
                    </div>
                ) : questions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Stats Breakdown Side */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass-panel p-8 sticky top-24">
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                    <FaHistory /> Activity Log
                                </h2>

                                <div className="space-y-4">
                                    {subRole === 'psychology' && (
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                            <span className="text-sm font-bold text-slate-700">Psychology (BLEPP)</span>
                                            <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-black">{stats.psychology}</span>
                                        </div>
                                    )}
                                    {subRole === 'nursing' && (
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
                                            <span className="text-sm font-bold text-slate-700">Nursing (PNLE)</span>
                                            <span className="px-3 py-1 rounded-full bg-secondary text-white text-xs font-black">{stats.nursing}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <Link
                                        href="/create-card"
                                        className="w-full btn-premium py-4 flex items-center justify-center gap-2 text-xs font-black tracking-widest uppercase"
                                    >
                                        <FaPlusCircle /> Create New Card
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="lg:col-span-8 space-y-8">
                            {questions.map((q) => (
                                <QuizCard
                                    key={q.id}
                                    question={q.question}
                                    choices={[q.choice_a, q.choice_b, q.choice_c, q.choice_d]}
                                    correctAnswer={q.correct_answer}
                                    explanation={q.explanation}
                                    category={q.category}
                                    onEdit={() => router.push(`/create-card?id=${q.id}`)}
                                    onDelete={async () => {
                                        if (window.confirm("Are you sure you want to delete this flashcard?")) {
                                            const { error } = await supabase
                                                .from("questions")
                                                .delete()
                                                .eq("id", q.id);

                                            if (!error) {
                                                const updatedQuestions = questions.filter(item => item.id !== q.id);
                                                setQuestions(updatedQuestions);

                                                // Update stats
                                                const psychCount = updatedQuestions.filter(item => item.module === 'psychology').length;
                                                const nursingCount = updatedQuestions.filter(item => item.module === 'nursing').length;
                                                setStats({
                                                    total: updatedQuestions.length,
                                                    psychology: psychCount,
                                                    nursing: nursingCount
                                                });
                                            } else {
                                                alert("Failed to delete the card. Please try again.");
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-200 animate-fade-in shadow-xl shadow-slate-200/20">
                        <div className="inline-flex p-8 rounded-[2.5rem] bg-slate-50 text-slate-300 mb-6 ring-1 ring-slate-100">
                            <FaBookOpen size={64} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">No contributions yet!</h2>
                        <p className="text-slate-500 text-lg font-medium max-w-md mx-auto mb-10 leading-relaxed">
                            Start sharing your knowledge by creating your first exam review card.
                        </p>
                        <Link
                            href="/create-card"
                            className="btn-premium px-10 py-5 inline-flex items-center gap-3 font-black tracking-[0.2em] uppercase text-sm shadow-2xl shadow-primary/30"
                        >
                            <FaPlusCircle size={20} /> Create My First Card
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
