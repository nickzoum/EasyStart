(function () {
    const fs = require("fs");

    /**
     * Synchronously reads a file
     * @param {string} filePath 
     * @returns {string}
     */
    function readSync(filePath) {
        return fs.readFileSync(filePath).toString();
    }

    /**
     * Asynchronously reads a file
     * @param {string} filePath
     * @returns {Promise<string>}
     */
    function readAsync(filePath) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filePath, function (error, data) {
                if (error) return reject(error);
                else return resolve(data.toString());
            });
        });
    }

    /**
     * Synchronously writes to a file
     * @param {string} filePath 
     * @param {string} data 
     * @returns {void}
     */
    function writeSync(filePath, data) {
        fs.writeFileSync(filePath, data.toString());
    }

    /**
     * Asynchronously writes to a file
     * @param {string} filePath 
     * @param {string} data 
     * @returns {Promise<void>}
     */
    function writeAsync(filePath, data) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(filePath, data.toString(), function (error) {
                if (error) return reject(error);
                else return resolve();
            });
        });
    }

    function copyFileSync(source, destination) {
        return fs.copyFileSync(source, destination);
    }

    function copyFileAsync(source, destination) {
        return new Promise(function (resolve, reject) {
            fs.copyFile(source, destination, function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    exports.writeAsync = writeAsync;
    exports.readAsync = readAsync;
    exports.writeSync = readSync;
    exports.readSync = readSync;
})();