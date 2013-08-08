define(function() {
    "use strict";

    function Ops(elem) {
        this.elem = elem;
    }
    
    Ops.prototype.clear = function() {
        this.elem.empty();
    };
    
    var ESCAPES = {
      '&'  :  '&amp;'   ,
      '<'  :  '&lt;'    ,
      '>'  :  '&gt;'    ,
      '"'  :  '&quot;'  ,
      "'"  :  '&#x27;'  ,
      '/'  :  '&#x2F;'
    };
    
    function escape(str) {
        var arr = [],
            i = 0;
        for (; i < str.length; i++) {
            if ( str[i] in ESCAPES ) {
                arr[i] = ESCAPES[str[i]];
            } else {
                arr[i] = str[i];
            }
        }
        return arr.join('');
    }
    
    function drawFixity(fixity) {
        return ['<select>'].concat(
            ['prefix', 'infix', 'mixfix', 'postfix'].map(function(option) {
		        if ( option === fixity ) {
		            return '<option selected>' + option + '</option>';
		        }
		        return '<option>' + option + '</option>';
            }), 
            '</select>'
        ).join('');
    }
    
    function displayAssociativity(assoc) {
        return ['<select>'].concat(
            ['left', 'right', 'none'].map(function(a) {
                var close = a + '</option>';
                if ( assoc === a ) {
                    return '<option selected>' + close;
                }
                return '<option>' + close;
            }),
            '</select>'
        ).join('');
    }
    
    // problem:
    //   - if it's prefix or postfix, associativity must not be changeable
    //   - can prefix/postfix be non-associative?  i.e. so that `@ x @` causes
    //     an associativity error if both `@`s are non-associative?
    Ops.prototype.drawRow = function(name, fixity, precedence, associativity) {
        this.elem.append(['<tr><td><input type="text" value="',
                          escape(name),
                          '" /></td><td>',
                          drawFixity(fixity),
                          '</td><td>',
                          '<input type="number" value="' + escape(precedence + "") + '" />',
                          '</td><td>',
                          displayAssociativity(associativity),
                          '</td></tr>'].join(''));
    };
                          
    Ops.prototype.display = function(lang) {
        var name, first, temp;
        this.elem.empty();
        for (name in lang.prefix) {
            this.drawRow(name, 'prefix', lang.prefix[name], 'right');
        }
        for (name in lang.infix) {
            temp = lang.infix[name];
            this.drawRow(name, 'infix', temp[0], temp[1]);
        }
        for (first in lang.mixfix) {
            temp = lang.mixfix[first];
            this.drawRow(first + ',' + temp[2], 'mixfix', temp[0], temp[1]);
        }
        for (name in lang.postfix) {
            this.drawRow(name, 'postfix', lang.postfix[name], 'left');
        }
    };
    
    return Ops;

});
