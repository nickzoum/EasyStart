(function () {
    const { app, BrowserWindow, ipcMain, Menu } = require("electron");
    const Settings = require("./settings.js");
    const Actions = require("./actions.js");

    /** @type {Electron.Display} */
    var display;
    /** @type {Electron.BrowserWindow} */
    var window;

    app.on("ready", onAppReady);

    /**
     * Called when the app is started
     * @returns {void}
     */
    function onAppReady() {
        Settings.loadSettings(getConfigPath()).then(onSettingsLoaded).catch(onError);
    }

    /**
     * Called when settings are loaded
     * @param {Array<EasyStart.Category>} categories
     * @returns {void} 
     */
    function onSettingsLoaded(categories) {
        Settings.getScreen().then(onScreenReady).catch(onError);
    }

    /**
     * Called after screen is selected
     * @param {Electron.Display} screen
     * @returns {void}
     */
    function onScreenReady(screen) {
        var area = screen.workArea;
        window = new BrowserWindow({
            x: area.x + area.width - 270,
            minimizable: true,
            transparent: true,
            resizable: false,
            y: area.y + 20,
            frame: false,
            height: 160,
            width: 250,
        });
        window.loadURL(`file://${__dirname}/../../pages/index.html`);
        display = screen;
        Settings.saveSettings(getConfigPath());
    }

    /**
     * Function to be called on promise reject
     * @param {Error} err 
     * @returns {void}
     */
    function onError(err) {
        console.warn(err);
    }

    ipcMain.on("control-action", onControlAction);

    /**
     * On control action
     * @param {Event} evt 
     * @param {string} actionCode
     * @returns {void} 
     */
    function onControlAction(evt, actionCode) {
        var action = Actions[actionCode];
        if (typeof action === "function") action();
    }

    function showAbout() {
        if (window instanceof BrowserWindow) {
            var aboutWindow = new BrowserWindow({
                title: `About ${app.getName()}`,
                minimizable: false,
                skipTaskbar: true,
                resizable: false,
                parent: window,
                center: true,
                modal: true,
                height: 160,
                width: 300,
            });
            aboutWindow.setMenu(null);
            aboutWindow.loadURL(`file://${__dirname}/../../pages/about.html`);
        }
    }

    function toggleDevTools() {
        if (window instanceof BrowserWindow) {
            window.webContents.toggleDevTools();
        }
    }

    function closeWindow() {
        if (window instanceof BrowserWindow) {
            window.close();
            window = null;
        }
    }

    function minimize() {
        if (window instanceof BrowserWindow) {
            window.minimize();
        }
    }

    /**
     * 
     * @param {Electron.Menu} menu 
     * @param {Electron.PopupOptions} [options=]
     */
    function showMenu(menu, options) {
        if (window instanceof BrowserWindow) {
            menu.popup(window, options);
        }
    }

    function getRoamingPath() {
        return app.getPath("userData");
    }

    function getImagePath() {
        return `${getRoamingPath()}\\images`;
    }

    function getConfigPath() {
        return `${getRoamingPath()}\\${app.getName()}.config`;
    }

    ipcMain.on("get-app", function (event) {
        var appJSON = {
            version: app.getVersion(),
            name: app.getName()
        };
        event.returnValue = appJSON;
    });

    exports.toggleDevTools = toggleDevTools;
    exports.getConfigPath = getConfigPath;
    exports.getImagePath = getImagePath;
    exports.closeWindow = closeWindow;
    exports.showAbout = showAbout;
    exports.minimize = minimize;
    exports.showMenu = showMenu;

})();