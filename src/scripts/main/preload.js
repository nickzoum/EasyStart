(function () {
  const { contextBridge, ipcRenderer } = require("electron");

  contextBridge.exposeInMainWorld("easyStartApi", {
    getCategories: function () {
      return ipcRenderer.sendSync("get-categories");
    },
    getApp: function () {
      return ipcRenderer.sendSync("get-app");
    },
    requestDisplays: function () {
      return ipcRenderer.sendSync("on-display-request");
    },
    selectScreen: function (displayId) {
      ipcRenderer.send("on-screen-selected", displayId);
    },
    notifyWindowLoaded: function () {
      ipcRenderer.send("window-loaded");
    },
    showItemMenu: function (url) {
      ipcRenderer.send("showItemMenu", url);
    },
    callItem: function (url) {
      ipcRenderer.send("call-item", url);
    },
    controlAction: function (actionName) {
      ipcRenderer.send("control-action", actionName);
    },
    onLoadStyle: function (listener) {
      if (typeof listener !== "function") return;
      var wrappedListener = function (evt, styleUrl) {
        listener(styleUrl);
      };
      ipcRenderer.on("load-style", wrappedListener);
      return function () {
        ipcRenderer.removeListener("load-style", wrappedListener);
      };
    },
  });
})();
