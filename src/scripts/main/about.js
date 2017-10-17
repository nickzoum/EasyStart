(function () {
    const { BrowserWindow } = require("electron");


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
        });
        aboutWindow.setMenu(null);
        aboutWindow.loadURL(`file://${__dirname}/../../pages/about.html`);
    }

    exports.showAbout = showAbout;
})();