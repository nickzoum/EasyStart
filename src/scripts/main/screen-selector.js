(function () {
    const { BrowserWindow, screen, ipcMain } = require("electron");
    var display = undefined;

    /**
     * Gets the display
     * @param {number} displayId
     * @returns {Promise<Electron.Display>}
     */
    function onScreenSelected(displayId) {
        return new Promise(function (resolve, reject) {
            if (display) return resolve(display);
            var displays = screen.getAllDisplays();
            var index = getDisplayIndex(displayId, displays);
            if (index !== -1) return resolve(display = displays[index]);
            if (displays.length === 1) return resolve(display = displays[0]);
            var window = new BrowserWindow({
                title: "Screen Selector",
                //skipTaskbar: true,
                transparent: true,
                resizable: true,
                center: true,
                frame: false,
                height: 400,
                width: 800
            });
            window.loadURL(`file://${__dirname}/../../pages/screen-selector.html`);
            ipcMain.on("on-screen-selected", function (evt, id) {
                index = getDisplayIndex(id, displays);
                if (index !== -1) {
                    window.blur();
                    window.setSkipTaskbar(true);
                    resolve(display = displays[index]);
                    setTimeout(function () {
                        window.close(); window = null;
                    }, 2500);
                }
            });
            ipcMain.on("on-display-request", function (evt) {
                return evt.returnValue = displays;
            });
        });
    }

    /**
     * Finds the index of the display with a specific id
     * @param {number} displayId 
     * @param {Array<Electron.Display>} displayList 
     * @returns {number}
     */
    function getDisplayIndex(displayId, displayList) {
        return displayList.findIndex(function (item) { return item.id == displayId });
    }

    exports.onScreenSelected = onScreenSelected;

})();