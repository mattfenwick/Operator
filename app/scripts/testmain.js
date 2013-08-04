
var NEW_TESTS = [
    "test/stack",
    "test/languages",
    "test/tokenizer",
    "test/parser"
];

require(NEW_TESTS, function() {
    module("testmain");
    
    test("testmain", function() {
        ok(1, "modules loaded");
    });
});
