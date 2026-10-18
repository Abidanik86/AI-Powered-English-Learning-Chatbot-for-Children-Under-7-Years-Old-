'use client';

import React, { useState, useCallback } from 'react';
import { ChatMessage, ChildProfile, LearningLevel, MoodState } from '@/lib/types';
import { Header } from '@/components/Header';
import { Mascot } from '@/components/Mascot';
import { ChatWindow } from '@/components/ChatWindow';
import { QuickSuggestions } from '@/components/QuickSuggestions';
import { VoiceController } from '@/components/VoiceController';
import { EvaluatorInspector } from '@/components/EvaluatorInspector';
import { MoodSelectorModal } from '@/components/MoodSelectorModal';
import { childTTS } from '@/lib/audio/speechSynthesis';
import { soundFX } from '@/lib/audio/soundEffects';
import { LEVEL_1_VOCAB } from '@/lib/pedagogy/curriculum';

export default function Home() {
  const [profile, setProfile] = useState<ChildProfile>({
    name: 'Little Superstar',
    age: 4,
    level: 'L1',
    stars: 2,
    masteredWords: ['cat', 'sun'],
    currentStreak: 1,
    consecutiveCorrect: 0,
    consecutiveStruggles: 0,
    currentMood: 'happy',
    activeMode: 'learning',
    mistakesBuffer: [],
    history: []
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hello little superstar! 🌟 I'm Barnaby the Bear! 🐻 Welcome to our English playground! Let's discover fun words together!",
      timestamp: Date.now(),
      mode: 'learning',
      level: 'L1',
      flashcard: LEVEL_1_VOCAB[0], // Cat
      quickReplies: ['Cat! 🐱', 'Meow! 🐾', 'Hello Barnaby! 🐻', 'Play a game! 🎈'],
      latencyMs: 38
    }
  ]);

  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [moodModalOpen, setMoodModalOpen] = useState(false);
  const [lastLatencyMs, setLastLatencyMs] = useState(38);
  const [lastTransitionReason, setLastTransitionReason] = useState('Initial welcome greeting');
  const [sentimentScore, setSentimentScore] = useState(0.5);
  const [frustrationFlag, setFrustrationFlag] = useState(false);
  const [learningTurnsInRow, setLearningTurnsInRow] = useState(1);

  // Trigger confetti safely
  const triggerCelebration = useCallback(() => {
    setIsCelebrating(true);
    soundFX.playStarChime();
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.6 }
        });
      }).catch(() => {});
    }
    setTimeout(() => setIsCelebrating(false), 2000);
  }, []);

  // Handle Send Message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isBotTyping) return;

    soundFX.playPop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsBotTyping(true);

    const clientStartTime = performance.now();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          profile,
          learningTurnsInRow
        })
      });

      const data = await res.json();
      const roundTripLatency = Math.round(performance.now() - clientStartTime);

      setLastLatencyMs(roundTripLatency);
      setLastTransitionReason(data.debugInfo?.fsmTransition || 'Standard response cycle');
      setSentimentScore(data.debugInfo?.sentimentScore ?? 0);
      setFrustrationFlag(data.debugInfo?.frustrationDetected ?? false);

      // Sound & Celebration
      if (data.starsAwarded > 0) {
        triggerCelebration();
      } else if (data.mode === 'support') {
        soundFX.playComfortChime();
      }

      if (data.levelUp) {
        soundFX.playLevelUpFanfare();
      }

      // Update Profile State
      setProfile((prev) => {
        const newMastered = [...prev.masteredWords];
        if (data.flashcard && data.starsAwarded > 0) {
          const word = data.flashcard.word.toLowerCase();
          if (!newMastered.includes(word)) newMastered.push(word);
        }

        return {
          ...prev,
          level: data.level || prev.level,
          stars: prev.stars + (data.starsAwarded || 0),
          activeMode: data.mode || prev.activeMode,
          masteredWords: newMastered,
          consecutiveCorrect: data.starsAwarded > 0 ? prev.consecutiveCorrect + 1 : 0,
          consecutiveStruggles: data.debugInfo?.frustrationDetected ? prev.consecutiveStruggles + 1 : 0
        };
      });

      setLearningTurnsInRow((prev) => (data.mode === 'learning' ? prev + 1 : 0));

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.text,
        timestamp: Date.now(),
        mode: data.mode,
        level: data.level,
        flashcard: data.flashcard,
        quickReplies: data.quickReplies || [],
        latencyMs: roundTripLatency
      };

      setMessages((prev) => [...prev, botMsg]);

      // Read aloud via child-friendly TTS
      if (soundEnabled) {
        setIsSpeaking(true);
        childTTS.speak(data.text, () => {
          setIsSpeaking(false);
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackLatency = Math.round(performance.now() - clientStartTime);
      setLastLatencyMs(fallbackLatency);

      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "Barnaby's tummy is ticklish! 🐻 Let's try that again!",
        timestamp: Date.now(),
        mode: 'support',
        quickReplies: ['Hello Barnaby! 🐻', 'Let us learn! 🎓'],
        latencyMs: fallbackLatency
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleSelectWord = (word: string) => {
    handleSendMessage(word);
  };

  const handleSelectLevel = (lvl: LearningLevel) => {
    setProfile((prev) => ({ ...prev, level: lvl }));
    handleSendMessage(`I want to explore Level ${lvl}!`);
  };

  const handleSelectMood = (mood: MoodState, phrase: string) => {
    setProfile((prev) => ({ ...prev, currentMood: mood }));
    handleSendMessage(phrase);
  };

  const currentReplies = messages.length > 0 ? messages[messages.length - 1].quickReplies || [] : [];

  return (
    <div className="app-container">
      {/* Top Navigation & Live Benchmark Bar */}
      <Header
        level={profile.level}
        stars={profile.stars}
        mode={profile.activeMode}
        lastLatencyMs={lastLatencyMs}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          childTTS.setEnabled(next);
        }}
        onOpenInspector={() => setInspectorOpen(true)}
        onSelectLevel={handleSelectLevel}
        onOpenMoodModal={() => setMoodModalOpen(true)}
      />

      {/* Main Two-Column Responsive Workspace */}
      <main className="main-layout">
        {/* Left Column: Companion Stage & Child Progress */}
        <aside className="companion-sidebar">
          {/* Barnaby the Bear Mascot */}
          <Mascot
            mode={profile.activeMode}
            isSpeaking={isSpeaking}
            isListening={false}
            isCelebrating={isCelebrating}
          />

          {/* Level & Stars Card (Hidden on narrow mobile screens) */}
          <div
            className="hide-on-mobile"
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '12px 14px',
              border: '1.5px solid #FEF3C7',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>
                Level {profile.level} Journey
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#D97706' }}>
                ⭐ {profile.stars} Stars
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: '#F1F5F9',
                borderRadius: '999px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, (profile.stars % 5) * 20 + 20)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #FFB703, #F59E0B)',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
            <span style={{ fontSize: '10px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              {(5 - (profile.stars % 5)) === 5 ? 5 : (5 - (profile.stars % 5))} stars to next level celebration! 🎈
            </span>
          </div>

          {/* Mastered Words Pill Box (Hidden on mobile) */}
          <div
            className="hide-on-mobile"
            style={{
              width: '100%',
              background: '#F8FAFC',
              borderRadius: '16px',
              padding: '12px',
              border: '1px solid #E2E8F0',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              🏆 Mastered Words ({profile.masteredWords.length})
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', overflowY: 'auto', maxHeight: '110px' }}>
              {profile.masteredWords.map((w, idx) => (
                <span
                  key={idx}
                  onClick={() => handleSendMessage(w)}
                  style={{
                    background: '#E0F2FE',
                    color: '#0369A1',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    cursor: 'pointer'
                  }}
                  title="Click to practice again"
                >
                  ✓ {w}
                </span>
              ))}
            </div>

            {/* Quick SEL / Game action shortcuts */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={() => handleSendMessage('Tell me a fun riddle!')}
                style={{
                  border: 'none',
                  background: '#FEF3C7',
                  color: '#92400E',
                  borderRadius: '10px',
                  padding: '7px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🎈</span>
                <span>Play Animal Riddle</span>
              </button>
              <button
                onClick={() => handleSendMessage("I want to take a calm balloon breath.")}
                style={{
                  border: 'none',
                  background: '#FCE7F3',
                  color: '#9D174D',
                  borderRadius: '10px',
                  padding: '7px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>💖</span>
                <span>Balloon Breath (SEL)</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column: Full-Height Chat Arena */}
        <section className="chat-arena">
          {/* Scrollable Chat Window with clear message spacing */}
          <ChatWindow
            messages={messages}
            onSelectWord={handleSelectWord}
            isBotTyping={isBotTyping}
          />

          {/* Bottom Dock: Tap Suggestions & Voice Controller */}
          <div
            style={{
              padding: '8px 16px 14px 16px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderTop: '1.5px solid #F1F5F9',
              boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.03)'
            }}
          >
            {/* Quick Answer Suggestion Chips */}
            <QuickSuggestions
              suggestions={currentReplies}
              onSelect={handleSendMessage}
              disabled={isBotTyping}
            />

            {/* Integrated Mic + Keyboard Input Bar */}
            <VoiceController
              onSendMessage={handleSendMessage}
              disabled={isBotTyping}
            />
          </div>
        </section>
      </main>

      {/* Evaluator Inspector Slide-out Drawer */}
      <EvaluatorInspector
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        profile={profile}
        lastLatencyMs={lastLatencyMs}
        lastTransitionReason={lastTransitionReason}
        sentimentScore={sentimentScore}
        frustrationFlag={frustrationFlag}
        onSimulateScenario={(prompt) => {
          handleSendMessage(prompt);
        }}
        onForceLevel={(lvl) => {
          setProfile((p) => ({ ...p, level: lvl }));
        }}
        onForceMode={(mode) => {
          setProfile((p) => ({ ...p, activeMode: mode }));
        }}
      />

      {/* Morning / Session Mood Check-In Modal */}
      <MoodSelectorModal
        isOpen={moodModalOpen}
        onClose={() => setMoodModalOpen(false)}
        onSelectMood={handleSelectMood}
      />
    </div>
  );
}
