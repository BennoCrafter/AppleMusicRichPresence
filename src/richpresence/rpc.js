const { execSync } = require("child_process");
const DiscordRPC = require("discord-rpc");
const { getSongCover } = require("../utils/getSongCover");
const clientId = "1221392804161523824"; // Replace this with your actual client ID
const rpc = new DiscordRPC.Client({ transport: "ipc" });
const os = require("os");
const { setStringValue, store } = require("./state.js");

async function setDiscordPresence({
  trackName,
  artistName,
  artworkUrl,
  songDuration,
  currentPos,
}) {
  try {
    await rpc.setActivity({
      details: trackName,
      state: artistName,
      largeImageKey: artworkUrl, // Use the resolved artwork URL
      largeImageText: "Apple Music",
      smallImageKey: "note-icon",
      smallImageText: "Currently hearing",
      instance: false,
      startTimestamp: Math.floor(new Date().getTime() / 1000),
      endTimestamp:
        Math.floor(new Date().getTime() / 1000) +
        parseInt(songDuration) -
        parseInt(currentPos),
    });
  } catch (error) {
    console.error("Error setting Discord presence:", error);
  }
}

async function updatePresence() {
  if (process.env.FAKE_PRESENCE) {
    await setDiscordPresence({
      trackName: "Fake Track Name",
      artistName: "Fake Artist Name",
      artworkUrl:
        "https://artists.apple.com/assets/artist-og-share-c766a5950ae664ea9073ede99da0df1094ae1a24bee32b86ab9e43e7e02bce2e.jpg",
      songDuration: "100",
      currentPos: "10",
    });
    store.dispatch(setStringValue("Fake Track Name"));
    return;
  }

  if (os.platform() !== "darwin") {
    console.error("Unsupported platform:", os.platform());
    return;
  }

  const script = "osascript ./src/richpresence/getmusicinfo.applescript";
  try {
    const result = execSync(script).toString().split("||");
    console.log(result);
    if (result[0] == "STOPPED") {
      await rpc.clearActivity();
    } else {
      if (result[1] !== undefined && result[0] !== "PAUSED") {
        await setDiscordPresence({
          trackName: result[1],
          artistName: result[2],
          artworkUrl: await getSongCover(result[2], result[1]),
          songDuration: result[5],
          currentPos: result[4],
        });
        currentTrack = result[1];
      }
      store.dispatch(setStringValue(result[1]));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const initDiscordRPC = () => {
  DiscordRPC.register(clientId);
  rpc
    .login({ clientId })
    .then(() => {
      console.log("Successfully connected to Discord.");
    })
    .catch((error) => {
      console.error("Error connecting to Discord:", error);
    });
};

rpc.on("ready", () => {
  updatePresence();
  // Update presence every 5 seconds
  setInterval(updatePresence, 5000);
});

module.exports = { initDiscordRPC };
