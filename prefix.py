import json


def node(op, l, r):
    return {'op': op, 'left': l, 'right': r}


prefix = { # I guess prefix operators are always right-associative, by default -- so I don't need to declare anything, right?
    '++': 110, '--': 110, '-': 110, '+': 110, '!': 110, '~': 110,
}

# now for java
precs = {
    # 120: postfix ++ and --
    # 110: prefix unary ++ -- + - !
    '*': 100, '/': 100, '%': 100,
    '+': 90, '-': 90,
    '<<': 80, '>>': 80, '>>>': 80,
    '<': 70, '>': 70, '<=': 70, '>=': 70, 'instanceof': 70,
    '==': 60, '!=': 60,
    '&': 50,
    '^': 40,
    '|': 30,
    '&&': 20,
    '||': 10,
    # normally would be ...?...:... operator here
    '=':  -10, '+=':  -10, '-=':  -10, '*=':   -10,
    '/=': -10, '%=':  -10, '&=':  -10, '^=':   -10,
    '|=': -10, '<<=': -10, '>>=': -10, '>>>=': -10
}

rights = set(['=',  '+=',  '-=',  '*=', 
              '/=', '%=',  '&=',  '^=',
              '|=', '<<=', '>>=', '>>>='])

def done(stack, last):
    temp = last
    for (op, l, _p) in stack[::-1]: # iterate through stack in reverse, ignore (?) precedence
        temp = node(op, l, temp)
 #       print 'stack frame: ', op, l
    return temp

def unwind(stack, op2, arg2, p2):
    """
    Only handles ties where the operators have identical associativity.
    Blows up if ties between different associativities.
    """
    scratch = arg2
    # pop any stack levels with a higher prec than the current operator
    while len(stack) > 0:
        op1, arg1, p1 = stack[-1]
        if p2 > p1:
            break
        # also needs to break if right associative
        if p2 == p1:
            # disallow mixed associativity if same precedence
            if (op1 in rights) != (op2 in rights):
                raise ValueError('error -- equal precedence but different associativity')
            if op1 in rights:
                break
        stack.pop()
        scratch = node(op1, arg1, scratch)
    # now we perform the push
    return stack + [(op2, scratch, p2)]

# def prefix(stack, op):
    # 

def expr(stack, xs):
#    print 'calling expr: ', stack, xs
    if len(xs) == 0:
        raise ValueError('oops, bad input')
    elif len(xs) == 1:
        print 'almost done: ', stack
        return done(stack, xs[0])
    fst, op, ys = xs[0], xs[1], xs[2:]
    if fst in prefix: # how do you decide whether '+' and '-' are prefix or infix? it's based on what context they're called in
        new_stack = stack + [(fst, None, prefix[fst])]
        return expr(new_stack, xs[1:])
    else:
        new_stack = unwind(stack, op, fst, precs[op])
        rest = ys
    return expr(new_stack, rest)

def formatArg(a):
    if a is None:
        return '? '
    return pp(a) + ' '

def pp(node):
    if isinstance(node, dict):
        return ''.join(['(',
                        formatArg(node['left']),
                        node['op'],       ' ', 
                        formatArg(node['right']),
                        ')'])
    return node

def run(ys):
    v = expr([], ys.split())
    print json.dumps(v, indent=4)
    print pp(v)
#    return v
