"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Globe, ArrowRight, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Floating micro-particles inside the light cone
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const SUGGESTIONS = [
  "miracle",
  "future",
  "vision",
  "SaaS",
  "web app",
  "AI tool",
  "mobile",
];

export function CreativeSearchPrompt() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate floating dust particles in the light beam zone
  useEffect(() => {
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 140 + 20, // Spread within the light beam width
      y: Math.random() * 40 - 20,  // Vertically spread around the center
      size: Math.random() * 2.5 + 1.5,
      duration: Math.random() * 2.5 + 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, [value, displayedWord]);

  // Typewriter effect for when the input is empty and not focused
  useEffect(() => {
    if (isFocused || value.length > 0) return;

    let timer: NodeJS.Timeout;
    const activeWord = SUGGESTIONS[currentWordIndex];

    const type = () => {
      if (!isDeleting) {
        setDisplayedWord(activeWord.substring(0, displayedWord.length + 1));
        if (displayedWord === activeWord) {
          // Pause at the end of the word
          timer = setTimeout(() => setIsDeleting(true), 2500);
          return;
        }
      } else {
        setDisplayedWord(activeWord.substring(0, displayedWord.length - 1));
        if (displayedWord === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % SUGGESTIONS.length);
          return;
        }
      }

      const speed = isDeleting ? 40 : 80;
      timer = setTimeout(type, speed);
    };

    timer = setTimeout(type, 100);
    return () => clearTimeout(timer);
  }, [displayedWord, isDeleting, currentWordIndex, isFocused, value]);

  // Handle Search Execution
  const handleSearch = () => {
    const query = value.trim() || displayedWord || "miracle";
    router.push(`/contact?prompt=${encodeURIComponent("Let's build " + query)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Determine what text to show in the illuminated (right) side
  const rightText = isFocused || value.length > 0 ? value : displayedWord;

  return (
    <div className="w-full max-w-2xl mt-8">
      {/* ── Main Input Capsule Box ── */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className={`relative w-full rounded-[24px] bg-white/70 backdrop-blur-xl border transition-all duration-500 cursor-text select-none overflow-hidden group
          ${isFocused 
            ? "border-black/35 shadow-[0_20px_40px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.8)] scale-[1.01]" 
            : "border-black/15 hover:border-black/25 shadow-[0_15px_30px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,0.8)]"
          }`}
        style={{
          padding: "20px 28px",
          minHeight: "84px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Hidden Input field captured dynamically */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10 px-6"
          placeholder=""
        />

        {/* Text Area Container */}
        <div className="flex items-center flex-wrap font-sans text-[18px] sm:text-[26px] md:text-[32px] font-black uppercase tracking-tight text-neutral-900 leading-none relative z-20 pointer-events-none select-none">
          {/* Prefix "Let's build" */}
          <span className="text-black/80 font-black tracking-tighter mr-2 sm:mr-3 shrink-0">
            Let&apos;s build
          </span>

          {/* Glowing Vertical Cursor Line & Particle Light Beam */}
          <div className="relative flex items-center h-[34px] sm:h-[42px] shrink-0 mr-1 sm:mr-2">
            {/* Glowing Emitter Beam Cone */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-y-1/2 h-[70px] sm:h-[90px] pointer-events-none origin-left transition-all duration-300"
              style={{
                width: rightText ? "180px" : "110px",
                background: "linear-gradient(90deg, rgba(255, 84, 0, 0.16) 0%, rgba(255, 84, 0, 0.05) 45%, rgba(255, 84, 0, 0.01) 75%, transparent 100%)",
                transform: "translateY(-50%)",
                clipPath: "polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)",
              }}
            />

            {/* Glowing vertical line cursor */}
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[3.5px] sm:w-[4px] h-[28px] sm:h-[36px] bg-white rounded-full relative z-30"
              style={{
                boxShadow: "0 0 10px #ff5400, 0 0 20px #ff5400, 0 0 35px rgba(255, 84, 0, 0.8)",
              }}
            />

            {/* Micro floating particles inside the light beam */}
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.2, x: 0, y: p.y }}
                  animate={{
                    opacity: [0, 0.8, 0.8, 0],
                    scale: [0.2, 1, 1, 0.2],
                    x: p.x,
                    y: p.y - 12,
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: "easeOut",
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#ff5400] pointer-events-none"
                  style={{
                    width: p.size,
                    height: p.size,
                    filter: "blur(0.5px)",
                    boxShadow: "0 0 6px #ff5400",
                  }}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Right text (illuminated text) */}
          <div className="relative inline-block shrink-0">
            {/* The actual text styled beautifully with high premium aesthetic */}
            <span 
              className="font-black tracking-tighter whitespace-nowrap"
              style={{
                background: "linear-gradient(to right, #ff5400 0%, #ff8c00 70%, rgba(255, 84, 0, 0.6) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 10px rgba(255, 84, 0, 0.08)",
              }}
            >
              {rightText}
            </span>

            {/* Display static placeholder text when input is unfocused and empty */}
            {!isFocused && value.length === 0 && displayedWord === "" && (
              <span className="text-black/20 font-black tracking-tighter absolute left-0 top-0 whitespace-nowrap">
                something great
              </span>
            )}
          </div>
        </div>

        {/* Action Hint (Enter to Search icon) on far right */}
        {isFocused && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-200/60 rounded px-2 py-1 select-none pointer-events-none animate-fade-in shrink-0 hidden sm:flex">
            <span>ENTER</span>
            <CornerDownLeft size={10} className="mt-0.5" />
          </div>
        )}
      </div>

      {/* ── Sub-bar Elements Aligned underneath the capsule box ── */}
      <div className="flex items-center justify-between mt-4 px-1 w-full">
        <div className="flex items-center gap-3">
          {/* Avatar Profile */}
          <div className="relative group/avatar cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff5400] to-[#ff8c00] rounded-full blur-[2px] opacity-40 group-hover/avatar:opacity-100 transition duration-300" />
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white bg-neutral-100 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Lead Designer Portrait"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/avataaars/svg?seed=VoquarnLead";
                }}
              />
            </div>
            {/* Online Pulse Indicator */}
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </div>

          {/* Attachment Paperclip Button */}
          <button 
            type="button"
            onClick={() => {
              setValue("a high-performing website");
              inputRef.current?.focus();
            }}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-neutral-50 hover:bg-[#ff5400] text-neutral-600 hover:text-white border border-neutral-200/50 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 group/clip"
            title="Attach brief / Autocomplete preset"
          >
            <Paperclip size={18} className="transition-transform duration-300 group-hover/clip:rotate-45" />
          </button>
        </div>

        {/* Premium Action Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          className="relative overflow-hidden h-11 px-6 rounded-full flex items-center gap-2.5 bg-[#2d2d2d] hover:bg-[#3a3a3a] text-white font-bold text-[12px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02] group/btn border border-neutral-700/30"
        >
          {/* Shining / Shimmer Effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "180%" }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 2.2,
              ease: "easeInOut",
              repeatDelay: 1.5,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[60%] -skew-x-12 pointer-events-none"
          />
          <Globe size={14} className="text-[#ff5400] transition-transform duration-500 group-hover/btn:rotate-180 relative z-10" />
          <span className="relative z-10">Launch Search</span>
          <ArrowRight size={14} className="text-white/60 transition-transform duration-300 group-hover/btn:translate-x-1 relative z-10" />
        </button>
      </div>
    </div>
  );
}
