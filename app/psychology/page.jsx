"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import QuizCard from "@/components/QuizCard";
import {
    FaBrain,
    FaRedo,
    FaArrowRight,
    FaTrophy,
    FaChartBar,
    FaCheckCircle,
    FaTimesCircle,
    FaArrowLeft
} from "react-icons/fa";
import Link from "next/link";

const QUIZ_SIZES = [10, 20, 50, 70, 100, 120];

export default function PsychologyDashboard() {
    const [phase, setPhase] = useState("select");
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(false);
    const [totalAvailable, setTotalAvailable] = useState(0);

    useEffect(() => {
        const getCount = async () => {
            const { count } = await supabase
                .from("questions")
                .select("*", { count: "exact", head: true })
                .eq("module", "psychology");
            setTotalAvailable(count || 0);
        };
        getCount();
    }, []);

    const startQuiz = async (size) => {
        setLoading(true);
        setSelectedSize(size);

        const { data, error } = await supabase
            .from("questions")
            .select("*")
            .eq("module", "psychology")
            .limit(size);

        if (!error && data) {
            const shuffled = data.sort(() => Math.random() - 0.5);
            setQuestions(shuffled);
            setAnswers(new Array(shuffled.length).fill(null));
            setCurrentIndex(0);
            setPhase("quiz");
        }
        setLoading(false);
    };

    const recordAnswer = useCallback((answerIndex) => {
        setAnswers(prev => {
            const updated = [...prev];
            updated[currentIndex] = answerIndex;
            return updated;
        });
    }, [currentIndex]);

    const goNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setPhase("results");
        }
    };

    const goBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const score = answers.reduce((acc, answer, idx) => {
        if (answer === questions[idx]?.correct_answer) return acc + 1;
        return acc;
    }, 0);

    const scorePercentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

    const resetQuiz = () => {
        setPhase("select");
        setQuestions([]);
        setAnswers([]);
        setCurrentIndex(0);
        setSelectedSize(null);
    };

    // ─── SELECT PHASE ───
    if (phase === "select") {
        return (
            <div className="hero-gradient min-h-[calc(100vh-5rem)] p-6 md:p-12">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-16 text-center animate-fade-in">
                        <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-6">
                            <FaBrain size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                            BLEPP Psychology Reviewer
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
                            Master your licensure exam with high-yield questions for Psychologists and Psychometricians.
                        </p>
                        {totalAvailable > 0 && (
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                                <FaChartBar /> {totalAvailable} questions available
                            </div>
                        )}
                    </header>

                    <div className="animate-fade-in animation-delay-300">
                        <h2 className="text-center text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                            Select Number of Items
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                            {QUIZ_SIZES.map((size) => {
                                const isAvailable = size <= totalAvailable;
                                return (
                                    <button
                                        key={size}
                                        onClick={() => isAvailable && startQuiz(size)}
                                        disabled={!isAvailable || loading}
                                        className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-center ${isAvailable
                                                ? "border-slate-200 bg-white hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer"
                                                : "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                                            }`}
                                    >
                                        <div className="text-3xl font-black text-slate-800 group-hover:text-primary transition-colors">
                                            {size}
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                            Items
                                        </div>
                                        {!isAvailable && (
                                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Not Enough</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center mt-12 gap-4">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Preparing your exam...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── QUIZ PHASE ───
    if (phase === "quiz") {
        const currentQ = questions[currentIndex];
        const hasAnswered = answers[currentIndex] !== null;

        return (
            <div className="hero-gradient min-h-[calc(100vh-5rem)] p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-3">
                            <button
                                onClick={resetQuiz}
                                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2"
                            >
                                <FaArrowLeft /> Exit
                            </button>
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                {currentIndex + 1} / {questions.length}
                            </div>
                            <div className="text-xs font-black text-primary uppercase tracking-widest">
                                Score: {score}
                            </div>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-violet-400 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <QuizCard
                        key={currentQ.id}
                        question={currentQ.question}
                        choices={[currentQ.choice_a, currentQ.choice_b, currentQ.choice_c, currentQ.choice_d]}
                        correctAnswer={currentQ.correct_answer}
                        explanation={currentQ.explanation}
                        category={currentQ.category}
                        onAnswerSelect={recordAnswer}
                    />

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 animate-fade-in">
                        <button
                            onClick={goBack}
                            disabled={currentIndex === 0}
                            className="px-6 py-3 rounded-xl border-2 border-slate-200 text-sm font-black text-slate-500 uppercase tracking-widest hover:border-slate-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={goNext}
                            disabled={!hasAnswered}
                            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 ${hasAnswered
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
                                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                }`}
                        >
                            {currentIndex === questions.length - 1 ? (
                                <>Finish <FaTrophy /></>
                            ) : (
                                <>Next <FaArrowRight /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── RESULTS PHASE ───
    return (
        <div className="hero-gradient min-h-[calc(100vh-5rem)] p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <div className={`inline-flex p-6 rounded-3xl mb-6 ${scorePercentage >= 75 ? 'bg-primary/10 text-primary' : scorePercentage >= 50 ? 'bg-amber-100 text-amber-600' : 'bg-red-50 text-red-500'}`}>
                        <FaTrophy size={48} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                        {scorePercentage >= 75 ? "Excellent!" : scorePercentage >= 50 ? "Good Effort!" : "Keep Practicing!"}
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        You completed {questions.length} psychology board exam items.
                    </p>
                </div>

                {/* Score Card */}
                <div className="glass-panel p-10 text-center mb-10 animate-fade-in animation-delay-300">
                    <div className={`text-7xl font-black mb-2 ${scorePercentage >= 75 ? 'text-primary' : scorePercentage >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {scorePercentage}%
                    </div>
                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
                        {score} out of {questions.length} correct
                    </div>
                    <div className="flex justify-center gap-8">
                        <div className="flex items-center gap-2 text-primary">
                            <FaCheckCircle />
                            <span className="text-sm font-bold">{score} Correct</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-500">
                            <FaTimesCircle />
                            <span className="text-sm font-bold">{questions.length - score} Incorrect</span>
                        </div>
                    </div>
                </div>

                {/* Review Missed Questions */}
                {answers.some((a, i) => a !== questions[i]?.correct_answer) && (
                    <div className="mb-10 animate-fade-in">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 text-center">
                            Review Incorrect Answers
                        </h2>
                        <div className="space-y-6">
                            {questions.map((q, idx) => {
                                if (answers[idx] === q.correct_answer) return null;
                                return (
                                    <div key={q.id} className="glass-panel p-6 border-l-4 border-l-red-400">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                            Item #{idx + 1} — {q.category}
                                        </div>
                                        <p className="font-bold text-slate-800 mb-3">{q.question}</p>
                                        <div className="grid gap-2 mb-4">
                                            {[q.choice_a, q.choice_b, q.choice_c, q.choice_d].map((c, cIdx) => (
                                                <div
                                                    key={cIdx}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${cIdx === q.correct_answer
                                                            ? "bg-primary/10 border-primary/30 text-primary font-bold"
                                                            : cIdx === answers[idx]
                                                                ? "bg-red-50 border-red-200 text-red-600 line-through opacity-70"
                                                                : "bg-slate-50 border-slate-100 text-slate-500"
                                                        }`}
                                                >
                                                    <span className="font-black mr-2">{String.fromCharCode(65 + cIdx)}.</span>
                                                    {c}
                                                </div>
                                            ))}
                                        </div>
                                        {q.explanation && (
                                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 italic">
                                                <span className="font-black not-italic">Rationale:</span> {q.explanation}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
                    <button
                        onClick={resetQuiz}
                        className="px-8 py-4 rounded-xl border-2 border-slate-200 text-sm font-black text-slate-600 uppercase tracking-widest hover:border-slate-400 transition-all flex items-center justify-center gap-2"
                    >
                        <FaRedo /> Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-4 rounded-xl bg-primary text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl transition-all text-center"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
