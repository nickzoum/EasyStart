(function () {
    const { app, BrowserWindow, ipcMain, Menu, shell, dialog, Tray } = require("electron");
    const TrayMenu = require("./settings-menu.js");// require("./tray-menu.js");
    const FileSystem = require("./file-system.js");
    const ItemMenu = require("./item-menu.js");
    const Settings = require("./settings.js");
    const Actions = require("./actions.js");
    const About = require("./About.js");
    const Item = require("./item.js");
    const path = require("path");


    /** @type {Map<string, Electron.FileFilter>} */
    const filterList = {
        "css": {
            name: "Cascade Style Sheets Files",
            extensions: ["css"]
        },
        get: function (key) {
            return this[key];
        }
    };

    /** @type {Electron.Display} */
    var display;
    /** @type {Electron.BrowserWindow} */
    var window;
    /** @type {Electron.Tray} */
    var tray;

    app.on("ready", onAppReady);

    /**
     * Called when the app is started
     * @returns {void}
     */
    function onAppReady() {
        tray = new Tray(path.join("assets", "images", "display.png"));
        tray.setContextMenu(TrayMenu());
        tray.setToolTip(app.getName());
        Settings.checkDirectories([getRoamingPath(), getImagePath(), getStylePath()]);
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
        dialog.showErrorBox("Error", err);
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
            About.showAbout(window);
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
        return path.join(getRoamingPath(), "images");
    }

    function getStylePath() {
        return path.join(getRoamingPath(), "styles");
    }

    function getConfigPath() {
        return path.join(getRoamingPath(), `${app.getName()}.config`);
    }

    /**
     * Gets the app properties
     * @param {Event} event 
     * @returns {Electron.App}
     */
    function getApp(event) {
        var appJSON = {
            version: app.getVersion(),
            name: app.getName()
        };
        return event.returnValue = appJSON;
    }

    /**
     * 
     * @param {string} url 
     */
    function callItem(url) {
        if (url.startsWith("file://")) shell.openItem(url);
        else shell.openExternal(url);
    }

    /**
     * 
     * @param {Electron.Event} event 
     * @param {string} url 
     */
    function onCallItem(event, url) {
        callItem(url);
    }

    function changeDisplay() {
        Settings.getNewScreen().then(function (display) {
            var area = display.workArea;
            window.setPosition(area.x + area.width - 270, area.y + 20, true);
        }).catch(onError);
    }

    function savePosition() {
        Settings.saveSettings();
    }

    function importStyle() {
        dialog.showOpenDialog(window, getOpenDialogOptions("Import Style", app.getPath("desktop"), ["css"]), function (fileNames) {
            if (fileNames instanceof Array) {
                for (var fileName of fileNames) {
                    Settings.addStyle(fileName, path.join(getStylePath())).catch(onError);
                    window.webContents.send("load-style", fileName);
                }
            }
        });
    }

    function newCategory() {

    }

    function newFolder() {

    }

    function editItem() {

    }

    function newItem() {
        Item.showItemPage(window).then(function (item) {
            console.log(item);
        }).catch(function (err) {
            console.log("Error");
            console.log(err);
        })
    }

    /**
     * 
     * @param {Event} evt 
     */
    function onWindowLoaded(evt) {
        for (var style of Settings.getStyles()) window.webContents.send("load-style", style);
    }

    /**
     * 
     * @param {string} title
     * @param {string} path
     * @param {Array<string>} filters
     * @returns {Electron.OpenDialogOptions}
     */
    function getOpenDialogOptions(title, path, filters) {
        var json = {
            properties: [
                "showHiddenFiles",
                "multiSelections",
                "openFile"
            ]
        };
        if (typeof title === "string") json["title"] = title;
        if (typeof path === "string") json["defaultPath"] = path;
        if (filters instanceof Array) {
            json.filters = [];
            for (var filterName of filters) {
                var filter = filterList.get(filterName);
                if (filter) json.filters.push(filter);
            }
        }
        return json;
    }

    /**
     * Shows an item in explorer
     * @param {string} path
     * @returns {void} 
     */
    function showItemInFolder(path) {
        FileSystem.fileExistsAsync(path).then(function (exists) {
            if (exists) shell.showItemInFolder(item);
            else onError("File couldn't be found");
        });
    }


    function showItemMenu(event, url) {
        showMenu(ItemMenu(url));
    }

    ipcMain.on("window-loaded", onWindowLoaded);
    ipcMain.on("showItemMenu", showItemMenu);
    ipcMain.on("call-item", onCallItem);
    ipcMain.on("get-app", getApp);


    exports.showItemInFolder = showItemInFolder;
    exports.toggleDevTools = toggleDevTools;
    exports.changeDisplay = changeDisplay;
    exports.getConfigPath = getConfigPath;
    exports.savePosition = savePosition;
    exports.getImagePath = getImagePath;
    exports.importStyle = importStyle;
    exports.closeWindow = closeWindow;
    exports.newCategory = newCategory;
    exports.newFolder = newFolder;
    exports.showAbout = showAbout;
    exports.callItem = callItem;
    exports.minimize = minimize;
    exports.showMenu = showMenu;
    exports.editItem = editItem;
    exports.newItem = newItem;

})();