import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Move, Linkedin, Instagram, Facebook, Twitter, MapPin, Mail, Plus } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ServicesDiagram } from './components/ServicesDiagram';
import PremiumBackground from './components/PremiumBackground';
import logo from './logo.png';
import myPortrait from './my-portrait.png';

// Portfolio items will be added here when ready

const DraggableCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const [isDragging, setIsDragging] = useState(false);
  const [showDragIndicator, setShowDragIndicator] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  const state = useRef({
    rotX: -15,
    rotY: 0,
    velX: 0,
    velY: 0,
    time: 0,
  });

  const dragState = useRef({
    lastX: 0,
    lastY: 0,
    isDragging: false
  });

  const images = [
    "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/c63185db-861c-478c-919d-058ab9c6a416_rw_1920.png?h=1d53c0c1cee1b248712bd2f2fcd78ca1",
    "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/851e51b6-4809-4f1e-8d8f-7bf220260eb6_rw_1200.png?h=1bd7595b23ae1f506545287fcd33cebf",
    "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/e5aa6e06-ed51-4bdb-8fc7-6e31be953d0d_rw_1200.jpg?h=89e751a9440465f52d19257ee5a4d947",
    "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/b1ccafe3-910f-4584-baa8-f5a7d1d9bb72_rw_1920.jpg?h=f378734ffbc2df5afbd008a3203bad9b",
    "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/eabe7afe-0de7-4e3e-844c-c053f63bc9c8_rw_1200.jpg?h=a4285092a813234c339394c25d20f33c",
    "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/726d3e31-631c-4e68-b421-6c23b15be594_rw_1920.jpg?h=65bc7eee19dae800f8df2f49f2ebfe9f",
    "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/5099dd32-d0b6-4908-93dc-2524d685cbcb_rw_1920.jpg?h=439a8719a39cbca7ea2e1a7673bd44cb",
    "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/c155fdf8-0608-4c45-b442-f66c10f96b39_rw_1920.jpg?h=8b8f41241d4164d0010215a6f5d7b927",
    "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/dd2d1db5-6f02-48ea-a82d-d87eefb522c5_rw_1200.png?h=cc393da777503075c0ee8efbfebb80ed",
    "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/f9698532-0490-4b4d-b74e-093228366e4d_rw_1920.png?h=dbada58a3e86b618b5991f5ad7d7c05b"
  ];

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current.isDragging = true;
    setIsDragging(true);
    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;
    state.current.velX = 0;
    state.current.velY = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.parentElement?.getBoundingClientRect();
      if (rect) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    }
    if (!dragState.current.isDragging) return;
    const deltaX = e.clientX - dragState.current.lastX;
    const deltaY = e.clientY - dragState.current.lastY;
    state.current.rotY += deltaX * 0.4;
    state.current.rotX -= deltaY * 0.4;
    state.current.velY = deltaX * 0.4;
    state.current.velX = -deltaY * 0.4;
    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragState.current.isDragging = false;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const animate = () => {
      state.current.time += 0.01;
      if (!dragState.current.isDragging) {
        state.current.velY += 0.02;
        const targetRotX = -15;
        state.current.rotX += (targetRotX - state.current.rotX) * 0.01;
      }
      state.current.velX *= 0.98;
      state.current.velY *= 0.98;
      if (!dragState.current.isDragging) {
        state.current.rotX += state.current.velX;
        state.current.rotY += state.current.velY;
      }
      if (state.current.rotX < -45) { state.current.rotX = -45; state.current.velX *= -0.5; }
      if (state.current.rotX > 45) { state.current.rotX = 45; state.current.velX *= -0.5; }
      if (containerRef.current) {
        const floatY = Math.sin(state.current.time * 2) * 10;
        containerRef.current.style.transform = `translateY(${floatY}px) rotateX(${state.current.rotX}deg) rotateY(${state.current.rotY}deg)`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
      style={{ perspective: '1200px' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => setShowDragIndicator(true)}
      onPointerLeave={() => setShowDragIndicator(false)}
    >
      {/* Light splash behind the discs */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'conic-gradient(from 0deg, rgba(59,130,246,0.15), rgba(147,51,234,0.15), rgba(59,130,246,0.15))' }}
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      <div
        ref={containerRef}
        className="w-full h-full absolute top-0 left-0"
        style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
      >
        {images.map((src, i) => {
          const angle = (i / images.length) * 360;
          const radius = 320;
          const thickness = 6;
          const layers = Array.from({ length: thickness }).map((_, j) => (
            <div
              key={j}
              className="absolute inset-0 rounded-2xl bg-[#222] border border-white/5"
              style={{ transform: `translateZ(${j - thickness / 2}px)`, backfaceVisibility: 'hidden' }}
            />
          ));
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2"
              style={{
                width: '180px',
                height: '240px',
                transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Back face */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-[#050505]"
                style={{ transform: `translateZ(${-thickness / 2 - 1}px) rotateY(180deg)` }}
              >
                <img src={src} alt="Portfolio Work Back" className="w-full h-full object-cover opacity-30 scale-x-[-1]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none" />
              </div>
              {/* Edge layers */}
              {layers}
              {/* Front face */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden border border-white/20 bg-black"
                style={{ transform: `translateZ(${thickness / 2 + 1}px)` }}
              >
                <img src={src} alt="Portfolio Work" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showDragIndicator && (
          <motion.div
            style={{ x: springX, y: springY, left: 0, top: 0, translateX: '-50%', translateY: '-50%' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute pointer-events-none z-50 flex items-center gap-2 text-white/90 text-[10px] font-bold uppercase tracking-widest bg-white/[0.03] backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-2xl"
          >
            <Move size={12} strokeWidth={3} />
            <span>Drag</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function Navbar() {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 md:px-12"
    >
      <nav className="group relative flex items-center w-full max-w-7xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-16 md:h-18 px-8">
        <div className="flex-1 flex items-center">
          <Link to="/" className="inline-block cursor-pointer z-10 pl-2">
            <img
              src={logo}
              alt="Rahul Chanda"
              className="h-10 md:h-12 w-auto object-contain transition-all duration-500 hover:scale-110"
            />
          </Link>
        </div>

        {/* Centered Navigation Cluster */}
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 z-10">
          <Link to="/" className="hover:text-white transition-all duration-500 dw-link">
            <span>Home</span>
            <span>Home</span>
          </Link>
          <Link to="/about" className="hover:text-white transition-all duration-500 dw-link">
            <span>About</span>
            <span>About</span>
          </Link>
          <Link to="/portfolio" className="hover:text-white transition-all duration-500 dw-link">
            <span>Works</span>
            <span>Works</span>
          </Link>
        </div>

        {/* Action Section */}
        <div className="flex-1 flex justify-end items-center z-10">
          <Link to="/contact" className="bg-white text-black pl-6 pr-2 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest dw-btn transition-all duration-500 hover:scale-105 hover:bg-white/90 flex items-center gap-4 group/btn shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className="dw-btn-text-wrapper">
              <span className="block">Get In Touch</span>
              <span className="block">Get In Touch</span>
            </div>
            <span className="bg-black text-white p-2 rounded-full transform group-hover/btn:rotate-45 transition-transform duration-500">
              <ArrowUpRight size={14} strokeWidth={3} />
            </span>
          </Link>
        </div>
      </nav>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="w-full py-12 border-t border-white/10 bg-[#050505] relative z-20 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
        <div className="text-2xl font-bold tracking-tighter text-white mb-6 md:mb-0">
          Rahul Chanda
        </div>
        <div className="text-gray-400 text-sm font-medium mb-6 md:mb-0">
          &copy; {new Date().getFullYear()} Rahul Chanda. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-gray-400">
          <a href="#" className="hover:text-white transition-colors duration-300"><Linkedin size={20} /></a>
          <a href="#" className="hover:text-white transition-colors duration-300"><Instagram size={20} /></a>
          <a href="#" className="hover:text-white transition-colors duration-300"><Facebook size={20} /></a>
          <a href="#" className="hover:text-white transition-colors duration-300"><Twitter size={20} /></a>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="min-h-screen w-full bg-transparent overflow-hidden relative flex flex-col">
      {/* Premium Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl bg-blue-500/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-3/4 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[140px] pointer-events-none rounded-full" />

      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between relative z-10 pt-32 md:pt-0">

        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">Hey, I'm a</p>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] font-bold tracking-tighter mb-6 cursor-default text-fade-right w-fit">
            Photographer<br />& Editor
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-10 font-medium leading-relaxed">
            From raw captures to final cuts, I build visual narratives that connect and captivate.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/portfolio" className="bg-[#111111] border border-white/10 text-white pl-6 pr-2 py-2 rounded-full text-sm font-bold hover:bg-[#222222] transition-colors duration-300 inline-flex items-center gap-4 dw-btn">
              <div className="dw-btn-text-wrapper">
                <span>See Projects</span>
                <span>See Projects</span>
              </div>
              <span className="bg-white text-black p-2 rounded-full">
                <ArrowRight size={16} strokeWidth={2} className="-rotate-45" />
              </span>
            </Link>
            <Link to="/contact" className="bg-[#111111] border border-white/10 text-white pl-6 pr-2 py-2 rounded-full text-sm font-bold hover:bg-[#222222] transition-colors duration-300 inline-flex items-center gap-4 dw-btn">
              <div className="dw-btn-text-wrapper">
                <span>Get In Touch</span>
                <span>Get In Touch</span>
              </div>
              <span className="bg-white text-black p-2 rounded-full">
                <ArrowRight size={16} strokeWidth={2} className="-rotate-45" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right Content - 3D Coins Animation */}
        <div className="w-full md:w-1/2 h-[500px] md:h-[700px] relative mt-12 md:mt-0">
          <DraggableCarousel />
        </div>

      </div>

      <ServicesDiagram />
    </div>
  );
}

function About() {
  return (
    <div className="min-h-screen w-full bg-transparent text-white font-sans selection:bg-[#ff4d29] selection:text-white flex flex-col relative z-10 overflow-hidden">
      <Navbar />
      <div className="flex-1 w-full px-6 md:px-12 pt-32 pb-0 flex flex-col md:flex-row max-w-6xl mx-auto items-end h-full gap-8">
        
        {/* Left Side: Text Content */}
        <div className="w-full md:w-[50%] flex flex-col justify-start pt-4 md:pt-16 pb-24 z-20">
          <div className="mb-10">
            <h1 className="text-[5.5rem] leading-none font-bold tracking-tight cursor-default flex items-center gap-4 text-fade-right w-fit">
              <span className="text-white">About</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-gray-600 font-bold">Me</span>
            </h1>
          </div>
          
          <div className="space-y-8 max-w-xl pr-8">
            <p className="text-white text-xl md:text-[1.35rem] leading-snug font-medium cursor-default tracking-tight">
              I am Rahul Chanda—a dedicated photographer and visual editor based in Dehradun, specializing in the craft of cinematic storytelling.
            </p>
            
            <p className="text-gray-400 text-[1.05rem] leading-[1.8] font-normal cursor-default">
              My expertise lies in transforming raw captures into impactful narrative visuals. From meticulous product lighting and editorial portrait retouching to high-end video grading, I provide elite post-production solutions structured to elevate brands, empower businesses, and equip visionary creators.
            </p>
            
            <div className="pt-6">
              <Link to="/contact" className="group bg-[#0a0a0a]/90 border border-white/20 text-white flex items-center gap-5 pl-7 pr-2 py-2 rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 w-fit origin-left hover:scale-105">
                <span>Let's Collaborate</span>
                <span className="bg-white text-black group-hover:bg-black group-hover:text-white flex items-center justify-center rounded-full transition-all duration-500 w-9 h-9 shrink-0">
                  <ArrowRight size={16} strokeWidth={2.5} className="-rotate-45" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Portrait Image */}
        <div className="w-full md:w-[50%] h-[60vh] md:h-[85vh] flex items-end justify-start relative z-10 pointer-events-none mt-10 md:mt-0 2xl:ml-[-50px]">
          <img 
            src={myPortrait} 
            alt="Rahul Chanda" 
            className="w-full h-full object-contain object-bottom md:object-left-bottom drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] scale-110 md:scale-[1.15] origin-bottom" 
          />
        </div>

      </div>
    </div>
  );
}

const portfolioItems = [
  {
    id: 'editorial',
    title: 'Editorial Essence',
    category: 'Fashion Photography',
    image: '/portfolio/editorial.png',
    description: 'A study in high-contrast black and white editorial photography.'
  },
  {
    id: 'cinematic',
    title: 'Neon Nights',
    category: 'Cinematic Editing',
    image: '/portfolio/cinematic.png',
    description: 'Atmospheric color grading and visual storytelling.'
  },
  {
    id: 'product',
    title: 'Luxe Precision',
    category: 'Product Retouching',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    description: 'High-end product retouching and professional lighting.'
  }
];

function Portfolio() {
  return (
    <div className="min-h-screen w-full bg-transparent text-white font-sans selection:bg-[#ff4d29] selection:text-white flex flex-col relative">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="flex-1 px-6 md:px-12 pt-32 pb-20 z-20 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter cursor-default text-fade-right w-fit mb-6">Selected Work</h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            A curated selection of photography and post-production projects focusing on high-end visual narratives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative flex flex-col"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-white/5 transition-all duration-500 hover:border-white/20 shadow-2xl">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                
                {/* Overlay Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">{item.category}</p>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">{item.description}</p>
                  
                  <div className="flex items-center gap-3 text-white text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/20">
                    View Project <ArrowUpRight size={12} strokeWidth={3} />
                  </div>
                </div>
              </div>
              
              {/* Bottom Label (Visible always in subtle form) */}
              <div className="mt-6 flex justify-between items-start px-2">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold tracking-tight mb-1 group-hover:text-[#ff4d29] transition-colors truncate">{item.title}</h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{item.category}</p>
                </div>
                <div className="p-3 rounded-full border border-white/5 bg-white/[0.02] text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                  <ArrowUpRight size={18} strokeWidth={2} />
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Coming Soon Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-gray-500">
              <Plus size={32} />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white/40 mb-2">More Coming Soon</h3>
            <p className="text-gray-600 text-xs font-medium uppercase tracking-widest">Ongoing Projects</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="min-h-screen w-full bg-transparent text-white font-sans selection:bg-[#ff4d29] selection:text-white flex flex-col relative">
      <Navbar />
      <div className="flex-1 px-6 md:px-12 pt-32 pb-20 z-20 flex flex-col justify-center max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter cursor-default text-fade-right w-fit hover:scale-105 transition-transform duration-300 origin-left">Let's Work<br />Together.</h1>

          <div className="h-16 md:h-24" />

          <div className="mb-20">
            <p className="text-white/50 text-lg md:text-xl leading-relaxed font-medium max-w-2xl cursor-default">
              Available for worldwide freelance projects. I specialize in crafting cinematic visual narratives that elevate brand identities and capture the essence of every moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-500 group/item relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400">Available</span>
                </div>
              </div>

              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 group-hover/item:text-white/50 transition-colors">Location</p>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 text-[#ff4d29]">
                  <MapPin size={24} />
                </div>
                <p className="text-2xl font-bold tracking-tighter">Dehradun, India</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-500 group/item flex flex-col justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 group-hover/item:text-white/50 transition-colors">Direct Email</p>
                <a href="mailto:rahulchandaphotography@gmail.com" className="flex items-center gap-5 dw-link-plain">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10 text-[#ff4d29] flex-shrink-0 transition-transform group-hover/item:scale-110">
                    <Mail size={24} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-xl md:text-2xl font-bold tracking-tighter break-words">rahulchandaphotography@gmail.com</p>
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold group-hover/item:text-[#ff4d29] transition-colors mt-1">Click to compose message</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-8">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Connect</p>
            <div className="flex items-center gap-6 p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-125 transition-all duration-300"><Linkedin size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-125 transition-all duration-300"><Instagram size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-125 transition-all duration-300"><Facebook size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-125 transition-all duration-300"><Twitter size={22} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Inner portfolio pages will be added here ---

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PremiumBackground />
      <div className="relative z-10 flex flex-col min-h-[100vh]">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
