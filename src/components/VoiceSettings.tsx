import React from 'react';
import { Volume2, X } from 'lucide-react';

type VoiceOption = {
  voiceURI: string;
  name: string;
  lang: string;
  localService: boolean;
  isDefault: boolean;
};

type TTSSettings = {
  voiceURI: string | null;
  rate: number;
  pitch: number;
  volume: number;
};

export default function VoiceSettings({
  isOpen,
  onClose,
  voices,
  language,
  ttsSettings,
  setTTSSettings,
  onTest
}: {
  isOpen: boolean;
  onClose: () => void;
  voices: SpeechSynthesisVoice[];
  language: string;
  ttsSettings: TTSSettings;
  setTTSSettings: (next: TTSSettings) => void;
  onTest: () => void;
}) {
  if (!isOpen) return null;

  const options: VoiceOption[] = voices.map(v => ({
    voiceURI: v.voiceURI,
    name: v.name,
    lang: v.lang,
    localService: v.localService,
    isDefault: v.default
  }));

  const filtered = options
    .filter(v => v.lang?.toLowerCase().startsWith(language.toLowerCase().slice(0, 2)))
    .sort((a, b) => {
      const aScore = (a.lang === language ? 10 : 0) + (a.localService ? 1 : 0) + (/google|natural|luciana|felipe|microsoft/i.test(a.name) ? 3 : 0) + (a.isDefault ? 1 : 0);
      const bScore = (b.lang === language ? 10 : 0) + (b.localService ? 1 : 0) + (/google|natural|luciana|felipe|microsoft/i.test(b.name) ? 3 : 0) + (b.isDefault ? 1 : 0);
      return bScore - aScore;
    });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-inep-primary/10">
              <Volume2 className="h-5 w-5 text-inep-primary" />
            </div>
            <div>
              <div className="font-bold text-inep-primary">Voz do Examinador</div>
              <div className="text-xs text-gray-500">Escolha uma voz mais humana e ajuste a fala</div>
            </div>
          </div>
          <button className="p-2 rounded hover:bg-gray-100" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voz</label>
            <select
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-inep-primary outline-none"
              value={ttsSettings.voiceURI || ''}
              onChange={(e) => setTTSSettings({ ...ttsSettings, voiceURI: e.target.value || null })}
            >
              <option value="">Automático (melhor disponível)</option>
              {filtered.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Velocidade</label>
              <input
                type="range"
                min={0.8}
                max={1.3}
                step={0.01}
                value={ttsSettings.rate}
                onChange={(e) => setTTSSettings({ ...ttsSettings, rate: Number(e.target.value) })}
                className="w-full"
              />
              <div className="text-xs text-gray-500">{ttsSettings.rate.toFixed(2)}x</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tom</label>
              <input
                type="range"
                min={0.8}
                max={1.2}
                step={0.01}
                value={ttsSettings.pitch}
                onChange={(e) => setTTSSettings({ ...ttsSettings, pitch: Number(e.target.value) })}
                className="w-full"
              />
              <div className="text-xs text-gray-500">{ttsSettings.pitch.toFixed(2)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={ttsSettings.volume}
                onChange={(e) => setTTSSettings({ ...ttsSettings, volume: Number(e.target.value) })}
                className="w-full"
              />
              <div className="text-xs text-gray-500">{Math.round(ttsSettings.volume * 100)}%</div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button className="px-4 py-2 rounded-lg hover:bg-gray-100" onClick={onClose}>
              Fechar
            </button>
            <button className="bg-inep-primary hover:bg-inep-secondary text-white px-4 py-2 rounded-lg font-bold" onClick={onTest}>
              Testar Voz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

