import React from "react";
import { Compass } from "lucide-react";

export default function SriLankaMap({ onPin, pinColor = "#00b0a5", pinX, pinY, hoverLocName = "" }) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const svgX = (px / rect.width) * 320;
    const svgY = (py / rect.height) * 160;
    const lat = (8.5 - (svgY / 160) * 5).toFixed(4);
    const lng = (79.5 + (svgX / 320) * 2.5).toFixed(4);
    onPin && onPin({ svgX, svgY, lat, lng });
  };

  return (
    <div
      onClick={handleClick}
      className="relative rounded-xl overflow-hidden cursor-crosshair shadow-inner"
      style={{ height: 180, background: "#E0F2FE" }}
    >
      <svg viewBox="0 0 320 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="160" fill="#E0F2FE" />
        <line x1="80" y1="0" x2="80" y2="160" stroke="#bae6fd" strokeWidth="0.5" strokeDasharray="3" />
        <line x1="160" y1="0" x2="160" y2="160" stroke="#bae6fd" strokeWidth="0.5" strokeDasharray="3" />
        <line x1="240" y1="0" x2="240" y2="160" stroke="#bae6fd" strokeWidth="0.5" strokeDasharray="3" />
        <line x1="0" y1="40" x2="320" y2="40" stroke="#bae6fd" strokeWidth="0.5" strokeDasharray="3" />
        <line x1="0" y1="80" x2="320" y2="80" stroke="#bae6fd" strokeWidth="0.5" strokeDasharray="3" />
        <line x1="0" y1="120" x2="320" y2="120" stroke="#bae6fd" strokeWidth="0.5" strokeDasharray="3" />

        <path
          d="M148,8 L155,15 L163,25 L170,36 L173,50 L176,62 L178,75 L180,88 L181,100 L181,112 L179,122 L175,132 L168,139 L158,145 L148,147 L138,145 L128,139 L121,132 L117,122 L115,112 L115,100 L116,88 L119,75 L122,62 L126,50 L131,36 L139,25 L145,15 Z"
          fill="#D1FAE5"
          stroke="#10B981"
          strokeWidth="1"
        />

        <text x="148" y="78" textAnchor="middle" fontSize="9" fill="#047857" fontWeight="bold" fontFamily="system-ui">
          SRI LANKA
        </text>
        <text x="148" y="90" textAnchor="middle" fontSize="6.5" fill="#059669" letterSpacing="0.5" fontFamily="system-ui">
          ADMIN NAVIGATOR
        </text>

        <g opacity="0.45">
          <circle cx="120" cy="115" r="2" fill="#1E293B" />
          <text x="114" y="117" fontSize="5" textAnchor="end" fill="#1E293B">Colombo</text>
          <circle cx="155" cy="85" r="2" fill="#1E293B" />
          <text x="159" y="87" fontSize="5" textAnchor="start" fill="#1E293B">Kandy</text>
          <circle cx="157" cy="45" r="2" fill="#1E293B" />
          <text x="161" y="47" fontSize="5" textAnchor="start" fill="#1E293B">Sigiriya</text>
          <circle cx="128" cy="148" r="2" fill="#1E293B" />
          <text x="124" y="150" fontSize="5" textAnchor="end" fill="#1E293B">Galle Fort</text>
        </g>

        {pinX !== undefined && pinY !== undefined && (
          <g>
            <circle cx={pinX} cy={pinY} r="8" fill={pinColor} fillOpacity="0.2" stroke={pinColor} strokeWidth="1" />
            <circle cx={pinX} cy={pinY} r="5" fill={pinColor} fillOpacity="0.4" stroke={pinColor} strokeWidth="1" />
            <circle cx={pinX} cy={pinY} r="2.5" fill={pinColor} />
            <path d={`M ${pinX} ${pinY} L ${pinX} ${pinY - 14}`} stroke={pinColor} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={pinX} cy={pinY - 14} r="2" fill={pinColor} />
          </g>
        )}
      </svg>
      {pinX === undefined && (
        <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none select-none">
          <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-white/95 text-teal-800 shadow-sm border border-teal-100 font-medium animate-pulse">
            <Compass className="w-3.5 h-3.5" />
            Click anywhere to pin coordinates
          </span>
        </div>
      )}
      {hoverLocName && (
        <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-md bg-stone-900/85 text-stone-100 font-medium">
          Focused: {hoverLocName}
        </div>
      )}
    </div>
  );
}