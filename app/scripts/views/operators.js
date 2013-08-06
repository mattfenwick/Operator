define(function() {

    function Ops(elem) {
        this.elem = elem;
    }
    
    Ops.prototype.clear = function() {
        this.elem.empty();
    };
    
    function escape(str) {
        throw Error('unimplemented');
    }
    
    // need to actually escape stuff
    Ops.prototype.drawRow = function(name, fixity, precedence, associativity) {
        this.elem.append(['<tr><td>',
                          escape(name),
                          '</td><td>',
                          fixity,
                          '</td><td>',
                          precedence,
                          '</td><td>',
                          associativity,
                          '</td></tr>'].join(''));
    };
                          
    Ops.prototype.display = function(lang) {
        var name;
        this.clear();
        for (name in lang.prefix) {
            this.drawRow(name, 'prefix', lang.prefix[name], 'right');
        }
        for (name in lang.infix) {
            this.drawRow(name, 'infix', lang.infix[name][0], lang.prefix[name][1];
        }
        throw Error('need postfix, mixfix');
    };

});