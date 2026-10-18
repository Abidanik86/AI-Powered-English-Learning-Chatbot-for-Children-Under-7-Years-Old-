import { Flashcard, LevelCurriculum } from '../types';

export const LEVEL_1_VOCAB: Flashcard[] = [
  { id: 'l1-cat', word: 'Cat', phonetic: 'KAT', emoji: '🐱', category: 'animals', soundHint: 'Meow! Meow!', examplePhrase: 'A soft cat!' },
  { id: 'l1-dog', word: 'Dog', phonetic: 'DAWG', emoji: '🐶', category: 'animals', soundHint: 'Woof! Woof!', examplePhrase: 'A happy dog!' },
  { id: 'l1-sun', word: 'Sun', phonetic: 'SUN', emoji: '☀️', category: 'objects', soundHint: 'Warm and bright!', examplePhrase: 'The yellow sun!' },
  { id: 'l1-apple', word: 'Apple', phonetic: 'AP-PUL', emoji: '🍎', category: 'fruits', soundHint: 'Crunch crunch!', examplePhrase: 'A yummy red apple!' },
  { id: 'l1-red', word: 'Red', phonetic: 'RED', emoji: '🔴', category: 'colors', soundHint: 'Like a strawberry!', examplePhrase: 'The red balloon!' },
  { id: 'l1-blue', word: 'Blue', phonetic: 'BLOO', emoji: '🔵', category: 'colors', soundHint: 'Like the sky!', examplePhrase: 'The blue sea!' },
  { id: 'l1-happy', word: 'Happy', phonetic: 'HAP-EE', emoji: '😊', category: 'emotions', soundHint: 'Big bright smile!', examplePhrase: 'I feel happy!' },
  { id: 'l1-duck', word: 'Duck', phonetic: 'DUK', emoji: '🦆', category: 'animals', soundHint: 'Quack! Quack!', examplePhrase: 'A swimming duck!' },
  { id: 'l1-star', word: 'Star', phonetic: 'STAR', emoji: '⭐', category: 'objects', soundHint: 'Twinkle twinkle!', examplePhrase: 'A shining star!' },
  { id: 'l1-ball', word: 'Ball', phonetic: 'BALL', emoji: '⚽', category: 'objects', soundHint: 'Bounce bounce!', examplePhrase: 'Kick the ball!' }
];

export const LEVEL_2_VOCAB: Flashcard[] = [
  { id: 'l2-big-bear', word: 'Big Bear', phonetic: 'BIG BAIR', emoji: '🐻', category: 'animals', soundHint: 'Grrr! Big and cuddly!', examplePhrase: 'I see a big bear!' },
  { id: 'l2-green-tree', word: 'Green Tree', phonetic: 'GREEN TREE', emoji: '🌳', category: 'objects', soundHint: 'Rustle rustle in the wind!', examplePhrase: 'Climb the green tree!' },
  { id: 'l2-run-fast', word: 'Run Fast', phonetic: 'RUN FAST', emoji: '🏃', category: 'actions', soundHint: 'Pitter patter zoom!', examplePhrase: 'We run fast together!' },
  { id: 'l2-sweet-banana', word: 'Sweet Banana', phonetic: 'BA-NA-NA', emoji: '🍌', category: 'fruits', soundHint: 'Peel and munch!', examplePhrase: 'Monkeys love bananas!' },
  { id: 'l2-jump-high', word: 'Jump High', phonetic: 'JUMP HY', emoji: '🦘', category: 'actions', soundHint: 'Boing boing!', examplePhrase: 'Can you jump high?' },
  { id: 'l2-little-bird', word: 'Little Bird', phonetic: 'LIT-TL BIRD', emoji: '🐦', category: 'animals', soundHint: 'Chirp chirp tweet!', examplePhrase: 'The little bird sings!' },
  { id: 'l2-warm-milk', word: 'Warm Milk', phonetic: 'WARM MILK', emoji: '🥛', category: 'objects', soundHint: 'Sip sip soothing!', examplePhrase: 'Drink warm milk!' },
  { id: 'l2-funny-frog', word: 'Funny Frog', phonetic: 'FUN-NEE FROG', emoji: '🐸', category: 'animals', soundHint: 'Ribbit! Ribbit!', examplePhrase: 'The funny frog hops!' }
];

