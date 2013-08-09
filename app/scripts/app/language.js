define(function() {
    "use strict";
    
    function Language(operators) {
        this.prefix = {};
        this.infix = {};
        this.mixfix = {};
        this.postfix = {};
        var name, temp;
        for ( name in operators.prefix ) {
            this.addPrefix(name, operators.prefix[name]);
        }
        temp = operators.infix;
        for ( name in temp ) {
            this.addInfix(name, temp[name][0], temp[name][1]);
        }
        temp = operators.mixfix;
        for ( name in temp ) {
            this.addMixfix(name, temp[name][2], temp[name][0], temp[name][1]);
        }
        for ( name in operators.postfix ) {
            this.addPostfix(name, operators.postfix[name]);
        }
    }
    
    Language.prototype.checkName = function(name) {
        if ( name in this.infix || name in this.mixfix || name in this.postfix ) {
            throw new Error('infix operator name ' + name + ' already used as in/mix/post-fix operator');
        }
    };
    
    Language.prototype.addPrefix = function(name, prec) {
        if ( name in this.prefix ) {
            throw new Error('prefix operator name ' + name + ' already used');
        }
        this.prefix[name] = prec;
    };
    
    Language.prototype.addInfix = function(name, prec, assoc) {
        this.checkName(name);
        this.infix[name] = [prec, assoc];
    };
    
    Language.prototype.addMixfix = function(name1, name2, prec, assoc) {
        this.checkName(name1);
        this.checkName(name2); // what checks does name2 need?  
        this.mixfix[name1] = [prec, assoc, name2];
    };
    
    Language.prototype.addPostfix = function(name, prec) {
        this.checkName(name);
        this.postfix[name] = prec;
    };
    
    return Language;
    
});
