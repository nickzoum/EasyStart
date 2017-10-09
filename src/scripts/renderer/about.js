(function () {
    const { ipcRenderer } = require("electron");

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    function onLoad() {
        var properties = document.querySelectorAll(".property");
        var testApp = ipcRenderer.sendSync("get-app");
        for (var property of properties) {
            var appProperty = testApp[property.getAttribute("property")];
            property.textContent = typeof appProperty === "function" ? appProperty() : appProperty;
        }
    }

})();