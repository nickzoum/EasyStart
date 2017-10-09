(function () {
    const { app, Menu } = require("electron");
    const Main = require("./index.js");

    const template = [
        {
            label: "New Category",
            click: newCategory
        },
        {
            label: "New Folder",
            click: newFolder
        },
        {
            label: "New Item",
            click: newItem
        },
        { type: "separator" },
        {
            label: "Advanced",
            submenu: [
                {
                    label: "Toggle Developer Toolds",
                    accelerator: "Ctrl+Shift+I",
                    click: toggleDevTools
                }
            ]
        },
        { type: "separator" },
        {
            label: `About ${app.getName()}`,
            click: showAbout
        },
        {
            label: `Exit ${app.getName()}`,
            click: close
        }
    ];

    function newCategory() {

    }

    function newFolder() {

    }

    function newItem() {

    }

    function close() {
        Main.closeWindow();
    }

    function showAbout() {
        Main.showAbout();
    }

    function toggleDevTools() {
        Main.toggleDevTools();
    }

    function getMenu() {
        return Menu.buildFromTemplate(template);
    }

    module.exports = getMenu;
})();