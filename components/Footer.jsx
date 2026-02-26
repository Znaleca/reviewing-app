import Link from "next/link";
import { FaAward, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-32 bg-gradient-to-t from-white/90 via-white/70 to-white/40 backdrop-blur-lg border-t border-slate-200">
            {/* Decorative Glows */}
            <div className="absolute -top-16 left-1/4 w-72 h-36 bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-16 right-1/3 w-72 h-36 bg-accent/10 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white/40 border border-white/40 px-4 py-1.5 rounded-full shadow-md">
                            <FaAward className="text-primary text-sm" />
                            <span className="text-primary font-bold text-xs tracking-widest uppercase">
                                Future Topnotcher
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
                            Topnotcher <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Portal</span>
                        </h2>
                        <p className="text-sm md:text-base text-slate-600 max-w-md">
                            Your ultimate platform for excellence in board exam preparation. Learn, review, and succeed with confidence.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 mt-4">
                            <Link href="#" className="text-slate-500 hover:text-primary transition-colors">
                                <FaFacebookF />
                            </Link>
                            <Link href="#" className="text-slate-500 hover:text-accent transition-colors">
                                <FaInstagram />
                            </Link>
                            <Link href="#" className="text-slate-500 hover:text-secondary transition-colors">
                                <FaTwitter />
                            </Link>
                        </div>
                    </div>

                    {/* Review Modules */}
                    <div>
                        <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider mb-6">
                            Review Modules
                        </h3>
                        <ul className="space-y-4 text-sm font-medium text-slate-500">
                            <li>
                                <Link href="/psychology" className="hover:text-accent transition-colors flex items-center gap-2 group">
                                    <span className="w-2 h-2 rounded-full bg-accent/50 group-hover:scale-150 transition-transform"></span>
                                    Psychology (BLEPP)
                                </Link>
                            </li>
                            <li>
                                <Link href="/nursing" className="hover:text-secondary transition-colors flex items-center gap-2 group">
                                    <span className="w-2 h-2 rounded-full bg-secondary/50 group-hover:scale-150 transition-transform"></span>
                                    Nursing (PNLE)
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider mb-6">
                            Platform
                        </h3>
                        <ul className="space-y-4 text-sm font-medium text-slate-500">
                            <li>
                                <Link href="/about" className="hover:text-slate-900 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-slate-900 transition-colors">
                                    Contact Support
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] font-medium text-slate-400">
                    <p>
                        &copy; {currentYear} <span className="text-slate-700 font-bold tracking-tight">Topnotcher Portal</span>. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold">
                        <span className="text-slate-300">Excellence in Board Preparation</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}