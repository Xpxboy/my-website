import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, Plus, Play } from 'lucide-react';

const services = [
  {
    id: 'photography',
    title: 'Photography',
    path: 'M 125 0 L 125 80 L 500 150 L 500 200',
    image: '/portfolio/cinematic_camera.png'
  },
  {
    id: 'video',
    title: 'Video Editing',
    path: 'M 375 0 L 375 80 L 500 150 L 500 200',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'retouching',
    title: 'Photo Retouching',
    path: 'M 625 0 L 625 80 L 500 150 L 500 200',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'creative',
    title: 'Creative Direction',
    path: 'M 875 0 L 875 80 L 500 150 L 500 200',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=500&auto=format&fit=crop'
  },
];

export const ServicesDiagram = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState<'idle' | 'loading' | 'done'>('idle');

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (progress === 'idle') {
      timeout = setTimeout(() => setProgress('loading'), 500);
    } else if (progress === 'loading') {
      timeout = setTimeout(() => setProgress('done'), 1000);
    } else if (progress === 'done') {
      timeout = setTimeout(() => {
        setProgress('idle');
        setActiveIndex((prev) => (prev + 1) % services.length);
      }, 2000); // Wait for the beam animation to finish
    }

    return () => clearTimeout(timeout);
  }, [activeIndex, progress]);

  return (
    <section className="w-full py-20 bg-transparent relative flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-semibold tracking-widest uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-white/50" />
          Our Services
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6 text-fade-right w-fit mx-auto">
          Your Creative Powerhouse
        </h2>

        <p className="text-gray-400 text-lg max-w-2xl mb-10">
          Providing end-to-end visual solutions to elevate your brand and capture your most important moments.
        </p>

        <a
          href="tel:+917078939475"
          className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full p-[1px] focus:outline-none"
        >
          <span className="absolute inset-[-1000%] animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_80%,white_100%)]" style={{ animationDuration: '3s' }} />
          <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-[#030303]/90 backdrop-blur-xl pl-6 pr-2 gap-3 transition-all duration-500 hover:bg-[#0a0a0a]/90">
            <span className="text-base font-medium text-white transition-transform duration-300 group-hover:-translate-x-1">Book a call</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-white/10">
              <Play className="w-4 h-4 text-white transition-colors duration-300 group-hover:text-white ml-0.5" fill="currentColor" />
            </div>
          </span>
        </a>
      </div>

      {/* Apple Liquid Glass Container Wrapper */}
      <div className="mt-20 relative w-full max-w-6xl mx-auto px-6">
        {/* True Glass Container System */}
        <div className="relative w-full p-10 md:p-24 rounded-[4rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col items-center overflow-hidden">

          <div className="relative w-full h-[400px] flex justify-center">
            {/* SVG Paths */}
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute top-[120px] left-0 w-full h-[200px] overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                </linearGradient>
              </defs>

              {/* Base Lines */}
              {services.map((service) => (
                <path key={`base-${service.id}`} d={service.path} fill="none" stroke="url(#lineGradient)" strokeWidth="1" strokeLinejoin="round" />
              ))}

              {/* Animated Light Beam */}
              <AnimatePresence mode="wait">
                {progress === 'done' && (
                  <motion.path
                    key={`beam-${services[activeIndex].id}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.5, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}
                    d={services[activeIndex].path}
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </AnimatePresence>
            </svg>

            {/* Service Cards */}
            <div className="absolute top-0 left-0 w-full h-full grid grid-cols-4 justify-items-center pointer-events-none z-10">
              {services.map((service, index) => {
                const isActive = index === activeIndex;

                return (
                  <div key={service.id} className="relative w-32 h-40 md:w-40 md:h-48 pointer-events-auto transition-all duration-500 hover:scale-105"
                    style={{
                      transform: isActive && progress === 'done' ? 'translateY(-10px)' : 'translateY(0)'
                    }}
                  >
                    {/* Glass Card Shape */}
                    <div className="absolute inset-0 bg-white/[0.03] border border-white/10 backdrop-blur-2xl transition-all duration-500 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-3xl"
                      style={{
                        borderColor: isActive && progress === 'done' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
                        boxShadow: isActive && progress === 'done' ? '0 0 40px rgba(255,255,255,0.1), inset 0 1px 1px rgba(255,255,255,0.2)' : '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
                      }}
                    >
                      {/* Background Image */}
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-opacity duration-700"
                        style={{ opacity: isActive ? 0.9 : 0.4 }}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

                      {/* Internal Reflection */}
                      <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 transition-opacity duration-700 ${isActive && progress === 'done' ? 'opacity-100' : 'opacity-0'}`} />
                    </div>

                    {/* Status Icon */}
                    <div className="absolute top-4 left-4 w-6 h-6 flex items-center justify-center z-10">
                      {isActive && progress === 'loading' && (
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                      )}
                      {isActive && progress === 'done' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={4} />
                        </motion.div>
                      )}
                      {(!isActive || progress === 'idle') && (
                        <div className="w-5 h-5 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm shadow-inner" />
                      )}
                    </div>

                    {/* Label with Experimental CSS-Mask Animation */}
                    <div className="absolute bottom-6 left-2 right-2 z-10 flex justify-center">
                      <div className="button-mask-container">
                        <span className="mas tracking-tighter">{service.title}</span>
                        <button type="button" name="Hover" className="tracking-tighter">{service.title}</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Central Pill */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20">
              <button
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full p-[1px] focus:outline-none"
              >
                <span className="absolute inset-[-1000%] animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_80%,white_100%)]" style={{ animationDuration: '3s' }} />
                <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-[#030303]/90 backdrop-blur-xl px-8 gap-3 transition-all duration-500 hover:bg-[#0a0a0a]/90">
                  <span className="text-base font-bold text-white transition-transform duration-300 group-hover:-translate-x-1 tracking-tighter">Your Business</span>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-white/10">
                    <Play className="w-4 h-4 text-white transition-colors duration-300 group-hover:text-white ml-0.5" fill="currentColor" />
                  </div>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
