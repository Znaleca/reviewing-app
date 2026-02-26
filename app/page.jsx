"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  FaBrain,
  FaStethoscope,
  FaArrowRight,
  FaAward,
} from "react-icons/fa";

export default function LandingPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("sub_role, role")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const showPsych = !profile || profile.role === 'admin' || profile.sub_role === 'psychology';
  const showNursing = !profile || profile.role === 'admin' || profile.sub_role === 'nursing';

  return (
    <div className="hero-gradient min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">

      {/* Decorative Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="animate-fade-in max-w-6xl w-full z-10">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white px-5 py-2 rounded-full shadow-lg transition-all hover:shadow-xl">
          <FaAward className="text-primary animate-pulse" />
          <span className="text-primary font-bold text-xs tracking-[0.25em] uppercase">
            Future Topnotcher Portal
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-6xl md:text-8xl mb-8 font-black tracking-tight leading-[1.05] text-slate-900">
          Aspire. Review. <br />
          <span className="text-gradient">Achieve.</span>
        </h1>

        <p className="text-xl text-slate-600 mb-20 max-w-2xl mx-auto leading-relaxed">
          The most comprehensive digital reviewer platform for
          <span className="text-slate-900 font-semibold">
            {" "}Psychology (BLEPP)
          </span>{" "}
          and
          <span className="text-slate-900 font-semibold">
            {" "}Nursing (PNLE)
          </span>{" "}
          candidates.
        </p>

        {/* MODULE CARDS */}
        {!loading && (
          <div className={`grid gap-12 max-w-5xl mx-auto w-full ${showPsych && showNursing ? "md:grid-cols-2" : "md:grid-cols-1 max-w-xl"}`}>

            {/* Psychology Card */}
            {showPsych && (
              <Link href="/psychology" className="group relative">
                <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-accent/40 via-transparent to-primary/40 transition-all duration-500 group-hover:scale-[1.03]">

                  <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl p-10 h-full flex flex-col overflow-hidden transition-all duration-500 group-hover:shadow-2xl">

                    {/* Glow Effect */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/20 blur-[120px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity"></div>

                    {/* Icon */}
                    <div className="mb-8 inline-flex p-5 rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20 transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:scale-110">
                      <FaBrain size={30} />
                    </div>

                    <h2 className="text-3xl font-bold mb-4 text-slate-800 tracking-tight">
                      Psychology
                    </h2>

                    <p className="text-slate-600 mb-12 flex-grow text-lg leading-relaxed">
                      Master Theories of Personality, Abnormal Psychology,
                      Psychological Assessment, and Industrial Psychology.
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-accent font-semibold tracking-wide">
                        Begin BLEPP Review
                      </span>

                      <div className="p-3 rounded-full bg-accent text-white transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg">
                        <FaArrowRight />
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            )}

            {/* Nursing Card */}
            {showNursing && (
              <Link href="/nursing" className="group relative">
                <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-secondary/40 via-transparent to-primary/40 transition-all duration-500 group-hover:scale-[1.03]">

                  <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl p-10 h-full flex flex-col overflow-hidden transition-all duration-500 group-hover:shadow-2xl">

                    {/* Glow Effect */}
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/20 blur-[120px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity"></div>

                    {/* Icon */}
                    <div className="mb-8 inline-flex p-5 rounded-2xl bg-secondary/10 text-secondary ring-1 ring-secondary/20 transition-all duration-300 group-hover:bg-secondary group-hover:text-white group-hover:scale-110">
                      <FaStethoscope size={30} />
                    </div>

                    <h2 className="text-3xl font-bold mb-4 text-slate-800 tracking-tight">
                      Nursing
                    </h2>

                    <p className="text-slate-600 mb-12 flex-grow text-lg leading-relaxed">
                      Comprehensive coverage of Medical-Surgical,
                      Maternal & Child, Community Health,
                      and Psychiatric Nursing.
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-secondary font-semibold tracking-wide">
                        Begin PNLE Review
                      </span>

                      <div className="p-3 rounded-full bg-secondary text-white transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg">
                        <FaArrowRight />
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            )}

          </div>
        )}

      </div>
    </div>
  );
}