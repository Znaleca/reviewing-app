"use client";

import { FaFacebook, FaPaperPlane, FaLinkedin } from "react-icons/fa";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">

            {/* Left Side: Full Screen Image Section */}
            <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen overflow-hidden">
                <img
                    src="/images/YUTA.jpg"
                    alt="Merlin - Developer"
                    className="w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-105"
                />
                {/* Overlay Gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/10" />

                {/* Floating Badge on Image */}
                <div className="absolute bottom-8 left-8 z-20">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                        <p className="text-white text-xs font-black uppercase tracking-[0.3em] mb-1">Developer</p>
                        <p className="text-white/80 text-[10px] font-medium italic">Dedicated to excellence in board prep.</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Content Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-slate-50/30">
                <div className="max-w-md w-full animate-fade-in">

                    {/* Header Section */}
                    <div className="mb-12">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10 mb-6">
                            Full Stack Developer
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-6">
                            Hi, I'm <span className="text-primary italic">Merlin</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            "Let's chat and find ways to improve your board exam preparation together."
                        </p>
                    </div>

                    {/* Action Hub */}
                    <div className="space-y-4">
                        <a
                            href="https://www.facebook.com/imbernardlanz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center transition-all duration-500 group-hover:bg-[#0866FF] group-hover:text-white group-hover:rotate-6">
                                    <FaFacebook size={26} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Connect with me</p>
                                    <p className="text-base font-bold text-slate-700 font-sans">Facebook</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all group-hover:rotate-12">
                                <FaPaperPlane size={14} className="-rotate-45" />
                            </div>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/bernard-lanz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-100 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-400/5 transition-all duration-500"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-[#0077B5]/10 text-[#0077B5] flex items-center justify-center transition-all duration-500 group-hover:bg-[#0077B5] group-hover:text-white group-hover:-rotate-6">
                                    <FaLinkedin size={26} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Professional Network</p>
                                    <p className="text-base font-bold text-slate-700 font-sans">LinkedIn</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#0077B5] group-hover:text-white transition-all group-hover:rotate-12">
                                <FaPaperPlane size={14} className="-rotate-45" />
                            </div>
                        </a>
                    </div>

                    {/* Footer Quote */}
                    <div className="mt-16 pt-8 border-t border-slate-100 flex items-center gap-4">
                        <span className="text-2xl opacity-20">🇵🇭</span>
                        <p className="italic text-slate-400 text-xs font-semibold leading-relaxed">
                            Focused on building the future of <br />
                            Philippine Board Exam Review.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}