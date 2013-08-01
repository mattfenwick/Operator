define(["app/stack"], function(Stack) {
    "use strict";
    
    function node(op, args) {
        if ( args.length === undefined || typeof(args) === 'string' ) { // actually not sure about the precedence here ... haha
            throw new Error('oops, "node" expected array of args');
        }
        return {'operator': op, 'arguments': args};
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
    
    function parsePrefixes(stack, xs) {
        var fst;
        while ( true ) {
            fst = xs[0];
            if (!(fst in prefix)) { // OOPS -- <-- where does `prefix` come from?
                break;
            }
            stack = stack.push(frame(fst + ' [prefix]', 'right', prefix[fst], [])); // OOPS again
            xs = xs.slice(1);
        }
        return [stack, xs];
    }

    function unwind(stack, assoc2, prec2, arg2) {
        var op1 = null, assoc1 = null,
            prec1 = null, args1 = null,
            frame = null;
        // pop any stack levels with a higher prec than the current operator
        while (!(stack.isEmpty())) {
            frame = stack.first();
            op1 = frame.op, assoc1 = frame.assoc;
            prec1 = frame.prec, arg1 = frame.args;
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
            arg2 = node(op1, args1.concat(arg2);
        }
        return [stack, arg2];
    }
    
    function parsePostfixes(stack, arg2, xs) {
        var post = null,
            unwound = null;
        while ( true ) {
            if ( xs.length === 0 ) {
                break;
            }
            post = xs[0];
            if (!(post in postfix)) { // OOPS -- <-- where does `postfix` come from?
                break;
            }
            unwound = unwind(stack, 'left', postfix[post], arg2); // OOPS again
            stack = unwound[0];
            arg2 = unwound[1];
            arg2 = node(post + ' [postfix]', [arg2]);
            xs = xs.slice(1);
        }
        return [stack, xs, arg2];
    }
    
    function parseMixfix(stack, arg, xs) {
        var op = xs[0],
            xs = xs.slice(1),
            temp = mixfix[op], // OOPS -- `mixfix`
            prec = temp.prec,
            assoc = temp.assoc,
            second = temp.second, 
            temp2 = unwind(stack, assoc, prec, arg),
            stack = temp2[0],
            arg2 = temp2[1],
            temp3 = expr(xs),
            arg3 = temp3[0], // hmm, seems like false advertising to call it arg3.  is that right ????
            xs = temp3[1];
        if ( xs[0] !== second ) {
            throw new Error('mixfix operator ' + op + ': expected "' + second + '"');
        }
        stack = stack.push(frame(op + ',' + second + ' [mixfix]', assoc, prec, [arg2, arg3])); 
        xs = xs.slice(1);
        return [stack, xs];
    }
    
    function parseInfix(stack, arg, xs) {
        var op = xs[0],
            prec = infix[op].prec,   // OOPS -- <-- `infix`
            assoc = infix[op].assoc, // OOPS again
            temp = unwind(stack, assoc, prec, arg),
            stack = temp[0],
            arg2 = temp[1];
        stack = stack.push(frame(op, assoc, prec, [arg2]));
        xs = xs.slice(1);
        return [stack, xs];
    }
    
    function expr(xs) {
        var stack = Stack.empty, 
            arg, op, last, temp;
        while ( true ) {
            temp = parsePrefixes(stack, xs);
            stack = temp[0];
            xs = temp[1];
            if ( xs.length === 1 ) { // length 0 case handled by parsePrefixes
                last = xs[0];
                xs = xs.slice(1);
                break;
            }
            
            temp = parsePostfixes(stack, xs[0], xs.slice(1));
            stack = temp[0];
            xs = temp[1];
            arg = temp[2];
            if ( xs.length === 0 ) {
                last = arg;
                break;
            }
            
            op = xs[0];
            if ( op in infix ) { // OOPS -- `infix`
                temp = parseInfix(stack, arg, xs);
                stack = temp[0];
                xs = temp[1];
            } else if ( op in mixfix ) { // OOPS -- `mixfix`
                temp = parseMixfix(stack, arg, xs);
                stack = temp[0];
                xs = temp[1];
            } else {
                last = arg;
                break;
            }
        }
        
        return [done(stack, last), xs];
    }
    
    return expr;

});
