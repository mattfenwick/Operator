define(["app/parser", "app/languages", "app/stack"], function(Parser, langs, Stack) {

    module("parser");
    
    var p = new Parser(langs.test),
        e = function(xs) {return p.expr(xs.split(' '));};
    
    test("bare operand", function() {
        propEqual(e('3'), ['3', []]);
        propEqual(e('3 $$ $'), ['3', ['$$', '$']]);
    });

    test("prefix", function() {
        propEqual(e('- x'), [{'op': '- [prefix]', 'args': ['x']}, []]);
        propEqual(e('++ ! ~ z'),
                  [{'op': '++ [prefix]', 
                    'args': [{'op': '! [prefix]', 
                              'args': [{'op': '~ [prefix]', 
                                        'args': ['z']}]}]},
                   []]);
    });
    
    test("infix", function() {
        propEqual(e('a + b'), [{'op': '+', 'args': ['a', 'b']}, []]);
        propEqual(e('q * r y'), [{'op': '*', 'args': ['q', 'r']}, ['y']]);
        // missing right operand
        throws(function() {e('t +');}, /did not find operand/, 'should be error');
    });
    
    test("mixfix", function() {
        propEqual(e('1 ? 2 : 3'), [{'op': '?,: [mixfix]', 'args': ['1', '2', '3']}, []]);
        propEqual(e('w :: x ?? y 4'), [{'op': '::,?? [mixfix]', 'args': ['w', 'x', 'y']}, ['4']]);    
    });
    
    test("postfix", function() {
        propEqual(e('x ++'), [{'op': '++ [postfix]', 'args': ['x']}, []]);
        propEqual(e('a -- @ q'), [{'op': '@ [postfix]', 
                                              'args': [{'op': '-- [postfix]', 
                                                        'args': ['a']}]}, ['q']]);
    });
    
    test("left associativity", function() {
        propEqual(e('g + h + i j'),
                  [{'op': '+', 'args': [{'op': '+', 'args': ['g', 'h']}, 'i']}, ['j']]);
    });
    
    test("right associativity", function() {
        propEqual(e('x = y = z z'),
                  [{'op': '=', 'args': ['x', {'op': '=', 'args': ['y', 'z']}]}, ['z']]);
    });
    
    test("prefix associativity", function() {
        propEqual(e('! a R110 b c'),
                  [{'op': '! [prefix]', 'args': [{'op': 'R110', 'args': ['a', 'b']}]}, ['c']]);
    });
    
    test("postfix associativity", function() {
        propEqual(e('d L120 e ++ f'),
                  [{'op': '++ [postfix]', 'args': [{'op': 'L120', 'args': ['d', 'e']}]}, ['f']]);
    });
    
    test("infix precedence", function() {
        propEqual(e('x + y * z'),
                  [{'op': '+', 'args': ['x', {'op': '*', 'args': ['y', 'z']}]}, []]);
        propEqual(e('m * n + o'),
                  [{'op': '+', 'args': [{'op': '*', 'args': ['m', 'n']}, 'o']}, []]);
    });
    
    test("precedence and associativity: left vs right, left wins", function() {
        propEqual(e('3 L120 4 R110 5'),
                  [{'op': 'R110', 'args': [{'op': 'L120', 'args': ['3', '4']}, '5']}, []]);
        propEqual(e('6 R110 7 L120 8'),
                  [{'op': 'R110', 'args': ['6', {'op': 'L120', 'args': ['7', '8']}]}, []]);
    });
    
    test("precedence and associativity: left vs right, right wins", function() {
        propEqual(e('3 L110 4 R120 5'),
                  [{'op': 'L110', 'args': ['3', {'op': 'R120', 'args': ['4', '5']}]}, []]);
        propEqual(e('6 R120 7 L110 8'),
                  [{'op': 'L110', 'args': [{'op': 'R120', 'args': ['6', '7']}, '8']}, []]);
    });
    
    // mixfix associativity
    // prefix/infix precedence
    // infix/postfix precedence
    // prefix/postfix precedence
    // mixed associativity
    // same operator, prefix/infix, prefix/postfix
    // multiple prefix
    // multiple postfix
    
    // prefix, infix, mixfix, postfix
    // precedence, associativity
    // prefix vs postfix, prefix vs infix/mixfix
    
});
