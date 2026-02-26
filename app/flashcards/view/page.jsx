"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaLightbulb,
    FaGraduationCap,
    FaArrowLeft,
    FaLayerGroup,
    FaUserCircle,
    FaFilter,
    FaTrophy,
    FaRedo,
    FaArrowRight,
    FaChartBar,
    FaPlay,
    FaListUl,
    FaCog,
    FaCheck,
    FaClock
} from "react-icons/fa";

// --- QUIZ CARD COMPONENT ---
function QuizCard({ question, choices = [], correctAnswer, explanation, category, onAnswer, hideRationale = false }) {
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [isRevealed, setIsRevealed] = useState(false);

    const handleChoiceClick = (index) => {
        if (isRevealed) return;
        setSelectedChoice(index);
        setIsRevealed(true);
        if (onAnswer) onAnswer(index === correctAnswer);
    };

    const getChoiceClass = (index) => {
        if (!isRevealed) {
            return selectedChoice === index
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                : "border-border hover:border-primary-light hover:bg-slate-50 hover:translate-x-1";
        }

        if (index === correctAnswer) {
            return "border-secondary bg-secondary/10 ring-2 ring-secondary/20 font-medium text-secondary-800";
        }

        if (index === selectedChoice && index !== correctAnswer) {
            return "border-red-500 bg-red-50 ring-2 ring-red-100 opacity-100";
        }

        return "opacity-40 border-border grayscale-[0.5]";
    };

    return (
        <div className="glass-panel p-8 md:p-12 animate-fade-in max-w-3xl mx-auto overflow-hidden relative group">
            <div className={`absolute top-0 left-0 h-2 transition-all duration-700 ease-in-out ${isRevealed
                ? (selectedChoice === correctAnswer ? "bg-secondary w-full" : "bg-red-500 w-full")
                : "bg-slate-200 w-full opacity-30"
                }`} />

            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 w-9 h-9 rounded-xl flex items-center justify-center text-primary shadow-sm border border-primary/10">
                        <FaGraduationCap size={16} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {category}
                    </span>
                </div>
                {isRevealed && (
                    <div className={`flex items-center gap-2 text-sm font-black uppercase tracking-wider animate-slide-down ${selectedChoice === correctAnswer ? 'text-secondary' : 'text-red-500'
                        }`}>
                        {selectedChoice === correctAnswer ? (
                            <><FaCheckCircle /> Perfect</>
                        ) : (
                            <><FaTimesCircle /> Not Quite</>
                        )}
                    </div>
                )}
            </div>

            <h3 className="text-2xl md:text-3xl font-black mb-12 text-slate-900 leading-[1.3] tracking-tight">
                {question}
            </h3>

            <div className="grid gap-4 mb-10">
                {choices.map((choice, index) => {
                    const isCorrect = isRevealed && index === correctAnswer;
                    const isWrong = isRevealed && index === selectedChoice && index !== correctAnswer;

                    return (
                        <button
                            key={index}
                            onClick={() => handleChoiceClick(index)}
                            className={`group/btn relative flex items-center p-6 rounded-2xl border-2 transition-all duration-300 ${getChoiceClass(index)}`}
                            disabled={isRevealed}
                        >
                            <span className={`flex-shrink-0 w-11 h-11 rounded-xl border-2 flex items-center justify-center font-black text-sm mr-5 transition-all duration-500 ${isCorrect ? "bg-secondary text-white border-secondary rotate-[360deg] shadow-lg shadow-secondary/20" :
                                isWrong ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" :
                                    "border-slate-100 text-slate-300 group-hover/btn:border-primary group-hover/btn:text-primary group-hover/btn:bg-primary/5"
                                }`}>
                                {String.fromCharCode(65 + index)}
                            </span>

                            <span className="text-lg md:text-xl text-left font-bold text-slate-700 leading-snug">
                                {choice}
                            </span>
                        </button>
                    );
                })}
            </div>

            {isRevealed && !hideRationale && (
                <div className="mt-12 pt-10 border-t border-slate-100 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4 text-amber-500">
                        <FaLightbulb size={20} className="animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.25em]">Expert Rationale</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border-2 border-slate-100 relative group/rationale">
                        <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
                            {explanation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- MAIN PAGE LOGIC ---
function DeckViewer() {
    const searchParams = useSearchParams();
    const creatorId = searchParams.get("creator");

    const [allQuestions, setAllQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatorName, setCreatorName] = useState("Loading...");

    // UI & Game Modes
    const [viewMode, setViewMode] = useState("lobby"); // 'lobby', 'scrolling', 'game', 'results'
    const [activeQuestions, setActiveQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showNext, setShowNext] = useState(false);

    // Filter/Lobby settings
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [questionLimit, setQuestionLimit] = useState(20);

    useEffect(() => {
        if (creatorId) {
            fetchCreatorDeck();
        }
    }, [creatorId]);

    const fetchCreatorDeck = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("questions")
            .select(`*, profiles (full_name)`)
            .eq("user_id", creatorId)
            .order("created_at", { ascending: false });

        if (data && data.length > 0) {
            setAllQuestions(data);
            setCreatorName(data[0].profiles?.full_name || "Anonymous Reviewer");
            // Default to all topics selected
            const uniqueTopics = [...new Set(data.map(q => q.category).filter(Boolean))];
            setSelectedTopics(uniqueTopics);
        } else {
            setCreatorName("Unknown Creator");
        }
        setLoading(false);
    };

    const topics = useMemo(() => {
        return [...new Set(allQuestions.map(q => q.category).filter(Boolean))].sort();
    }, [allQuestions]);

    const startSession = (mode) => {
        // Filter by selected topics
        let filtered = allQuestions.filter(q => selectedTopics.includes(q.category));

        if (mode === 'game') {
            // Shuffle and Limit for Game Mode
            filtered = [...filtered].sort(() => Math.random() - 0.5).slice(0, questionLimit);
            setScore(0);
            setCurrentIndex(0);
            setShowNext(false);
        }

        setActiveQuestions(filtered);
        setViewMode(mode);
    };

    const handleAnswer = (isCorrect) => {
        if (isCorrect) setScore(prev => prev + 1);
        setShowNext(true);
    };

    const nextQuestion = () => {
        if (currentIndex + 1 < activeQuestions.length) {
            setCurrentIndex(prev => prev + 1);
            setShowNext(false);
        } else {
            setViewMode("results");
        }
    };

    if (loading) return (
        <div className="min-h-screen hero-gradient flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-xl" />
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest animate-pulse">Entering Domain...</p>
        </div>
    );

    return (
        <div className="hero-gradient min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-10 animate-fade-in">
                    <Link href="/flashcards" className="group flex items-center gap-3 text-slate-500 hover:text-primary transition-all">
                        <div className="bg-white/50 w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all border border-slate-100">
                            <FaArrowLeft size={10} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Decks Library</span>
                    </Link>

                    <div className="bg-white/40 px-5 py-2.5 rounded-2xl border border-white/50 backdrop-blur-md flex items-center gap-3">
                        <FaUserCircle className="text-primary size-5" />
                        <span className="text-xs font-black text-slate-800 tracking-tight italic">By {creatorName}</span>
                    </div>
                </div>

                {/* --- LOBBY MODE --- */}
                {viewMode === "lobby" && (
                    <div className="animate-fade-in max-w-2xl mx-auto">
                        <div className="glass-panel overflow-hidden">
                            <div className="p-8 md:p-12 text-center border-b border-slate-100">
                                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 border border-primary/10">
                                    <FaCog size={32} className="animate-spin-slow" />
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Deck Arena Lobby</h1>
                                <p className="text-slate-500 font-medium">Configure your study session for maximum retention.</p>
                            </div>

                            <div className="p-8 md:p-12 space-y-12">
                                {/* Topic Multi-Select */}
                                <div>
                                    <div className="flex items-center justify-between mb-6 px-1">
                                        <div className="flex items-center gap-2">
                                            <FaFilter className="text-primary size-3" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Modules</h3>
                                        </div>
                                        <button
                                            onClick={() => setSelectedTopics(selectedTopics.length === topics.length ? [] : topics)}
                                            className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                        >
                                            {selectedTopics.length === topics.length ? 'Clear All' : 'Select All'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {topics.map(topic => (
                                            <button
                                                key={topic}
                                                onClick={() => setSelectedTopics(prev =>
                                                    prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
                                                )}
                                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold text-sm ${selectedTopics.includes(topic)
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                                    }`}
                                            >
                                                <span className="truncate">{topic}</span>
                                                {selectedTopics.includes(topic) && <FaCheck size={10} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity Limit */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6 px-1">
                                        <FaClock className="text-secondary size-3" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Questions</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {[10, 20, 50, 70, 100].map(val => (
                                            <button
                                                key={val}
                                                onClick={() => setQuestionLimit(val)}
                                                className={`px-6 py-3 rounded-xl border-2 font-black text-xs transition-all ${questionLimit === val
                                                        ? 'border-secondary bg-secondary/5 text-secondary'
                                                        : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                                    }`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setQuestionLimit(allQuestions.length)}
                                            className={`px-6 py-3 rounded-xl border-2 font-black text-xs transition-all ${questionLimit === allQuestions.length
                                                    ? 'border-amber-400 bg-amber-50 text-amber-600'
                                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                                }`}
                                        >
                                            MAX ({allQuestions.length})
                                        </button>
                                    </div>
                                </div>

                                {/* Launch Mode */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                                    <button
                                        onClick={() => startSession('scrolling')}
                                        disabled={selectedTopics.length === 0}
                                        className="btn-glass p-6 rounded-3xl flex flex-col items-center gap-4 group transition-all hover:border-primary/40 disabled:opacity-50"
                                    >
                                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <FaListUl size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-black text-slate-800 uppercase tracking-widest text-xs">Scroll Mode</p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-1">Classic full deck view</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => startSession('game')}
                                        disabled={selectedTopics.length === 0}
                                        className="btn-premium p-6 rounded-3xl flex flex-col items-center gap-4 group disabled:opacity-50 shadow-primary/20"
                                    >
                                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                            <FaPlay size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-black text-white uppercase tracking-widest text-xs">Arena Mode</p>
                                            <p className="text-[10px] text-white/70 font-medium mt-1">Interactive sequential quiz</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SCROLLING MODE --- */}
                {viewMode === "scrolling" && (
                    <div className="animate-fade-in space-y-8">
                        <div className="flex items-center justify-between bg-white/40 p-6 rounded-3xl border border-white/50 mb-12">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Review Library</h1>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Showing all {activeQuestions.length} selected cards</p>
                            </div>
                            <button onClick={() => setViewMode('lobby')} className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 hover:bg-primary hover:text-white transition-all">
                                Change Settings
                            </button>
                        </div>
                        {activeQuestions.map((q, idx) => (
                            <QuizCard
                                key={q.id}
                                question={q.question}
                                choices={[q.choice_a, q.choice_b, q.choice_c, q.choice_d]}
                                correctAnswer={q.correct_answer}
                                explanation={q.explanation}
                                category={q.category}
                            />
                        ))}
                    </div>
                )}

                {/* --- GAME MODE --- */}
                {viewMode === "game" && (
                    <div className="animate-fade-in">
                        {/* Game HUD */}
                        <div className="max-w-3xl mx-auto mb-12 px-2 flex items-center gap-6">
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {activeQuestions.length}</span>
                                    <button onClick={() => setViewMode('lobby')} className="text-[9px] font-black text-slate-400 hover:text-primary uppercase tracking-widest">End Session</button>
                                </div>
                                <div className="h-3 bg-white/50 rounded-full overflow-hidden border border-white/50 p-0.5">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-700 shadow-sm"
                                        style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center min-w-[80px] aspect-square rounded-[2rem] bg-white shadow-2xl shadow-primary/10 border border-primary/5">
                                <span className="text-3xl font-black text-primary mb-0.5">{score}</span>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Score</span>
                            </div>
                        </div>

                        {activeQuestions[currentIndex] && (
                            <QuizCard
                                key={`${currentIndex}`}
                                question={activeQuestions[currentIndex].question}
                                choices={[
                                    activeQuestions[currentIndex].choice_a,
                                    activeQuestions[currentIndex].choice_b,
                                    activeQuestions[currentIndex].choice_c,
                                    activeQuestions[currentIndex].choice_d
                                ]}
                                correctAnswer={activeQuestions[currentIndex].correct_answer}
                                explanation={activeQuestions[currentIndex].explanation}
                                category={activeQuestions[currentIndex].category}
                                onAnswer={handleAnswer}
                            />
                        )}

                        <div className="mt-10 flex justify-center h-16">
                            {showNext && (
                                <button
                                    onClick={nextQuestion}
                                    className="btn-premium flex items-center gap-4 px-12 py-4.5 text-sm animate-slide-up shadow-xl shadow-primary/20"
                                >
                                    {currentIndex + 1 === activeQuestions.length ? 'Finalize Score' : 'Continue Mission'}
                                    <FaArrowRight className="animate-pulse" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* --- RESULTS MODE --- */}
                {viewMode === "results" && (
                    <div className="max-w-2xl mx-auto text-center animate-fade-in py-12">
                        <div className="relative bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-4 bg-primary/10" />
                            <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-white mx-auto mb-10 rotate-12 shadow-2xl shadow-primary/30">
                                <FaTrophy size={48} />
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Mission Success!</h1>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs mb-12">Performance Summary</p>

                            <div className="grid grid-cols-2 gap-6 mb-12">
                                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Overall Accuracy</p>
                                    <p className="text-5xl font-black text-primary italic">
                                        {Math.round((score / activeQuestions.length) * 100 || 0)}%
                                    </p>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Total Points</p>
                                    <p className="text-5xl font-black text-secondary">{score}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setViewMode('lobby')}
                                    className="flex-1 flex items-center justify-center gap-3 p-6 rounded-3xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl shadow-slate-900/10 uppercase tracking-widest text-xs"
                                >
                                    <FaRedo /> New Session
                                </button>
                                <Link
                                    href="/flashcards"
                                    className="flex-1 flex items-center justify-center gap-3 p-6 rounded-3xl bg-white border-2 border-slate-100 text-slate-800 font-black hover:border-primary/20 transition-all hover:scale-[1.02] uppercase tracking-widest text-xs"
                                >
                                    <FaChartBar /> Other Decks
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- DEFAULT EXPORT ---
export default function ViewDeckPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen hero-gradient flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        }>
            <DeckViewer />
        </Suspense>
    );
}
