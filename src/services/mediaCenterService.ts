import TrackPlayer, { Event } from "react-native-track-player";

// Configurações para o Media Center (centro de mídia/notificação)
const setupMediaCenter = async () => {
  try {
    await TrackPlayer.setupPlayer({
      waitForBuffer: true,
      maxCacheSize: 50000,
    });

    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: "ContinuePlayback" as any,
        alwaysPauseOnInterruption: false,
      },
      capabilities: [
        "play" as any,
        "pause" as any,
        "stop" as any,
      ],
      compactCapabilities: [
        "play" as any,
        "pause" as any,
        "stop" as any,
      ],
      notificationCapabilities: [
        "play" as any,
        "pause" as any,
        "stop" as any,
      ],
      icon: require("../../assets/images/logo102kbum.png"),
      playIcon: require("../../assets/images/logo102kbum.png"),
      pauseIcon: require("../../assets/images/logo102kbum.png"),
      stopIcon: require("../../assets/images/logo102kbum.png"),
      progressUpdateEventInterval: 2,
    });

    // Configurar o track com metadados ricos para o media center
    const track = {
      id: "radio-kbum-102fm",
      url: "https://srv946411.hstgr.cloud/listen/kbum_102/live",
      title: "Rádio Kbum 102.7 FM",
      artist: "Ao Vivo",
      album: "Transmissão ao Vivo",
      genre: "Música Popular",
      artwork: require("../../assets/images/logo102kbum.png"),
      description: "A sua rádio favorita tocando os melhores sucessos!",
      isLiveStream: true,
      headers: {
        "User-Agent": "RadioKbum102FM/1.0",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      },
    };

    await TrackPlayer.add(track);

    console.log("Media Center configurado com sucesso!");
  } catch (error) {
    console.error("Erro ao configurar Media Center:", error);
  }
};

// Configurar eventos do media center
const setupMediaCenterEvents = () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log("Play solicitado do Media Center");
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log("Pause solicitado do Media Center");
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    console.log("Stop solicitado do Media Center");
    TrackPlayer.stop();
  });

  // Atualizar metadados em tempo real (simulado)
  TrackPlayer.addEventListener(Event.PlaybackState, (data: any) => {
    if (data.state === "playing") {
      TrackPlayer.updateMetadataForTrack("radio-kbum-102fm", {
        title: "Rádio Kbum 102.7 FM",
        artist: "🔴 AO VIVO",
        artwork: require("../../assets/images/logo102kbum.png"),
      });
    }
  });
};

export { setupMediaCenter, setupMediaCenterEvents };
