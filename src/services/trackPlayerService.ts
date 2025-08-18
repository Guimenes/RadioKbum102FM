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

  // Evento para mudanças de estado
  TrackPlayer.addEventListener(Event.PlaybackState, state => {
    console.log("Playback state changed:", state);
  });
};

module.exports = TrackPlayerService;
