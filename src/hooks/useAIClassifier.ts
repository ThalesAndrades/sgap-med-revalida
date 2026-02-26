import { useState, useEffect, useRef, useCallback } from 'react';

interface AIStatus {
  status: 'idle' | 'downloading' | 'initializing' | 'ready' | 'error';
  progress?: number;
  message?: string;
}

interface UseAIClassifierResult {
  status: AIStatus;
  classify: (text: string) => Promise<{ intent: string; confidence: number }>;
}

export const useAIClassifier = (): UseAIClassifierResult => {
  const [status, setStatus] = useState<AIStatus>({ status: 'idle' });
  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<string, (result: any) => void>>(new Map());

  useEffect(() => {
    // Create worker only once
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../workers/ai.worker.ts', import.meta.url), {
        type: 'module'
      });

      workerRef.current.onmessage = (event) => {
        const { status, data, intent, confidence, error } = event.data;

        if (status === 'downloading') {
          setStatus({ 
            status: 'downloading', 
            progress: data.progress, 
            message: `Carregando modelo de IA: ${data.file} (${Math.round(data.progress || 0)}%)` 
          });
        } else if (status === 'initializing_embeddings') {
          setStatus({ status: 'initializing', message: 'Calibrando vetores médicos...' });
        } else if (status === 'ready') {
          setStatus({ status: 'ready', message: 'IA Pronta' });
        } else if (status === 'result') {
          // Resolve pending promise
          const resolve = pendingRequests.current.get('latest');
          if (resolve) resolve({ intent, confidence });
        } else if (status === 'error') {
          console.error('AI Worker Error:', error);
          setStatus({ status: 'error', message: 'Falha ao iniciar IA' });
        }
      };

      // Start initialization
      workerRef.current.postMessage({ type: 'init' });
    }

    return () => {
      // Don't terminate worker on unmount to keep model in memory
      // workerRef.current?.terminate();
    };
  }, []);

  const classify = useCallback((text: string): Promise<{ intent: string; confidence: number }> => {
    return new Promise((resolve) => {
      if (workerRef.current) {
        pendingRequests.current.set('latest', resolve);
        workerRef.current.postMessage({ type: 'classify', text });
      } else {
        resolve({ intent: 'UNKNOWN', confidence: 0 });
      }
    });
  }, []);

  return { status, classify };
};
