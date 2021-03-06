
def node(op, l, r):
    return {'op': op, 'left': l, 'right': r}


python_precs = {
    'or':  -30,
    'and': -20,
    'in': 0, 'is': 0, '<': 0, '<=': 0, '>': 0, '>=': 0, 
        '<>': 0, '!=': 0, '==': 0, # oops, comparisons are ... different in Python
    '|': 10,
    '^': 20,
    '&': 30,
    '<<': 40, '>>': 40,
    '+': 50, '-': 50,
    '*': 60, '/': 60, '%': 60, '//': 60,
    '**': 70
}
python_rights = set(['**']) 

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
    for (op, l) in stack[::-1]: # iterate through stack in reverse
        temp = node(op, l, temp)
 #       print 'stack frame: ', op, l
    return temp

def unwind(stack, op2, arg2):
    """
    Only handles ties where the operators have identical associativity.
    Does not handle ties between different associativities.
    """
    scratch = arg2
    # pop any stack levels with a higher prec than the current operator
    while len(stack) > 0:
        op1, arg1 = stack[-1]
        if precs[op2] > precs[op1]:
            break
        # also needs to break if right associative
        if precs[op2] == precs[op1]:
            # disallow mixed associativity if same precedence
            if (op1 in rights) != (op2 in rights):
                raise ValueError('operator associativity error -- cannot mix operators of equal precedence but different associativity')
            if op1 in rights:
                break
        stack.pop()
        scratch = node(op1, arg1, scratch)
    # now we perform the push
    return stack + [(op2, scratch)]

def expr(stack, xs):
#    print 'calling expr: ', stack, xs
    if len(xs) == 0:
        raise ValueError('oops, bad input')
    elif len(xs) == 1:
        return done(stack, xs[0])
    fst, op, ys = xs[0], xs[1], xs[2:]
    new_stack = unwind(stack, op, fst)
    return expr(new_stack, ys)

def pp(node):
    if isinstance(node, dict):
        return ''.join(['(',
                        pp(node['left']), ' ',
                        node['op'],       ' ', 
                        pp(node['right']),
                        ')'])
    return node

def run(ys):
    v = pp(expr([], ys.split(' ')))
    print v
#    return v
