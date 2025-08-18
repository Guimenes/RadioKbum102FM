import { useState, useEffect } from "react";
import { State, Event } from "react-native-track-player";
import { radioPlayerService } from "../services/radioPlayerService";

export const useRadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Configurar o player quando o hook é montado
    radioPlayerService.setupPlayer();

    // Listener para mudanças de estado
    const subscription = radioPlayerService.addEventListener(
      Event.PlaybackState,
      (data: any) => {
        const { state } = data;
        setIsPlaying(state === State.Playing);
        setIsLoading(state === State.Buffering || state === State.Connecting);
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  const play = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await radioPlayerService.play();
    } catch (err) {
      setError("Erro ao reproduzir a rádio");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const pause = async () => {
    try {
      setError(null);
      await radioPlayerService.pause();
    } catch (err) {
      setError("Erro ao pausar a rádio");
      console.error(err);
    }
  };

  const stop = async () => {
    try {
      setError(null);
      await radioPlayerService.stop();
    } catch (err) {
      setError("Erro ao parar a rádio");
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

  return {
    isPlaying,
    isLoading,
    error,
    play,
    pause,
    stop,
    togglePlayback,
  };
};
