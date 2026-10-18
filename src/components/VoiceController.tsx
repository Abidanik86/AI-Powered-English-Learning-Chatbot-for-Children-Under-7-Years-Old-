'use client';

import React, { useState } from 'react';
import { childListener } from '@/lib/audio/speechRecognition';

interface VoiceControllerProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({ onSendMessage, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [micError, setMicError] = useState<string | null>(null);

  const toggleMic = () => {
    if (isListening) {
      childListener.stopListening();
      setIsListening(false);
    } else {
      setMicError(null);
      childListener.startListening(
        (transcript) => {
          setIsListening(false);
          if (transcript.trim()) {
            onSendMessage(transcript.trim());
          }
        },
        (listening) => {
          setIsListening(listening);
        },
        () => {
          setIsListening(false);
          setMicError('Mic unavailable. You can type below!');
        }
      );
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !disabled) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto' }}>
      {/* Listening Banner if active */}
      {isListening && (
        <div
          className="animate-pop"
          style={{
            background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
            border: '2px solid #FCA5A5',
            borderRadius: '16px',
            padding: '8px 16px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🎙️</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#B91C1C' }}>
              Barnaby is listening! Say a word or sentence out loud...
            </span>
          </div>
          <button
            type="button"
            onClick={toggleMic}
            style={{
              border: 'none',
              background: '#EF4444',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '999px',
              cursor: 'pointer'
            }}
          >
            Done Speaking 🛑
          </button>
        </div>
      )}

      {/* Sleek Ergonomic Dock */}
      <form
        onSubmit={handleFormSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFFFFF',
          padding: '6px 8px 6px 8px',
          borderRadius: '999px',
          boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.1)',
          border: '2px solid #E2E8F0'
        }}
      >
        {/* Integrated Push-To-Talk Mic Button */}
        <button
          type="button"
          onClick={toggleMic}
          disabled={disabled}
          title={isListening ? 'Stop Listening' : 'Tap to speak to Barnaby'}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            border: 'none',
            background: isListening
              ? 'linear-gradient(135deg, #EF4444, #DC2626)'
              : 'linear-gradient(135deg, #0284C7, #0369A1)',
            color: '#FFFFFF',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            boxShadow: isListening
              ? '0 0 0 4px rgba(239, 68, 68, 0.3)'
              : '0 4px 10px rgba(2, 132, 199, 0.3)',
            transition: 'transform 0.15s ease'
          }}
        >
          {isListening ? '🛑' : '🎤'}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? 'Listening to your voice...' : 'Type a word, question, or tap the mic...'}
          disabled={disabled}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '15px',
            fontWeight: 500,
            fontFamily: 'Outfit, sans-serif',
            color: '#1E293B',
            background: 'transparent',
            padding: '8px 4px'
          }}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !inputText.trim()}
          style={{
            border: 'none',
            background: inputText.trim() ? '#0284C7' : '#E2E8F0',
            color: inputText.trim() ? '#FFFFFF' : '#94A3B8',
            fontWeight: 700,
            fontSize: '14px',
            padding: '10px 18px',
            borderRadius: '999px',
            cursor: inputText.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0
          }}
        >
          <span>Send</span>
          <span>🚀</span>
        </button>
      </form>

      {micError && (
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: '#B91C1C' }}>{micError}</span>
        </div>
      )}
    </div>
  );
};
