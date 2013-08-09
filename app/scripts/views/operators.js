define(function() {
    "use strict";

    function Ops(elem) {
        this.elem = elem;
    }
    
    Ops.prototype.display = function(ops) {
        this.elem.val(JSON.stringify(ops, undefined, 2));
    };
    
    Ops.prototype.error = function() {
        this.elem.addClass('error');
    };
    
    Ops.prototype.noError = function() {
        this.elem.removeClass('error');
    };
    
    return Ops;

});
