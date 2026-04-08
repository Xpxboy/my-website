import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, Camera } from 'lucide-react';
import logo from './logo.png';
import myPortrait from './my-portrait.png';
import PremiumBackground from './components/PremiumBackground';
import ParallaxSlider from './components/ParallaxSlider';

/* ── Portfolio images (existing 3D disc images) ── */
const images = [
  "/portfolio/cinematic.png",
  "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/851e51b6-4809-4f1e-8d8f-7bf220260eb6_rw_1200.png?h=1bd7595b23ae1f506545287fcd33cebf",
  "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/b1ccafe3-910f-4584-baa8-f5a7d1d9bb72_rw_1920.jpg?h=f378734ffbc2df5afbd008a3203bad9b",
  "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/eabe7afe-0de7-4e3e-844c-c053f63bc9c8_rw_1200.jpg?h=a4285092a813234c339394c25d20f33c",
  "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/726d3e31-631c-4e68-b421-6c23b15be594_rw_1920.jpg?h=65bc7eee19dae800f8df2f49f2ebfe9f",
  "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/5099dd32-d0b6-4908-93dc-2524d685cbcb_rw_1920.jpg?h=439a8719a39cbca7ea2e1a7673bd44cb",
  "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/c155fdf8-0608-4c45-b442-f66c10f96b39_rw_1920.jpg?h=8b8f41241d4164d0010215a6f5d7b927",
  "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/dd2d1db5-6f02-48ea-a82d-d87eefb522c5_rw_1200.png?h=cc393da777503075c0ee8efbfebb80ed",
  "https://cdn.myportfolio.com/69546baf-dc28-4990-bf93-53ab8f221e1d/f9698532-0490-4b4d-b74e-093228366e4d_rw_1920.png?h=dbada58a3e86b618b5991f5ad7d7c05b",
];

/* ── Fade-in wrapper ── */
const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#hero">
        <img src={logo} alt="RC" className="h-9 w-auto object-contain" />
      </a>
      <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
        <a href="#hero" className="hover:text-white transition-colors duration-300">Home</a>
        <a href="#services" className="hover:text-white transition-colors duration-300">Services</a>
        <a href="#work" className="hover:text-white transition-colors duration-300">Cases</a>
      </div>
      <a
        href="#contact"
        className="bg-white text-[#1a1410] px-5 py-2 rounded-full text-[9px] font-extrabold uppercase tracking-widest hover:scale-105 transition-transform duration-300 inline-flex items-center gap-2"
      >
        Contact
        <ArrowUpRight size={11} strokeWidth={3} />
      </a>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 1 — HERO  (dark, portrait + big text)
   ═══════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section id="hero" className="hero">
      {/* Ambient warm glow */}
      <div className="hero-glow" />

      {/* Portrait */}
      <motion.img
        src={myPortrait}
        alt="Rahul Chanda"
        className="hero-portrait"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Warm color wash over portrait area */}
      <div className="absolute bottom-0 left-[20%] w-[500px] h-[90vh] bg-[#C87941]/[0.06] mix-blend-overlay pointer-events-none z-[6]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 pt-32">
        {/* Left column (Main Typography & CTA) - F-Pattern Start */}
        <motion.div
          className="md:col-span-7 flex flex-col justify-end z-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Brand pill */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 border border-white/10 mb-8 w-fit backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">Photographer & Editor</span>
          </div>

          <h1 className="hero-title mb-6 text-left">
            Crafting<br />
            Visual<br />
            <span className="text-[var(--accent)] font-medium pr-4 inline-block transform -skew-x-6">Stories.</span>
          </h1>

          <p className="text-base md:text-xl text-white/50 font-medium max-w-md mb-10 leading-relaxed tracking-wide">
            Elevating brands through cinematic photography and precise editorial color grading.
          </p>

          <a
            href="#contact"
            className="bg-white text-[var(--dark)] px-8 py-4 rounded-full text-[11px] font-extrabold uppercase tracking-[0.2em] hover:scale-105 hover:bg-[var(--accent)] hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-3 w-fit shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Start a Project
            <ArrowUpRight size={16} strokeWidth={3} />
          </a>
        </motion.div>

        {/* Right column (Stats & Secondary Info) */}
        <motion.div
          className="md:col-span-5 flex flex-col justify-end items-start md:items-end gap-6 z-20"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-left md:text-right bg-black/20 border border-white/5 rounded-2xl p-6 backdrop-blur-md min-w-[220px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)] mb-3">Experience</p>
            <p className="text-4xl font-black text-white tracking-tighter mb-1">7+ Years</p>
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">In The Industry</p>
          </div>

          <div className="text-left md:text-right bg-black/20 border border-white/5 rounded-2xl p-6 backdrop-blur-md min-w-[220px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-3">Specialties</p>
            <p className="text-sm text-white/80 font-medium leading-loose">
              Cinematic Lighting<br />
              High-End Retouching<br />
              Color Grading
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 2 — BRAND STATEMENT  (light cream)
   ═══════════════════════════════════════════════════ */
