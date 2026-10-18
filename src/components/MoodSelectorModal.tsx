'use client';

import React from 'react';
import { MoodState } from '@/lib/types';

interface MoodSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMood: (mood: MoodState, phrase: string) => void;
}

const MOODS: { mood: MoodState; label: string; emoji: string; color: string; phrase: string }[] = [
  { mood: 'happy', label: 'Happy & Cheerful', emoji: '😊', color: '#10B981', phrase: 'I feel super happy today!' },
  { mood: 'curious', label: 'Curious Explorer', emoji: '🧐', color: '#0284C7', phrase: 'I am curious to learn something cool!' },
  { mood: 'silly', label: 'Giggly & Silly', emoji: '😜', color: '#F59E0B', phrase: 'I feel silly and want to giggle!' },
  { mood: 'sleepy', label: 'A Little Sleepy', emoji: '🥱', color: '#8B5CF6', phrase: 'I am a little bit sleepy today.' },
  { mood: 'frustrated', label: 'Frustrated / Grumpy', emoji: '😣', color: '#EF4444', phrase: 'I feel grumpy and things are hard.' },
  { mood: 'shy', label: 'Quiet & Shy', emoji: '🙈', color: '#EC4899', phrase: 'I feel a little shy right now.' }
];

export const MoodSelectorModal: React.FC<MoodSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectMood
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(6px)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="animate-pop"
        style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          padding: '28px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          textAlign: 'center'
        }}
      >
        <span style={{ fontSize: '40px' }}>🌈</span>
        <h3
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#1E293B',
            margin: '8px 0 4px 0',
            fontFamily: 'Fredoka, sans-serif'
          }}
        >
          How is your little heart feeling today?
        </h3>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>
          Barnaby loves you no matter how you feel! Tap your mood:
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}
        >
          {MOODS.map((m) => (
            <button
              key={m.mood}
              onClick={() => {
                onSelectMood(m.mood, m.phrase);
                onClose();
              }}
              style={{
                border: `2px solid ${m.color}30`,
                background: `${m.color}0D`,
                borderRadius: '16px',
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.borderColor = m.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = `${m.color}30`;
              }}
            >
              <span style={{ fontSize: '32px' }}>{m.emoji}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                {m.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            border: 'none',
            background: 'transparent',
            color: '#94A3B8',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};
