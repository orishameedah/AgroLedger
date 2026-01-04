"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    // INCREASED OPACITY: bg-white/90 ensures text is always readable over LightRays
    // CHANGED BORDER: border-slate-200/60 is cleaner than white/10 for a light theme
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur border-b border-slate-200/40">
      <nav className="mx-auto flex items-center justify-between px-6 py-4 max-w-7xl">
        {/* Left Side */}
        <Link
          href="/"
          className="text-3xl font-bold text-green-700 hover:opacity-90 transition-opacity"
        >
          Agroledger
        </Link>

        {/* Right Side*/}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-slate-700 hover:text-green-700 font-bold font-heading text-lg transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/signup"
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-4xl transition-all hover:scale-105 w-full sm:w-auto"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2 text-green-700 focus:outline-none cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div
            className="absolute top-full left-0 w-full z-20 md:hidden flex flex-col justify-center items-center p-8 space-y-6
            bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-xl animate-mobile-menu"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-bold text-slate-800 hover:text-green-700 transition-colors text-center w-full py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/signup"
              className="bg-green-600 hover:bg-green-700 hover:text-black text-white font-bold px-6 py-3 rounded-full transition-all hover:scale-105 w-full sm:w-auto"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
