define(["app/tokenizer", "app/parser", "app/languages"], function(Tk, Parser, L) {
    "use strict";
    
    // maybe put the 'Language' class in here?
    //   or maybe it's subsumed by the 'Model' class?
    
    var EVENTS = {
        'set-language' : 1,
        'parse-success': 1,
        'parse-error'  : 1,
        'new-op'       : 1,
        'change-op'    : 1,
        'remove-op'    : 1,
        'reset-op'     : 1,
        'op-error'     : 1
    };
    
    function Model() {
        this._listeners = {};
        for ( var e in EVENTS ) {
            this._listeners[e] = [];
        }
        this.language = null;
        this.parsers = {};
        for ( var l in L ) {
            this.parsers[l] = new Parser(L[l]);
        }
    }
    
    Model.prototype.setLanguage = function(l) {
        if (!(l in L)) {
            throw new Error('invalid language -- ' + l);
        }
        this.language = l;
        this.fire('set-language');
    }
    
    Model.prototype.getOperators = function() {
        return L[this.language];
    }
    
    Model.prototype.parse = function(str) {
//        try {
            console.log(JSON.stringify([this.parsers, Object.keys(this.parsers), typeof this.parsers.java]));
            var result = this.parsers[this.language].expr(Tk(str));
            console.log('parse result: ' + JSON.stringify(result));
            this.fire('parse-success', result[0], result[1]);
//        } catch(e) {
//            this.fire('parse-error', e);
//        }
    }
    
    // so what are these doing ... modifying data of which there is 
    //   only *1* copy ??? oops ... need to figure that one out again
    Model.prototype.removeOperator = function(name, fixity) {
        if ( name in L ) {
            delete L[this.language][fixity][name];
            this.fire('remove-op', name, fixity);
        } else { // an exception b/c I *believe* this is impossible
            throw new Error('invalid operator/fixity -- ' + name + ', ' + fixity);
        }
    }
    
    Model.prototype.addInfix = function(name, prec, assoc) {
        throw new Error('unimplemented');
    };
    
    Model.prototype.modifyInfix = function(oldname, newname, prec, assoc) {
        if (!(oldname in this.getOperators()['infix'])) {
            throw new Error('invalid infix operator name -- ' + oldname);
        }
        this.checkName(newname);
        delete this.getOperators()['infix'][oldname];
        this.getOperators()['infix'][newname] = [prec, assoc];
    };
    
    Model.prototype.checkName = function(name) {
        var ops = this.getOperators();
        if ( name in ops.infix || name in ops.mixfix || name in ops.postfix ) {
            throw new Error('infix operator name ' + name + ' already used as in/mix/post-fix operator');
        }
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
