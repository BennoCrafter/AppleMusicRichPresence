const { app, Menu, Tray } = require("electron");
const { menubar } = require("menubar");
const { currentTrack, initDiscordRPC } = require("../richpresence/rpc.js");
app.on("ready", () => {
  const tray = new Tray("./src/assets/music-2-xxl.png");
  const contextMenu = Menu.buildFromTemplate([
    { label: currentTrack, click: () => {} },
    { label: "Item2", type: "radio" },
    { label: "Settings" },
    {
      label: "Quit",
      click: () => {
        quitApp();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);

  const mb = menubar({
    tray,
  });

  mb.on("ready", () => {
    console.log("Menubar app is ready.");
    tray.removeAllListeners();
    initDiscordRPC();
    // your app code here
  });
});

const quitApp = () => {
  app.quit();
};
