define(["app/stack"], function(Stack) {

    module("stack");
    
    var e = Stack.empty;
    
    test("empty", function() {
        propEqual(e, {'_empty': true, '_next': null, '_value': null});
    });
    
    test("push", function() {
        var s1 = e.push(3),
            s2 = s1.push('hi');
        propEqual(s1, {'_value': 3,    '_next': e});
        propEqual(s2, {'_value': 'hi', '_next': s1});
    });
    
    test("pop", function() {
        var s1 = e.push(3),
            s2 = s1.push('hi');
        propEqual(s2.pop(), s1);
        propEqual(s1.pop(), e);
    });
    
    test("first", function() {
        var s1 = e.push(3),
            s2 = s1.push('hi');
        propEqual(s2.first(), 'hi');
        propEqual(s1.first(), 3);
    });
    
    test("isEmpty", function() {
        var s1 = e.push(3),
            s2 = s1.push('hi');
        propEqual(s2.isEmpty(), false);
        propEqual(s1.isEmpty(), false);
        propEqual(e.isEmpty(), true);
    });

});
