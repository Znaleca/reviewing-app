"use client";

import { useState } from "react";
import {
    FaEye,
    FaEyeSlash,
    FaBrain,
    FaHeartbeat,
    FaUserEdit,
    FaLightbulb
} from "react-icons/fa";

export default function FlashCard({
    id,
    question,
    choices = [],
    correctAnswer,
    explanation,
    category,
    module,
    creatorName
}) {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div className="glass-panel flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden group">
            {/* Header / Meta Info */}
            <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${module === 'psychology' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                        {module === 'psychology' ? <FaBrain size={12} /> : <FaHeartbeat size={12} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {category}
                    </span>
                </div>

                {/* Creator Attribution */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/5 text-[9px] font-black text-slate-500 uppercase tracking-tighter border border-slate-100/50">
                    <FaUserEdit size={10} className="text-primary/50" />
                    <span>{creatorName || "Community Member"}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 pt-6 flex-grow">
                <h3 className="text-xl font-bold text-slate-800 leading-relaxed mb-6">
                    {question}
                </h3>

                <div className="grid gap-3">
                    {choices.map((choice, idx) => (
                        <div
                            key={idx}
                            className={`p-4 rounded-xl border text-sm font-medium transition-all duration-300 ${isRevealed && idx === correctAnswer
                                    ? "bg-primary/10 border-primary/30 text-primary font-bold shadow-sm"
                                    : isRevealed
                                        ? "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60"
                                        : "bg-slate-50/50 border-slate-100 text-slate-600"
                                }`}
                        >
                            <span className="font-black mr-2 text-[10px] opacity-40">{String.fromCharCode(65 + idx)}.</span>
                            {choice}
                        </div>
                    ))}
                </div>

                {/* Rationale / Explanation */}
                {isRevealed && explanation && (
                    <div className="mt-6 p-5 rounded-2xl bg-amber-50/50 border border-amber-100/50 animate-slide-down">
                        <div className="flex items-center gap-2 mb-2 text-amber-600">
                            <FaLightbulb size={12} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Rationale</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                            {explanation}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <button
                onClick={() => setIsRevealed(!isRevealed)}
                className={`w-full py-4 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isRevealed
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-primary hover:text-white"
                    }`}
            >
                {isRevealed ? (
                    <><FaEyeSlash size={14} /> Hide Answer</>
                ) : (
                    <><FaEye size={14} /> Reveal Answer</>
                )}
            </button>
        </div>
    );
}
