"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    FaSearch,
    FaFilter,
    FaLayerGroup,
    FaGlobeAmericas,
    FaPlay,
    FaUserCircle
} from "react-icons/fa";
import Link from "next/link"; // Import Link for navigation

export default function FlashcardsFeed() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModule, setSelectedModule] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("questions")
            .select(`
                *,
                profiles (
                    full_name
                )
            `)
            .order("created_at", { ascending: false });

        if (data) {
            setCards(data);
        }
        setLoading(false);
    };

    // 1. Filter the cards first
    const filteredCards = cards.filter(card => {
        const matchesSearch =
            card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.explanation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesModule = selectedModule === "all" || card.module === selectedModule;
        const matchesCategory = selectedCategory === "all" || card.category === selectedCategory;
        return matchesSearch && matchesModule && matchesCategory;
    });

    // 2. Group the filtered cards by creator (user_id)
    const groupedDecks = Object.values(filteredCards.reduce((acc, card) => {
        const creatorId = card.user_id;
        if (!acc[creatorId]) {
            acc[creatorId] = {
                creatorId: creatorId,
                creatorName: card.profiles?.full_name || "Anonymous Reviewer",
                count: 0,
                categories: new Set(),
                module: card.module // Grabbing the first module for display purposes
            };
        }
        acc[creatorId].count += 1;
        if (card.category) acc[creatorId].categories.add(card.category);
        return acc;
    }, {}));

    const categories = ["all", ...new Set(cards.map(c => c.category).filter(Boolean))].sort();

    return (
        <div className="hero-gradient min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="mb-12 text-center animate-fade-in">
                    <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-6">
                        <FaGlobeAmericas size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Community Decks
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                        Explore study decks created by our community. Click on a creator's deck to start practicing their questions.
                    </p>
                </header>

                {/* Filters & Search */}
                <div className="glass-panel p-6 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-in animation-delay-200">
                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search topics, questions, or creators..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-600"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100">
                            <FaFilter className="text-slate-400 size-3" />
                            <select
                                value={selectedModule}
                                onChange={(e) => setSelectedModule(e.target.value)}
                                className="text-sm font-bold text-slate-600 outline-none bg-transparent"
                            >
                                <option value="all">All Modules</option>
                                <option value="psychology">Psychology</option>
                                <option value="nursing">Nursing</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100">
                            <FaLayerGroup className="text-slate-400 size-3" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="text-sm font-bold text-slate-600 outline-none bg-transparent max-w-[150px]"
                            >
                                <option value="all">All Topics</option>
                                {categories.filter(c => c !== "all").map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Decks...</p>
                    </div>
                ) : groupedDecks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in animation-delay-300">
                        {groupedDecks.map((deck) => (
                            <Link
                                href={`/flashcards/view?creator=${deck.creatorId}`}
                                key={deck.creatorId}
                                className="group relative glass-panel p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
                            >
                                {/* Decorative background elements to look like stacked cards */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />

                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                            <FaUserCircle size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 line-clamp-1">
                                                {deck.creatorName}
                                            </h3>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                                                Creator
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {Array.from(deck.categories).slice(0, 3).map(cat => (
                                            <span key={cat} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-bold text-slate-500">
                                                {cat}
                                            </span>
                                        ))}
                                        {deck.categories.size > 3 && (
                                            <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-bold text-slate-400">
                                                +{deck.categories.size - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                                    <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
                                        <FaLayerGroup />
                                        <span>{deck.count} Cards</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FaPlay className="ml-1 size-3" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 animate-fade-in">
                        <div className="text-slate-300 mb-4 flex justify-center">
                            <FaLayerGroup size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No decks found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
}