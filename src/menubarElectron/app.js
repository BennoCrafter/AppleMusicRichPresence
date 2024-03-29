const { app, Menu, Tray } = require("electron");
const { menubar } = require("menubar");
const { initDiscordRPC } = require("../richpresence/rpc.js");
const { store } = require("../richpresence/state.js");

let tray;
let contextMenuTemplate = [
  { label: "Not Playing", click: () => {} },
  { label: "Item2", type: "radio" },
  { label: "Settings" },
  {
    label: "Quit",
    click: () => {
      quitApp();
    },
  },
];

store.subscribe(() => {
  const currentState = store.getState();
  console.log("State updated:", currentState);
  contextMenuTemplate[0].label = currentState.stringState.stringValue;
  tray.setContextMenu(Menu.buildFromTemplate(contextMenuTemplate));
});

app.on("ready", () => {
  tray = new Tray("./src/assets/music-2-xxl.png");
  tray.setContextMenu(Menu.buildFromTemplate(contextMenuTemplate));

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
