'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/lib/types';
import { FlashcardCard } from './FlashcardCard';
import { childTTS } from '@/lib/audio/speechSynthesis';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSelectWord: (word: string) => void;
  isBotTyping: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSelectWord,
  isBotTyping
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    // Scroll immediately and again after microtask to account for flashcard render
    scrollToBottom();
    const t = setTimeout(scrollToBottom, 80);
    return () => clearTimeout(t);
  }, [messages, isBotTyping]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollBottom(!isNearBottom);
  };

  const handleSpeak = (text: string) => {
    childTTS.speak(text);
  };

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px 30px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          scrollBehavior: 'smooth'
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className="animate-pop"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '6px',
                maxWidth: '88%',
                alignSelf: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              {/* Header: Sender + Latency Tag */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isUser ? '#0284C7' : '#B45309',
                  padding: '0 4px'
                }}
              >
                <span>{isUser ? '🧒 You' : '🐻 Barnaby'}</span>
                {msg.latencyMs !== undefined && (
                  <span
                    style={{
                      fontSize: '10px',
                      color: msg.latencyMs < 2000 ? '#047857' : '#DC2626',
                      background: msg.latencyMs < 2000 ? '#ECFDF5' : '#FEF2F2',
                      border: `1px solid ${msg.latencyMs < 2000 ? '#A7F3D0' : '#FECACA'}`,
                      padding: '1px 7px',
                      borderRadius: '6px',
                      fontWeight: 700
                    }}
                  >
                    ⚡ {msg.latencyMs}ms
                  </span>
                )}
              </div>

              {/* Speech Bubble */}
              <div
                style={{
                  background: isUser
                    ? 'linear-gradient(135deg, #0284C7, #0369A1)'
                    : msg.mode === 'support'
                    ? 'linear-gradient(135deg, #FFF1F2, #FFE4E6)'
                    : '#FFFFFF',
                  color: isUser ? '#FFFFFF' : '#1E293B',
                  padding: '16px 20px',
                  borderRadius: isUser ? '22px 22px 6px 22px' : '22px 22px 22px 6px',
                  boxShadow: isUser
                    ? '0 6px 16px rgba(2, 132, 199, 0.28)'
                    : '0 6px 18px rgba(0, 0, 0, 0.06)',
                  border: isUser ? 'none' : '2px solid rgba(254, 243, 199, 0.7)',
                  fontSize: '17px',
                  lineHeight: 1.55,
                  wordBreak: 'break-word',
                  position: 'relative'
                }}
              >
                <span>{msg.text}</span>

                {/* Sound replay button for kid accessibility */}
                {!isUser && (
                  <button
                    onClick={() => handleSpeak(msg.text)}
                    title="Listen again"
                    style={{
                      border: 'none',
                      background: '#F1F5F9',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      marginLeft: '10px',
                      verticalAlign: 'middle',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    🔊
                  </button>
                )}
              </div>

              {/* Flashcard embedded cleanly if present */}
              {msg.flashcard && (
                <div style={{ width: '100%', marginTop: '4px' }}>
                  <FlashcardCard card={msg.flashcard} onSelectWord={onSelectWord} />
                </div>
              )}
            </div>
          );
        })}

        {/* Bot Thinking Skeleton */}
        {isBotTyping && (
          <div
            style={{
              alignSelf: 'flex-start',
              background: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '22px 22px 22px 6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '2px solid #FEF3C7',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#B45309',
              fontWeight: 700
            }}
          >
            <span>🐻 Barnaby is thinking</span>
            <span style={{ letterSpacing: '3px', fontWeight: 900 }}>...</span>
          </div>
        )}

        <div ref={bottomRef} style={{ height: '4px' }} />
      </div>

      {/* Floating Jump-To-Bottom Pill if scrolled up */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="animate-pop"
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '24px',
            background: 'linear-gradient(135deg, #0284C7, #0369A1)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '999px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(2, 132, 199, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10
          }}
        >
          <span>Latest Message</span>
          <span>⬇️</span>
        </button>
      )}
    </div>
  );
};
