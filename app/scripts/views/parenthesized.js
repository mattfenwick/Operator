define(function() {

    function Parenthesized(elem) {
        this.elem = elem;
    }
    
    Parenthesized.prototype.display = function(tree) {
        this.elem.text(JSON.stringify(tree)); // for now we'll just json-ize it
    }
    
    return Parenthesized;
    
});