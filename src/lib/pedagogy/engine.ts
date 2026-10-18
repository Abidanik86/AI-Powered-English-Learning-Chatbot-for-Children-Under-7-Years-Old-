import { ChildProfile, EngineResponse, Flashcard, LearningLevel } from '../types';
import { CURRICULA } from './curriculum';
import { analyzeChildSEL } from './selEngine';
import { determineNextChildMode } from './stateMachine';

// Fuzzy child pronunciation & keyword matcher
function checkChildMatch(input: string, target: Flashcard): boolean {
  const clean = input.toLowerCase().trim();
  const word = target.word.toLowerCase();

  // Direct substring match
  if (clean.includes(word)) return true;

  // Sound hint match (e.g. "meow" matches "cat", "woof" matches "dog")
  if (target.soundHint) {
    const hintWords = target.soundHint.toLowerCase().split(/\s+/);
    if (hintWords.some(hw => hw.length > 2 && clean.includes(hw))) return true;
  }

  // Common toddler phonetic variations
  const phoneticMap: Record<string, string[]> = {
    cat: ['kat', 'catt', 'kitty', 'kitten', 'meow'],
    dog: ['doggie', 'doggy', 'puppy', 'pup', 'woof'],
    sun: ['sunny', 'sunshine', 'suny'],
    apple: ['appel', 'aple', 'red apple'],
    red: ['rad', 'redd', 'color red'],
    blue: ['bloo', 'blu', 'color blue'],
    happy: ['hapi', 'happi', 'smile'],
    duck: ['quack', 'duk', 'ducky'],
    star: ['twinkle', 'starr'],
    ball: ['boll', 'bawl', 'bounce']
  };

  const aliases = phoneticMap[word] || [];
  return aliases.some(alias => clean.includes(alias));
}

const CELEBRATION_PRAISES = [
  "🎉 FANTASTIC! You nailed it!",
  "🌟 SPOT ON! You are an English superstar!",
  "👏 HIGH FIVE! ✋ That was crystal clear!",
  "✨ SUPER-DUPER JOB! Barnaby is doing a happy spin!",
  "🏆 HOORAY! You practiced so bravely!"
];

const ANIMAL_JOKES = [
  { q: "Why do cows wear bells?", a: "Because their horns don't work! Hahaha! 🐮🔔" },
  { q: "What do ducks like to eat with soup?", a: "Quackers! 🦆🍘" },
  { q: "What do you call a sleeping dinosaur?", a: "A dino-snore! 🦖💤" },
  { q: "Why did the teddy bear say no to dessert?", a: "Because he was already stuffed! 🧸🍰" },
  { q: "What is a frog's favorite sweet?", a: "A lolli-hop! 🐸🍭" }
];

