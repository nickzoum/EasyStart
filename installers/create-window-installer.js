const { createWindowsInstaller } = require("electron-winstaller");
const path = require("path");

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });

function getInstallerConfig() {
    console.log("Creating Windows Installer");
    const rootPath = path.join("./");
    const outPath = path.join(rootPath, "release-builds");

    return Promise.resolve({
        appDirectory: path.join(outPath, "EasyStart-win32-x64/"),
        authors: "NZapp",
        noMsi: true,
        outputDirectory: path.join(outPath, "windows-installer"),
        exe: "EasyStart.exe",
        setupExe: "EasyStartInstaller.exe",
        setupIcon: path.join(rootPath, "assets", "images", "icon.ico")
    });
}