define(function() {
    "use strict";

    function AST(elem) {
        this.elem = elem;
    }
    
    AST.prototype.display = function(tree) {
        var str = node(tree, 0);
        console.log('lookie: ' + str);
        console.log('huh?  ' + this.elem + ' ' + JSON.stringify(this.elem));
        this.elem.text(str);
    };
    
    // there's got to be a better way to do this
    function spaces(num) {
        var arr = new Array(num),
            i = 0;
        for(; i < arr.length; i++) {
            arr[i] = ' ';
        }
        return arr.join(' ');
    }
    
    function node(val, indent) {
        if ( typeof val === 'string' ) {
            return spaces(indent * 2) + val;
        }
        var op = spaces(indent * 2) + val.op.name + ' [' + val.op.fixity + ']';
        function f(a) {
            return node(a, indent + 1);
        }
        return [op].concat(val.args.map(f)).join('\n');
    }
    
    return AST;

});