export type LearningLevel = 'L1' | 'L2' | 'L3';

export type ChildMode = 'learning' | 'conversation' | 'engagement' | 'support';

export type MoodState = 'happy' | 'curious' | 'silly' | 'sleepy' | 'frustrated' | 'shy';

export interface Flashcard {
  id: string;
  word: string;
  phonetic: string;
  emoji: string;
  category: 'animals' | 'colors' | 'fruits' | 'actions' | 'emotions' | 'objects';
  soundHint?: string;
  examplePhrase?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  mode?: ChildMode;
  level?: LearningLevel;
  flashcard?: Flashcard;
  quickReplies?: string[];
  latencyMs?: number;
  selNote?: string;
}

export interface ChildProfile {
  name: string;
  age: number;
  level: LearningLevel;
  stars: number;
  masteredWords: string[];
  currentStreak: number;
  consecutiveCorrect: number;
  consecutiveStruggles: number;
  currentMood: MoodState;
  activeMode: ChildMode;
  mistakesBuffer: string[];
  history: { sender: 'user' | 'bot'; text: string; timestamp: number }[];
}

export interface EngineResponse {
  text: string;
  mode: ChildMode;
  level: LearningLevel;
  flashcard?: Flashcard;
  quickReplies: string[];
  starsAwarded?: number;
  levelUp?: boolean;
  latencyMs: number;
  selTriggered: boolean;
  debugInfo: {
    engine: 'deterministic-fsm' | 'llm-hybrid';
    detectedIntent: string;
    sentimentScore: number;
    frustrationDetected: boolean;
    fsmTransition: string;
    runtimeSignature?: string;
  };
}

export interface LevelCurriculum {
  level: LearningLevel;
  name: string;
  targetAge: string;
  description: string;
  vocabBank: Flashcard[];
  conversationStarters: string[];
  engagementRiddles: { question: string; answer: string; hint: string; emoji: string }[];
  selComfortPhrases: string[];
}
