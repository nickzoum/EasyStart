(function () {
    const { ipcRenderer } = require("electron");
    /** @type {Array<EasyStart.Category>} */
    var categories = ipcRenderer.sendSync("get-categories");

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    function onLoad() {
        var actions = document.querySelectorAll(".action");
        for (var action of actions) action.addEventListener("click", onActionClicked);
        var container = document.querySelector("#container");
        for (var category of categories) {
            container.appendChild(createCategoryDom(category));
        }
    }

    /**
     * 
     * @param {EasyStart.Category} category 
     * @returns {HTMLElement}
     */
    function createCategoryDom(category) {
        var name = document.createElement("span");
        var dom = document.createElement("div");
        var list = document.createElement("ul");
        name.textContent = category.name;
        dom.className = "category";
        dom.appendChild(name);
        dom.appendChild(list);
        for (var folder of category.folderList) {
            list.appendChild(createFolderDom(folder));
        }
        for (var item of category.itemList) {
            list.appendChild(createItemDom(item));
        }
        return dom;
    }

    /**
     * 
     * @param {EasyStart.Folder} folder
     * @returns {HTMLElement}
     */
    function createFolderDom(folder) {
        var name = document.createElement("span");
        var dom = document.createElement("div");
        var list = document.createElement("ul");
        dom.className = "folder";
        dom.appendChild(list);
        dom.appendChild(name);
        for (var item of folder.itemList) {
            list.appendChild(createItemDom(item));
        }
        return dom;
    }

    /**
     * 
     * @param {EasyStart.Item} item
     * @returns {HTMLElement}
     */
    function createItemDom(item) {
        var name = document.createElement("span");
        var dom = document.createElement("button");
        var image = document.createElement("img");
        dom.setAttribute("tooltip", item.fileSrc);
        dom.addEventListener("click", onItemClicked);
        image.src = item.imageSrc;
        name.textContent = item.name;
        name.className = "hover";
        dom.className = "item";
        dom.appendChild(image);
        dom.appendChild(name);
        return dom;
    }

    /**
     * 
     * @param {Event} evt
     * @returns {void}
     */
    function onItemClicked(evt) {
        callItem(evt.srcElement.getAttribute("tooltip"));
    }

    /**
     * 
     * @param {Event} evt
     * @returns {void} 
     */
    function onActionClicked(evt) {
        callAction(evt.srcElement.getAttribute("action"));
    }


    /**
     * 
     * @param {string} url 
     * @returns {void}
     */
    function callItem(url) {
        ipcRenderer.send("call-item", url);
    }

    /**
     * 
     * @param {string} actionName 
     * @returns {void}
     */
    function callAction(actionName) {
        ipcRenderer.send("control-action", actionName);
    }


})();