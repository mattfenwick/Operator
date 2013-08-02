define(["app/parser", "app/languages", "app/stack"], function(Parser, langs, Stack) {

    module("parser");
    
    // prefix, infix, mixfix, postfix
    // precedence, associativity
    // prefix vs postfix, prefix vs infix/mixfix
    
    var p = new Parser(langs.test),
        e = function(xs) {return p.expr(xs);};
    
    test("bare operand", function() {
        propEqual(e(['3']), ['3', []]);
        propEqual(e(['3', '$$', '$']), ['3', ['$$', '$']]);
    });

    test("prefix", function() {
        propEqual(e(['-', 'x']), [{'op': '- [prefix]', 'args': ['x']}, []]);
        propEqual(e(['++', '!', '~', 'z']),
                  [{'op': '++ [prefix]', 
                    'args': [{'op': '! [prefix]', 
                              'args': [{'op': '~ [prefix]', 
                                        'args': ['z']}]}]},
                   []]);
    });
    
    test("infix", function() {
        propEqual(e(['a', '+', 'b']), [{'op': '+', 'args': ['a', 'b']}, []]);
        propEqual(e(['q', '*', 'r', 'y']), [{'op': '*', 'args': ['q', 'r']}, ['y']]);
    });
    
    test("mixfix", function() {
        propEqual(e(['1', '?', '2', ':', '3']), [{'op': '?,: [mixfix]', 'args': ['1', '2', '3']}, []]);
        propEqual(e(['w', '::', 'x', '??', 'y', '4']), [{'op': '::,?? [mixfix]', 'args': ['w', 'x', 'y']}, ['4']]);    
    });
    
    test("postfix", function() {
        propEqual(e(['x', '++']), [{'op': '++ [postfix]', 'args': ['x']}, []]);
        propEqual(e(['a', '--', '@', 'q']), [{'op': '@ [postfix]', 
                                              'args': [{'op': '-- [postfix]', 
                                                        'args': ['a']}]}, ['q']]);
    });
    
        
/*    test("simple tokens -> simple parse nodes", function() {
        propEqual(pp.parse([ti, tf, ts, tsy]), 
            good([pi, pf, ps, psy], []));
    });*/
    
});
