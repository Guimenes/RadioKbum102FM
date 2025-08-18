import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
  State,
} from "react-native-track-player";
import { initializeTrackPlayer } from "./trackPlayerSetup";

export const RADIO_STREAM_URL =
  "https://srv946411.hstgr.cloud/listen/kbum_102/live";

class RadioPlayerService {
  private isSetup = false;
  private volume = 1.0;
  private isMuted = false;
  private previousVolume = 1.0;
  private retryCount = 0;
  private maxRetries = 3;
  private connectionTimeout = 15000; // 15 segundos
  private bufferConfig = {
    minBufferMs: 15000, // 15 segundos de buffer mínimo
    maxBufferMs: 50000, // 50 segundos de buffer máximo
    bufferForPlaybackMs: 2500, // 2.5 segundos para iniciar playback
    bufferForPlaybackAfterRebufferMs: 5000, // 5 segundos após rebuffer
  };

  async setupPlayer() {
    if (this.isSetup) {
      return;
    }

    try {
      // Registrar o serviço de background apenas uma vez
      await initializeTrackPlayer();

      await TrackPlayer.setupPlayer({
        waitForBuffer: true,
        maxCacheSize: 50000, // 50MB de cache
      });

      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
          alwaysPauseOnInterruption: false,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
        progressUpdateEventInterval: 1, // Reduzido para melhor responsividade
        forwardJumpInterval: 30,
        backwardJumpInterval: 30,
      });

      const track = {
        id: "radio-kbum-102fm",
        url: RADIO_STREAM_URL,
        title: "Kbum 102 FM",
        artist: "Rádio Kbum 102 FM",
        artwork: "../assets/images/logo.png", // Substitua pela URL do logo da rádio
        isLiveStream: true,
        headers: {
          "User-Agent": "RadioKbum102FM/1.0",
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
        },
      };

      await TrackPlayer.add(track);
      await TrackPlayer.setRepeatMode(RepeatMode.Off);

      this.isSetup = true;
    } catch (error) {
      console.error("Erro ao configurar o player:", error);
      throw error;
    }
  }

  async play() {
    try {
      await this.setupPlayer();
      this.retryCount = 0;
      await this.playWithRetry();
    } catch (error) {
      console.error("Erro ao reproduzir:", error);
      throw error;
    }
  }

  private async playWithRetry(): Promise<void> {
    try {
      // Configurar timeout para conexão
      const playPromise = TrackPlayer.play();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout na conexão")),
          this.connectionTimeout
        )
      );

      await Promise.race([playPromise, timeoutPromise]);
    } catch (error) {
      console.error(`Tentativa ${this.retryCount + 1} falhou:`, error);

      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(
          `Tentando reconectar... (${this.retryCount}/${this.maxRetries})`
        );

        // Aguardar antes de tentar novamente
        await new Promise((resolve) =>
          setTimeout(resolve, 2000 * this.retryCount)
        );
        // Reset do player antes de tentar novamente
        await this.resetConnection();
        await this.playWithRetry();
      } else {
        throw new Error("Falha na conexão após múltiplas tentativas");
      }
    }
  }

  private async resetConnection() {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      this.isSetup = false;
      await this.setupPlayer();
    } catch (error) {
      console.error("Erro ao resetar conexão:", error);
    }
  }

  async pause() {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error("Erro ao pausar:", error);
    }
  }

  async stop() {
    try {
      await TrackPlayer.stop();
    } catch (error) {
      console.error("Erro ao parar:", error);
    }
  }

  async getState() {
    try {
      return await TrackPlayer.getPlaybackState();
    } catch (error) {
      console.error("Erro ao obter estado:", error);
      return { state: State.None };
    }
  }

  async reset() {
    try {
      await TrackPlayer.reset();
      this.isSetup = false;
    } catch (error) {
      console.error("Erro ao resetar:", error);
    }
  }

  addEventListener(event: Event, listener: any) {
    return TrackPlayer.addEventListener(event, listener);
  }

  async setVolume(volume: number) {
    try {
      this.volume = Math.max(0, Math.min(1, volume));
      await TrackPlayer.setVolume(this.volume);
      if (this.volume > 0) {
        this.isMuted = false;
      }
    } catch (error) {
      console.error("Erro ao definir volume:", error);
    }
  }

  async getVolume() {
    return this.volume;
  }

  async toggleMute() {
    try {
      if (this.isMuted) {
        // Desmuta - volta ao volume anterior
        this.volume = this.previousVolume;
        this.isMuted = false;
      } else {
        // Muta - salva o volume atual e define como 0
        this.previousVolume = this.volume;
        this.volume = 0;
        this.isMuted = true;
      }
      await TrackPlayer.setVolume(this.volume);
    } catch (error) {
      console.error("Erro ao alternar mute:", error);
    }
  }

  isMutedState() {
    return this.isMuted;
  }

  // Métodos para monitoramento de buffer
  async getBufferStatus() {
    try {
      const state = await TrackPlayer.getPlaybackState();
      return {
        isBuffering: state.state === State.Buffering,
        isConnecting: state.state === State.Connecting,
        isPlaying: state.state === State.Playing,
        bufferHealth: await this.calculateBufferHealth(),
      };
    } catch (error) {
      console.error("Erro ao obter status do buffer:", error);
      return {
        isBuffering: false,
        isConnecting: false,
        isPlaying: false,
        bufferHealth: 0,
      };
    }
  }

  private async calculateBufferHealth(): Promise<number> {
    try {
      // Simulação de cálculo de saúde do buffer
      // Em uma implementação real, você mediria o buffer disponível
      const state = await TrackPlayer.getPlaybackState();

      if (state.state === State.Playing) {
        return 100;
      }
      if (state.state === State.Buffering) {
        return 50;
      }
      if (state.state === State.Connecting) {
        return 25;
      }

      return 0;
    } catch (error) {
      console.error("Erro ao calcular saúde do buffer:", error);
      return 0;
    }
  }

  // Método para verificar e corrigir problemas de conexão
  async healthCheck(): Promise<boolean> {
    try {
      const bufferStatus = await this.getBufferStatus();
      // Se estiver com problemas de buffer por muito tempo, reconectar
      if (bufferStatus.isBuffering) {
        console.log("Detectado problema de buffer, tentando reconectar...");
        await this.resetConnection();
        return false;
      }
      return bufferStatus.isPlaying;
    } catch (error) {
      console.error("Erro na verificação de saúde:", error);
      return false;
    }
  }
}

export const radioPlayerService = new RadioPlayerService();