function BrandStatementSection() {
  return (
    <section className="brand-section">
      <div className="max-w-[1400px] mx-auto">
        {/* Asterisk + Heading */}
        <Reveal>
          <div className="flex items-start gap-6 mb-8">
            <span className="asterisk-icon select-none mt-2">✺</span>
            <h2 className="brand-heading">
              Rahul Chanda Creates<br />
              Visual Narratives{' '}
              That<br />
              <span className="outline-text">Redefine Modern</span><br />
              Photography
            </h2>
          </div>
        </Reveal>

        {/* Description + label */}
        <Reveal delay={0.15}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mt-10 mb-12">
            <p className="text-sm md:text-base text-[var(--text-muted)] max-w-lg leading-relaxed font-medium">
              From raw captures to final cuts, I build visual narratives that connect and captivate.
              Specializing in cinematic photography, product retouching, and editorial color grading
              to elevate brands and empower businesses.
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">Over 7+ Years<br />Of Experience</p>
          </div>
        </Reveal>

        {/* Latest Projects row — Infinite Slider */}
        <Reveal delay={0.25} className="w-full mt-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-end gap-10 px-[calc(1.5rem+6px)] md:px-[calc(4vw+6px)]">
              <span className="latest-label hidden md:block">Our Latest Projects</span>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] max-w-xs mb-1">
                A curated selection of our most recent cinematic and commercial works.
              </p>
            </div>
            <ParallaxSlider images={images} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 3 — SERVICES  (light cream, tilted cards)
   ═══════════════════════════════════════════════════ */
const services = [
  { title: 'Photography', img: '/portfolio/cinematic_camera.png' },
  { title: 'Video Editing', img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=500&auto=format&fit=crop' },
  { title: 'Photo Retouching', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500&auto=format&fit=crop' },
  { title: 'Creative Direction', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=500&auto=format&fit=crop' },
];

function ServicesSection() {
  return (
    <section id="services" className="services-section">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <h2 className="services-heading mb-4">
            Everything <span className="thin">Your</span><br />
            Brand <span className="thin">Needs To</span> Grow
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto mb-6 leading-relaxed">
            Providing end-to-end visual solutions from concept to delivery.
            Every frame crafted with precision and creative intent.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="service-cards-row">
            {services.map((s, i) => (
              <div key={i} className="service-card">
                <img src={s.img} alt={s.title} loading="lazy" />
                <div className="service-card-overlay">
                  <span className="service-card-label">{s.title}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 4 — TYPOGRAPHIC STATEMENT
   ═══════════════════════════════════════════════════ */
function TypoStatementSection() {
  return (
    <section className="typo-section">
      <Reveal>
        <h2 className="typo-heading leading-tight">
          <span className="thin text-[var(--text-muted)] text-3xl md:text-5xl block mb-4">I Turn Ideas</span>
          Into Visual{' '}
          <span className="accent-badge shadow-lg shadow-[var(--accent)]/20 hover:scale-110 transition-transform cursor-pointer">
            <Camera size={18} color="#fff" strokeWidth={2.5} />
          </span>{' '}
          Statements<br />
          <span className="inline-block mt-8 px-6 py-2 rounded-full border border-[var(--text-muted)] text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--text-muted)]">From Vision To Delivery</span><br />
          <span className="block mt-4">Impact That Lasts.</span>
        </h2>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 5 — PORTFOLIO GALLERY + CTA
   ═══════════════════════════════════════════════════ */
function PortfolioGallerySection() {
  return (
    <section id="work" className="gallery-section">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="gallery-grid">
            {/* Card 1 */}
            <div className="gallery-card">
              <img src={images[8]} alt="Work 1" loading="lazy" />
              <div className="card-badge">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="gallery-card">
              <img src={images[9]} alt="Work 2" loading="lazy" />
              <div className="card-badge">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
            </div>

            {/* CTA Card */}
            <div className="gallery-cta-card" id="contact">
              {/* Decorative circle */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--dark)] flex items-center justify-center">
                <ArrowUpRight size={14} color="#fff" strokeWidth={2.5} />
              </div>

              <p className="text-[var(--dark)] text-lg md:text-xl font-bold tracking-tight leading-snug mb-6">
                Explore the<br />
                world's{' '}
                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[var(--dark)] text-[9px] text-white font-bold align-middle mx-0.5">RC</span>{' '}
                leading<br />
                creatives
              </p>

              <a href="mailto:rahulchandaphotography@gmail.com" className="cta-btn w-fit">
                Explore Now
                <ArrowUpRight size={11} strokeWidth={3} />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Bottom credit line */}
        <Reveal delay={0.15}>
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--cream-dark)]">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              © {new Date().getFullYear()} Rahul Chanda. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors">Instagram</a>
              <a href="#" className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors">LinkedIn</a>
              <a href="#" className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors">Twitter</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════════ */
export default function App() {
  return (
    <div className="overflow-x-hidden">
      <PremiumBackground />
      <Navbar />
      <HeroSection />
      <BrandStatementSection />
      <ServicesSection />
      <TypoStatementSection />
      <PortfolioGallerySection />
    </div>
  );
}
