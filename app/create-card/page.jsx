"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FaPlusCircle,
    FaSave,
    FaBookOpen,
    FaGraduationCap,
    FaCheckCircle,
    FaExclamationTriangle,
    FaRegCircle,
    FaArrowLeft,
    FaEdit
} from "react-icons/fa";
import Link from "next/link";

export default function CreateCard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("id");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        question: "",
        choice_a: "",
        choice_b: "",
        choice_c: "",
        choice_d: "",
        correct_answer: 0,
        explanation: "",
        category: "",
        module: "psychology"
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                setUser(session.user);
                // Fetch profile to get sub_role
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("role, sub_role")
                    .eq("id", session.user.id)
                    .single();

                if (profileData) {
                    setProfile(profileData);
                    // Lock module if not admin
                    if (profileData.role !== 'admin' && profileData.sub_role) {
                        setFormData(prev => ({ ...prev, module: profileData.sub_role }));
                    }
                }

                // If editing, fetch the card data
                if (editId) {
                    const { data: questionData, error: fetchError } = await supabase
                        .from("questions")
                        .select("*")
                        .eq("id", editId)
                        .single();

                    if (!fetchError && questionData) {
                        setFormData({
                            question: questionData.question,
                            choice_a: questionData.choice_a,
                            choice_b: questionData.choice_b,
                            choice_c: questionData.choice_c,
                            choice_d: questionData.choice_d,
                            correct_answer: questionData.correct_answer,
                            explanation: questionData.explanation,
                            category: questionData.category,
                            module: questionData.module
                        });
                    }
                }
            }
        };
        checkUser();
    }, [router, editId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        let result;
        if (editId) {
            // Update existing card
            result = await supabase
                .from("questions")
                .update({
                    ...formData,
                    user_id: user.id
                })
                .eq("id", editId);
        } else {
            // Insert new card
            result = await supabase
                .from("questions")
                .insert([
                    {
                        ...formData,
                        user_id: user.id
                    }
                ]);
        }

        const { error: submitError } = result;

        if (submitError) {
            setError(submitError.message);
        } else {
            setSuccess(true);
            if (!editId) {
                setFormData({
                    question: "",
                    choice_a: "",
                    choice_b: "",
                    choice_c: "",
                    choice_d: "",
                    correct_answer: 0,
                    explanation: "",
                    category: "",
                    module: formData.module // Keep the same module for batch entry
                });
            } else {
                // If editing, wait a bit then redirect back to My Flashcards
                setTimeout(() => router.push("/flashcards/my"), 2000);
            }
            setTimeout(() => setSuccess(false), 3000);
        }
        setLoading(false);
    };

    return (
        <div className="hero-gradient min-h-[calc(100vh-5rem)] p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 text-center animate-fade-in relative">
                    {editId && (
                        <Link
                            href="/flashcards/my"
                            className="absolute left-0 top-0 hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                        >
                            <FaArrowLeft /> Cancel Edit
                        </Link>
                    )}
                    <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm border border-slate-100 text-primary mb-4">
                        {editId ? <FaEdit size={28} /> : <FaPlusCircle size={28} />}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {editId ? "Edit Review Card" : "Create Review Card"}
                    </h1>
                    <p className="text-slate-500 mt-2 text-base md:text-lg">
                        {editId ? "Modify your contributed board exam question" : "Add a new question to the knowledge base"}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 animate-fade-in animation-delay-300">
                    {/* Left Column: Basic Info */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col gap-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <FaBookOpen size={16} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Question Details</h2>
                        </div>

                        {profile?.role === 'admin' ? (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Target Module
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, module: "psychology" })}
                                        className={`py-2.5 px-4 rounded-xl border-2 font-semibold transition-all ${formData.module === "psychology"
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                            }`}
                                    >
                                        Psychology
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, module: "nursing" })}
                                        className={`py-2.5 px-4 rounded-xl border-2 font-semibold transition-all ${formData.module === "nursing"
                                            ? "border-secondary bg-secondary/5 text-secondary"
                                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                            }`}
                                    >
                                        Nursing
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                                    Posting to Module
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${formData.module === 'psychology' ? 'bg-primary' : 'bg-secondary'}`} />
                                    <span className={`text-sm font-bold ${formData.module === 'psychology' ? 'text-primary' : 'text-secondary'}`}>
                                        {formData.module === 'psychology' ? 'Psychology (BLEPP)' : 'Nursing (PNLE)'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Category / Topic</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Theories of Personality"
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 placeholder-slate-400"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">The Question</label>
                            <textarea
                                required
                                rows={6}
                                placeholder="Type the board exam style question here..."
                                className="w-full flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 placeholder-slate-400 resize-none"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Right Column: Choices & Answer */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col gap-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                                <FaGraduationCap size={16} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Answers & Rationalization</h2>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Options (Select the correct one)</label>
                            {[
                                { id: "choice_a", label: "A", color: "text-blue-600", bg: "bg-blue-50" },
                                { id: "choice_b", label: "B", color: "text-purple-600", bg: "bg-purple-50" },
                                { id: "choice_c", label: "C", color: "text-emerald-600", bg: "bg-emerald-50" },
                                { id: "choice_d", label: "D", color: "text-amber-600", bg: "bg-amber-50" }
                            ].map((choice, idx) => {
                                const isCorrect = formData.correct_answer === idx;
                                return (
                                    <div
                                        key={choice.id}
                                        className={`relative flex items-stretch rounded-xl border transition-all overflow-hidden ${isCorrect
                                            ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20"
                                            : "border-slate-300 bg-white hover:border-slate-400"
                                            }`}
                                    >
                                        {/* Letter Indicator */}
                                        <div className={`flex items-center justify-center w-12 font-bold border-r ${isCorrect ? 'border-emerald-500 text-emerald-700 bg-emerald-100/50' : `border-slate-200 ${choice.color} ${choice.bg}`}`}>
                                            {choice.label}
                                        </div>

                                        {/* Input Field */}
                                        <input
                                            required
                                            type="text"
                                            placeholder={`Enter choice ${choice.label}...`}
                                            className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-800 placeholder-slate-400"
                                            value={formData[choice.id]}
                                            onChange={(e) => setFormData({ ...formData, [choice.id]: e.target.value })}
                                        />

                                        {/* Mark Correct Button */}
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, correct_answer: idx })}
                                            className="flex items-center justify-center px-4 transition-colors focus:outline-none"
                                            title="Mark as correct answer"
                                        >
                                            {isCorrect ? (
                                                <FaCheckCircle className="text-emerald-500 text-xl" />
                                            ) : (
                                                <FaRegCircle className="text-slate-300 hover:text-emerald-400 text-xl transition-colors" />
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-2 flex-1 flex flex-col">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Rationalization (Explanation)</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Explain why the chosen answer is correct and others are not..."
                                className="w-full flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 placeholder-slate-400 resize-none"
                                value={formData.explanation}
                                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Full Width Footer Area */}
                    <div className="lg:col-span-2 flex flex-col items-center gap-4 mt-2">
                        {error && (
                            <div className="w-full max-w-2xl p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in">
                                <FaExclamationTriangle className="flex-shrink-0 text-red-500" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="w-full max-w-2xl p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in">
                                <FaCheckCircle className="flex-shrink-0 text-emerald-500" />
                                <p className="text-sm font-medium">
                                    {editId ? "Successfully updated! Redirecting..." : "Successfully saved! Ready for the next question."}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full max-w-md btn-premium bg-primary text-white py-3.5 px-6 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>{editId ? "Saving Changes..." : "Processing..."}</span>
                                </div>
                            ) : (
                                <>
                                    <FaSave size={18} />
                                    <span>{editId ? "Update Board Question" : "Save Board Question"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}