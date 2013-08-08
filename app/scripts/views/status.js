define(function() {
    "use strict";

    function Status(elem) {
        this.elem = elem;
    }
    
    Status.prototype.display = function(status, message) {
        if ( status === 'success' ) {
            this.elem.text('GOOD -- ' + status + ', ' + message);
        } else if ( status === 'error' ) {
            this.elem.text('BAD -- ' + status + ', ' + message);
        } else {
            throw new Error('invalid status: ' + JSON.stringify([status, message]));
        }
    }
    
    return Status;

});