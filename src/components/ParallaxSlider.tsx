import React, { useRef, useEffect, useState } from 'react';

interface ParallaxSliderProps {
  images: string[];
}

// ─── Physics constants ───────────────────────────────────────────────────────
const SLIDE_WIDTH = 320;
const SLIDE_GAP = 20;
const STRIDE = SLIDE_WIDTH + SLIDE_GAP;
const AUTO_SPEED = 0.45;
const FRICTION = 0.99; // Lower friction for 'free' glide feel
const PARALLAX_FACTOR = 0.16;
const MAX_CARD_ROT = 14; // max rotateY in degrees on drag

// ─── Sample-Based Single-Beat Trigger (Original MP3) ────────────────────────────────────────────
class SpinSoundEngine {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private buffer: AudioBuffer | null = null;

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.9; // Set to exactly 90% volume
    this.masterGain.connect(this.ctx.destination);
    this.loadBuffer();
  }

  private async loadBuffer() {
    try {
      const resp = await fetch('/audio/spinning-reel.mp3');
      const arrayBuffer = await resp.arrayBuffer();
      this.buffer = await this.ctx.decodeAudioData(arrayBuffer);
    } catch (err) { }
  }

  /** Play the single reel beat sample once at fixed volume */
  playBeat() {
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (!this.buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.buffer;

    const gain = this.ctx.createGain();
    gain.gain.value = 1.0; 

    source.connect(gain);
    gain.connect(this.masterGain);
    
    source.start(0);
  }

  destroy() {
    this.ctx.close();
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const ParallaxSlider: React.FC<ParallaxSliderProps> = ({ images }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const soundRef = useRef<SpinSoundEngine | null>(null);

  const posRef = useRef(0);
  const velRef = useRef(0);
  const isDragging = useRef(false);
  const isHovering = useRef(false);
  const lastClientX = useRef(0);
  const lastMoveTime = useRef(0);
  const lastMoveX = useRef(0);
  const lastCardIndexRef = useRef(0);
  const continuousPosRef = useRef(0);

  const [cursor, setCursor] = useState<'grab' | 'grabbing'>('grab');

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const count = images.length;
    const loopWidth = count * STRIDE;
    // sync posRefs
    posRef.current = -(count * STRIDE);
    continuousPosRef.current = posRef.current;
    lastCardIndexRef.current = Math.floor(Math.abs(continuousPosRef.current) / STRIDE);

    // ── RAF tick ─────────────────────────────────────────────────────────────
    const tick = () => {
      if (!isDragging.current) {
        if (!isHovering.current) {
          velRef.current += (AUTO_SPEED - velRef.current) * 0.04;
        } else {
          velRef.current *= FRICTION;
        }
      }

      posRef.current += velRef.current;
      continuousPosRef.current += velRef.current;

      // Handle wrapping for seamless loop
      if (posRef.current < -loopWidth) {
        posRef.current += loopWidth;
      }
      if (posRef.current > 0) {
        posRef.current -= loopWidth;
      }

      // ── Audio Trigger: perfectly synced to 1 beat per Card ──
      const currentCardIndex = Math.floor(Math.abs(continuousPosRef.current) / STRIDE);
      if (currentCardIndex !== lastCardIndexRef.current) {
        // Play beat if moving fast enough (ignoring slow auto-scroll)
        if (Math.abs(velRef.current) > AUTO_SPEED + 0.1) {
          soundRef.current?.playBeat();
        }
        lastCardIndexRef.current = currentCardIndex;
      }

      // ── Card 3D rotation ────────────────────────────────────────────────────
      // rotateY proportional to velocity (+ = left-drag tilt, - = right-drag)
      const rotDeg = Math.max(-MAX_CARD_ROT, Math.min(MAX_CARD_ROT, -velRef.current * 0.55));

      // ── Apply transforms ─────────────────────────────────────────────────────
      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;

      const cLeft = container.getBoundingClientRect().left;
      const cW = container.offsetWidth;

      (track.querySelectorAll('.slide-inner-wrap') as NodeListOf<HTMLElement>).forEach(slide => {
        // Card tilt driven by velocity
        slide.style.transform = `rotateY(${rotDeg}deg)`;

        // Parallax on the inner image based on viewport position
        const r = slide.getBoundingClientRect();
        const cx = r.left + r.width / 2 - cLeft;
        const rat = (cx / cW - 0.5) * 2;
        const img = slide.querySelector('.parallax-inner-img') as HTMLElement | null;
        if (img) {
          img.style.transform = `translateX(${rat * SLIDE_WIDTH * PARALLAX_FACTOR}px) scale(1.18)`;
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // ── Pointer handlers ──────────────────────────────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      // Init sound on first gesture (browser policy)
      if (!soundRef.current) {
        try { soundRef.current = new SpinSoundEngine(); } catch { }
      }

      isDragging.current = true;
      lastClientX.current = e.clientX;
      lastMoveX.current = e.clientX;
      lastMoveTime.current = performance.now();
      velRef.current = 0;
      container.setPointerCapture(e.pointerId);
      setCursor('grabbing');
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const now = performance.now();
      const dx = e.clientX - lastClientX.current;
      lastClientX.current = e.clientX;

      const dt = now - lastMoveTime.current;
      if (dt > 0) {
        const raw = e.clientX - lastMoveX.current;
        const instant = raw / (dt / 16.67);
        velRef.current = velRef.current * 0.3 + instant * 0.7;
      }
      lastMoveX.current = e.clientX;
      lastMoveTime.current = now;

      posRef.current += dx;
      continuousPosRef.current += dx;
    };

    const onPointerUp = () => {
      isDragging.current = false;
      setCursor('grab');
      // Velocity ceiling boosted for 'free' feel
      velRef.current = Math.max(-100, Math.min(100, velRef.current));
    };

    const onMouseEnter = () => { isHovering.current = true; };
    const onMouseLeave = () => { isHovering.current = false; };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      soundRef.current?.destroy();
    };
  }, [images]);

  const tripled = [...images, ...images, ...images];

  return (
    <div
      ref={containerRef}
      className="slider-container relative w-full overflow-hidden py-12 select-none"
      style={{ cursor, perspective: '1200px' }}
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 z-10"
        style={{ background: 'linear-gradient(to right, var(--cream) 20%, transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 z-10"
        style={{ background: 'linear-gradient(to left, var(--cream) 20%, transparent)' }} />

      {/* Drag hint */}
      <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-20
                      text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)] opacity-50
                      flex items-center gap-2">
        <span>←</span><span>drag to explore</span><span>→</span>
      </div>

      <div
        ref={trackRef}
        className="flex"
        style={{
          gap: `${SLIDE_GAP}px`,
          willChange: 'transform',
          width: `${tripled.length * STRIDE}px`,
          transform: `translate3d(${-(images.length * STRIDE)}px, 0, 0)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {tripled.map((src, i) => (
          <div
            key={i}
            className="slide-inner-wrap flex-shrink-0 rounded-2xl overflow-hidden relative group"
            style={{
              width: SLIDE_WIDTH,
              height: 420,
              willChange: 'transform',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
          >
            <img
              src={src}
              alt={`Project ${(i % images.length) + 1}`}
              className="parallax-inner-img absolute inset-0 w-full h-full object-cover"
              draggable={false}
              style={{ willChange: 'transform', transformOrigin: 'center center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent
                            opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 mb-1">
                  Project {String((i % images.length) + 1).padStart(2, '0')}
                </p>
                <p className="text-sm font-bold text-white uppercase tracking-widest">View Work →</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParallaxSlider;
