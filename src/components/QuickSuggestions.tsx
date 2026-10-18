'use client';

import React from 'react';

interface QuickSuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({
  suggestions,
  onSelect,
  disabled
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px',
        margin: '10px 0',
        maxWidth: '700px'
      }}
    >
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          style={{
            border: '2px solid #E0F2FE',
            background: '#FFFFFF',
            color: '#0369A1',
            borderRadius: '999px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: disabled ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)',
            transition: 'all 0.18s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#E0F2FE';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>{suggestion}</span>
        </button>
      ))}
    </div>
  );
};
