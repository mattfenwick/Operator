define(["app/stack"], function(Stack) {
    "use strict";
    
    function operator(name, fixity) {
        return {'name': name, 'fixity': fixity};
    }
    
    function node(op, args) {
        if ( args.length === undefined || typeof(args) === 'string' ) { // actually not sure about the precedence here ... haha
            throw new Error('oops, "node" expected array of args');
        }
        return {'op': op, 'args': args};
    }
    
    function frame(op, assoc, prec, args) {
        return {
            'op': op,
            'assoc': assoc,
            'prec': prec,
            'args': args
        };
    }
    
    function done(stack, last) {
        var temp = last,
            frame = null;
        while ( !stack.isEmpty() ) {
            frame = stack.first();
            temp = node(frame.op, frame.args.concat(temp));
            stack = stack.pop();
        }
        return temp;
    }
    
    function Parser(operators) {
        if (!operators) {
            throw new Error('undefined operators in Parser');
        }
        this.prefix = operators.prefix;
        this.infix = operators.infix;
        this.mixfix = operators.mixfix;
        this.postfix = operators.postfix;
    }
    
    Parser.prototype.parsePrefixes = function(stack, xs) {
        var fst;
        while ( true ) {
            if ( xs.length === 0 ) {
                throw new Error('while parsing prefixes, did not find operand');
            }
            fst = xs[0];
            if (!(fst in this.prefix)) {
                break;
            }
            stack = stack.push(frame(operator(fst, 'prefix'), 'right', this.prefix[fst], []));
            xs = xs.slice(1);
        }
        return [stack, xs];
    };

    function unwind(stack, assoc2, prec2, arg2) {
        var op1 = null, assoc1 = null,
            prec1 = null, args1 = null,
            frame = null;
        // pop any stack levels with a higher prec than the current operator
        while (!(stack.isEmpty())) {
            frame = stack.first();
            op1 = frame.op, assoc1 = frame.assoc;
            prec1 = frame.prec, args1 = frame.args;
            console.log(JSON.stringify([assoc1, prec1, frame, 'd', arguments]));
            if ( prec2 > prec1 ) {
                break;
            }
            // also needs to break if right-associative
            if ( prec2 === prec1 ) {
                if ( assoc1 !== assoc2 ) {
                    throw new Error('in unwind -- equal precedence but different associativity');
                } else if ( assoc1 === 'right' ) { // what about non-associativity?
                    break;
                }
            }
            stack = stack.pop();
            arg2 = node(op1, args1.concat(arg2));
        }
        return [stack, arg2];
    }
    
    Parser.prototype.parsePostfixes = function(stack, arg2, xs) {
        var post = null,
            unwound = null;
        while ( true ) {
            if ( xs.length === 0 ) {
                break;
            }
            post = xs[0];
            if (!(post in this.postfix)) {
                break;
            }
            unwound = unwind(stack, 'left', this.postfix[post], arg2);
            stack = unwound[0];
            arg2 = unwound[1];
            arg2 = node(operator(post, 'postfix'), [arg2]);
            xs = xs.slice(1);
        }
        return [stack, xs, arg2];
    };
    
    Parser.prototype.parseMixfix = function(stack, arg, xs) {
        var op = xs[0],
            xs = xs.slice(1),
            temp = this.mixfix[op],
            prec = temp[0],
            assoc = temp[1],
            second = temp[2], 
            temp2 = unwind(stack, assoc, prec, arg),
            stack = temp2[0],
            arg2 = temp2[1],
            temp3 = this.expr(xs),
            arg3 = temp3[0], // hmm, seems like false advertising to call it arg3.  is that right ????
            xs = temp3[1];
        if ( xs[0] !== second ) {
            throw new Error('mixfix operator ' + op + ': expected "' + second + '"');
        }
        stack = stack.push(frame(operator([op, second], 'mixfix'), assoc, prec, [arg2, arg3])); 
        xs = xs.slice(1);
        return [stack, xs];
    }
    
    Parser.prototype.parseInfix = function(stack, arg, xs) {
        var op = xs[0],
            prec = this.infix[op][0],
            assoc = this.infix[op][1],
            temp = unwind(stack, assoc, prec, arg),
            stack = temp[0],
            arg2 = temp[1];
        stack = stack.push(frame(operator(op, 'infix'), assoc, prec, [arg2]));
        xs = xs.slice(1);
        return [stack, xs];
    }
    
    Parser.prototype.expr = function(xs) {
        var stack = Stack.empty, 
            arg, op, last, temp;
        while ( true ) {
            temp = this.parsePrefixes(stack, xs);
            stack = temp[0];
            xs = temp[1];
            if ( xs.length === 1 ) { // length 0 case handled by parsePrefixes
                last = xs[0];
                xs = xs.slice(1);
                break;
            }
            
            temp = this.parsePostfixes(stack, xs[0], xs.slice(1));
            stack = temp[0];
            xs = temp[1];
            arg = temp[2];
            if ( xs.length === 0 ) {
                last = arg;
                break;
            }
            
            op = xs[0];
            if ( op in this.infix ) {
                temp = this.parseInfix(stack, arg, xs);
                stack = temp[0];
                xs = temp[1];
            } else if ( op in this.mixfix ) {
                temp = this.parseMixfix(stack, arg, xs);
                stack = temp[0];
                xs = temp[1];
            } else {
                last = arg;
                break;
            }
        }
        
        return [done(stack, last), xs];
    }
    
    return Parser;

});
