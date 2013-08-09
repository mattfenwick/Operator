define(function() {
    "use strict";

    function Ops(pre, inf, mix, post) {
        this._pre = pre;
        this._inf = inf;
        this._mix = mix;
        this._post = post;
    }
    
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
    
    function associativity(assoc) {
        return ['<td><select>'].concat(
            ['left', 'right', 'none'].map(function(a) {
                var close = a + '</option>';
                if ( assoc === a ) {
                    return '<option selected>' + close;
                }
                return '<option>' + close;
            }),
            '</select></td>'
        ).join('');
    }
    
    function precedence(p) {
        return ['<td><input type="number" value="', escape(p + ""), '" /></td>'].join('');
    }
    
    function name(n) {
        return ['<td><input type="text" value="', escape(n), '" /></td>'].join('');
    }
    
    Ops.prototype.prefix = function(n, prec) {
        this._pre.append(['<tr>', name(n), precedence(prec), '</tr>'].join(''));
    }
    
    Ops.prototype.infix = function(n, prec, assoc) {
        this._inf.append(['<tr>', 
                          name(n),
                          precedence(prec),
                          associativity(assoc),
                          '</tr>'].join(''));
    }
    
    Ops.prototype.mixfix = function(n1, n2, prec, assoc) {
        this._mix.append(['<tr>', 
                          name(n1),
                          name(n2),
                          precedence(prec),
                          associativity(assoc),
                          '</tr>'].join(''));
    }
    
    Ops.prototype.postfix = function(n, prec) {
        this._post.append(['<tr>', name(n), precedence(prec), '</tr>'].join(''));
    }
                          
    Ops.prototype.display = function(lang) {
        var name, first, temp;
        this._pre.empty();
        for (name in lang.prefix) {
            this.prefix(name, lang.prefix[name]);
        }
        this._inf.empty();
        for (name in lang.infix) {
            temp = lang.infix[name];
            this.infix(name, temp[0], temp[1]);
        }
        this._mix.empty();
        for (first in lang.mixfix) {
            temp = lang.mixfix[first];
            this.mixfix(first, temp[2], temp[0], temp[1]);
        }
        this._post.empty();
        for (name in lang.postfix) {
            this.postfix(name, lang.postfix[name]);
        }
    };
    
    return Ops;

});
