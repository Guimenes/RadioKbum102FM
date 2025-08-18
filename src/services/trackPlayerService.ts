import TrackPlayer, { Event } from "react-native-track-player";

module.exports = async function () {
  // Este serviço roda em segundo plano para manter a reprodução ativa
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());

  // Adicione outros eventos conforme necessário
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
};
