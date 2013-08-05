define(function() {

    function Input(elem, cont) {
        this.elem = elem;
        this.controller = cont;

        var self = this;
        this.elem.bind('keydown', function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if( code == 13 ) {                               // why isn't this `===`?
                self.controller(self.elem.val());
            }
            return true;                                     // forgot why it has to return true
        });
    }
    
    Input.prototype.reset = function(result) {
        if ( result.status === 'success' ) {
            this.elem.val("");
        }
    };
    
    return Input;
    
});
