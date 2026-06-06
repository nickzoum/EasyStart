(function () {
  const { BrowserWindow, ipcMain } = require("electron");
  const path = require("path");
  /** @type {Electron.BrowserWindow} */
  var itemWindow = undefined;
  var occupied = false;

  /**
   * Creates an item window for edit/create
   * @param {Electron.BrowserWindow} mainWindow
   * @param {EasyStart.Item} [item=]
   * @returns {Promise<EasyStart.Item>}
   */
  function showItemPage(mainWindow, item) {
    return new Promise(function (resolve, reject) {
      if (occupied) reject("Only edit one item a time");
      else occupied = true;
      itemWindow = new BrowserWindow({
        title: `${item ? "Edit" : "Create"} Item`,
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
      itemWindow.setMenu(null);
      itemWindow.loadURL(`file://${__dirname}/../../pages/item-view.html`);
      itemWindow.webContents.on("item-window-loaded", function (evt, item) {
        console.log(evt);
        console.log(item);
      });
      itemWindow.webContents.openDevTools();
    });
  }

  exports.showItemPage = showItemPage;
})();
