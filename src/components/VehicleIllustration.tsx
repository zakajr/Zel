import React from 'react';
import { ArtKind, Lang } from '../data/neorideData';

interface VehicleIllustrationProps {
  kind: ArtKind;
  accentColor?: string;
  showCallouts?: boolean;
  lang?: Lang;
  className?: string;
  label?: string;
}

export const VehicleIllustration: React.FC<VehicleIllustrationProps> = ({
  kind,
  accentColor = '#2dff6e',
  showCallouts = false,
  lang = 'fr',
  className = '',
  label,
}) => {
  const s = '#d6dfda';
  const d = '#0c0f10';

  const renderWheel = (cx: number, cy: number, r: number) => (
    <g key={`wheel-${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={r} fill={d} stroke="#2c3438" strokeWidth="4" />
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.72}
        fill="none"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeDasharray="10 6"
        opacity="0.7"
      />
      <circle cx={cx} cy={cy} r={r * 0.56} fill="none" stroke="#9aa6a0" strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#9aa6a0" />
    </g>
  );

  const renderBolt = (x: number, y: number) => (
    <path
      d={`M${x + 8} ${y}l-11 14h8l-3 11 14-16h-8z`}
      fill={accentColor}
    />
  );

  return (
    <svg
      viewBox="0 0 400 250"
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      preserveAspectRatio="xMidYMid meet"
      className={`w-full h-full select-none ${className}`}
    >
      <defs>
        <radialGradient id={`glow-${kind}-${accentColor.replace('#', '')}`} cx="50%" cy="68%" r="55%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="studio-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14181a" />
          <stop offset="100%" stopColor="#0f1214" />
        </linearGradient>
      </defs>

      <rect width="400" height="250" fill="url(#studio-bg)" />

      {/* Subtle technical studio grid lines */}
      <g stroke="#ffffff" strokeOpacity="0.035" strokeWidth="1">
        <line x1="0" y1="65" x2="400" y2="65" />
        <line x1="0" y1="130" x2="400" y2="130" />
        <line x1="0" y1="195" x2="400" y2="195" />
        <line x1="100" y1="0" x2="100" y2="250" />
        <line x1="200" y1="0" x2="200" y2="250" />
        <line x1="300" y1="0" x2="300" y2="250" />
      </g>

      <ellipse
        cx="200"
        cy="205"
        rx="185"
        ry="72"
        fill={`url(#glow-${kind}-${accentColor.replace('#', '')})`}
      />

      {!['helmet', 'battery'].includes(kind) && (
        <ellipse cx="200" cy="222" rx="152" ry="7" fill="#000000" opacity="0.55" />
      )}

      {kind === 'moto' && (
        <g>
          {renderWheel(96, 172, 46)}
          {renderWheel(304, 172, 46)}
          {/* Swingarm & Front Fork */}
          <path
            d="M96 172l92-24M304 172l-38-84"
            stroke="#8d9a93"
            strokeWidth="8.5"
            strokeLinecap="round"
          />
          {/* Handlebar */}
          <path
            d="M262 88l-14-14h-26"
            stroke={s}
            strokeWidth="6.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Main Aero Body */}
          <path
            d="M126 142l36-40q14-12 40-10l58 8q26 6 30 30l-14 22-130 6z"
            fill={s}
          />
          {/* Accent Stripe */}
          <path
            d="M164 108l52-6 42 10"
            stroke={accentColor}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Removable Battery Bay */}
          <rect
            x="168"
            y="130"
            width="92"
            height="32"
            rx="5"
            fill="#14181b"
            stroke={showCallouts ? accentColor : '#2b3338'}
            strokeWidth="1.5"
          />
          {renderBolt(206, 134)}
          {/* Ergonomic Two-up Saddle */}
          <path d="M116 120q30-12 66-12l6 14-68 8z" fill="#0e1113" />
          {/* LED Headlight */}
          <circle cx="284" cy="108" r="6" fill={accentColor} />
          <path
            d="M290 108l42 -8l0 20z"
            fill={accentColor}
            opacity="0.14"
          />
        </g>
      )}

      {kind === 'scoot' && (
        <g>
          {renderWheel(112, 188, 34)}
          {renderWheel(298, 188, 34)}
          {/* Flat Floorboard & Steering Column */}
          <path
            d="M118 186h110l30-8 20-104"
            stroke="#8d9a93"
            strokeWidth="8.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M256 74h38"
            stroke={s}
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          {/* Body Fairing */}
          <path
            d="M126 182l8-62q4-22 28-22h60l22 62-14 22z"
            fill={s}
          />
          <path d="M126 102q36-14 76-6l-2 12-72 6z" fill="#0e1113" />
          <rect
            x="154"
            y="130"
            width="66"
            height="28"
            rx="5"
            fill="#14181b"
            stroke={showCallouts ? accentColor : '#2b3338'}
            strokeWidth="1.5"
          />
          {renderBolt(179, 131)}
          <circle cx="272" cy="86" r="6" fill={accentColor} />
        </g>
      )}

      {kind === 'kick' && (
        <g>
          {renderWheel(94, 202, 26)}
          {renderWheel(310, 202, 26)}
          {/* Deck */}
          <path
            d="M94 202h216"
            stroke="#8d9a93"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Folding Stem */}
          <path
            d="M310 202L284 60"
            stroke={s}
            strokeWidth="8.5"
            strokeLinecap="round"
          />
          <path
            d="M264 60h42"
            stroke={s}
            strokeWidth="8.5"
            strokeLinecap="round"
          />
          {/* Battery Deck Enclosure */}
          <rect x="155" y="184" width="122" height="15" rx="6" fill="#14181b" />
          <path d="M166 191.5h100" stroke={accentColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="290" cy="88" r="5.5" fill={accentColor} />
        </g>
      )}

      {kind === 'helmet' && (
        <g>
          <path d="M110 172q-6-98 90-104 96 6 90 104z" fill={s} />
          <path d="M118 158q12-38 82-40 54 2 80 40z" fill="#0e1113" />
          <path
            d="M144 86q56-28 112 0"
            stroke={accentColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M110 172h180l-12 28h-156z" fill="#9aa6a0" />
        </g>
      )}

      {kind === 'battery' && (
        <g>
          {/* Ergonomic Carry Handle */}
          <path
            d="M162 76V58a10 10 0 0 1 10-10h56a10 10 0 0 1 10 10v18"
            fill="none"
            stroke={accentColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect
            x="108"
            y="78"
            width="184"
            height="108"
            rx="12"
            fill="#14181b"
            stroke="#aeb8b2"
            strokeWidth="4"
          />
          <rect x="292" y="114" width="14" height="36" rx="4" fill="#aeb8b2" />
          <rect x="126" y="96" width="34" height="72" rx="4" fill={accentColor} opacity="0.9" />
          <rect x="168" y="96" width="34" height="72" rx="4" fill={accentColor} opacity="0.65" />
          <rect x="210" y="96" width="34" height="72" rx="4" fill={accentColor} opacity="0.4" />
          <rect x="252" y="96" width="22" height="72" rx="4" fill="#252c30" />
        </g>
      )}

      {/* Optional Interactive Technical Callout Overlay */}
      {showCallouts && (
        <g className="text-[10px] font-semibold">
          {kind === 'moto' && (
            <>
              <line x1="214" y1="146" x2="214" y2="42" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 3" />
              <circle cx="214" cy="146" r="4" fill={accentColor} />
              <rect x="142" y="20" width="144" height="22" rx="3" fill="#0d0f10" stroke={accentColor} strokeWidth="1" />
              <text x="214" y="34" fill="#f2f4f3" textAnchor="middle" fontSize="10">
                {lang === 'ar' ? 'بطارية قابلة للإزالة 220V' : 'Batterie extractible 220V'}
              </text>

              <line x1="96" y1="172" x2="72" y2="72" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="3 3" />
              <circle cx="96" cy="172" r="4" fill="#cbd5e1" />
              <rect x="16" y="50" width="118" height="22" rx="3" fill="#0d0f10" stroke="#475569" strokeWidth="1" />
              <text x="75" y="64" fill="#e2e8f0" textAnchor="middle" fontSize="10">
                {lang === 'ar' ? 'محرك خلفي بدون فحمات' : 'Moteur Hub Brushless'}
              </text>
            </>
          )}
          {kind === 'scoot' && (
            <>
              <line x1="186" y1="144" x2="186" y2="44" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 3" />
              <circle cx="186" cy="144" r="4" fill={accentColor} />
              <rect x="114" y="22" width="144" height="22" rx="3" fill="#0d0f10" stroke={accentColor} strokeWidth="1" />
              <text x="186" y="36" fill="#f2f4f3" textAnchor="middle" fontSize="10">
                {lang === 'ar' ? 'شحن منزلي 2.5 درهم' : 'Charge maison ~2,5 DH'}
              </text>
            </>
          )}
          {kind === 'kick' && (
            <>
              <line x1="284" y1="108" x2="220" y2="44" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 3" />
              <circle cx="284" cy="108" r="4" fill={accentColor} />
              <rect x="136" y="22" width="136" height="22" rx="3" fill="#0d0f10" stroke={accentColor} strokeWidth="1" />
              <text x="204" y="36" fill="#f2f4f3" textAnchor="middle" fontSize="10">
                {lang === 'ar' ? 'يطوى في 3 ثوانٍ' : 'Pliage rapide 3 sec'}
              </text>
            </>
          )}
          {kind === 'helmet' && (
            <>
              <line x1="200" y1="84" x2="200" y2="38" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 3" />
              <rect x="130" y="18" width="140" height="22" rx="3" fill="#0d0f10" stroke={accentColor} strokeWidth="1" />
              <text x="200" y="32" fill="#f2f4f3" textAnchor="middle" fontSize="10">
                {lang === 'ar' ? 'معيار السلامة ECE 22.06' : 'Homologué ECE 22.06'}
              </text>
            </>
          )}
          {kind === 'battery' && (
            <>
              <line x1="200" y1="58" x2="200" y2="28" stroke={accentColor} strokeWidth="1.2" />
              <rect x="125" y="10" width="150" height="22" rx="3" fill="#0d0f10" stroke={accentColor} strokeWidth="1" />
              <text x="200" y="24" fill="#f2f4f3" textAnchor="middle" fontSize="10">
                {lang === 'ar' ? 'مقبض مريح + حماية BMS' : 'Poignée + BMS intelligent'}
              </text>
            </>
          )}
        </g>
      )}
    </svg>
  );
};
