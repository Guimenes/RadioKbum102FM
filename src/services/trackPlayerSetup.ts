import TrackPlayer from "react-native-track-player";
let isServiceRegistered = false;
export const initializeTrackPlayer = async () => {
  if (!isServiceRegistered) {
    try {
      await TrackPlayer.registerPlaybackService(() =>
        require("./trackPlayerService")
      );
      isServiceRegistered = true;
      console.log("TrackPlayer service registered successfully");
    } catch (error) {
      console.error("Error registering TrackPlayer service:", error);
    }
  }
};

export { isServiceRegistered };
