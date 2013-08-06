define(function() {

    function Rest(elem) {
        this.elem = elem;
    }
    
    // need to escape it
    Rest.prototype.display = function(tokens) {
        this.elem.empty();
        var self = this;
        tokens.map(function(t) {
            self.elem.append('<li>' + t + '</li>');
        });
    };
    
    return Rest;
    
});