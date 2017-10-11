(function () {
    const { app, Menu } = require("electron");
    const Main = require("./index.js");

    const template = [
        {
            label: `Exit ${app.getName()}`,
            click: close
        }
    ];

    function close() {
        Main.closeWindow();
    }

    function getMenu() {
        return Menu.buildFromTemplate(template);
    }

    module.exports = getMenu;
})();