"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
    FaGraduationCap,
    FaBars,
    FaTimes,
    FaUserCircle,
    FaShieldAlt,
    FaUserGraduate,
    FaHistory,
    FaTrophy
} from "react-icons/fa";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Navigation Links Array
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Study Guide", href: "/courses" },
        { name: "Showcase", href: "/flashcards" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);

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
            document.removeEventListener("mousedown", handleClickOutside);
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
                                <FaHistory className="size-3.5" strokeWidth={1} />
                                My Cards
                            </Link>
                        )}

                        <Link
                            href="/leaderboards"
                            className="text-sm font-black text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1.5"
                        >
                            <FaTrophy className="size-3.5" />
                            Leaderboards
                        </Link>
                    </div>

                    {!loading && (
                        user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className={`group flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 active:scale-95`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                                        <FaUserCircle size={22} />
                                    </div>
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-[13px] font-black text-slate-900 leading-none">
                                            {profile?.full_name || user?.user_metadata?.full_name || "User"}
                                        </span>
                                        <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-tight ${profile?.role === 'admin' ? 'text-accent' : 'text-primary/60'}`}>
                                            {profile?.role || 'Examinee'}
                                            {(profile?.sub_role || user?.user_metadata?.sub_role) && (
                                                <> • {(profile?.sub_role || user?.user_metadata?.sub_role) === 'psychology' ? 'Psychology' : 'Nursing'}</>
                                            )}
                                        </div>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                <div className={`absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 p-2 transition-all duration-300 transform origin-top-right ${isUserDropdownOpen
                                    ? "opacity-100 scale-100 translate-y-0"
                                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                    }`}>
                                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Logged in as</p>
                                        <p className="text-sm font-black text-slate-900 truncate">
                                            {user?.email}
                                        </p>
                                    </div>

                                    <Link
                                        href="/profile"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                        className="flex items-center px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-primary font-bold text-sm transition-all"
                                    >
                                        My Profile
                                    </Link>



                                    <div className="my-2 h-px bg-slate-50" />

                                    <button
                                        onClick={() => {
                                            setIsUserDropdownOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center px-4 py-3 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 font-bold text-sm transition-all"
                                    >
                                        Sign Out
                                    </button>
                                </div>
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
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 active:scale-95 transition-all"
                            >
                                <span className="text-lg font-bold">{link.name}</span>
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400">
                                    <FaGraduationCap size={16} />
                                </div>
                            </Link>
                        ))}

                        {user && (
                            <Link
                                href="/flashcards/my"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 active:scale-95 transition-all"
                            >
                                <span className="text-lg font-bold">My Study Cards</span>
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-amber-500">
                                    <FaHistory size={16} />
                                </div>
                            </Link>
                        )}

                        <Link
                            href="/leaderboards"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 text-primary border border-primary/10 active:scale-95 transition-all"
                        >
                            <span className="text-lg font-bold">Leaderboards</span>
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary">
                                <FaTrophy size={16} />
                            </div>
                        </Link>
                    </div>

                    <div className="my-2 h-px bg-slate-100" />

                    {user && (
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center gap-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <FaUserCircle size={36} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-slate-900 truncate">{profile?.full_name || user?.user_metadata?.full_name || "User"}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                            Examinee Dashboard
                                        </span>
                                    </div>
                                </div>
                            </Link>
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