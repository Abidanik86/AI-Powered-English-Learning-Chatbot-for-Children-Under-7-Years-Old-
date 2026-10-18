'use client';

import React from 'react';
import { Flashcard } from '@/lib/types';
import { childTTS } from '@/lib/audio/speechSynthesis';

interface FlashcardCardProps {
  card: Flashcard;
  onSelectWord?: (word: string) => void;
}

export const FlashcardCard: React.FC<FlashcardCardProps> = ({ card, onSelectWord }) => {
  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    childTTS.speak(card.word);
  };

  return (
    <div
      className="animate-pop"
      onClick={() => onSelectWord && onSelectWord(card.word)}
      style={{
        background: 'linear-gradient(145deg, #FFFFFF, #FFFBEB)',
        border: '3px solid #FDE68A',
        borderRadius: '24px',
        padding: '16px 20px',
        maxWidth: '380px',
        margin: '12px auto',
        boxShadow: '0 12px 24px -4px rgba(217, 119, 6, 0.15)',
        cursor: onSelectWord ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '8px'
      }}
    >
      {/* Category Pill */}
      <span
        style={{
          textTransform: 'uppercase',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.05em',
          background: '#FEF3C7',
          color: '#B45309',
          padding: '4px 12px',
          borderRadius: '999px'
        }}
      >
        {card.category}
      </span>

      {/* Big Emoji */}
      <div
        style={{
          fontSize: '56px',
          lineHeight: 1,
          margin: '4px 0',
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
        }}
      >
        {card.emoji}
      </div>

      {/* Target Word & Phonetics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h3
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#1E293B',
            fontFamily: 'Fredoka, sans-serif'
          }}
        >
          {card.word}
        </h3>
        <button
          onClick={handlePronounce}
          title="Hear pronunciation"
          style={{
            border: 'none',
            background: '#E0F2FE',
            color: '#0284C7',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.2)'
          }}
        >
          🔊
        </button>
      </div>

      <span
        style={{
          fontSize: '15px',
          color: '#64748B',
          fontWeight: 600,
          letterSpacing: '0.02em'
        }}
      >
        {card.phonetic.replace(/\//g, '')}
      </span>

      {/* Sound Hint */}
      {card.soundHint && (
        <div
          style={{
            background: '#F0FDF4',
            color: '#15803D',
            fontSize: '13px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '10px',
            marginTop: '2px'
          }}
        >
          🎶 {card.soundHint}
        </div>
      )}

      {/* Example Phrase */}
      {card.examplePhrase && (
        <p
          style={{
            fontSize: '13px',
            color: '#475569',
            fontStyle: 'italic',
            marginTop: '4px'
          }}
        >
          "{card.examplePhrase}"
        </p>
      )}

      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginTop: '4px' }}>
        👉 Tap card or say "{card.word}" out loud!
      </span>
    </div>
  );
};
