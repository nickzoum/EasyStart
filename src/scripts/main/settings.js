(function () {
    const { app, BrowserWindow, ipcMain } = require("electron");
    const FileSystem = require("./file-system.js");
    /** @type {module "./screen-selector"} */
    var ScreenSelector = undefined;
    /** @type {EasyStart.Settings} */
    var settings = {
        categories: [],
        displayId: -1
    };


    /**
     * Asynchronously loads the settings
     * @param {string} configPath
     * @returns {Promise<Electron.category>}
     */
    function loadSettings(configPath) {
        console.log(configPath);
        return new Promise(function (resolve, reject) {
            try {
                FileSystem.readAsync(configPath).then(function (data) {
                    try {
                        settings = JSON.parse(data);
                        resolve(settings.categories);
                    } catch (err) { reject(err); }
                }).catch(function (err) {
                    var error = err ? err["errno"] || err : "Unspecified Error";
                    if (error === -4058) {
                        saveSettings(configPath).then(function () {
                            resolve(settings.categories);
                        }).catch(reject);
                    } else {
                        reject();
                    }
                });
            } catch (err) { reject(err); }
        });
    }

    /**
     * Asynchronously gets the active screen
     * @returns {Promise<Electron.Display>}
     */
    function getScreen() {
        return new Promise(function (resolve, reject) {
            try {
                getScreenSelector().onScreenSelected(settings.displayId).then(function (result) {
                    settings.displayId = result.id;
                    resolve(result);
                }).catch(reject);
            }
            catch (err) { reject(err); }
        });
    }

    /**
     * Asynchronously gets a different screen
     * @returns {Promise<Electron.Display>}
     */
    function getNewScreen() {
        settings.displayId = -1;
        return getScreen();
    }

    /**
     * 
     * @param {string} configPath 
     * @returns {Promise<void>}
     */
    function saveSettings(configPath) {
        return new Promise(function (resolve, reject) {
            FileSystem.writeAsync(configPath, JSON.stringify(settings))
                .then(resolve).catch(reject);
        });
    }

    /**
     * 
     * @param {EasyStart.Category} category 
     * @returns {void}
     */
    function addCategory(category) {
        category.id = 0;
        for (var item of settings.categories) {
            if (item.id > category.id) category.id = item.id;
        }
        category.id++;
        settings.categories.push(category);
    }

    /**
     * 
     * @param {EasyStart.Folder} folder 
     * @param {number} categoryId 
     * @returns {void}
     */
    function addFolder(folder, categoryId) {
        folder.id = 0;
        for (var category of settings.categories) {
            for (var item of category.folderList) {
                if (item.id > folder.id) folder.id = item.id;
            }
            if (category.id === categoryId) category.folderList.push(folder);
        }
        folder.id++;
    }

    /**
     * 
     * @param {EasyStart.Item} item 
     * @param {number} categoryId 
     * @param {number} [folderId=]
     */
    function addItem(item, categoryId, folderId) {
        var categoryIndex = settings.categories.findIndex(function (category) {
            return category.id === categoryId;
        });
        if (categoryIndex !== -1) {
            var category = settings.categories[categoryIndex];
            var folderIndex = category.folderList.findIndex(function (folder) {
                return folder.id === folderId;
            });
            (folderIndex !== -1 ? category.folderList[folderIndex] : category)["itemList"]["push"](item);
        }
    }

    /**
     * Gets the screen selector module
     * @returns {module "./screen-selector"}
     */
    function getScreenSelector() {
        return ScreenSelector = ScreenSelector || require("./screen-selector.js");
    }

    /**
     * Gets the category list
     * @param {Event} evt
     * @returns {Array<EasyStart.Category>}
     */
    function getCategories(evt) {
        return evt.returnValue = settings.categories;
    }

    ipcMain.on("get-categories", getCategories);

    exports.getNewScreen = getNewScreen;
    exports.loadSettings = loadSettings;
    exports.saveSettings = saveSettings;
    exports.addCategory = addCategory;
    exports.getScreen = getScreen;
    exports.addFolder = addFolder;
    exports.addItem = addItem;
})();