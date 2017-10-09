(function () {
    const { app, BrowserWindow, ipcMain } = require("electron");
    const FileIO = require("./file-io.js");
    /** @type {Electron.Display} */
    var displayId;
    /** @type {Array<EasyStart.Category>} */
    var categories;


    /**
     * Asynchronously loads the settings
     * @param {string} configPath
     * @returns {Promise<Array<EasyStart.Category>>}
     */
    function loadSettings(configPath) {
        return new Promise(function (resolve, reject) {
            try {
                FileIO.readAsync(configPath).then(function (data) {
                    try {
                        var json = JSON.parse(data);
                        displayId = json["displayId"];
                        categories = json["categories"];
                        resolve(categories);
                    } catch (err) { reject(err); }
                }).catch(function (err) {
                    var error = err ? err["errno"] || err : "Unspecified Error";
                    if (error === -4058) {
                        resetConfig();
                        saveSettings(configPath).then(function () {
                            resolve(categories);
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
                require("./screen-selector.js").onScreenSelected(displayId).then(function (result) {
                    displayId = result.id;
                    resolve(result);
                }).catch(reject);
            }
            catch (err) { reject(err); }
        });
    }

    /**
     * 
     * @returns {void} 
     */
    function resetConfig() {
        categories = [];
        displayId = -1;
    }

    /**
     * 
     * @param {string} configPath 
     * @returns {Promise<void>}
     */
    function saveSettings(configPath) {
        return new Promise(function (resolve, reject) {
            var json = {
                categories: categories || [],
                displayId: displayId || -1
            };
            FileIO.writeAsync(configPath, JSON.stringify(json))
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
        for (var item of categories) {
            if (item.id > category.id) category.id = item.id;
        }
        category.id++;
        categories.push(category);
    }

    /**
     * 
     * @param {EasyStart.Folder} folder 
     * @param {number} categoryId 
     * @returns {void}
     */
    function addFolder(folder, categoryId) {
        folder.id = 0;
        for (var category of categories) {
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
        var categoryIndex = categories.findIndex(function (category) {
            return category.id === categoryId;
        });
        if (categoryIndex !== -1) {
            var category = categories[categoryIndex];
            var folderIndex = category.folderList.findIndex(function (folder) {
                return folder.id === folderId;
            });
            (folderIndex !== -1 ? category.folderList[folderIndex] : category)["itemList"]["push"](item);
        }
    }

    /**
     * Gets the category list
     * @param {Event} evt
     * @returns {Array<EasyStart.Category>}
     */
    function getCategories(evt) {
        return evt.returnValue = categories;
    }

    ipcMain.on("get-categories", getCategories);


    exports.loadSettings = loadSettings;
    exports.saveSettings = saveSettings;
    exports.addCategory = addCategory;
    exports.getScreen = getScreen;
    exports.addFolder = addFolder;
    exports.addItem = addItem;
})();