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
            label: "Settings",
            submenu: [
                {
                    label: "Change Display",
                    click: changeDisplay
                }, {
                    label: "Save Position",

                }
            ]
        },
        {
            label: "Advanced",
            submenu: [
                {
                    label: "Toggle Developer Toolds",
                    accelerator: "Ctrl+Shift+I",
                    click: toggleDevTools
                },
                {
                    label: "Import StyleSheet",
                    click: importStyle
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
        Main.newCategory();
    }

    function newFolder() {
        Main.newFolder();
    }

    function newItem() {
        Main.newItem();
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

    function importStyle() {
        Main.importStyle();
    }

    function changeDisplay() {
        Main.changeDisplay();
    }

    function savePosition() {
        Main.savePosition();
    }

    function getMenu() {
        return Menu.buildFromTemplate(template);
    }

    module.exports = getMenu;
})();