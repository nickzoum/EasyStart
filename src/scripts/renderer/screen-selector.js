(function () {
    const { ipcRenderer } = require("electron");

    onDisplaysSent(ipcRenderer.sendSync("on-display-request"));

    /**
     * Shows the displays
     * @param {Array<Electron.Display>} displays 
     * @returns {void}
     */
    function onDisplaysSent(displays) {
        var container = document.querySelector("#container");
        displays = displays.sort(sortDisplays);
        for (var display of displays) {
            container.appendChild(createDisplayDom(display));
        }
    }

    /**
     * Function used to sort displays
     * @param {Electron.Display} a 
     * @param {Electron.Display} b 
     * @returns {number}
     */
    function sortDisplays(a, b) {
        return a.workArea.x - b.workArea.x;
    }

    /**
     * Creates a display dom element
     * @param {Electron.Display} display 
     * @returns {HTMLElement}
     */
    function createDisplayDom(display) {
        var element = document.createElement("button");
        var height = document.createElement("span");
        var width = document.createElement("span");
        element.className = `display ${display.touchSupport === "available" ? "touch" : ""}`;
        element.addEventListener("click", onDisplayClicked);
        height.textContent = display.workArea.height;
        width.textContent = display.workArea.width;
        element.setAttribute("src-id", display.id);
        height.className = "height";
        width.className = "width";
        element.appendChild(height);
        element.appendChild(width);
        return element;
    }

    /**
     * Function to be called when a display is clicked
     * @param {MouseEvent} evt 
     * @returns {void}
     */
    function onDisplayClicked(evt) {
        var id = evt.srcElement.getAttribute("src-id");
        ipcRenderer.send("on-screen-selected", id);
    }
})();