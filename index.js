import TrackPlayer from "react-native-track-player";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

// Registrar o serviço de background do TrackPlayer
TrackPlayer.registerPlaybackService(() =>
  require("./src/services/trackPlayerService")
);

AppRegistry.registerComponent(appName, () => App);
