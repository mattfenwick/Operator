define(function() {

    function AST(elem) {
        this.elem = elem;
    }
    
    AST.prototype.display = function(tree) {
        this.elem.text(JSON.stringify(tree));
    };
    
    return AST;

});