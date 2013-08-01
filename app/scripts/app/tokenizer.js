define([], function() {
    "use strict";


    var tokenRegex = new RegExp('\\s+');
    
    function tokenFilter(t) {
        return t.length > 0;
    }
    
    function tokenize(string) {
        return string.split(tokenRegex).filter(tokenFilter);
    }

    
    return tokenize;
    
});