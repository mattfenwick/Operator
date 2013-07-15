import json

# cleaner postfix operator parsing


def node(op, l, r):
    return {'op': op, 'left': l, 'right': r}


prefix = { # always right-associative by default, right?
    '++': 110, '--': 110, '-': 110, '+': 110, '!': 110, '~': 110,
}

# always left-associative by default?
#  and they'll all have the same precedence -- higher than any other operator
#   and there's only one allowed -- i.e. can't do `x ++ ++`
postfix = set(['++', '--'])


precs = {
    # 120: postfix ++ and --
    # 110: prefix unary ++ -- + - ! ~
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


def expr(stack, xs):
    """
    step 1: prefix op (recur if one is found, pushing a stack level)
    step 2: find the arg
    step 3: postfix op if one is found
    step 4: if input is empty, call `done` to pop all pending stack levels
    step 5: input not empty, thus next token is the binary op
    step 6: pop stack as far as necessary, based on comparing precedences
            of pending operators to current op
    step 7: push new stack level for op
    """
    # step 1
    fst = xs[0]
    if fst in prefix: # decide infix/prefix or '+'/'-': by what context they're called in
        new_stack = stack + [(fst, None, prefix[fst])]
        return expr(new_stack, xs[1:])
    
    # so `fst` is our arg -- now let's see if it has a postfix operator
    # step 2 and step 4 (sort of)
    if len(xs) == 1:
        return done(stack, xs[0])
    
    # step 3
    snd = xs[1]
    if snd in postfix:
        arg = node(snd, fst, None)
        rest = xs[2:]
    else:
        arg = fst
        rest = xs[1:]
    
    # step 4 (again)
    if len(rest) == 0:
        return done(stack, arg)
    
    # step 5
    op = rest[0]
    # steps 6 and 7
    new_stack = unwind(stack, op, arg, precs[op])
    return expr(new_stack, rest[1:])

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
