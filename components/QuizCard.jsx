"use client";

import { useState } from "react";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaLightbulb,
    FaRegClock,
    FaGraduationCap,
    FaEdit,
    FaTrash
} from "react-icons/fa";

export default function QuizCard({ question, choices = [], correctAnswer, explanation, category, onEdit, onDelete, onAnswerSelect, rankMode = false }) {
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [isRevealed, setIsRevealed] = useState(false);

    const handleChoiceClick = (index) => {
        if (isRevealed) return;
        setSelectedChoice(index);
        if (!rankMode) setIsRevealed(true);
        if (onAnswerSelect) onAnswerSelect(index);
    };

    const getChoiceClass = (index) => {
        // Rank mode: only highlight the selected choice neutrally, no reveal
        if (rankMode) {
            return selectedChoice === index
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                : "border-border hover:border-primary-light hover:bg-slate-50 hover:translate-x-1";
        }

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
        <div className="glass-panel p-8 mb-8 animate-fade-in max-w-2xl mx-auto overflow-hidden relative group border-t-0">
            {/* Dynamic Status Ribbon */}
            <div className={`absolute top-0 left-0 h-1.5 transition-all duration-700 ease-in-out ${rankMode
                ? "bg-primary/30 w-full"
                : isRevealed
                    ? (selectedChoice === correctAnswer ? "bg-secondary w-full" : "bg-red-500 w-full")
                    : "bg-slate-200 w-full"
                }`} />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                        <FaGraduationCap size={14} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
                        {category}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    {!rankMode && isRevealed && (
                        <div className={`flex items-center gap-2 text-xs font-bold animate-fade-in ${selectedChoice === correctAnswer ? 'text-secondary' : 'text-red-600'
                            }`}>
                            {selectedChoice === correctAnswer ? (
                                <><FaCheckCircle /> Correct</>
                            ) : (
                                <><FaTimesCircle /> Incorrect</>
                            )}
                        </div>
                    )}
                    {rankMode && selectedChoice !== null && (
                        <div className="flex items-center gap-2 text-xs font-bold animate-fade-in text-primary">
                            <FaRegClock /> Saved
                        </div>
                    )}

                    {/* Management Actions */}
                    {(onEdit || onDelete) && (
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
                            {onEdit && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit();
                                    }}
                                    className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all border border-slate-100"
                                    title="Edit Question"
                                >
                                    <FaEdit size={14} />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100"
                                    title="Delete Question"
                                >
                                    <FaTrash size={14} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-10 text-slate-800 leading-[1.4]">
                {question}
            </h3>

            <div className="grid gap-4 mb-8">
                {choices.map((choice, index) => {
                    const isCorrect = isRevealed && index === correctAnswer;
                    const isWrong = isRevealed && index === selectedChoice && index !== correctAnswer;

                    return (
                        <button
                            key={index}
                            onClick={() => handleChoiceClick(index)}
                            className={`group/btn relative flex items-center p-5 rounded-xl border-2 transition-all duration-300 ${getChoiceClass(index)}`}
                            disabled={isRevealed}
                        >
                            <span className={`flex-shrink-0 w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-sm mr-4 transition-all duration-300 ${rankMode
                                ? selectedChoice === index
                                    ? "bg-primary text-white border-primary"
                                    : "border-slate-200 text-slate-400 group-hover/btn:border-primary group-hover/btn:text-primary"
                                : isCorrect ? "bg-secondary text-white border-secondary rotate-[360deg]" :
                                    isWrong ? "bg-red-500 text-white border-red-500" :
                                        "border-slate-200 text-slate-400 group-hover/btn:border-primary group-hover/btn:text-primary"
                                }`}>
                                {String.fromCharCode(65 + index)}
                            </span>

                            <span className="text-base md:text-lg text-left font-medium text-slate-700 leading-snug">
                                {choice}
                            </span>
                        </button>
                    );
                })}
            </div>

            {
                !rankMode && isRevealed && (
                    <div className="mt-10 animate-fade-in">
                        <div className="flex items-center gap-2 mb-4 text-amber-600">
                            <FaLightbulb className="animate-pulse" />
                            <p className="text-xs font-black uppercase tracking-[0.2em]">Rationalization</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner relative">
                            <p className="text-slate-600 leading-relaxed text-base italic">
                                {explanation}
                            </p>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
