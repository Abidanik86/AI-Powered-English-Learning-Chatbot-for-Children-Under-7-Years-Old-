# Architecture & Data Flow Diagrams

**Project Title:** AI-Powered English Learning Chatbot for Children (Under 7 Years Old)  
**Mascot Companion:** Barnaby the Bear 🐻  

---

## 1. System Architecture Overview

```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer (Browser)"]
        UI["Child UI & Mascot (Barnaby the Bear)"]
        VoiceSTT["Web Speech Recognition (STT)"]
        VoiceTTS["Web Speech Synthesis (TTS)"]
        WebAudio["Web Audio Synthesizer (FX Chimes)"]
        Inspector["Evaluator Diagnostic Panel (<2s Monitor)"]
        Storage["LocalStorage (Stars, Levels, History)"]
    end

    subgraph APILayer ["Backend / API Layer (Next.js Edge)"]
        RouteHandler["POST /api/chat"]
        Timer["High-Res Latency Stopwatch"]
    end

    subgraph IntelligenceEngine ["Child-Pedagogy Engine"]
        SELEngine["SEL Sentiment & Frustration Analyzer"]
        FSM["Child Mode Classifier (4 States)"]
        Curriculum["Pedagogy Matrix (L1, L2, L3)"]
        Progression["Adaptive Gamification & Stars"]
    end

    UI --> VoiceSTT
    VoiceSTT --> RouteHandler
    UI --> RouteHandler
    RouteHandler --> Timer
    Timer --> SELEngine
    SELEngine --> FSM
    FSM --> Curriculum
    Curriculum --> Progression
    Progression --> RouteHandler
    RouteHandler --> Timer
    Timer --> UI
    UI --> VoiceTTS
    UI --> WebAudio
    UI --> Inspector
    UI --> Storage
```

---

## 2. Request & Response Lifecycle (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor Child as 🧒 Child (Under 7)
    participant UI as 🎨 Interactive UI / Mascot
    participant API as ⚡ /api/chat (Next.js)
    participant SEL as 💖 SEL Frustration Detector
    participant FSM as 🔄 Mode State Machine
    participant Bank as 📚 Curriculum Bank
    participant TTS as 🔊 Child Voice Synthesizer

    Child->>UI: Speaks "Cat!" or taps big chip
    UI->>UI: Start Latency Timer & Play Bubble Pop
    UI->>API: HTTP POST { message, profile, learningTurns }
    API->>SEL: Analyze sentiment & frustration keywords
    SEL-->>API: Sentiment Score: +0.6 (Enthusiastic)
    API->>FSM: Classify next mode (learning, chat, play, support)
    FSM-->>API: Active Mode: LEARNING (Matches target word)
    API->>Bank: Retrieve L1 flashcard (Cat /kæt/) & award Star
    Bank-->>API: Flashcard object, next target, celebration flag
    API-->>UI: JSON { text, mode, flashcard, starsAwarded: 1, latencyMs: 42 }
    UI->>UI: Calculate roundtrip latency: 42ms (< 2000ms PASS)
    UI->>UI: Trigger Star Chime & Confetti blast! 🎉
    UI->>TTS: Speak Barnaby's response aloud
    TTS-->>Child: "Fantastic! You said Cat! ⭐"
```

---

## 3. Child Mode Finite State Machine (FSM)

```mermaid
stateDiagram-v2
    [*] --> Greeting : User joins session

    Greeting --> LearningMode : Child ready for words
    Greeting --> ConversationMode : Child shares personal story

    state LearningMode {
        [*] --> PhonicsPrompt
        PhonicsPrompt --> AssessResponse
        AssessResponse --> StarAwarded : Correct pronunciation
        AssessResponse --> GentleHelp : Close attempt
    }

    state SupportMode {
        [*] --> ValidateEmotions
        ValidateEmotions --> BalloonBreathing
        BalloonBreathing --> Reassurance
    }

    state EngagementMode {
        [*] --> SillyRiddle
        SillyRiddle --> TongueTwister
        TongueTwister --> AnimalNoises
    }

    state ConversationMode {
        [*] --> OpenPrompt
        OpenPrompt --> EmpathyReflect
        EmpathyReflect --> ChildQuestion
    }

    LearningMode --> SupportMode : Frustration ("too hard", "I can't", crying)
    LearningMode --> EngagementMode : Anti-Fatigue (3+ consecutive learning turns)
    LearningMode --> ConversationMode : Casual trigger ("my puppy", "my mom")

    SupportMode --> EngagementMode : Emotion stabilized (calm recovery)
    SupportMode --> LearningMode : Child says "I am ready!"

    EngagementMode --> LearningMode : Energy refreshed
    ConversationMode --> LearningMode : Natural educational bridge
```

---

## 4. Evaluator Live Latency & Diagnostic Architecture

```mermaid
flowchart LR
    ClientReq["Child Input"] --> TimerStart["Timer Starts: T0"]
    TimerStart --> Process["FSM & SEL Processing (~20ms)"]
    Process --> NetworkReturn["Response Packaged (~15ms)"]
    NetworkReturn --> TimerStop["Timer Stops: T1"]
    TimerStop --> Delta["Latency Delta: T1 - T0 = 35ms"]
    Delta --> Check{"Delta < 2000ms?"}
    Check -- Yes --> BadgeGreen["⚡ 35ms PASS (< 2.0s)"]
    Check -- No --> BadgeRed["⚠️ SLA VIOLATION"]
    BadgeGreen --> LiveInspector["Visible in Evaluator Drawer"]
```
