(function () {
    const path = require("path");
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

    /**
     * Synchronously copies a file
     * @param {string} source 
     * @param {string} destination 
     * @param {string} [name=]
     * @returns {string} 
     */
    function copyFileSync(source, destination, name) {
        if (typeof name === "string") destination = path.join(destination, name);
        fs.createReadStream(source).pipe(fs.createWriteStream(destination));
        return destination;
    }

    /**
     * Asynchronously copies a file
     * @param {string} source 
     * @param {string} destination 
     * @param {string} [name=]
     * @returns {Promise<string>} 
     */
    function copyFileAsync(source, destination, name) {
        return new Promise(function (resolve, reject) {
            try { resolve(copyFileSync(source, destination, name)); }
            catch (err) { reject(err); }
        });
    }

    /**
     * Synchronously creates a directory if it doesn't exist
     * @param {string} directory
     * @returns {void} 
     */
    function createDirectorySync(directory) {
        if (!fs.existsSync(directory)) fs.mkdirSync(directory);
    }

    /**
     * Asynchronously creates a directory if it doesn't exist
     * @param {string} directory
     * @returns {void} 
     */
    function createDirectoryAsync(directory) {
        return new Promise(function (resolve, reject) {
            fs.exists(directory, function (exists) {
                if (exists) resolve();
                else fs.mkdir(function (err) {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    }

    exports.createDirectoryAsync = createDirectoryAsync;
    exports.createDirectorySync = createDirectorySync;
    exports.copyFileAsync = copyFileAsync;
    exports.copyFileSync = copyFileAsync;
    exports.writeAsync = writeAsync;
    exports.readAsync = readAsync;
    exports.writeSync = readSync;
    exports.readSync = readSync;
})();