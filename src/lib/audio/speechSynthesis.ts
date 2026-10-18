// Web Speech API Voice Synthesizer tailored for children under 7

class VoiceSynthesizer {
  private isSpeaking: boolean = false;
  private isEnabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.isEnabled) {
      if (onEnd) onEnd();
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any currently speaking utterance
    window.speechSynthesis.cancel();

    // Strip markdown, emojis, slashes, and technical phonetic labels
    const cleanText = text
      .replace(/Sound check:?/gi, '')
      .replace(/Phonetic:?/gi, '')
      .replace(/\/[^/]+\//g, '') // remove any /phonetic/ notation
      .replace(/[\/\\|•~`#*_]/g, ' ') // strip slashes and symbols
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Child-friendly voice tuning:
    // Rate 0.88 = Slightly slower, clear enunciation for young learners
    // Pitch 1.2 = Warmer, cheerful nursery tone
    utterance.rate = 0.88;
    utterance.pitch = 1.2;

    const voices = window.speechSynthesis.getVoices();
    // Prefer friendly natural English voices
    const childFriendlyVoice = voices.find(
      v => (v.name.includes('Samantha') || v.name.includes('Natural') || v.name.includes('Google US English') || v.name.includes('Victoria')) && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (childFriendlyVoice) {
      utterance.voice = childFriendlyVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
}

export const childTTS = new VoiceSynthesizer();
