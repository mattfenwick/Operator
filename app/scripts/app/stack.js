define([], function() {
    "use strict";

    function Stack(value, next) {
        this._value = value;
        this._next = next;
    }
    
    Stack.prototype.push = function(value) {
        return Stack(value, this);
    };
    
    Stack.prototype.pop = function() {
        if ( this.isEmpty() ) {
            throw Error("can't pop empty stack");
        }
        return this._next;
    };
    
    Stack.prototype.first = function() {
        if ( this.isEmpty()) {
            throw Error("can't get top element of empty stack");
        }
        return this._value;
    };
    
    Stack.prototype.isEmpty = function() {
        return this._empty; // undefined is falsy
    };
    
    Stack.empty = Stack(null, null);
    Stack.empty._empty = true;
        
    return Stack;
    
});
