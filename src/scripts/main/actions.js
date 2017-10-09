const { app } = require("electron");
const SettingsMenu = require("./settings-menu.js");
const Main = require("./index.js");
const menu = SettingsMenu();

/**
 * 
 * @returns {void}
 */
function openSettings() {
    Main.showMenu(menu, { x: 197, y: 25 });
}

/**
 * 
 * @returns {void}
 */
function minimize() {
    Main.minimize();
}

/**
 * 
 * @returns {void}
 */
function close() {
    Main.closeWindow();
}

module.exports = {
    settings: openSettings,
    minimize: minimize,
    close: close
};