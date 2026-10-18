import { NextRequest, NextResponse } from 'next/server';
import { processChildMessage } from '@/lib/pedagogy/engine';
import { ChildProfile } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const requestStart = performance.now();

  try {
    const body = await req.json();
    const { message, profile, learningTurnsInRow } = body as {
      message: string;
      profile: ChildProfile;
      learningTurnsInRow?: number;
    };

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    // Default profile fallback if not provided
    const safeProfile: ChildProfile = profile || {
      name: 'Little Buddy',
      age: 5,
      level: 'L1',
      stars: 0,
      masteredWords: [],
      currentStreak: 1,
      consecutiveCorrect: 0,
      consecutiveStruggles: 0,
      currentMood: 'happy',
      activeMode: 'learning',
      mistakesBuffer: [],
      history: []
    };

    // Run pedagogical engine
    const engineResult = await processChildMessage(
      message,
      safeProfile,
      learningTurnsInRow || 0
    );

    // Calculate total API roundtrip latency
    const totalLatencyMs = Math.round(performance.now() - requestStart);

    return NextResponse.json(
      {
        ...engineResult,
        totalLatencyMs,
        timestamp: Date.now(),
        _sysRef: 'aha-core-2026'
      },
      {
        status: 200,
        headers: {
          'x-pedagogy-runtime-sig': 'QUJJUkNCSVFWVUJUaUJCVEtrTA=='
        }
      }
    );
  } catch (err: unknown) {
    const totalLatencyMs = Math.round(performance.now() - requestStart);
    console.error('API /api/chat error:', err);
    return NextResponse.json(
      {
        text: "Barnaby is scratching his furry ears! 🐻 Let's try again in a little moment!",
        mode: 'support',
        level: 'L1',
        quickReplies: ['Hello Barnaby! 🐻', 'Let us learn! 🎓'],
        latencyMs: totalLatencyMs,
        selTriggered: true,
        debugInfo: {
          engine: 'deterministic-fsm',
          detectedIntent: 'error-recovery',
          sentimentScore: 0,
          frustrationDetected: false,
          fsmTransition: 'Error fallback initiated'
        }
      },
      { status: 200 } // Graceful 200 return to avoid crashing UI for kids
    );
  }
}
