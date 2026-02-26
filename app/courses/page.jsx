"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaEyeSlash,
    FaGraduationCap,
    FaBrain,
    FaHeartbeat
} from "react-icons/fa";

export default function CoursesPage() {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModule, setSelectedModule] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Global toggle for all answers
    const [showAnswers, setShowAnswers] = useState(false);

    // State to track individually revealed answers
    const [revealedAnswers, setRevealedAnswers] = useState(new Set());
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("questions")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setQuestions(data);
            setFilteredQuestions(data);

            // Extract unique categories
            const uniqueCats = [...new Set(data.map(q => q.category).filter(Boolean))].sort();
            setCategories(uniqueCats);
        }
        setLoading(false);
    };

    useEffect(() => {
        let result = questions;

        if (selectedModule !== "all") {
            result = result.filter(q => q.module === selectedModule);
        }

        if (selectedCategory !== "all") {
            result = result.filter(q => q.category === selectedCategory);
        }

        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            result = result.filter(q =>
                q.question.toLowerCase().includes(query) ||
                q.explanation?.toLowerCase().includes(query)
            );
        }

        setFilteredQuestions(result);
    }, [searchQuery, selectedModule, selectedCategory, questions]);

    // Function to handle individual answer reveals
    const toggleRevealAnswer = (id) => {
        const newRevealed = new Set(revealedAnswers);
        if (newRevealed.has(id)) {
            newRevealed.delete(id);
        } else {
            newRevealed.add(id);
        }
        setRevealedAnswers(newRevealed);
    };

    return (
        <div className="hero-gradient min-h-[calc(100vh-5rem)] p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                                <FaGraduationCap /> Study Guide
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                Comprehensive <span className="text-gradient">Reviewer</span>
                            </h1>
                            <p className="text-slate-500 font-medium mt-2">
                                Browse all board exam questions, answers, and rationales.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowAnswers(!showAnswers)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${showAnswers
                                    ? "bg-slate-900 text-white shadow-lg"
                                    : "bg-white text-slate-600 border border-slate-200 hover:border-primary"
                                    }`}
                            >
                                {showAnswers ? <FaEye /> : <FaEyeSlash />}
                                {showAnswers ? "Hide All Answers" : "Reveal All Answers"}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Filters Row */}
                <div className="glass-panel p-6 mb-10 flex flex-col md:flex-row gap-6 animate-fade-in animation-delay-200">
                    <div className="flex-grow relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search questions or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-white/50 px-4 py-1.5 rounded-xl border border-slate-100">
                            <FaFilter className="text-slate-400 text-xs" />
                            <select
                                value={selectedModule}
                                onChange={(e) => {
                                    setSelectedModule(e.target.value);
                                    setSelectedCategory("all");
                                }}
                                className="bg-transparent text-sm font-bold text-slate-600 outline-none cursor-pointer"
                            >
                                <option value="all">All Modules</option>
                                <option value="psychology">Psychology</option>
                                <option value="nursing">Nursing</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-white/50 px-4 py-1.5 rounded-xl border border-slate-100">
                            <FaFilter className="text-slate-400 text-xs" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-transparent text-sm font-bold text-slate-600 outline-none cursor-pointer max-w-[200px]"
                            >
                                <option value="all">All Topics</option>
                                {categories
                                    .filter(cat => selectedModule === "all" || questions.some(q => q.category === cat && q.module === selectedModule))
                                    .map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Study Guide...</p>
                    </div>
                ) : filteredQuestions.length > 0 ? (
                    <div className="space-y-6 animate-fade-in animation-delay-300">
                        {filteredQuestions.map((q, idx) => {
                            // Extract just the correct answer text
                            const allChoices = [q.choice_a, q.choice_b, q.choice_c, q.choice_d];
                            const correctAnswerText = allChoices[q.correct_answer];
                            // Determine if this specific answer should be visible
                            const isAnswerRevealed = showAnswers || revealedAnswers.has(q.id);

                            return (
                                <div key={q.id} className="glass-panel overflow-hidden transition-all hover:shadow-xl group border-l-4 border-l-transparent hover:border-l-primary/40">
                                    <div className="p-6 md:p-8">
                                        <div className="flex items-start gap-4 mb-2">
                                            <span className="w-8 h-8 shrink-0 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black mt-1">
                                                {idx + 1}
                                            </span>

                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${q.module === 'psychology' ? 'text-accent' : 'text-secondary'}`}>
                                                        {q.module === 'psychology' ? <FaBrain className="size-2.5" /> : <FaHeartbeat className="size-2.5" />}
                                                        {q.module}
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {q.category}
                                                    </div>
                                                </div>

                                                {/* INLINE QUESTION & ANSWER */}
                                                <h3 className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed">
                                                    {q.question}

                                                    {isAnswerRevealed ? (
                                                        <span
                                                            className="text-primary font-black ml-2 cursor-pointer transition-all hover:opacity-70"
                                                            onClick={() => toggleRevealAnswer(q.id)}
                                                            title="Click to hide"
                                                        >
                                                            {correctAnswerText}
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => toggleRevealAnswer(q.id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1 ml-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary text-slate-400 text-xs font-black uppercase tracking-wider transition-all align-middle"
                                                        >
                                                            <FaEye size={12} /> Reveal
                                                        </button>
                                                    )}
                                                </h3>

                                                {/* FORMATTED RATIONALE */}
                                                {isAnswerRevealed && q.explanation && (
                                                    <div className="mt-6 p-5 rounded-xl bg-primary/5 border border-primary/10 text-slate-700 animate-slide-down">
                                                        <p className="text-sm md:text-base leading-relaxed">
                                                            <strong className="text-primary font-black mr-2">
                                                                {correctAnswerText}:
                                                            </strong>
                                                            {q.explanation}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-panel py-20 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                            <FaSearch size={30} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No questions found</h3>
                        <p className="text-slate-400 mt-2">Try adjusting your filters or search query.</p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedModule("all");
                                setSelectedCategory("all");
                            }}
                            className="mt-6 text-sm font-black text-primary hover:underline uppercase tracking-widest"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}