import { useState, useEffect, useRef } from "react";
import { State, Event } from "react-native-track-player";
import { radioPlayerService } from "../services/radioPlayerService";

export const useRadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [bufferHealth, setBufferHealth] = useState(100);
  const [connectionQuality, setConnectionQuality] = useState<
    "excellent" | "good" | "poor" | "offline"
  >("excellent");

  const healthCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  useEffect(() => {
    // Função para monitorar a saúde da conexão
    const startHealthMonitoring = () => {
      if (healthCheckInterval.current) {
        clearInterval(healthCheckInterval.current);
      }

      healthCheckInterval.current = setInterval(async () => {
        try {
          const bufferStatus = await radioPlayerService.getBufferStatus();
          setBufferHealth(bufferStatus.bufferHealth);

          // Atualizar qualidade da conexão baseada na saúde do buffer
          if (bufferStatus.bufferHealth >= 80) {
            setConnectionQuality("excellent");
          } else if (bufferStatus.bufferHealth >= 60) {
            setConnectionQuality("good");
          } else if (bufferStatus.bufferHealth >= 30) {
            setConnectionQuality("poor");
          } else {
            setConnectionQuality("offline");
          }

          // Se a conexão estiver ruim e estivermos tocando, tentar reconectar
          if (
            isPlaying &&
            bufferStatus.bufferHealth < 30 &&
            reconnectAttempts.current < maxReconnectAttempts
          ) {
            console.log("Conexão ruim detectada, tentando reconectar...");
            reconnectAttempts.current += 1;
            await radioPlayerService.healthCheck();
          }
        } catch (healthError) {
          console.error("Erro no monitoramento de saúde:", healthError);
          setConnectionQuality("offline");
        }
      }, 5000); // Verificar a cada 5 segundos
    };

    const stopHealthMonitoring = () => {
      if (healthCheckInterval.current) {
        clearInterval(healthCheckInterval.current);
        healthCheckInterval.current = null;
      }
    };

    // Configurar o player quando o hook é montado
    radioPlayerService.setupPlayer();

    // Inicializar o volume
    const initVolume = async () => {
      const currentVolume = await radioPlayerService.getVolume();
      setVolume(currentVolume);
      setIsMuted(radioPlayerService.isMutedState());
    };
    initVolume();

    // Listener para mudanças de estado
    const subscription = radioPlayerService.addEventListener(
      Event.PlaybackState,
      (data: any) => {
        const { state } = data;
        const playing = state === State.Playing;
        const loading = state === State.Buffering || state === State.Connecting;

        setIsPlaying(playing);
        setIsLoading(loading);

        // Iniciar monitoramento quando começar a tocar
        if (playing) {
          startHealthMonitoring();
          reconnectAttempts.current = 0; // Reset dos tentativas de reconexão
        } else if (!loading) {
          stopHealthMonitoring();
        }
      }
    );

    // Iniciar monitoramento de saúde
    startHealthMonitoring();

    return () => {
      subscription?.remove();
      stopHealthMonitoring();
    };
  }, [isPlaying]);

  const play = async () => {
    try {
      setError(null);
      setIsLoading(true);
      reconnectAttempts.current = 0;
      await radioPlayerService.play();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao reproduzir a rádio";
      setError(errorMessage);
      console.error(err);
      setConnectionQuality("offline");
    } finally {
      setIsLoading(false);
    }
  };

  const pause = async () => {
    try {
      setError(null);
      await radioPlayerService.pause();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao pausar a rádio";
      setError(errorMessage);
      console.error(err);
    }
  };

  const stop = async () => {
    try {
      setError(null);
      await radioPlayerService.stop();
      setConnectionQuality("offline");
      setBufferHealth(0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao parar a rádio";
      setError(errorMessage);
      console.error(err);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const changeVolume = async (newVolume: number) => {
    try {
      await radioPlayerService.setVolume(newVolume);
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    } catch (err) {
      setError("Erro ao alterar volume");
      console.error(err);
    }
  };

  const toggleMute = async () => {
    try {
      await radioPlayerService.toggleMute();
      const currentVolume = await radioPlayerService.getVolume();
      const mutedState = radioPlayerService.isMutedState();
      setVolume(currentVolume);
      setIsMuted(mutedState);
    } catch (err) {
      setError("Erro ao alternar mute");
      console.error(err);
    }
  };

  return {
    isPlaying,
    isLoading,
    error,
    volume,
    isMuted,
    bufferHealth,
    connectionQuality,
    play,
    pause,
    stop,
    togglePlayback,
    changeVolume,
    toggleMute,
  };
};
