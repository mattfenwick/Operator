define(["app/languages"], function(L) {

    module("languages");
    
    var languages = L();
    
    test("java", function() {    
        deepEqual(Object.keys(languages.java.prefix).length, 6);
        deepEqual(Object.keys(languages.java.postfix).length, 2);
        deepEqual(Object.keys(languages.java.infix).length, 32);
        deepEqual(Object.keys(languages.java.mixfix).length, 1);
    });

});
