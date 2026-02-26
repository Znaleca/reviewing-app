"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaEnvelope, FaLock, FaUser, FaCheckCircle } from "react-icons/fa";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [field, setField] = useState("psychology");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: "examinee",
                    sub_role: field,
                },
            },
        });

        if (error) {
            setMessage({ type: "error", icon: <FaLock className="text-red-500" />, text: error.message });
        } else {
            setMessage({ type: "success", icon: <FaCheckCircle className="text-secondary" />, text: "Check your email for the confirmation link!" });
            setTimeout(() => router.push("/login"), 3000);
        }
        setLoading(false);
    };

    return (
        <div className="hero-gradient min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 relative">
            {/* Decorative background glow */}
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

            <div className="glass-panel max-w-md w-full p-10 animate-fade-in relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
                        <FaUserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 mt-2 font-medium">Join the Topnotcher community</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
                        <div className="relative group">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary" />
                            <input
                                type="text"
                                placeholder="Juan Dela Cruz"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-medium text-slate-700"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
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

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">My Goal is...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setField("psychology")}
                                className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${field === "psychology"
                                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                BLEPP (Psychology)
                            </button>
                            <button
                                type="button"
                                onClick={() => setField("nursing")}
                                className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${field === "nursing"
                                    ? "border-secondary bg-secondary/5 text-secondary shadow-sm"
                                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                    }`}
                            >
                                PNLE (Nursing)
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-start gap-3 animate-fade-in ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            }`}>
                            <div className="mt-0.5">{message.icon}</div>
                            <p className="text-sm font-bold">{message.text}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-premium py-4 font-black tracking-widest uppercase text-sm shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500 font-bold text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline decoration-2 underline-offset-4">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
