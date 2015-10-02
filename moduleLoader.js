"use strict";
var util = require('util');
function bootstrap(dirname, call) {
    if (!dirname) {
        throw new Error('initial directory is not set')
    }
    if (typeof dirname !== 'string') {
        throw new Error('first argument must be a string')
    }
    var fs = require("fs"),
        path = require("path");
    fs.readdir(dirname, function (err, files) {
        if (err) {
            throw err;
        }
        var htable = {};
        files.map(function (file) {
            return path.join(dirname, file);
        }).filter(function (file) {
            return fs.statSync(file).isFile();
        }).forEach(function (file) {
            //     console.log("%s (%s)", file, path.extname(file));
            var module = require(file);
            var moduleName = file.replace(/(\/\w+)+\/(\w+)(\.js)?/, '$2');
            //   console.log("found module '%s' at: %s", moduleName, file);
            htable[moduleName] = module;
        });
        call(null, htable);
    });
};

function testModuleExportsTypeofFunction(Constructor) {
    console.log(Constructor)
    var instance = new Constructor();
    return (typeof instance.authenticate === 'function');
}


exports.bootstrap = bootstrap;
exports.testModuleExportsTypeofFunction = testModuleExportsTypeofFunction;