export const LEVEL_3_VOCAB: Flashcard[] = [
  { id: 'l3-butterfly', word: 'Gentle Butterfly', phonetic: 'BUT-TER-FLY', emoji: '🦋', category: 'animals', soundHint: 'Flutter flutter softly!', examplePhrase: 'The gentle butterfly dances in the garden.' },
  { id: 'l3-rainbow', word: 'Colorful Rainbow', phonetic: 'RAIN-BOH', emoji: '🌈', category: 'objects', soundHint: 'Seven magical colors!', examplePhrase: 'Look at the colorful rainbow after the rain!' },
  { id: 'l3-rocket', word: 'Fast Rocket', phonetic: 'ROK-IT', emoji: '🚀', category: 'objects', soundHint: '3, 2, 1... Blastoff!', examplePhrase: 'The fast rocket zooms to the moon!' },
  { id: 'l3-friendship', word: 'Kind Friend', phonetic: 'FREND', emoji: '🤝', category: 'emotions', soundHint: 'Sharing and caring!', examplePhrase: 'You are a very kind friend!' },
  { id: 'l3-dolphin', word: 'Playful Dolphin', phonetic: 'DOL-FIN', emoji: '🐬', category: 'animals', soundHint: 'Splash and flip!', examplePhrase: 'The playful dolphin leaps out of the sea.' },
  { id: 'l3-curiosity', word: 'Brave Explorer', phonetic: 'EX-PLOR-ER', emoji: '🧭', category: 'actions', soundHint: 'Searching for wonders!', examplePhrase: 'The brave explorer finds a secret treasure.' }
];

export const CURRICULA: Record<'L1' | 'L2' | 'L3', LevelCurriculum> = {
  L1: {
    level: 'L1',
    name: 'Seedling Explorer',
    targetAge: 'Ages 3–4',
    description: 'Phonics, animal sounds, single words, primary colors, and cheerful imitation.',
    vocabBank: LEVEL_1_VOCAB,
    conversationStarters: [
      'Hi little buddy! 🐻 What is your favorite animal?',
      'Look around you! Do you see something RED or something BLUE?',
      'Barnaby loves sweet apples! What fruit do you like to eat?'
    ],
    engagementRiddles: [
      { question: 'I say "Meow" and I love drinking milk. Who am I?', answer: 'Cat', hint: 'It has whiskers and purrs!', emoji: '🐱' },
      { question: 'I shine bright in the blue sky and keep you warm. What am I?', answer: 'Sun', hint: 'It is round and yellow!', emoji: '☀️' },
      { question: 'I swim in the pond and say "Quack quack". Who am I?', answer: 'Duck', hint: 'A yellow bird with webbed feet!', emoji: '🦆' }
    ],
    selComfortPhrases: [
      "It is okay! Barnaby is right here with you! 🤗",
      "You are doing great! Let's take a deep breath like a big balloon. Inhale... and exhale! 🎈",
      "Every time you try, your brain grows a tiny bit stronger! 🌱"
    ]
  },
  L2: {
    level: 'L2',
    name: 'Little Adventurer',
    targetAge: 'Ages 5–6',
    description: 'Two to four-word phrases, action verbs, questions, feelings, and simple binary choices.',
    vocabBank: LEVEL_2_VOCAB,
    conversationStarters: [
      'Welcome back adventurer! 🌟 If you could fly like a bird, where would you go?',
      'Barnaby is building a tall block tower! Do you want to add a RED block or a GREEN block?',
      'What game makes you giggle the most?'
    ],
    engagementRiddles: [
      { question: 'I am green, I hop in the mud, and I say "Ribbit"! What am I?', answer: 'Funny Frog', hint: 'Look near the lily pads!', emoji: '🐸' },
      { question: 'I have big ears, a long trunk, and I love water! Who am I?', answer: 'Elephant', hint: 'The biggest animal on land!', emoji: '🐘' },
      { question: 'I have sweet yellow peel and monkeys love to eat me! What am I?', answer: 'Sweet Banana', hint: 'You peel it to eat it!', emoji: '🍌' }
    ],
    selComfortPhrases: [
      "Mistakes are just magical clues that help us learn! ✨",
      "Take your time, friend. There is no rush at all! 🐢",
      "Barnaby believes in you! You are so brave for practicing! 💖"
    ]
  },
  L3: {
    level: 'L3',
    name: 'Storyteller Champion',
    targetAge: 'Ages 6–7',
    description: 'Complete simple sentences, interactive mini-story branches, feelings, and questions.',
    vocabBank: LEVEL_3_VOCAB,
    conversationStarters: [
      'Imagine we found a magic door behind a bookshelf! What is behind it?',
      'If you could invent a brand new superpower today, what would you choose?',
      'Tell Barnaby about the best part of your day!'
    ],
    engagementRiddles: [
      { question: 'I have no wings, but I can fly to outer space with fire and smoke! What am I?', answer: 'Fast Rocket', hint: '3... 2... 1... Blastoff!', emoji: '🚀' },
      { question: 'I appear after the rain with seven bright arc colors in the sky. What am I?', answer: 'Colorful Rainbow', hint: 'Red, orange, yellow, green, blue, indigo, violet!', emoji: '🌈' },
      { question: 'I live in the ocean, jump through waves, and click to my family. Who am I?', answer: 'Playful Dolphin', hint: 'A friendly smiling sea creature!', emoji: '🐬' }
    ],
    selComfortPhrases: [
      "Hard things become easy things when we practice step-by-step! 🧗",
      "It is totally normal to feel tired or frustrated sometimes. Your feelings matter to Barnaby! 🧸",
      "You are a thoughtful explorer with a huge heart! Let's shake our hands out and smile! 🌈"
    ]
  }
};
