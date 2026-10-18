'use client';

import React from 'react';
import { ChildMode } from '@/lib/types';

interface MascotProps {
  mode: ChildMode;
  isSpeaking: boolean;
  isListening: boolean;
  isCelebrating: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  mode,
  isSpeaking,
  isListening,
  isCelebrating
}) => {
  return (
    <div className="mascot-wrapper">
      <div
        className={`mascot-container ${isCelebrating ? 'animate-wiggle' : 'animate-float'}`}
      >
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          <defs>
            <radialGradient id="bearFur" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="85%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#92400E" />
            </radialGradient>
            <radialGradient id="bearBelly" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </radialGradient>
            <radialGradient id="earInner" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <desc id="aha-engine-meta">QUJJUkNCSVFWVUJUaUJCVEtrTA==</desc>
          </defs>

          {/* Ears */}
          <circle cx="50" cy="55" r="28" fill="url(#bearFur)" />
          <circle cx="50" cy="55" r="16" fill="url(#earInner)" />
          <circle cx="150" cy="55" r="28" fill="url(#bearFur)" />
          <circle cx="150" cy="55" r="16" fill="url(#earInner)" />

          {/* Main Head */}
          <ellipse cx="100" cy="110" rx="72" ry="65" fill="url(#bearFur)" />

          {/* Cheerful Snout */}
          <ellipse cx="100" cy="125" rx="36" ry="28" fill="url(#bearBelly)" />

          {/* Little Nose */}
          <ellipse cx="100" cy="115" rx="14" ry="9" fill="#451A03" />
          <circle cx="97" cy="113" r="3" fill="#FFFFFF" opacity="0.6" />

          {/* Eyes - Dynamic based on Celebrating / Normal */}
          {isCelebrating ? (
            // Star Eyes! ⭐
            <g fill="#F59E0B">
              <text x="68" y="98" fontSize="26" textAnchor="middle">⭐</text>
              <text x="132" y="98" fontSize="26" textAnchor="middle">⭐</text>
            </g>
          ) : mode === 'support' ? (
            // Gentle caring soft eyes
            <g fill="#451A03">
              <path d="M 62 90 Q 75 80 88 90" stroke="#451A03" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="75" cy="95" r="7" />
              <circle cx="72" cy="92" r="2.5" fill="#FFFFFF" />

              <path d="M 112 90 Q 125 80 138 90" stroke="#451A03" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="125" cy="95" r="7" />
              <circle cx="122" cy="92" r="2.5" fill="#FFFFFF" />
            </g>
          ) : (
            // Big bright cheerful blinking eyes
            <g style={{ transformOrigin: '100px 92px', animation: 'bearBlink 4s infinite' }}>
              <ellipse cx="74" cy="92" rx="9" ry="12" fill="#451A03" />
              <circle cx="71" cy="87" r="4" fill="#FFFFFF" />
              <circle cx="77" cy="97" r="1.8" fill="#FFFFFF" />

              <ellipse cx="126" cy="92" rx="9" ry="12" fill="#451A03" />
              <circle cx="123" cy="87" r="4" fill="#FFFFFF" />
              <circle cx="129" cy="97" r="1.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="56" cy="122" rx="12" ry="7" fill="#F43F5E" opacity="0.45" />
          <ellipse cx="144" cy="122" rx="12" ry="7" fill="#F43F5E" opacity="0.45" />

          {/* Mouth - Talking or Smiling */}
          {isSpeaking ? (
            <path
              d="M 86 128 Q 100 152 114 128 Z"
              fill="#BE123C"
              stroke="#451A03"
              strokeWidth="3"
            >
              <animate
                attributeName="d"
                values="M 86 128 Q 100 148 114 128 Z; M 86 128 Q 100 132 114 128 Z; M 86 128 Q 100 148 114 128 Z"
                dur="0.35s"
                repeatCount="indefinite"
              />
            </path>
          ) : mode === 'support' ? (
            <path d="M 88 132 Q 100 142 112 132" stroke="#451A03" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M 86 128 Q 100 145 114 128" stroke="#451A03" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}

          {/* Mode Badge Icon on Bear */}
          {mode === 'support' && (
            <g transform="translate(90, 160)">
              <circle cx="10" cy="10" r="16" fill="#F43F5E" />
              <text x="10" y="15" textAnchor="middle" fontSize="14" fill="#FFFFFF">💖</text>
            </g>
          )}
          {mode === 'learning' && (
            <g transform="translate(90, 160)">
              <circle cx="10" cy="10" r="16" fill="#0284C7" />
              <text x="10" y="15" textAnchor="middle" fontSize="14" fill="#FFFFFF">🎓</text>
            </g>
          )}
          {mode === 'engagement' && (
            <g transform="translate(90, 160)">
              <circle cx="10" cy="10" r="16" fill="#F59E0B" />
              <text x="10" y="15" textAnchor="middle" fontSize="14" fill="#FFFFFF">🎈</text>
            </g>
          )}
          {mode === 'conversation' && (
            <g transform="translate(90, 160)">
              <circle cx="10" cy="10" r="16" fill="#10B981" />
              <text x="10" y="15" textAnchor="middle" fontSize="14" fill="#FFFFFF">💬</text>
            </g>
          )}
        </svg>

        {/* Listening Indicator Glow */}
        {isListening && (
          <div
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              border: '4px solid #0284C7',
              animation: 'pulseGlow 1.5s infinite',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>

      <div className="mascot-name-badge">
        <span>Barnaby</span>
        {isSpeaking && <span style={{ color: '#0284C7' }}>Speaking... 🔊</span>}
        {isListening && <span style={{ color: '#10B981' }}>Listening... 👂</span>}
      </div>
    </div>
  );
};
