"use client";

import {
    FaFire,
    FaTrophy,
    FaChartLine,
    FaLayerGroup,
    FaCheckCircle
} from "react-icons/fa";

export default function ProfileStats({ stats, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-slate-100 rounded-3xl" />
                ))}
            </div>
        );
    }

    const statCards = [
        {
            label: "Total Rank Points",
            value: stats.totalPoints.toLocaleString(),
            icon: <FaFire className="text-amber-500" />,
            bg: "bg-amber-50",
            border: "border-amber-100",
            textColor: "text-amber-700"
        },
        {
            label: "Quizzes Completed",
            value: stats.quizCount,
            icon: <FaTrophy className="text-primary" />,
            bg: "bg-primary/5",
            border: "border-primary/10",
            textColor: "text-primary"
        },
        {
            label: "Average Accuracy",
            value: `${stats.accuracy}%`,
            icon: <FaChartLine className="text-emerald-500" />,
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            textColor: "text-emerald-700"
        },
        {
            label: "Total Questions",
            value: stats.totalAnswered.toLocaleString(),
            icon: <FaCheckCircle className="text-violet-500" />,
            bg: "bg-violet-50",
            border: "border-violet-100",
            textColor: "text-violet-700"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((card, idx) => (
                <div
                    key={idx}
                    className={`p-6 rounded-3xl border ${card.bg} ${card.border} transition-all hover:scale-[1.02] duration-300`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-2xl bg-white shadow-sm ${card.textColor}`}>
                            {card.icon}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-2xl font-black ${card.textColor}`}>
                            {card.value}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                            {card.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
