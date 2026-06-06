(function () {
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad);

  function onLoad() {
    var properties = document.querySelectorAll(".property");
    var testApp = window.easyStartApi.getApp();
    for (var property of properties) {
      var appProperty = testApp[property.getAttribute("property")];
      property.textContent =
        typeof appProperty === "function" ? appProperty() : appProperty;
    }
  }
})();
