import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Zap, ArrowUpRight, ArrowRight, Globe } from 'lucide-react';
import { Lang, getShowroomStatus } from '../data/neorideData';

interface ElectricRoadHeroProps {
  lang: Lang;
  onToggleLang: () => void;
  onSelectCategory: (cat: 'all' | 'moto' | 'scoot' | 'piece') => void;
}

export const ElectricRoadHero: React.FC<ElectricRoadHeroProps> = ({
  lang,
  onToggleLang,
  onSelectCategory,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [cruiseTarget, setCruiseTarget] = useState<number | null>(null); // null, 0.55 (45km/h), 0.82 (70km/h), 1.0 (85km/h)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [audioUnavailable, setAudioUnavailable] = useState<boolean>(false);
  const [showroomStatus, setShowroomStatus] = useState(() => getShowroomStatus());

  // Refs for animation loop and WebAudio
  const stateRef = useRef({
    velocity: 0.07,
    targetVelocity: 0.07,
    offset: 0,
    isVisible: true,
    soundMuted: false,
  });

  const audioRef = useRef<{
    ctx: AudioContext;
    master: GainNode;
    wA: OscillatorNode;
    wB: OscillatorNode;
    hum: OscillatorNode;
    nf2: BiquadFilterNode;
    gA: GainNode;
    gB: GainNode;
    gH: GainNode;
    gN: GainNode;
    gT: GainNode;
    tlg: GainNode;
    tlfo: OscillatorNode;
    tlp: BiquadFilterNode;
    gS: GainNode;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowroomStatus(getShowroomStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const initAudio = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.ctx.state === 'suspended') {
        audioRef.current.ctx.resume().catch(() => setAudioUnavailable(true));
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const mkOsc = (type: OscillatorType, freq: number) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = freq;
        return o;
      };
      const mkGain = () => {
        const g = ctx.createGain();
        g.gain.value = 0;
        return g;
      };

      const master = ctx.createGain();
      master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp);
      comp.connect(ctx.destination);

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 2600;
      lp.Q.value = 0.5;
      lp.connect(master);

      const wA = mkOsc('sawtooth', 220);
      const wB = mkOsc('triangle', 440);
      const hum = mkOsc('sine', 50);
      const gA = mkGain();
      const gB = mkGain();
      const gH = mkGain();

      wA.connect(gA);
      gA.connect(lp);
      wB.connect(gB);
      gB.connect(lp);
      hum.connect(gH);
      gH.connect(master);

      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const nz = ctx.createBufferSource();
      nz.buffer = buf;
      nz.loop = true;
      const nf2 = ctx.createBiquadFilter();
      nf2.type = 'bandpass';
      nf2.frequency.value = 600;
      nf2.Q.value = 0.7;
      const gN = mkGain();
      nz.connect(nf2);
      nf2.connect(gN);
      gN.connect(master);

      const tz = ctx.createBufferSource();
      tz.buffer = buf;
      tz.loop = true;
      const tlp = ctx.createBiquadFilter();
      tlp.type = 'lowpass';
      tlp.frequency.value = 500;
      const gT = mkGain();
      tz.connect(tlp);
      tlp.connect(gT);
      gT.connect(master);

      const tlfo = mkOsc('sine', 8);
      const tlg = ctx.createGain();
      tlg.gain.value = 0;
      tlfo.connect(tlg);
      tlg.connect(gT.gain);

      const ths = ctx.createBufferSource();
      ths.buffer = buf;
      ths.loop = true;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 2600;
      const gS = mkGain();
      ths.connect(hp);
      hp.connect(gS);
      gS.connect(master);

      [wA, wB, hum, nz, tz, tlfo, ths].forEach((n) => n.start());

      audioRef.current = {
        ctx,
        master,
        wA,
        wB,
        hum,
        nf2,
        gA,
        gB,
        gH,
        gN,
        gT,
        tlg,
        tlfo,
        tlp,
        gS,
      };
    } catch {
      setAudioUnavailable(true);
    }
  }, []);

  // Update target velocity when holding or cruising
  useEffect(() => {
    if (isHolding) {
      stateRef.current.targetVelocity = 1;
    } else if (cruiseTarget !== null) {
      stateRef.current.targetVelocity = cruiseTarget;
    } else {
      stateRef.current.targetVelocity = 0.07;
    }
  }, [isHolding, cruiseTarget]);

  useEffect(() => {
    stateRef.current.soundMuted = !soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const cv = canvasRef.current;
    const heroEl = heroRef.current;
    if (!cv || !heroEl) return;

    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let rafId = 0;
    let lastReportedSpeed = 0;

    const drawScene = () => {
      const v = stateRef.current.velocity;
      const off = stateRef.current.offset;
      const cx = width / 2;
      const vy = height * 0.41;
      const sw = Math.max(width * 0.95, height * 0.8);

      ctx.fillStyle = '#0d0f10';
      ctx.fillRect(0, 0, width, height);

      // Horizon electric glow
      const horizonGlow = ctx.createRadialGradient(cx, vy, 0, cx, vy, width * 0.7);
      horizonGlow.addColorStop(0, `rgba(45, 255, 110, ${0.1 + 0.3 * v})`);
      horizonGlow.addColorStop(1, 'rgba(45, 255, 110, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, width, height);

      // Road surface triangle
      ctx.fillStyle = '#141719';
      ctx.beginPath();
      ctx.moveTo(cx, vy);
      ctx.lineTo(cx - sw, height);
      ctx.lineTo(cx + sw, height);
      ctx.fill();

      // Road neon edges
      ctx.save();
      ctx.shadowColor = '#2dff6e';
      ctx.shadowBlur = 10 + 18 * v;
      ctx.strokeStyle = '#2dff6e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, vy);
      ctx.lineTo(cx - sw, height);
      ctx.moveTo(cx, vy);
      ctx.lineTo(cx + sw, height);
      ctx.stroke();
      ctx.restore();

      // Perspective center dashes
      ctx.fillStyle = '#e4e8ea';
      for (let i = 0; i < 14; i++) {
        const z = ((i / 14) + off) % 1;
        const p = Math.pow(z, 2.4);
        const y = vy + (height - vy) * p;
        const w = 1 + 14 * p;
        const h = (4 + 90 * p) * (0.6 + v);
        ctx.fillRect(cx - w / 2, y, w, h);
      }

      // High-speed warp streaks
      if (v > 0.3) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${(v - 0.3) * 0.48})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 34; i++) {
          const a = (((i * 137.5) % 360) * Math.PI) / 180;
          const r = (i * 0.173 + off * 3) % 1;
          const sx = cx + Math.cos(a) * width * 0.12 * (1 + r);
          const sy = vy + Math.sin(a) * height * 0.12 * (1 + r);
          const L = r * r * height * 0.7 * v;
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + Math.cos(a) * L, sy + Math.sin(a) * L);
        }
        ctx.stroke();
      }

      // Rider & Electric Bike silhouette
      const bs = Math.max(68, Math.min(width * 0.17, height * 0.19));
      const by = height * 0.79;
      const t = performance.now() / 1000;
      const lv = Math.max(0, v - 0.07) / 0.93;
      const lean = lv * 0.05 * Math.sin(t * 1.6) + lv * 0.008 * Math.sin(t * 41);
      const sh = lv * 1.6 * Math.sin(t * 37);
      const gl = 0.25 + 0.75 * lv;
      const lw = Math.max(1, bs * 0.012);

      const drawRoundRect = (rx: number, ry: number, rw: number, rh: number, rad: number) => {
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(rx, ry, rw, rh, rad);
        } else {
          ctx.rect(rx, ry, rw, rh);
        }
      };

      const drawEllipse = (ex: number, ey: number, erx: number, ery: number) => {
        ctx.beginPath();
        ctx.ellipse(ex, ey, erx, ery, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      };

      ctx.save();
      ctx.translate(cx, by);

      // Ground reflection under tire
      const rg = ctx.createRadialGradient(0, bs * 0.08, 0, 0, bs * 0.08, bs * 0.8);
      rg.addColorStop(0, `rgba(45, 255, 110, ${0.16 + 0.5 * lv})`);
      rg.addColorStop(1, 'rgba(45, 255, 110, 0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.ellipse(0, bs * 0.08, bs * 0.8, bs * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Headlight beam forward
      const far = (by - vy) * 0.85;
      const bm = ctx.createLinearGradient(0, -bs * 0.5, 0, -far);
      bm.addColorStop(0, `rgba(225, 255, 238, ${0.04 + 0.32 * lv})`);
      bm.addColorStop(1, 'rgba(225, 255, 238, 0)');
      ctx.fillStyle = bm;
      ctx.beginPath();
      ctx.moveTo(-bs * 0.32, -bs * 0.5);
      ctx.lineTo(bs * 0.32, -bs * 0.5);
      ctx.lineTo(bs * 0.05, -far);
      ctx.lineTo(-bs * 0.05, -far);
      ctx.fill();

      ctx.translate(sh, 0);
      ctx.rotate(lean);
      ctx.lineWidth = lw;
      ctx.fillStyle = '#0b0c0d';
      ctx.strokeStyle = '#1f2427';
      drawEllipse(0, -bs * 0.3, bs * 0.075, bs * 0.3);

      ctx.fillStyle = '#15181a';
      drawRoundRect(-bs * 0.15, -bs * 0.78, bs * 0.3, bs * 0.34, bs * 0.05);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1d2124';
      drawRoundRect(-bs * 0.2, -bs * 0.92, bs * 0.4, bs * 0.16, bs * 0.05);
      ctx.fill();
      ctx.stroke();

      // Rear LED tail bar
      ctx.save();
      ctx.shadowColor = '#2dff6e';
      ctx.shadowBlur = 8 + 22 * gl;
      ctx.fillStyle = '#2dff6e';
      ctx.fillRect(-bs * 0.17, -bs * 0.86, bs * 0.34, bs * 0.035);
      ctx.restore();

      ctx.fillStyle = '#0e1011';
      drawEllipse(-bs * 0.22, -bs * 1, bs * 0.09, bs * 0.17);
      drawEllipse(bs * 0.22, -bs * 1, bs * 0.09, bs * 0.17);

      ctx.beginPath();
      ctx.moveTo(-bs * 0.14, -bs * 0.95);
      ctx.lineTo(bs * 0.14, -bs * 0.95);
      ctx.lineTo(bs * 0.25, -bs * 1.5);
      ctx.lineTo(-bs * 0.25, -bs * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.lineCap = 'round';
      ctx.strokeStyle = '#0e1011';
      ctx.lineWidth = bs * 0.1;
      ctx.beginPath();
      ctx.moveTo(-bs * 0.23, -bs * 1.45);
      ctx.lineTo(-bs * 0.36, -bs * 1.28);
      ctx.moveTo(bs * 0.23, -bs * 1.45);
      ctx.lineTo(bs * 0.36, -bs * 1.28);
      ctx.stroke();

      ctx.strokeStyle = '#1b1f22';
      ctx.lineWidth = bs * 0.04;
      ctx.beginPath();
      ctx.moveTo(-bs * 0.4, -bs * 1.28);
      ctx.lineTo(bs * 0.4, -bs * 1.28);
      ctx.stroke();

      ctx.lineWidth = lw;
      ctx.fillStyle = '#101315';
      ctx.strokeStyle = '#1f2427';
      drawEllipse(0, -bs * 1.68, bs * 0.17, bs * 0.19);

      ctx.strokeStyle = `rgba(45, 255, 110, ${0.25 + 0.6 * gl})`;
      ctx.lineWidth = Math.max(1, bs * 0.02);
      ctx.beginPath();
      ctx.arc(0, -bs * 1.68, bs * 0.13, Math.PI * 1.1, Math.PI * 1.55);
      ctx.stroke();
      ctx.restore();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = cv.clientWidth;
      height = cv.clientHeight;
      cv.width = width * dpr;
      cv.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScene();
    };

    const loop = () => {
      const st = stateRef.current;
      if (st.isVisible) {
        st.velocity += (st.targetVelocity - st.velocity) * 0.045;
        if (!prefersReducedMotion) {
          st.offset = (st.offset + st.velocity * 0.018) % 1;
        }
        const computedSpeed = Math.round((Math.max(0, st.velocity - 0.07) / 0.93) * 85);
        if (computedSpeed !== lastReportedSpeed) {
          lastReportedSpeed = computedSpeed;
          setSpeedKmh(computedSpeed);
        }
        if (!prefersReducedMotion || Math.abs(st.targetVelocity - st.velocity) > 0.002) {
          drawScene();
        }
      }

      if (audioRef.current) {
        const a = audioRef.current;
        const T = a.ctx.currentTime;
        const L = Math.max(0, Math.min(1, (st.velocity - 0.07) / 0.93));
        const amp = Math.min(1, L * 5);
        const freq = 210 + L * 1750;
        const shouldPlay = !st.soundMuted && st.isVisible && !document.hidden && L > 0.01;

        a.master.gain.setTargetAtTime(shouldPlay ? 0.85 : 0, T, 0.05);
        a.wA.frequency.setTargetAtTime(freq, T, 0.05);
        a.wB.frequency.setTargetAtTime(freq * 2.01, T, 0.05);
        a.hum.frequency.setTargetAtTime(48 + L * 150, T, 0.06);
        a.nf2.frequency.setTargetAtTime(500 + L * 2300, T, 0.08);

        a.gA.gain.setTargetAtTime(0.06 * amp, T, 0.06);
        a.gB.gain.setTargetAtTime(0.03 * amp, T, 0.09);
        a.gH.gain.setTargetAtTime(0.08 * amp, T, 0.06);
        a.gN.gain.setTargetAtTime(0.06 * Math.pow(L, 1.2), T, 0.08);

        const A = 0.15 * Math.pow(L, 0.9);
        a.gT.gain.setTargetAtTime(A * 0.7, T, 0.08);
        a.tlg.gain.setTargetAtTime(A * 0.3, T, 0.08);
        a.tlfo.frequency.setTargetAtTime(5 + L * 32, T, 0.08);
        a.tlp.frequency.setTargetAtTime(350 + L * 900, T, 0.08);
        a.gS.gain.setTargetAtTime(0.04 * Math.pow(L, 1.3), T, 0.08);
      }

      rafId = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        stateRef.current.isVisible = entries[0]?.isIntersecting ?? true;
        if (!stateRef.current.isVisible) {
          setIsHolding(false);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(heroEl);

    window.addEventListener('resize', resize);
    resize();
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  const startHold = () => {
    initAudio();
    if (navigator.vibrate) navigator.vibrate(10);
    setCruiseTarget(null);
    setIsHolding(true);
  };

  const stopHold = () => {
    setIsHolding(false);
  };

  const selectCruise = (val: number | null) => {
    initAudio();
    setIsHolding(false);
    setCruiseTarget((prev) => (prev === val ? null : val));
  };

  const isAccelerating = isHolding || cruiseTarget !== null;

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[calc(100svh-64px)] flex flex-col justify-between overflow-hidden border-b border-[#262b2f]"
    >
      {/* Interactive Canvas Background */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full block transition-all duration-300 ${
          isAccelerating ? 'saturate-125 brightness-110' : ''
        }`}
      />

      {/* Measured Contrast Scrim that opens up when accelerating */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isAccelerating ? 'opacity-65' : 'opacity-95'
        }`}
        style={{
          background:
            lang === 'ar'
              ? 'linear-gradient(270deg, rgba(13,15,16,0.95) 0%, rgba(13,15,16,0.78) 48%, rgba(13,15,16,0.25) 100%), linear-gradient(0deg, rgba(13,15,16,0.96) 0%, transparent 52%)'
              : 'linear-gradient(90deg, rgba(13,15,16,0.95) 0%, rgba(13,15,16,0.78) 48%, rgba(13,15,16,0.25) 100%), linear-gradient(0deg, rgba(13,15,16,0.96) 0%, transparent 52%)',
        }}
      />

      {/* Top Hero Utility Bar: Regional Identity + Live Showroom Status + Language Switcher */}
      <div className="relative z-10 w-full max-w-[1160px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#9aa2a9]">
          <span className="font-semibold text-[#f2f4f3]">NeoRide by Zelloufi</span>
          <span aria-hidden="true">·</span>
          <span>{lang === 'ar' ? 'بركان والجهة الشرقية' : 'Berkane & Région de l’Oriental'}</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <a
            href="#localisation"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#d0d6dc] hover:text-[#2dff6e] transition-colors"
          >
            <span className="font-medium">
              {showroomStatus.isOpen
                ? lang === 'ar'
                  ? 'المعرض مفتوح الآن (9:00–19:30)'
                  : 'Showroom ouvert (9h–19h30)'
                : lang === 'ar'
                ? 'المعرض مغلق حاليًا (يفتح 9:00)'
                : 'Showroom fermé (ouvre à 9h00)'}
            </span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onSelectCategory('piece');
              document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#d0d6dc] hover:text-[#2dff6e] border border-[#262b2f] bg-[#141719]/80 rounded transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'قطع الغيار والخوذات' : 'Pièces & Casques'}
          </button>

          <button
            type="button"
            onClick={onToggleLang}
            aria-label={lang === 'ar' ? 'Passer en français' : 'التبديل إلى العربية'}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#f2f4f3] bg-[#1a1e21] hover:bg-[#2dff6e] hover:text-[#05150b] border border-[#2e3438] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'Français' : 'العربية'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Content + Speedometer */}
      <div className="relative z-10 w-full max-w-[1160px] mx-auto px-4 sm:px-6 my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        {/* Left Column: Primary Proposition & Actions */}
        <div
          className={`lg:col-span-7 transition-opacity duration-300 ${
            isAccelerating ? 'opacity-80 sm:opacity-70' : 'opacity-100'
          }`}
        >
          <p className="text-xs sm:text-sm font-medium text-[#2dff6e] mb-3 tracking-wide">
            {lang === 'ar'
              ? 'صفر بنزين · بطارية قابلة للإزالة · خدمة ما بعد البيع في بركان'
              : '0 DH d’essence · Batterie amovible 220V · Atelier local à Berkane'}
          </p>

          <h1 className="text-silver font-display font-extrabold text-[clamp(2.25rem,5vw,4rem)] leading-[1.04] tracking-tight max-w-[16ch] mb-4">
            {lang === 'ar'
              ? 'دراجات وسكوترات كهربائية في بركان وجهة الشرق.'
              : 'Motos & scooters électriques à Berkane et dans l’Oriental.'}
          </h1>

          <p className="text-[#c5ccd0] text-base sm:text-lg leading-relaxed max-w-[50ch] mb-7">
            {lang === 'ar'
              ? 'اكتشفوا الدراجات والسكوترات الكهربائية المصممة لتنقلاتكم اليومية وللموزعين المحترفين، مع قطع الغيار ومواكبة محلية في بركان، وجدة، الناظور والسعيدية.'
              : 'Passez à l’électrique pour vos trajets quotidiens ou la livraison pro : 2 à 3 DH la recharge sur prise domestique, zéro vidange et un suivi réel au showroom de Berkane.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#catalogue"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 bg-[#2dff6e] hover:bg-white text-[#05150b] font-bold text-sm sm:text-base rounded transition-colors whitespace-nowrap shrink-0 shadow-[0_8px_28px_rgba(45,255,110,0.18)]"
            >
              <span>{lang === 'ar' ? 'اكتشف الكتالوج والأسعار' : 'Découvrir le catalogue'}</span>
              <ArrowUpRight className="w-4 h-4 flip-rtl" />
            </a>

            <a
              href="#essai"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 bg-[#1a1e21]/90 hover:bg-[#262b2f] text-[#f2f4f3] border border-[#2e3438] font-semibold text-sm sm:text-base rounded transition-colors whitespace-nowrap shrink-0"
            >
              <span>{lang === 'ar' ? 'احجز تجربة مجانية' : 'Réserver un essai'}</span>
              <ArrowRight className="w-4 h-4 flip-rtl text-[#2dff6e]" />
            </a>

            <a
              href="#electrique"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-2 text-sm font-semibold text-[#c5ccd0] hover:text-[#2dff6e] underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              <span>{lang === 'ar' ? 'احسب توفيرك السنوي' : 'Calculer mes économies'}</span>
            </a>
          </div>
        </div>

        {/* Right Column: Live Speedometer + Interactive Electric Throttle Module */}
        <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-end">
          {/* Speed Readout */}
          <div className="mb-4 lg:text-end select-none" aria-live="off">
            <div className="flex items-baseline gap-2 lg:justify-end">
              <span
                className={`font-display font-extrabold text-[clamp(3.5rem,9vw,6.25rem)] leading-none tabular-nums bidi-plain transition-colors duration-200 ${
                  speedKmh >= 48
                    ? 'text-[#2dff6e] drop-shadow-[0_0_28px_rgba(45,255,110,0.45)]'
                    : speedKmh >= 8
                    ? 'text-white'
                    : 'text-[#6e777d]'
                }`}
              >
                {speedKmh}
              </span>
              <span className="text-sm sm:text-base font-mono-num text-[#9aa2a9] uppercase">
                {lang === 'ar' ? 'كم/س' : 'km/h'}
              </span>
            </div>
            <p className="text-xs text-[#9aa2a9] mt-1">
              {speedKmh > 0
                ? lang === 'ar'
                  ? `استهلاك فوري: ~${(0.03 + (speedKmh / 85) * 0.03).toFixed(2)} درهم/كم · بدون ضجيج`
                  : `Conso estimée : ~${(0.03 + (speedKmh / 85) * 0.03).toFixed(2)} DH/km · 0 émission`
                : lang === 'ar'
                ? 'اضغط مطوّلًا على مقبض التسارع أو اختر وضع السرعة'
                : 'Maintenez l’accélérateur ou testez un mode de vitesse'}
            </p>
          </div>

          {/* Interactive Throttle Card */}
          <div className="w-full max-w-[440px] p-4 rounded bg-[#141719]/90 border border-[#262b2f] backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-[#d0d6dc]">
                {lang === 'ar' ? 'محاكاة التسارع الكهربائي' : 'Simulateur de couple électrique'}
              </span>

              <button
                type="button"
                onClick={() => {
                  initAudio();
                  setSoundEnabled((prev) => !prev);
                }}
                aria-pressed={soundEnabled}
                className={`inline-flex items-center gap-1.5 min-h-[34px] px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  audioUnavailable
                    ? 'border-[#3a3f44] text-[#9aa2a9]'
                    : soundEnabled
                    ? 'border-[#2dff6e]/40 bg-[#2dff6e]/10 text-[#2dff6e]'
                    : 'border-[#ff6b6b]/40 bg-[#ff6b6b]/10 text-[#ff9a9a]'
                }`}
              >
                {soundEnabled && !audioUnavailable ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span>
                  {audioUnavailable
                    ? lang === 'ar'
                      ? 'الصوت غير متاح'
                      : 'Son indisponible'
                    : soundEnabled
                    ? lang === 'ar'
                      ? 'الصوت مفعّل'
                      : 'Son moteur actif'
                    : lang === 'ar'
                    ? 'الصوت مكتوم'
                    : 'Son coupé'}
                </span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Hold-to-accelerate button */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  startHold();
                }}
                onPointerUp={stopHold}
                onPointerCancel={stopHold}
                onLostPointerCapture={stopHold}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    startHold();
                  }
                }}
                onKeyUp={stopHold}
                onBlur={stopHold}
                onContextMenu={(e) => e.preventDefault()}
                className={`flex-1 flex items-center justify-center gap-2.5 min-h-[46px] px-4 py-2 rounded font-bold text-xs sm:text-sm border transition-all cursor-pointer select-none touch-none whitespace-nowrap ${
                  isHolding
                    ? 'bg-[#2dff6e] text-[#05150b] border-[#2dff6e] shadow-[0_0_24px_rgba(45,255,110,0.45)] scale-[0.99]'
                    : 'bg-[#1f2428] hover:bg-[#282e33] text-[#f2f4f3] border-[#32393f]'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full grid place-items-center transition-transform ${
                    isHolding ? 'bg-[#05150b] text-[#2dff6e] scale-110' : 'bg-[#2dff6e] text-[#05150b]'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                </span>
                <span>
                  {isHolding
                    ? lang === 'ar'
                      ? 'تسارع أقصى...'
                      : 'Accélération...'
                    : lang === 'ar'
                    ? 'اضغط مطوّلًا للتسريع'
                    : 'Maintenir pour accélérer'}
                </span>
              </button>

              {/* Quick Cruise Mode Buttons for effortless mobile tap */}
              <div className="flex items-center gap-1 bg-[#0d0f10] p-1 rounded border border-[#262b2f]" role="group" aria-label="Modes de vitesse">
                {[
                  { label: 'Eco', target: 0.52 },
                  { label: 'Ville', target: 0.78 },
                  { label: 'Sport', target: 1.0 },
                ].map((m) => {
                  const active = cruiseTarget === m.target && !isHolding;
                  return (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => selectCruise(m.target)}
                      className={`flex-1 sm:flex-initial min-h-[36px] px-2.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#2dff6e] text-[#05150b]'
                          : 'text-[#9aa2a9] hover:text-[#f2f4f3]'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Full-Width KPI & Regional Proof Bar */}
      <div className="relative z-10 w-full bg-[#0d0f10]/90 border-t border-[#262b2f] backdrop-blur-sm">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <div className="font-display font-bold text-lg sm:text-xl text-[#f2f4f3] tabular-nums bidi-plain">
              {lang === 'ar' ? 'ابتداءً من 5\u00a0200 درهم' : 'Dès 5\u00a0200 DH'}
            </div>
            <div className="text-xs text-[#9aa2a9]">
              {lang === 'ar' ? 'موطورات، سكوترات وتروتينيت' : 'Motos, scooters & trottinettes'}
            </div>
          </div>

          <div>
            <div className="font-display font-bold text-lg sm:text-xl text-[#2dff6e] tabular-nums bidi-plain">
              {lang === 'ar' ? '40 إلى 90 كم' : '40 à 90 km'}
            </div>
            <div className="text-xs text-[#9aa2a9]">
              {lang === 'ar' ? 'مدى السير بشحنة واحدة (2–3 دراهم)' : 'Autonomie par charge (~2 à 3 DH)'}
            </div>
          </div>

          <div>
            <div className="font-display font-bold text-lg sm:text-xl text-[#f2f4f3]">
              {lang === 'ar' ? 'قطع الغيار والصيانة' : 'Pièces & Atelier local'}
            </div>
            <div className="text-xs text-[#9aa2a9]">
              {lang === 'ar' ? 'متوفرة لدى زلّوفي في بركان' : 'Suivi après-vente assuré à Berkane'}
            </div>
          </div>

          <div>
            <div className="font-display font-bold text-lg sm:text-xl text-[#f2f4f3]">
              {lang === 'ar' ? 'توصيل لجهة الشرق' : 'Expédition Oriental'}
            </div>
            <div className="text-xs text-[#9aa2a9]">
              {lang === 'ar' ? 'وجدة، الناظور، السعيدية، تاوريرت وأحفير' : 'Oujda, Nador, Saïdia, Taourirt & Ahfir'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
