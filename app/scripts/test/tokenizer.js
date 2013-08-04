define(["app/tokenizer"], function(tk) {

    module("tokenizer");

    test("basic", function() {
        deepEqual(tk('***  jkl z'), ['***', 'jkl', 'z']);
    });
    
    test("all whitespace characters", function() {
        deepEqual(tk('a \n\t\r\f b      c'), ['a', 'b', 'c']);
    });
    
    test("leading and trailing whitespace", function() {
        deepEqual(tk(' abc 123 + - '), ['abc', '123', '+', '-']);
    });

});