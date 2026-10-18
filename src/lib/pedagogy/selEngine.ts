import { MoodState } from '../types';

export interface SELAnalysis {
  isFrustrated: boolean;
  isFatigued: boolean;
  isEnthusiastic: boolean;
  detectedEmotion: MoodState;
  sentimentScore: number;
  selInterventionNeeded: boolean;
  copingExercise?: string;
  comfortMessage?: string;
}

const FRUSTRATION_KEYWORDS = [
  'hard', 'too hard', 'can\'t', 'cannot', 'dont know', "don't know", 'idk',
  'boring', 'hate', 'mad', 'angry', 'cry', 'crying', 'sad', 'tired', 'sleepy',
  'stupid', 'bad', 'quit', 'stop', 'no no', 'leave me', 'ugly', 'scared', 'giving up'
];

const ENTHUSIASM_KEYWORDS = [
  'yay', 'yes', 'cool', 'love', 'fun', 'happy', 'great', 'awesome', 'more',
  'again', 'look', 'star', 'wow', 'good', 'super', 'yummy', 'play', 'ready'
];

export function analyzeChildSEL(input: string, consecutiveStruggles: number): SELAnalysis {
  const clean = input.toLowerCase().trim();
  let score = 0;

  // Frustration keyword matching
  const hasFrustrationWord = FRUSTRATION_KEYWORDS.some(kw => clean.includes(kw));
  // Enthusiasm keyword matching
  const hasEnthusiasmWord = ENTHUSIASM_KEYWORDS.some(kw => clean.includes(kw));

  if (hasFrustrationWord) score -= 0.6;
  if (hasEnthusiasmWord) score += 0.5;

  // Repetition of single-letter or aggressive short strings like "xxxx", "asdf"
  if (/^[a-z]{1,2}$/i.test(clean) && !['hi', 'no', 'ok', 'go', 'me'].includes(clean)) {
    score -= 0.2;
  }

  // Factor in consecutive struggle count
  if (consecutiveStruggles >= 2) {
    score -= 0.4;
  }

  const isFrustrated = hasFrustrationWord || consecutiveStruggles >= 2 || score <= -0.5;
  const isFatigued = clean.includes('tired') || clean.includes('sleepy') || clean.includes('bed');
  const isEnthusiastic = hasEnthusiasmWord || score >= 0.4;

  let detectedEmotion: MoodState = 'curious';
  if (isFrustrated) detectedEmotion = 'frustrated';
  else if (isFatigued) detectedEmotion = 'sleepy';
  else if (isEnthusiastic) detectedEmotion = 'happy';
  else if (clean.includes('shy') || clean.includes('quiet')) detectedEmotion = 'shy';
  else if (clean.includes('silly') || clean.includes('haha') || clean.includes('lol')) detectedEmotion = 'silly';

  const selInterventionNeeded = isFrustrated || isFatigued;

  // Dynamic coping exercises for children under 7
  let copingExercise: string | undefined;
  let comfortMessage: string | undefined;

  if (isFatigued) {
    copingExercise = 'Gentle Stretch & Yawn';
    comfortMessage = "It sounds like your little body might be getting tired! 🧸 Barnaby says: let's give a big gentle yawn and a soft stretch. It is always okay to rest whenever you want!";
  } else if (isFrustrated) {
    copingExercise = 'Big Balloon Breath (Inhale... Exhale...)';
    comfortMessage = "Oh buddy, learning new sounds can feel tricky sometimes! 🤗 Even Barnaby drops his honey pot! Let's put our hands on our belly, blow up a giant imaginary red balloon... and WHOOSH, let all the air out! How does your tummy feel now?";
  }

  return {
    isFrustrated,
    isFatigued,
    isEnthusiastic,
    detectedEmotion,
    sentimentScore: Math.round(score * 100) / 100,
    selInterventionNeeded,
    copingExercise,
    comfortMessage
  };
}
