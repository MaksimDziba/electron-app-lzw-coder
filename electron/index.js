const { app, BrowserWindow } = require("electron");
const { join } = require("path");

function main() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, "./preload.js"),
    },
  });

  window.loadFile(join(__dirname, "../dist/index.html"));
  window.on("ready-to-show", window.show);
}

app.whenReady().then(main);
