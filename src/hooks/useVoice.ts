import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceProps {
  onTranscript?: (text: string) => void;
  language?: string;
}

type TTSSettings = {
  voiceURI: string | null;
  rate: number;
  pitch: number;
  volume: number;
};

const TTS_STORAGE_KEY = 'sgap_tts_settings_v1';

const loadTTSSettings = (): TTSSettings => {
  try {
    const raw = localStorage.getItem(TTS_STORAGE_KEY);
    if (!raw) {
      return { voiceURI: null, rate: 1.05, pitch: 1.0, volume: 1.0 };
    }
    const parsed = JSON.parse(raw);
    return {
      voiceURI: typeof parsed.voiceURI === 'string' ? parsed.voiceURI : null,
      rate: typeof parsed.rate === 'number' ? parsed.rate : 1.05,
      pitch: typeof parsed.pitch === 'number' ? parsed.pitch : 1.0,
      volume: typeof parsed.volume === 'number' ? parsed.volume : 1.0,
    };
  } catch {
    return { voiceURI: null, rate: 1.05, pitch: 1.0, volume: 1.0 };
  }
};

const pickBestVoice = (voices: SpeechSynthesisVoice[], language: string) => {
  const langMatches = voices.filter(v => (v.lang || '').toLowerCase().startsWith(language.toLowerCase().slice(0, 2)));
  const exact = langMatches.filter(v => v.lang === language);
  const pool = exact.length ? exact : langMatches;
  const preferred = pool.find(v => /google|natural|luciana|felipe|microsoft/i.test(v.name));
  return preferred || pool.find(v => v.default) || pool[0] || null;
};

export const useVoice = ({ onTranscript, language = 'pt-BR' }: UseVoiceProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [ttsSettings, setTTSSettings] = useState<TTSSettings>(() => loadTTSSettings());
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = event.results[0][0].transcript;
        setTranscript(currentTranscript);
        if (onTranscript) {
          onTranscript(currentTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    } else {
      setSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onTranscript]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const load = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(Array.isArray(list) ? list : []);
    };

    load();
    window.speechSynthesis.onvoiceschanged = load;

    return () => {
      if (window.speechSynthesis.onvoiceschanged === load) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TTS_STORAGE_KEY, JSON.stringify(ttsSettings));
    } catch {
      return;
    }
  }, [ttsSettings]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const speak = useCallback((text: string, override?: Partial<TTSSettings>) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;

      const settings: TTSSettings = { ...ttsSettings, ...override };

      const selected = settings.voiceURI
        ? voices.find(v => v.voiceURI === settings.voiceURI) || null
        : null;
      const best = selected || pickBestVoice(voices, language);
      if (best) utterance.voice = best;

      utterance.pitch = settings.pitch;
      utterance.rate = settings.rate;
      utterance.volume = settings.volume;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [language, ttsSettings, voices]);

  const cancelSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    supported,
    voices,
    ttsSettings,
    setTTSSettings
  };
};
