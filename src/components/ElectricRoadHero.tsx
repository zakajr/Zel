import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Lang } from '../data/neorideData';

interface ElectricRoadHeroProps {
  lang: Lang;
}

type SoundStatus = 'on' | 'muted' | 'fail';

export const ElectricRoadHero: React.FC<ElectricRoadHeroProps> = ({ lang }) => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const numRef = useRef<HTMLDivElement | null>(null);
  const thrRef = useRef<HTMLButtonElement | null>(null);
  const sndRef = useRef<HTMLButtonElement | null>(null);

  const [soundState, setSoundState] = useState<SoundStatus>('on');
  const [isAccelerating, setIsAccelerating] = useState<boolean>(false);

  // Direct mutable state for 60fps requestAnimationFrame loop & WebAudio
  const simRef = useRef({
    v: 0.07,
    tg: 0.07,
    off: 0,
    sp: -1,
    vis: true,
    held: false,
    mute: false,
    fail: false,
  });

  // WebAudio graph references matching mockup v11
  const audioNodesRef = useRef<{
    ac: AudioContext;
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

  const aud = useCallback(() => {
    if (simRef.current.fail) return;
    try {
      if (!audioNodesRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctx) throw new Error('No WebAudio');

        const ac = new Ctx();
        const master = ac.createGain();
        master.gain.value = 0;

        const comp = ac.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.ratio.value = 4;
        master.connect(comp);
        comp.connect(ac.destination);

        // Motor oscillators: sawtooth 220Hz + triangle 440Hz -> lowpass 1600Hz
        const wA = ac.createOscillator();
        const wB = ac.createOscillator();
        const wF = ac.createBiquadFilter();
        const gA = ac.createGain();
        const gB = ac.createGain();

        wA.type = 'sawtooth';
        wB.type = 'triangle';
        wF.type = 'lowpass';
        wF.frequency.value = 1600;
        wA.frequency.value = 220;
        wB.frequency.value = 440;
        gA.gain.value = 0;
        gB.gain.value = 0;

        wA.connect(gA);
        wB.connect(gB);
        gA.connect(wF);
        gB.connect(wF);
        wF.connect(master);

        // Sub-bass sine 50Hz
        const hum = ac.createOscillator();
        const gH = ac.createGain();
        hum.type = 'sine';
        hum.frequency.value = 50;
        gH.gain.value = 0;
        hum.connect(gH);
        gH.connect(master);

        // 2-second white noise buffer for road tire roar, wind buffeting, and inverter whine
        const sr = ac.sampleRate;
        const nb = ac.createBuffer(1, sr * 2, sr);
        const d = nb.getChannelData(0);
        for (let i = 0; i < d.length; i++) {
          d[i] = Math.random() * 2 - 1;
        }

        const ns = ac.createBufferSource();
        ns.buffer = nb;
        ns.loop = true;

        // Filter 1: Bandpass 140Hz -> Lowpass 900Hz -> gN
        const nf = ac.createBiquadFilter();
        const nf2 = ac.createBiquadFilter();
        const gN = ac.createGain();
        nf.type = 'bandpass';
        nf.frequency.value = 140;
        nf.Q.value = 1.4;
        nf2.type = 'lowpass';
        nf2.frequency.value = 900;
        gN.gain.value = 0;
        ns.connect(nf);
        nf.connect(nf2);
        nf2.connect(gN);
        gN.connect(master);

        // Filter 2: Lowpass 320Hz + LFO 8Hz -> gT
        const tlp = ac.createBiquadFilter();
        const gT = ac.createGain();
        const tlfo = ac.createOscillator();
        const tlg = ac.createGain();
        tlp.type = 'lowpass';
        tlp.frequency.value = 320;
        tlp.Q.value = 3.5;
        gT.gain.value = 0;
        tlfo.frequency.value = 8;
        tlg.gain.value = 0;
        tlfo.connect(tlg);
        tlg.connect(gT.gain);
        ns.connect(tlp);
        tlp.connect(gT);
        gT.connect(master);

        // Filter 3: Bandpass 2400Hz Q=6 -> gS
        const sf = ac.createBiquadFilter();
        const gS = ac.createGain();
        sf.type = 'bandpass';
        sf.frequency.value = 2400;
        sf.Q.value = 6;
        gS.gain.value = 0;
        ns.connect(sf);
        sf.connect(gS);
        gS.connect(master);

        wA.start();
        wB.start();
        hum.start();
        tlfo.start();
        ns.start();

        audioNodesRef.current = {
          ac,
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
      }

      if (audioNodesRef.current.ac.state === 'suspended') {
        audioNodesRef.current.ac.resume().catch(() => {});
      }
    } catch {
      simRef.current.fail = true;
      setSoundState('fail');
    }
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    const hero = heroRef.current;
    const numEl = numRef.current;
    const thr = thrRef.current;
    if (!cv || !hero || !numEl || !thr) return;

    const x = cv.getContext('2d');
    if (!x) return;

    let W = 0;
    let H = 0;
    let rafId = 0;
    const R = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const E = (cx: number, cy: number, rx: number, ry: number) => {
      x.beginPath();
      x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      x.fill();
      x.stroke();
    };

    const P = (pts: [number, number][], closePath = false) => {
      x.beginPath();
      pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])));
      if (closePath) x.closePath();
    };

    // Compute smart non-overlapping coordinates so the motorcycle is 100% visible
    // in the open theater lane on desktop and open middle window on mobile!
    const getSceneCoords = () => {
      const v = simRef.current.v;
      const runFactor = Math.max(0, Math.min(1, (v - 0.07) / 0.93));
      const isMobile = W <= 700;
      const isRtl = document.documentElement.dir === 'rtl';

      if (isMobile) {
        // Mobile: Top copy + CTA row ends around ~34% H; bottom dock starts around ~77% H.
        // Place horizon at 42% H and motorcycle at 66% H with compact scale so 100% of the
        // road and rider sit inside the unobstructed middle window.
        return {
          cx: W * 0.5,
          vy: H * 0.42,
          by: H * 0.66,
          bs: Math.min(W * 0.118, H * 0.088),
        };
      }

      // Desktop: Place road & bike in the open right lane (66% W in LTR, 34% W in RTL),
      // smoothly gliding toward center (54% / 46%) when holding accelerate and copy fades out!
      const restX = isRtl ? W * 0.34 : W * 0.66;
      const activeX = isRtl ? W * 0.46 : W * 0.54;
      const cx = restX + (activeX - restX) * runFactor;

      return {
        cx,
        vy: H * 0.38,
        by: H * 0.74,
        bs: Math.min(W, H) * 0.16,
      };
    };

    const bike = (cx: number, by: number, bs: number) => {
      const v = simRef.current.v;
      const gl = Math.min(1, v * 1.15);
      const lw = Math.max(1.2, bs * 0.025);

      x.save();
      x.translate(cx, by);
      x.lineWidth = lw;
      x.lineJoin = 'round';
      x.lineCap = 'round';

      const rg = x.createRadialGradient(0, bs * 0.1, 2, 0, bs * 0.1, bs * 1.9);
      rg.addColorStop(0, `rgba(45,255,110,${0.22 + 0.38 * gl})`);
      rg.addColorStop(0.45, `rgba(45,255,110,${0.06 + 0.14 * gl})`);
      rg.addColorStop(1, 'rgba(45,255,110,0)');
      x.fillStyle = rg;
      x.fillRect(-bs * 2, -bs * 1.4, bs * 4, bs * 2.2);

      x.fillStyle = 'rgba(0,0,0,.7)';
      x.beginPath();
      x.ellipse(0, bs * 0.48, bs * 0.55, bs * 0.11, 0, 0, Math.PI * 2);
      x.fill();

      x.fillStyle = '#07090a';
      x.strokeStyle = '#252a2e';
      E(0, bs * 0.08, bs * 0.21, bs * 0.42);

      x.strokeStyle = `rgba(45,255,110,${0.2 + 0.45 * gl})`;
      x.lineWidth = Math.max(1, bs * 0.016);
      x.beginPath();
      x.ellipse(0, bs * 0.08, bs * 0.15, bs * 0.34, 0, 0, Math.PI * 2);
      x.stroke();

      x.lineWidth = lw;
      x.strokeStyle = '#2a3035';
      P([
        [-bs * 0.22, -bs * 0.18],
        [-bs * 0.19, bs * 0.1],
        [bs * 0.22, -bs * 0.18],
        [bs * 0.19, bs * 0.1],
      ]);
      x.stroke();

      x.fillStyle = '#0f1214';
      x.strokeStyle = '#23282c';
      P(
        [
          [-bs * 0.34, -bs * 0.2],
          [-bs * 0.24, -bs * 0.68],
          [bs * 0.24, -bs * 0.68],
          [bs * 0.34, -bs * 0.2],
          [bs * 0.18, -bs * 0.05],
          [-bs * 0.18, -bs * 0.05],
        ],
        true
      );
      x.fill();
      x.stroke();

      x.save();
      x.shadowColor = '#2dff6e';
      x.shadowBlur = 12 + 22 * gl;
      x.fillStyle = '#2dff6e';
      x.fillRect(-bs * 0.18, -bs * 0.69, bs * 0.36, bs * 0.075);
      x.fillStyle = '#d8ffe4';
      x.fillRect(-bs * 0.12, -bs * 0.675, bs * 0.24, bs * 0.035);
      x.restore();

      x.fillStyle = '#0c0e10';
      x.strokeStyle = '#1b1f22';
      P(
        [
          [-bs * 0.3, -bs * 0.72],
          [-bs * 0.36, -bs * 1.38],
          [-bs * 0.2, -bs * 1.54],
          [bs * 0.2, -bs * 1.54],
          [bs * 0.36, -bs * 1.38],
          [bs * 0.3, -bs * 0.72],
        ],
        true
      );
      x.fill();
      x.stroke();

      x.strokeStyle = '#0e1011';
      x.lineWidth = bs * 0.1;
      x.beginPath();
      x.moveTo(-bs * 0.23, -bs * 1.45);
      x.lineTo(-bs * 0.36, -bs * 1.28);
      x.moveTo(bs * 0.23, -bs * 1.45);
      x.lineTo(bs * 0.36, -bs * 1.28);
      x.stroke();

      x.strokeStyle = '#1b1f22';
      x.lineWidth = bs * 0.04;
      x.beginPath();
      x.moveTo(-bs * 0.4, -bs * 1.28);
      x.lineTo(bs * 0.4, -bs * 1.28);
      x.stroke();

      x.lineWidth = lw;
      x.fillStyle = '#101315';
      x.strokeStyle = '#1f2427';
      E(0, -bs * 1.68, bs * 0.17, bs * 0.19);

      x.strokeStyle = `rgba(45,255,110,${0.25 + 0.6 * gl})`;
      x.lineWidth = Math.max(1, bs * 0.02);
      x.beginPath();
      x.arc(0, -bs * 1.68, bs * 0.13, Math.PI * 1.1, Math.PI * 1.55);
      x.stroke();
      x.restore();
    };

    const draw = () => {
      const v = simRef.current.v;
      const off = simRef.current.off;
      const { cx, vy, by, bs } = getSceneCoords();
      const sw = Math.max(W * 0.85, H * 0.75);

      x.fillStyle = '#121314';
      x.fillRect(0, 0, W, H);

      const g = x.createRadialGradient(cx, vy, 0, cx, vy, W * 0.68);
      g.addColorStop(0, `rgba(45,255,110,${0.11 + 0.3 * v})`);
      g.addColorStop(1, 'rgba(45,255,110,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, W, H);

      x.fillStyle = '#17191b';
      x.beginPath();
      x.moveTo(cx, vy);
      x.lineTo(cx - sw, H);
      x.lineTo(cx + sw, H);
      x.fill();

      x.save();
      x.shadowColor = '#2dff6e';
      x.shadowBlur = 10 + 18 * v;
      x.strokeStyle = '#2dff6e';
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(cx, vy);
      x.lineTo(cx - sw, H);
      x.moveTo(cx, vy);
      x.lineTo(cx + sw, H);
      x.stroke();
      x.restore();

      x.fillStyle = '#e4e8ea';
      for (let i = 0; i < 14; i++) {
        const z = (i / 14 + off) % 1;
        const p = Math.pow(z, 2.4);
        const y = vy + (H - vy) * p;
        const w = 1 + 14 * p;
        const h = (4 + 90 * p) * (0.6 + v);
        x.fillRect(cx - w / 2, y, w, h);
      }

      if (v > 0.3) {
        x.strokeStyle = `rgba(255,255,255,${(v - 0.3) * 0.5})`;
        x.lineWidth = 1;
        x.beginPath();
        for (let i = 0; i < 34; i++) {
          const a = (((i * 137.5) % 360) * Math.PI) / 180;
          const r = (i * 0.173 + off * 3) % 1;
          const sx = cx + Math.cos(a) * W * 0.12 * (1 + r);
          const sy = vy + Math.sin(a) * H * 0.12 * (1 + r);
          const L = r * r * H * 0.7 * v;
          x.moveTo(sx, sy);
          x.lineTo(sx + Math.cos(a) * L, sy + Math.sin(a) * L);
        }
        x.stroke();
      }

      // Smoothly fade the bottom road dashes before the interaction dock at rest,
      // and lift the fade when holding accelerate so the full-screen road rushes past!
      const runFactor = Math.max(0, Math.min(1, (v - 0.07) / 0.93));
      const dockFadeAlpha = Math.max(0, 1 - runFactor * 0.92);
      if (dockFadeAlpha > 0.01) {
        const fadeStartY = W <= 700 ? H * 0.71 : H * 0.82;
        const bf = x.createLinearGradient(0, fadeStartY, 0, H);
        bf.addColorStop(0, 'rgba(18,19,20,0)');
        bf.addColorStop(0.55, `rgba(18,19,20,${(0.92 * dockFadeAlpha).toFixed(3)})`);
        bf.addColorStop(1, `rgba(18,19,20,${dockFadeAlpha.toFixed(3)})`);
        x.fillStyle = bf;
        x.fillRect(0, fadeStartY, W, H - fadeStartY);
      }

      bike(cx, by, bs);
    };

    const rs = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * d;
      cv.height = H * d;
      x.setTransform(d, 0, 0, d, 0, 0);
      draw();
    };

    const loop = () => {
      const st = simRef.current;
      if (st.vis) {
        st.v += (st.tg - st.v) * 0.045;
        if (!R) {
          st.off = (st.off + st.v * 0.018) % 1;
        }
        const s = Math.round(((Math.max(0, st.v - 0.07) / 0.93) * 85));
        if (s !== st.sp) {
          st.sp = s;
          numEl.textContent = String(s);
          if (sndRef.current) {
            const norm = Math.max(0, Math.min(1, s / 85));
            sndRef.current.style.setProperty('--snd-level', norm.toFixed(2));
          }
        }
        hero.classList.toggle('speed-mid', s >= 8 && s < 48);
        hero.classList.toggle('speed-high', s >= 48);
        if (!R || Math.abs(st.tg - st.v) > 0.002) {
          draw();
        }
      }

      const nodes = audioNodesRef.current;
      if (nodes) {
        const T = nodes.ac.currentTime;
        const L = Math.max(0, Math.min(1, (st.v - 0.07) / 0.93));
        const a = Math.min(1, L * 5);
        const f = 210 + L * 1750;

        nodes.master.gain.setTargetAtTime(
          st.mute || !st.vis || document.hidden ? 0 : 0.9,
          T,
          0.05
        );
        nodes.wA.frequency.setTargetAtTime(f, T, 0.05);
        nodes.wB.frequency.setTargetAtTime(f * 2.01, T, 0.05);
        nodes.hum.frequency.setTargetAtTime(48 + L * 150, T, 0.06);
        nodes.nf2.frequency.setTargetAtTime(500 + L * 2300, T, 0.08);

        nodes.gA.gain.setTargetAtTime(0.06 * a, T, 0.06);
        nodes.gB.gain.setTargetAtTime(0.03 * a, T, 0.09);
        nodes.gH.gain.setTargetAtTime(0.08 * a, T, 0.06);
        nodes.gN.gain.setTargetAtTime(0.06 * Math.pow(L, 1.2), T, 0.08);

        const A = 0.15 * Math.pow(L, 0.9);
        nodes.gT.gain.setTargetAtTime(A * 0.7, T, 0.08);
        nodes.tlg.gain.setTargetAtTime(A * 0.3, T, 0.08);
        nodes.tlfo.frequency.setTargetAtTime(5 + L * 32, T, 0.08);
        nodes.tlp.frequency.setTargetAtTime(350 + L * 900, T, 0.08);
        nodes.gS.gain.setTargetAtTime(0.04 * Math.pow(L, 1.3), T, 0.08);
      }

      rafId = requestAnimationFrame(loop);
    };

    // Native Hold Handler (matches mockup go(on))
    const go = (on: boolean) => {
      if (on) {
        aud();
        if (navigator.vibrate) navigator.vibrate(8);
      }
      simRef.current.held = on;
      simRef.current.tg = on ? 1 : 0.07;
      hero.classList.toggle('run', on);
      setIsAccelerating(on);
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      try {
        thr.setPointerCapture(e.pointerId);
      } catch {}
      go(true);
    };

    const onPointerRelease = () => go(false);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        go(true);
      }
    };

    const onKeyUp = () => go(false);
    const onBlur = () => go(false);
    const onContextMenu = (e: Event) => e.preventDefault();
    const onVisibilityChange = () => {
      if (document.hidden) go(false);
    };

    // One-time audio unlock on hero tap for mobile Safari/Chrome
    const unlockHeroAudio = () => {
      aud();
    };
    hero.addEventListener('pointerdown', unlockHeroAudio, { once: true });

    thr.addEventListener('pointerdown', onPointerDown);
    thr.addEventListener('pointerup', onPointerRelease);
    thr.addEventListener('pointercancel', onPointerRelease);
    thr.addEventListener('lostpointercapture', onPointerRelease);
    thr.addEventListener('keydown', onKeyDown);
    thr.addEventListener('keyup', onKeyUp);
    thr.addEventListener('blur', onBlur);
    thr.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('visibilitychange', onVisibilityChange);

    const obs = new IntersectionObserver((entries) => {
      const isIntersecting = entries[0]?.isIntersecting ?? true;
      simRef.current.vis = isIntersecting;
      if (!isIntersecting) go(false);
    });
    obs.observe(hero);

    window.addEventListener('resize', rs);
    rs();
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      obs.disconnect();
      window.removeEventListener('resize', rs);
      hero.removeEventListener('pointerdown', unlockHeroAudio);
      thr.removeEventListener('pointerdown', onPointerDown);
      thr.removeEventListener('pointerup', onPointerRelease);
      thr.removeEventListener('pointercancel', onPointerRelease);
      thr.removeEventListener('lostpointercapture', onPointerRelease);
      thr.removeEventListener('keydown', onKeyDown);
      thr.removeEventListener('keyup', onKeyUp);
      thr.removeEventListener('blur', onBlur);
      thr.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [aud]);

  const handleToggleSound = () => {
    const nextMuted = !simRef.current.mute;
    simRef.current.mute = nextMuted;
    if (!nextMuted) {
      aud();
    }
    setSoundState((prev) =>
      prev === 'fail' ? 'fail' : nextMuted ? 'muted' : 'on'
    );
  };

  const soundText =
    soundState === 'on'
      ? lang === 'ar'
        ? 'الصوت يعمل'
        : 'Son activé'
      : soundState === 'muted'
      ? lang === 'ar'
        ? 'الصوت مكتوم'
        : 'Son coupé'
      : lang === 'ar'
      ? 'الصوت غير متوفر'
      : 'Son indisponible';

  return (
    <div className="hero" id="hero" ref={heroRef}>
      <canvas id="road" ref={canvasRef} aria-hidden="true" />

      <div className="wrap hero-layout">
        <div aria-hidden="true" className="spd">
          <div className="num" id="n" ref={numRef}>
            0
          </div>
          <span>{lang === 'ar' ? 'كم/س' : 'km/h'}</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">
            NEORIDE <span>·</span>{' '}
            {lang === 'ar' ? 'بركان · 0 درهم بنزين' : 'BERKANE · 0 DH D’ESSENCE'}
          </p>

          <h1 className="si">
            {lang === 'ar'
              ? 'دراجات وسكوترات كهربائية في بركان وجهة الشرق.'
              : 'Motos & scooters électriques à Berkane et dans l’Oriental.'}
          </h1>

          <p className="hero-lead">
            {lang === 'ar'
              ? 'وفّر حتى 8\u00a0500 درهم سنويًا. شحن منزلي عادي (220V)، ضمان وقطع غيار متوفرة في بركان.'
              : 'Économisez jusqu’à 8\u00a0500 DH/an. Recharge sur prise 220V normale (~1,5 DH / 100 km), garantie et SAV local à Berkane.'}
          </p>

          <div className="cta">
            <a className="btn btn-g" href="#catalogue">
              {lang === 'ar' ? 'شوف الكتالوج والأسعار' : 'Découvrir le catalogue'}{' '}
              <span className="arr" aria-hidden="true">
                ↗
              </span>
            </a>
            <a className="link" href="#essai">
              {lang === 'ar' ? 'جرّب الموطور فبركان' : 'Réserver un essai'}{' '}
              <span className="arr" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          <div className="hero-interaction">
            <div className="interaction-copy">
              <span className="interaction-icon" aria-hidden="true">
                ↯
              </span>
              <span>
                <strong>
                  {lang === 'ar'
                    ? 'جرّب تجربة التنقل الكهربائي'
                    : 'Essayez l’expérience électrique'}
                </strong>
                <small>
                  {lang === 'ar'
                    ? 'اضغط باستمرار للتسارع'
                    : 'Maintenez pour accélérer'}
                </small>
              </span>
            </div>

            <div className="interaction-controls">
              <button
                aria-label={
                  lang === 'ar'
                    ? 'اضغط باستمرار للتسارع'
                    : 'Maintenir pour accélérer'
                }
                className="thr"
                id="thr"
                ref={thrRef}
                type="button"
              >
                <i>
                  <svg viewBox="0 0 24 24">
                    <path d="M13 2L5 14h6l-1 8 9-13h-6z" />
                  </svg>
                </i>
                <span>
                  {lang === 'ar'
                    ? 'اضغط مطوّلًا للتسريع'
                    : 'Maintenir pour accélérer'}
                </span>
              </button>

              <button
                aria-pressed={soundState === 'on'}
                className={`snd ${soundState === 'on' ? 'on' : 'off'}${
                  soundState === 'on' && isAccelerating ? ' revving' : ''
                }`}
                id="snd"
                ref={sndRef}
                type="button"
                onClick={handleToggleSound}
              >
                <span className="snd-pulse-dot" aria-hidden="true" />
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 9v6h4l5 4V5L8 9H4z" />
                  <path className="w w-inner" d="M16 9a4 4 0 010 6" />
                  <path className="w w-outer" d="M18.5 6.5a8 8 0 010 11" />
                  <path className="x" d="M16 9l5 6M21 9l-5 6" />
                </svg>
                <span id="sndt">{soundText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="trust">
        <ul>
          <li>
            {lang === 'ar'
              ? 'طرازات ابتداءً من 5\u00a0200 درهم'
              : 'Modèles dès 5\u00a0200 DH'}
          </li>
          <li>{lang === 'ar' ? 'قطع الغيار متوفرة' : 'Pièces de rechange en stock'}</li>
          <li>
            {lang === 'ar'
              ? 'خدمة ما بعد البيع محليًا'
              : 'Service après-vente local'}
          </li>
          <li>
            {lang === 'ar'
              ? 'توصيل لبركان وجهة الشرق'
              : 'Livraison Berkane & Oriental'}
          </li>
        </ul>
      </div>
    </div>
  );
};
