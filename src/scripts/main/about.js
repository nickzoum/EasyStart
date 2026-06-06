(function () {
  const { BrowserWindow } = require("electron");
  const path = require("path");

  /**
   * Shows the about window
   * @param {Electron.BrowserWindow} [mainWindow=]
   * @returns {void}
   */
  function showAbout(mainWindow) {
    if (mainWindow instanceof BrowserWindow) mainWindow = undefined;
    var aboutWindow = new BrowserWindow({
      title: `About ${app.getName()}`,
      modal: !!mainWindow,
      parent: mainWindow,
      minimizable: false,
      skipTaskbar: true,
      resizable: false,
      center: true,
      height: 160,
      width: 300,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    aboutWindow.setMenu(null);
    aboutWindow.loadURL(`file://${__dirname}/../../pages/about.html`);
  }

  exports.showAbout = showAbout;
})();
