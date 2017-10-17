(function () {
    const { BrowserWindow, ipcMain } = require("electron");
    /** @type {Electron.BrowserWindow} */
    var itemWindow = undefined;
    var occupied = false;

    /**
     * Creates an item window for edit/create
     * @param {EasyStart.Item} [item=]
     * @returns {Promise<EasyStart.Item>}
     */
    function showItemPage(item) {
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
                width: 300
            });
            itemWindow.setMenu(null);
            itemWindow.loadURL(`file://${__dirname}/../../pages/item-view.html`);
            itemWindow.webContents.on("item-window-loaded", function (evt) {

            });
        });
    }

    ipcMain.on("item-window-loaded")

})();