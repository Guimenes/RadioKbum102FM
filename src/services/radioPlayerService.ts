import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
  State,
} from "react-native-track-player";

export const RADIO_STREAM_URL =
  "https://srv946411.hstgr.cloud/listen/kbum_102/live";

class RadioPlayerService {
  private isSetup = false;
  private volume = 1.0;
  private isMuted = false;
  private previousVolume = 1.0;

  async setupPlayer() {
    if (this.isSetup) {
      return;
    }

    try {
      await TrackPlayer.setupPlayer({
        waitForBuffer: true,
      });

      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
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
        progressUpdateEventInterval: 2,
      });

      const track = {
        id: "radio-kbum-102fm",
        url: RADIO_STREAM_URL,
        title: "Kbum 102 FM",
        artist: "Rádio Kbum 102 FM",
        artwork: "https://i.imgur.com/placeholder.png", // Substitua pela URL do logo da rádio
        isLiveStream: true,
      };

      await TrackPlayer.add(track);
      await TrackPlayer.setRepeatMode(RepeatMode.Off);

      this.isSetup = true;
    } catch (error) {
      console.error("Erro ao configurar o player:", error);
    }
  }

  async play() {
    try {
      await this.setupPlayer();
      await TrackPlayer.play();
    } catch (error) {
      console.error("Erro ao reproduzir:", error);
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
}

export const radioPlayerService = new RadioPlayerService();
