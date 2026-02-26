"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSignInAlt, FaEnvelope, FaLock, FaExclamationCircle } from "react-icons/fa";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/");
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="hero-gradient min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 relative">
            {/* Decorative background glow */}
            <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

            <div className="glass-panel max-w-md w-full p-10 animate-fade-in relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
                        <FaSignInAlt size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-2 font-medium">Continue your journey to success</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
                        <div className="relative group">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-medium text-slate-700"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark">Forgot?</a>
                        </div>
                        <div className="relative group">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-medium text-slate-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-start gap-3 animate-fade-in">
                            <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-premium py-4 font-black tracking-widest uppercase text-sm shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-50"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500 font-bold text-sm">
                    New to the portal?{" "}
                    <Link href="/register" className="text-primary hover:underline decoration-2 underline-offset-4">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}
