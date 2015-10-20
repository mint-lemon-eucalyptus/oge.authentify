"use strict";
var util = require('util');
var bootstrap = require('./moduleLoader').bootstrap;
var EventEmitter = require('events').EventEmitter;

//used as middleware in auth mechanism
function Auth($config) {
    EventEmitter.call(this);
    this.config = $config;
    this.strategies = {};
}
util.inherits(Auth, EventEmitter);
/*dir = string(absolute path) */
Auth.prototype.loadFromDir = function (dir) {
    var self = this;
    if (!dir) {
        throw new Error('missing directory that contains strategies scripts');
    }
    bootstrap(dir, function (err, mtable) {
        if (err) {
            throw new Error(err);
        } else {
            var strategies = self.config.strategies ? self.config.strategies : {};
            for (var i in mtable) {
                var strategyCfgEntry = strategies[i];
                if (!strategyCfgEntry) {
                    self.emit(self.EVENT_CONFIG_FOR_STRATEGY_MISSING, i);
                    strategyCfgEntry = {};
                }
                self.strategies [i] = new mtable[i](strategyCfgEntry);
            }
            self.emit(self.EVENT_STRATEGIES_LOADED, Object.keys(self.strategies))
        }
    });
};
/*name=string, instance = instance of strategy class, build trough 'new' */
Auth.prototype.addStrategy = function (name, instance) {
    if (this.strategies[name] != null) {
        throw new Error(this.ERROR_STRATEGY_ALREADY_LOADED);
    }
    this.strategies[name] = instance;
    this.emit(this.EVENT_STRATEGIES_LOADED, Object.keys(this.strategies))
};
Auth.prototype.auth = function (strategyName, authData, call) {
    var self = this;
    var strategy = this.strategies[strategyName];
    if (!strategy) {   //here are only functions present
        call({code: self.ERROR_NO_STRATEGY});
    } else {
        strategy.authenticate(authData, call);
    }
};
Auth.prototype.register = function (strategyName, authData, call) {
    var self = this;
    var strategy = this.strategies[strategyName];
    if (!strategy) {   //here are only functions present
        call({code: self.ERROR_NO_STRATEGY});
    } else {
        strategy.register(authData, call);
    }
};
Auth.prototype.getLoadedStrategies = function () {
    return Object.keys(this.strategies);
};

Auth.prototype.ERROR_NO_STRATEGY = "strategy is not implemented";
Auth.prototype.ERROR_STRATEGY_ALREADY_LOADED = "STRATEGY_ALREADY_LOADED";
Auth.prototype.EVENT_STRATEGIES_LOADED = 'EVENT_STRATEGIES_LOADED';
Auth.prototype.EVENT_CONFIG_FOR_STRATEGY_MISSING = 'EVENT_CONFIG_FOR_STRATEGY_MISSING';
module.exports = Auth;
