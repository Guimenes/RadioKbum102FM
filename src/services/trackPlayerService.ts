import TrackPlayer, { Event } from "react-native-track-player";

// Serviço de background para o TrackPlayer
const TrackPlayerService = async function () {
  // Este serviço roda em segundo plano para manter a reprodução ativa
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log("Remote play event");
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log("Remote pause event");
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    console.log("Remote stop event");
    TrackPlayer.stop();
  });

  // Eventos adicionais para controle remoto
  TrackPlayer.addEventListener(
    Event.RemoteJumpForward,
    async ({ interval }) => {
      console.log("Remote jump forward:", interval);
    }
  );

  TrackPlayer.addEventListener(
    Event.RemoteJumpBackward,
    async ({ interval }) => {
      console.log("Remote jump backward:", interval);
    }
  );

  TrackPlayer.addEventListener(Event.RemoteSeek, async ({ position }) => {
    console.log("Remote seek to position:", position);
  });

  // Evento para quando a reprodução é interrompida
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
    console.log("Playback queue ended");
  });

  // Evento para mudanças de estado - atualizar metadados do media center
  TrackPlayer.addEventListener(Event.PlaybackState, async (state) => {
    console.log("Playback state changed:", state);
    
    try {
      // Atualizar metadados no centro de mídia baseado no estado
      if (state.state === "playing") {
        await TrackPlayer.updateNowPlayingMetadata({
          title: "Rádio Kbum 102.7 FM",
          artist: "🔴 AO VIVO",
          album: "Transmissão ao Vivo",
          description: "A sua rádio favorita tocando os melhores sucessos!",
          genre: "Música Popular",
          artwork: require("../../assets/images/logo102kbum.png"),
        });
      } else if (state.state === "paused") {
        await TrackPlayer.updateNowPlayingMetadata({
          title: "Rádio Kbum 102.7 FM",
          artist: "⏸️ PAUSADO",
          album: "Transmissão ao Vivo",
          description: "Toque para continuar ouvindo",
          genre: "Música Popular",
          artwork: require("../../assets/images/logo102kbum.png"),
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar metadados:", error);
    }
  });

  // Evento para erros
  TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
    console.error("Playback error:", error);
  });

  // Evento para when the track changes (útil para streaming)
  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (data) => {
    console.log("Active track changed:", data);
  });
};

module.exports = TrackPlayerService;
