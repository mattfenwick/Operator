define(["app/parser", "app/languages", "app/stack"], function(Parser, langs, Stack) {

    module("parser");
    
    var p = new Parser(langs.test),
        e = function(xs) {return p.expr(xs.split(' '));};

    function node(name, fixity, args) {
        return {
            'op': {
                'name': name, 
                'fixity': fixity
            }, 
            'args': args
        };
    }
    
    test("bare operand", function() {
        propEqual(e('3'), ['3', []]);
        propEqual(e('3 $$ $'), ['3', ['$$', '$']]);
    });

    test("prefix", function() {
        propEqual(e('- x'), [node('-', 'prefix', ['x']), []]);
        propEqual(e('++ ! ~ z'), 
                  [node('++', 'prefix', 
                        [node('!', 'prefix', 
                              [node('~', 'prefix', ['z'])])]), 
                   []]);
    });
    
    test("infix", function() {
        propEqual(e('a + b'), [node('+', 'infix', ['a', 'b']), []]);
        propEqual(e('q * r y'), [node('*', 'infix', ['q', 'r']), ['y']]);
        // missing right operand
        throws(function() {e('t +');}, /did not find operand/, 'should be error');
    });
    
    test("mixfix", function() {
        propEqual(e('1 ? 2 : 3'), [node(['?', ':'], 'mixfix', ['1', '2', '3']), []]);
        propEqual(e('w :: x ?? y 4'), [node(['::', '??'], 'mixfix', ['w', 'x', 'y']), ['4']]);    
    });
    
    test("postfix", function() {
        propEqual(e('x ++'), [node('++', 'postfix', ['x']), []]);
        propEqual(e('a -- @ q'), [node('@', 'postfix', 
                                       [node('--', 'postfix', 
                                             ['a'])]), ['q']]);
    });
    
    test("left associativity", function() {
        propEqual(e('g + h + i j'),
                  [node('+', 'infix', [node('+', 'infix', ['g', 'h']), 'i']), ['j']]);
    });
    
    test("right associativity", function() {
        propEqual(e('x = y = z z'),
                  [node('=', 'infix', ['x', node('=', 'infix', ['y', 'z'])]), ['z']]);
    });
    
    test("prefix associativity", function() {
        propEqual(e('! a R110 b c'),
                  [node('!', 'prefix', [node('R110', 'infix', ['a', 'b'])]), ['c']]);
    });
    
    test("postfix associativity", function() {
        propEqual(e('d L120 e ++ f'),
                  [node('++', 'postfix', [node('L120', 'infix', ['d', 'e'])]), ['f']]);
    });
    
    test("infix precedence", function() {
        propEqual(e('x + y * z'),
                  [node('+', 'infix', ['x', node('*', 'infix', ['y', 'z'])]), []]);
        propEqual(e('m * n + o'),
                  [node('+', 'infix', [node('*', 'infix', ['m', 'n']), 'o']), []]);
    });
    
    test("precedence and associativity: left vs right, left wins", function() {
        propEqual(e('3 L120 4 R110 5'),
                  [node('R110', 'infix', [node('L120', 'infix', ['3', '4']), '5']), []]);
        propEqual(e('6 R110 7 L120 8'),
                  [node('R110', 'infix', ['6', node('L120', 'infix', ['7', '8'])]), []]);
    });
    
    test("precedence and associativity: left vs right, right wins", function() {
        propEqual(e('3 L110 4 R120 5'),
                  [node('L110', 'infix', ['3', node('R120', 'infix', ['4', '5'])]), []]);
        propEqual(e('6 R120 7 L110 8'),
                  [node('L110', 'infix', [node('R120', 'infix', ['6', '7']), '8']), []]);
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
