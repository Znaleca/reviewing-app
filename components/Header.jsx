"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    FaGraduationCap,
    FaBars,
    FaTimes,
    FaUserCircle,
    FaSignOutAlt,
    FaShieldAlt,
    FaUserGraduate,
    FaHistory
} from "react-icons/fa";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Navigation Links Array
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Study Guide", href: "/courses" },
        { name: "Showcase", href: "/flashcards" },
        { name: "Contact", href: "/contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                fetchProfile(session.user.id);
            }
            setLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (userId) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (!error && data) {
            setProfile(data);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
                ? "py-3 bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/40"
                : "py-6 bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                        <FaGraduationCap size={20} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-black tracking-tighter text-slate-900">
                            TOPNOTCHER
                        </span>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                            Portal
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {/* Main Menu Links */}
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold text-slate-600 hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user && (
                            <Link
                                href="/flashcards/my"
                                className="text-sm font-black text-slate-800 hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                                <FaHistory className="size-3.5" />
                                My Cards
                            </Link>
                        )}
                    </div>

                    {!loading && (
                        user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-black text-slate-900 leading-none mb-1">
                                        {profile?.full_name || "User"}
                                    </span>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${profile?.role === 'admin'
                                            ? 'bg-accent/10 text-accent ring-1 ring-accent/20'
                                            : 'bg-primary/10 text-primary ring-1 ring-primary/20'
                                            }`}>
                                            {profile?.role === 'admin' ? <FaShieldAlt className="size-2" /> : <FaUserGraduate className="size-2" />}
                                            {profile?.role || 'Examinee'}
                                        </div>
                                        {profile?.sub_role && (
                                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] bg-slate-100 px-1.5 py-0.5 rounded-md">
                                                {profile.sub_role === 'psychology' ? 'BLEPP Candidate' : 'PNLE Candidate'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100"
                                    title="Log Out"
                                >
                                    <FaSignOutAlt size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                                <Link
                                    href="/login"
                                    className="text-sm font-bold text-slate-900 hover:text-primary transition-all"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-premium text-sm py-2.5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )
                    )}
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-slate-900"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 top-[73px] bg-white/95 backdrop-blur-2xl z-[90] transition-all duration-500 md:hidden ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col p-8 gap-4">
                    {/* Mobile Main Links */}
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-2"
                        >
                            {link.name}
                        </Link>
                    ))}



                    {user && (
                        <Link
                            href="/flashcards/my"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xl font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2"
                        >
                            <FaHistory size={20} />
                            My Cards
                        </Link>
                    )}

                    <div className="my-4 h-px bg-slate-100" />

                    {user && (
                        <div className="mb-4 p-6 glass-panel flex items-center gap-4 border-primary/10">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <FaUserCircle size={32} />
                            </div>
                            <div>
                                <p className="font-black text-slate-900">{profile?.full_name || "User"}</p>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                    {profile?.role || "Examinee"}
                                </span>
                            </div>
                        </div>
                    )}

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-black uppercase tracking-widest text-sm text-center"
                        >
                            Sign Out
                        </button>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-bold text-slate-600 p-4 text-center"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="btn-premium text-center py-4"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header >
    );
}