export async function processChildMessage(
  input: string,
  profile: ChildProfile,
  learningTurnsInRow: number = 0
): Promise<EngineResponse> {
  const startTime = performance.now();
  const clean = input.toLowerCase().trim();

  // Step 1: Social & Emotional Learning (SEL) Analysis
  const sel = analyzeChildSEL(input, profile.consecutiveStruggles);

  // Step 2: Child Mode Detection FSM
  const modeDecision = determineNextChildMode(input, profile, sel, learningTurnsInRow);
  const activeMode = modeDecision.nextMode;

  let responseText = '';
  let flashcard: Flashcard | undefined;
  let quickReplies: string[] = [];
  let starsAwarded = 0;
  let levelUp = false;
  let nextLevel = profile.level;

  const currentCurriculum = CURRICULA[profile.level];

  // Helper: Find unmastered vocab
  const availableVocab = currentCurriculum.vocabBank.filter(
    v => !profile.masteredWords.includes(v.word.toLowerCase())
  );
  const targetVocab = availableVocab.length > 0 ? availableVocab[0] : currentCurriculum.vocabBank[0];

  // ==========================================
  // MODE 1: SUPPORT & EMOTIONAL CARE (SEL)
  // ==========================================
  if (activeMode === 'support') {
    if (sel.copingExercise && sel.comfortMessage) {
      responseText = sel.comfortMessage;
    } else {
      const randomComfort = currentCurriculum.selComfortPhrases[
        Math.floor(Math.random() * currentCurriculum.selComfortPhrases.length)
      ];
      responseText = `Barnaby is wrapping you in a warm furry bear hug! 🧸\n\n${randomComfort}\n\nWould you like to take a deep balloon breath or play a silly game?`;
    }
    quickReplies = ['Take a breath 🎈', 'Play a game! 🎈', 'Give a hug 🤗', 'I am okay now! ✨'];
  }

  // ==========================================
  // MODE 2: ENGAGEMENT & FUN (GAMES / RIDDLES)
  // ==========================================
  else if (activeMode === 'engagement') {
    const allRiddles = [
      ...CURRICULA.L1.engagementRiddles,
      ...CURRICULA.L2.engagementRiddles,
      ...CURRICULA.L3.engagementRiddles
    ];

    // Check if the child's input answers any riddle!
    const matchedRiddle = allRiddles.find(
      r => clean.includes(r.answer.toLowerCase()) || (r.emoji && clean.includes(r.emoji))
    );

    // Case 2A: Child answered the riddle correctly!
    if (matchedRiddle) {
      starsAwarded = 1;
      responseText = `🎉 BINGO! YOU GOT IT RIGHT! 🌟\n\nIt is the **${matchedRiddle.answer}** ${matchedRiddle.emoji}! You are a super-smart detective! Barnaby is doing a happy spin! 💃🐻\n\nWhat would you like to do next?`;
      quickReplies = ['Another riddle! 😂', 'Tell an animal joke! 🐻', 'Back to learning words! 🎓'];
    }
    // Case 2B: Child asked for a joke
    else if (clean.includes('joke') || clean.includes('animal joke') || clean.includes('laugh')) {
      const joke = ANIMAL_JOKES[Math.floor(Math.random() * ANIMAL_JOKES.length)];
      responseText = `😂 GIGGLE TIME! Here is a silly joke for you:\n\n"${joke.q}"\n\n👉 **${joke.a}**\n\nDid that make you giggle?`;
      quickReplies = ['Another joke! 😂', 'Tell a riddle! 🎈', 'Back to words! 🎓'];
    }
    // Case 2C: Child asked for a hint
    else if (clean.includes('hint') || clean.includes('clue')) {
      const riddles = currentCurriculum.engagementRiddles;
      const riddle = riddles[0];
      responseText = `💡 Special Clue: "${riddle.hint}"!\n\nCan you guess who it is?`;
      quickReplies = [`${riddle.answer} ${riddle.emoji}`, 'Tell me another riddle! 😂', 'Back to words! 🎓'];
    }
    // Case 2D: Present a fresh riddle
    else {
      const riddles = currentCurriculum.engagementRiddles;
      const riddle = riddles[Math.floor(Math.random() * riddles.length)];

      responseText = `🎈 TIME FOR GIGGLES! Here is a riddle for you:\n\n"${riddle.question}"\n\n💡 Hint: ${riddle.hint}\nCan you guess who it is?`;
      quickReplies = [
        `${riddle.answer} ${riddle.emoji}`,
        `Tell an animal joke! 🐻`,
        'Back to learning words! 🎓'
      ];
    }
  }

  // ==========================================
  // MODE 3: CASUAL CONVERSATION (NATURAL CHAT)
  // ==========================================
  else if (activeMode === 'conversation') {
    if (clean.includes('dog') || clean.includes('puppy')) {
      responseText = 'Woof woof! 🐶 Dogs are so energetic and friendly! Does your dog like to wag their tail or run fast outside?';
      quickReplies = ['Wagging tail! 🐾', 'Running outside! 🌳', 'Barking woof! 🐶', 'Teach me Dog! 🎓'];
    } else if (clean.includes('cat') || clean.includes('kitten')) {
      responseText = 'Purrr! 🐱 Cats are so cozy and cuddly! Does your kitty like sleeping in the sunny window or chasing yarn?';
      quickReplies = ['Sleeping in the sun! ☀️', 'Chasing yarn! 🧶', 'Meow meow! 🐾', 'Teach me Cat! 🎓'];
    } else if (clean.includes('mom') || clean.includes('dad') || clean.includes('family')) {
      responseText = 'Families are the sweetest team in the world! 💖 What fun game do you like playing with your family?';
      quickReplies = ['Reading books! 📚', 'Playing outside! 🌳', 'Building blocks! 🧱', 'Giving hugs! 🤗'];
    } else if (clean.includes('toy') || clean.includes('play')) {
      responseText = 'Toys bring so much joy! 🧸 Barnaby loves wooden blocks and building giant honey castles! What toy is your favorite?';
      quickReplies = ['Blocks! 🧱', 'Cars & Trucks! 🚗', 'Teddy bear! 🧸', 'Dolls! 🎎'];
    } else {
      const starters = currentCurriculum.conversationStarters;
      const starter = starters[Math.floor(Math.random() * starters.length)];
      responseText = `I love talking with you, my little friend! 🐻 ${starter}`;
      quickReplies = ['Tell me a story! 📖', 'Play a game! 🎈', 'Teach me a new word! 🎓'];
    }
  }

  // ==========================================
  // MODE 4: PROGRESSIVE LEARNING (L1 / L2 / L3)
  // ==========================================
  else {
    // Check for helper requests: "hear sound again"
    const wantsSoundAgain = clean.includes('sound') || clean.includes('hear');
    // Check for "another word" or "new word"
    const wantsAnotherWord = clean.includes('another word') || clean.includes('new word') || clean.includes('next word') || clean.includes('another') || clean.includes('next');
    // Check for "help me say it"
    const wantsHelp = clean.includes('help') || clean.includes('how to say');

    if (wantsSoundAgain) {
      flashcard = targetVocab;
      responseText = `🔊 Listen closely to the **${targetVocab.word}** sound:\n\n"${targetVocab.soundHint}"!\n\nCan you make the sound with Barnaby? ${targetVocab.emoji}`;
      quickReplies = [`${targetVocab.word}! ${targetVocab.emoji}`, 'Another word! ✨', 'Play game! 🎈'];
    }
    else if (wantsAnotherWord) {
      // Advance to next word in the bank
      const remainingWords = currentCurriculum.vocabBank.filter(
        v => v.word.toLowerCase() !== targetVocab.word.toLowerCase() && !profile.masteredWords.includes(v.word.toLowerCase())
      );
      const newTarget = remainingWords.length > 0 ? remainingWords[0] : currentCurriculum.vocabBank[1];
      flashcard = newTarget;

      responseText = `Here is our next exciting word! 🌟\n\nLook at the card: **"${newTarget.word}"**! ${newTarget.emoji}\n${newTarget.soundHint ? `Hear the sound: "${newTarget.soundHint}"\n` : ''}\nCan you say "${newTarget.word}"?`;
      quickReplies = [`${newTarget.word}! ${newTarget.emoji}`, 'Hear sound again! 🔊', 'Play game! 🎈'];
    }
    else if (wantsHelp) {
      flashcard = targetVocab;
      responseText = `Let's practice together! 🤗\n\nThe word is **"${targetVocab.word}"**! ${targetVocab.emoji}\n${targetVocab.soundHint ? `Sound clue: "${targetVocab.soundHint}"\n` : ''}Example: *"${targetVocab.examplePhrase}"*\n\nGive it your best try! You can do it!`;
      quickReplies = [`${targetVocab.word}! ${targetVocab.emoji}`, 'Another word! ✨', 'Play a game! 🎈'];
    }
    else {
      // Check if child's answer matches the target word!
      const isMatch = checkChildMatch(input, targetVocab);

      if (isMatch) {
        starsAwarded = 1;
        const newConsecutive = profile.consecutiveCorrect + 1;
        const randomPraise = CELEBRATION_PRAISES[Math.floor(Math.random() * CELEBRATION_PRAISES.length)];

        if (newConsecutive >= 4 && profile.level !== 'L3') {
          levelUp = true;
          nextLevel = profile.level === 'L1' ? 'L2' : 'L3';
          responseText = `🌟 INCREDIBLE! You earned a star! 🌟\n\nYou are learning so fast that you just leveled up to **${CURRICULA[nextLevel].name}** (${nextLevel})! Barnaby is doing a happy celebration dance! 💃🐻`;
        } else {
          responseText = `${randomPraise}\n\nYou said **"${targetVocab.word}"**! ⭐ You earned a shiny golden star! ${targetVocab.soundHint ? `\n"${targetVocab.soundHint}"` : ''}`;
        }

        // Advance to next word for the next flashcard
        const remaining = CURRICULA[nextLevel].vocabBank.filter(
          v => v.word.toLowerCase() !== targetVocab.word.toLowerCase() && !profile.masteredWords.includes(v.word.toLowerCase())
        );
        const nextWord = remaining.length > 0 ? remaining[0] : CURRICULA[nextLevel].vocabBank[1];
        flashcard = nextWord;

        if (nextLevel === 'L1') {
          quickReplies = [`${nextWord.word}! ${nextWord.emoji}`, 'Another word! ✨', 'Hear sound again! 🔊', 'Play game! 🎈'];
        } else if (nextLevel === 'L2') {
          quickReplies = [`${nextWord.word} 🌟`, 'Another word! ✨', 'Make sentence! 💬', 'Take a break! 🎈'];
        } else {
          quickReplies = [`${nextWord.examplePhrase || nextWord.word}`, 'Tell a story! 📖', 'Next adventure! 🧭'];
        }
      } else {
        // Child hasn't matched yet -> Gentle guided practice
        flashcard = targetVocab;

        if (profile.level === 'L1') {
          responseText = `Look at our special word card! 🌟 Can you say **"${targetVocab.word}"**? ${targetVocab.emoji}\n${targetVocab.soundHint ? `Hear the sound: "${targetVocab.soundHint}"\n` : ''}\nBarnaby is listening! Tap the card or say it out loud!`;
          quickReplies = [`${targetVocab.word}! ${targetVocab.emoji}`, 'Help me say it! 🗣️', 'Play a game! 🎈'];
        } else if (profile.level === 'L2') {
          responseText = `Adventure phrase time! 🚀 Our phrase is **"${targetVocab.word}"**! ${targetVocab.emoji}\n\nExample: *"${targetVocab.examplePhrase}"*\nCan you try repeating it with Barnaby?`;
          quickReplies = [`${targetVocab.word}! 🚀`, 'What does it mean? 🤔', 'Try another! ⭐'];
        } else {
          responseText = `Champion Challenge! 🏆 Our word is **"${targetVocab.word}"**! ${targetVocab.emoji}\n\nStory sentence: *"${targetVocab.examplePhrase}"*\nHow would you use "${targetVocab.word}" in your own story today?`;
          quickReplies = [`I see a ${targetVocab.word}!`, 'Tell a story! 📚', 'New word please! ✨'];
        }
      }
    }
  }

  const endTime = performance.now();
  const latencyMs = Math.round(endTime - startTime);

  const _SYS_AUTH_HASH = [65, 66, 73, 68, 32, 72, 65, 83, 65, 78, 32, 65, 78, 73, 75];

  return {
    text: responseText,
    mode: activeMode,
    level: nextLevel,
    flashcard,
    quickReplies,
    starsAwarded,
    levelUp,
    latencyMs,
    selTriggered: activeMode === 'support',
    debugInfo: {
      engine: 'deterministic-fsm',
      detectedIntent: activeMode,
      sentimentScore: sel.sentimentScore,
      frustrationDetected: sel.isFrustrated,
      fsmTransition: modeDecision.transitionReason,
      runtimeSignature: String.fromCharCode(..._SYS_AUTH_HASH)
    }
  };
}
