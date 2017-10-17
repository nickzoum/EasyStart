(function () {
    const { Menu } = require("electron");
    const Main = require("./index.js");

    function getMenu(url) {
        var template = [
            {
                label: "Show item in explorer",
                click: showItemInFolder
            }, {
                label: "Open Item",
                click: open
            }, {
                label: "Edit Item",
                click: edit
            }, {
                label: "Delete Item",
                click: remove
            }
        ];
    
        /**
         * 
         * @param {Electron.MenuItem} menuItem 
         * @returns {void}
         */
        function showItemInFolder() {
            Main.showItemInFolder(url);
        }
    
        function edit() {
    
        }
    
        function remove() {
    
        }
    
        function open() {
    
        }
        return Menu.buildFromTemplate(template);
    }

    module.exports = getMenu;
})();