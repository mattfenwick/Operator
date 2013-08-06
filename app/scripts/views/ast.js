define(function() {

    function AST(elem) {
        this.elem = elem;
    }
    
    // um, what element is this acting on?
    AST.prototype.display = function(tree) {
        var str = something(tree);
        console.log('lookie: ' + str);
        this.elem.empty();
        this.elem.append(str);
    };
    
    // need to escape !!!
    function something(node) {
        if ( typeof node === 'string' ) {
            return '<li>' + node + '</li>';
        }
        return '<li>' + node.op + '<ul>' + node.args.map(something).join('') + '</ul></li>';
    }
    
    return AST;

});