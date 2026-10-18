// Web Speech API Voice Recognition for hands-free speech from young children

// Declare custom types for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export class ChildSpeechListener {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onStateChangeCallback: ((listening: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.isListening = true;
          if (this.onStateChangeCallback) this.onStateChangeCallback(true);
        };

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (this.onResultCallback && transcript) {
            this.onResultCallback(transcript);
          }
        };

        this.recognition.onerror = (event: any) => {
          this.isListening = false;
          if (this.onStateChangeCallback) this.onStateChangeCallback(false);
          if (this.onErrorCallback) this.onErrorCallback(event.error);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.onStateChangeCallback) this.onStateChangeCallback(false);
        };
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(
    onResult: (text: string) => void,
    onStateChange: (listening: boolean) => void,
    onError?: (error: string) => void
  ) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    this.onResultCallback = onResult;
    this.onStateChangeCallback = onStateChange;
    this.onErrorCallback = onError || null;

    try {
      this.recognition.start();
    } catch {
      // If already started, stop and restart
      this.recognition.stop();
      setTimeout(() => {
        try {
          this.recognition.start();
        } catch {}
      }, 100);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    }
  }
}

export const childListener = new ChildSpeechListener();
