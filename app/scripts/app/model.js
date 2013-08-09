var modules = ["app/tokenizer", "app/parser", "app/languages", "app/language"];

define(modules, function(Tk, Parser, Ls, Language) {
    "use strict";
    
    var EVENTS = {
	        'parse-success'    : 1,
	        'parse-error'      : 1,
	        'save-ops'         : 1,
	        'reset-ops'        : 1,
	        'op-error'         : 1
        };
    
    function Model() {
        this._listeners = {};
        for ( var e in EVENTS ) {
            this._listeners[e] = [];
        }
        this.language = new Language({});
        this._ops = null;
    }
    
    Model.prototype.displayLanguage = function(l) {
        if (!(l in Ls)) {
            throw new Error('invalid language -- ' + l);
        }
        this._ops = Ls[l]; // throws away the old one ??? what if it was an accident -- is all the data lost?
        this.fire('reset-ops');
    }
    
    Model.prototype.setOperators = function(opsString) {
        var jsobj, lang;
        try {
            jsobj = JSON.parse(opsString);
        } catch(e) {
            this.fire('op-error', 'invalid JSON string -- parse error');
            return;
        }
        try {
            lang = new Language(jsobj);
            this._ops = lang; // if input was good, cache a copy for later
        } catch(e) {
            // two possible causes: conflicting names or wrong types
            this.fire('op-error', 'invalid operator data -- ' + e.message);
            return;
        }
        this.fire('save-ops');
    };
    
    Model.prototype.getOperators = function() {
        return this._ops;
    };
    
    Model.prototype.getParser = function() {
        return new Parser(this._ops);
    };
    
    Model.prototype.parse = function(str) {
        try {
            var result = this.getParser().expr(Tk(str));
            this.fire('parse-success', result[0], result[1]);
        } catch(e) {
            this.fire('parse-error', e);
        }
    }
    
    Model.prototype.resetOperators = function() {
        this.fire('reset-ops');
    };
    
    
    Model.prototype.listen = function(event, action) {
        if (!(event in EVENTS)) {
            throw new Error('invalid event -- ' + event);
        }
        this._listeners[event].push(action);
    };
    
    Model.prototype.fire = function(event) {
        if (!(event in EVENTS)) {
            throw new Error('invalid event -- ' + event);
        }
        var args = Array.prototype.slice.call(arguments, 1);
        this._listeners[event].forEach(function(l) {
            l.apply(null, args);
        });
    };
    
    return Model;
    
});
