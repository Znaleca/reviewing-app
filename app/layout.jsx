import { Geist, Geist_Mono } from "next/font/google";
import "@/assets/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Topnotcher Portal | PH Board Exam Reviewer",
  description: "The premium digital review platform for BLEPP and PNLE candidates in the Philippines.",
  keywords: ["BLEPP", "PNLE", "Nursing Board Exam", "Psychology Board Exam", "Reviewer Philippines"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/20 selection:text-primary`}
      >
        {/* Optional: Add a subtle grain overlay for a tactile, professional feel */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <main className="relative flex flex-col min-h-screen pt-20">
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}