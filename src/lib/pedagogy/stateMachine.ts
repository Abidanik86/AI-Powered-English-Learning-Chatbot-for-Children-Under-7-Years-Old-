import { ChildMode, ChildProfile } from '../types';
import { SELAnalysis } from './selEngine';

export interface ModeDecision {
  nextMode: ChildMode;
  previousMode: ChildMode;
  transitionReason: string;
  isModeChanged: boolean;
}

const CASUAL_CONVERSATION_TRIGGERS = [
  'i have', 'my dog', 'my cat', 'my mom', 'my dad', 'my sister', 'my brother',
  'i like', 'today', 'my toy', 'play with me', 'who are you', 'what is your name',
  'do you like', 'what do you eat', 'honey', 'where do you live', 'friend'
];

const ENGAGEMENT_TRIGGERS = [
  'joke', 'funny', 'riddle', 'game', 'play', 'sing', 'song', 'silly',
  'make me laugh', 'story', 'magic', 'animal sound', 'bored', 'dance'
];

const LEARNING_TRIGGERS = [
  'teach', 'learn', 'word', 'what is this', 'how to say', 'spell', 'say',
  'read', 'abc', 'phonics', 'next', 'again', 'one more', 'ready', 'yes'
];

export function determineNextChildMode(
  input: string,
  profile: ChildProfile,
  sel: SELAnalysis,
  learningTurnsInRow: number
): ModeDecision {
  const clean = input.toLowerCase().trim();
  const prev = profile.activeMode;

  // Rule 1: High priority SEL Intervention -> Switch to SUPPORT mode
  if (sel.selInterventionNeeded) {
    return {
      nextMode: 'support',
      previousMode: prev,
      transitionReason: 'Frustration or fatigue detected in child input. Prioritizing emotional comfort & safety.',
      isModeChanged: prev !== 'support'
    };
  }

  // Rule 2: If in SUPPORT mode and child responds calmly -> Bridge to ENGAGEMENT (fun, zero-pressure)
  if (prev === 'support') {
    const recoveryWords = ['okay', 'ok', 'good', 'better', 'yes', 'ready', 'happy', 'smile', 'fun', 'hug'];
    const isRecovering = recoveryWords.some(w => clean.includes(w));
    if (isRecovering || sel.sentimentScore >= 0) {
      return {
        nextMode: 'engagement',
        previousMode: prev,
        transitionReason: 'Emotional safety restored. Transitioning to low-stress playful engagement.',
        isModeChanged: true
      };
    }
    return {
      nextMode: 'support',
      previousMode: prev,
      transitionReason: 'Child still requires supportive listening and gentle reassurance.',
      isModeChanged: false
    };
  }

  // Rule 3: Anti-fatigue rule: Do not continuously teach!
  // If child has been in learning mode for 4 turns, automatically offer a playful breather
  if (prev === 'learning' && learningTurnsInRow >= 3) {
    return {
      nextMode: 'engagement',
      previousMode: prev,
      transitionReason: 'Anti-fatigue rule: Child completed 3+ learning rounds. Shifting to playful engagement breather.',
      isModeChanged: true
    };
  }

  // Rule 4: Explicit Engagement Triggers
  const wantsEngagement = ENGAGEMENT_TRIGGERS.some(kw => clean.includes(kw));
  if (wantsEngagement) {
    return {
      nextMode: 'engagement',
      previousMode: prev,
      transitionReason: 'Child requested a game, riddle, joke, or playful activity.',
      isModeChanged: prev !== 'engagement'
    };
  }

  // Rule 5: Explicit Casual Conversation Triggers
  const wantsConversation = CASUAL_CONVERSATION_TRIGGERS.some(kw => clean.includes(kw));
  if (wantsConversation) {
    return {
      nextMode: 'conversation',
      previousMode: prev,
      transitionReason: 'Child shared a personal thought, question, or casual observation.',
      isModeChanged: prev !== 'conversation'
    };
  }

  // Rule 6: Explicit Learning Triggers
  const wantsLearning = LEARNING_TRIGGERS.some(kw => clean.includes(kw));
  if (wantsLearning) {
    return {
      nextMode: 'learning',
      previousMode: prev,
      transitionReason: 'Child is eager for new vocabulary, phonics, or word challenges.',
      isModeChanged: prev !== 'learning'
    };
  }

  // Rule 7: Default smooth transition preserving active mode or alternating appropriately
  return {
    nextMode: prev,
    previousMode: prev,
    transitionReason: `Maintaining current ${prev} state based on conversational continuity.`,
    isModeChanged: false
  };
}
