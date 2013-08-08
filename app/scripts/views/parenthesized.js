define(function() {

    function Parenthesized(elem) {
        this.elem = elem;
    }
    
    Parenthesized.prototype.display = function(tree) {
        this.elem.text(node(tree)); // for now we'll just json-ize it
    }
    
    function node(n) {
        if ( typeof n === 'string' ) {
            return n;
        }
        var fix = n.op.fixity, name = n.op.name;
        if ( fix === 'prefix' ) {
            return ['(', name, node(n.args[0]), ')'].join(' ');
        } else if ( fix === 'postfix' ) {
            return ['(', node(n.args[0]), name, ')'].join(' ');
        } else if ( fix === 'infix' ) {
            return ['(', node(n.args[0]), name, node(n.args[1]), ')'].join(' ');
        } else if ( fix === 'mixfix' ) {
            return ['(', node(n.args[0]), name[0], node(n.args[1]), name[1], node(n.args[2]), ')'].join(' ');
        }
        throw new Error('unrecognized fixity -- ' + n.fixity);
    }

    return Parenthesized;
    
});