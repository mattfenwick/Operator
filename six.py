import json

# assumptions
# 1. prefix operators always associate to the right
#    `! ! ! x` => `(! (! (! x)))`
# 2. postfix operators always associate to the left
#    `x ++ ++ ++` => `(((x ++) ++) ++)`
# 3. each infix operator may either always associate
#    to the left, or always associate to the right
#    `x + y + z` => `((x + y) + z)`
#    `a ^ b ^ c` => `(a ^ (b ^ c))`
# 4. an operator may be both infix and prefix, or
#    prefix and postfix, but not infix and postfix
# 5. an operator may not also be an operand
# 6. if precedences are equal, associativities must
#    also be equal
#    cases: infix-infix, prefix-infix, infix-postfix
     
# stack
# (operator name, associativity, precedence, list of args)

def node(op, args):
    return {'op': op, 'args': args}


prefix = {
    '++': 110, '--': 110, '-': 110, '+': 110, '!': 110, '~': 110,
}

postfix = {
    '++': 120, '--': 120
}

infix = {
    # 120: postfix ++ and --
    # 110: prefix unary ++ -- + - ! ~
    'Z': 120, 'Y': 120,# matches postfix precedence
    'X': 110, 'W': 110,# matches prefix precedence
    '*': 100, '/': 100, '%': 100,
    '+': 90,  '-': 90,
    '<<': 80, '>>': 80, '>>>': 80,
    '<': 70,  '>': 70,  '<=': 70, '>=': 70, 'instanceof': 70,
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

rights = set(['=',  '+=',  '-=',  '*=', 'Z', 'X' # check pre/post-fix associativity problem reporting 
              '/=', '%=',  '&=',  '^=',
              '|=', '<<=', '>>=', '>>>='])

def done(stack, last):
    temp = last
    print 'done: ', stack, last
    for (op, a, _p, args) in stack[::-1]: # iterate through stack in reverse, ignore precedence and associativity
        print 'op, args, temp: ', op, args, temp
        temp = node(op, args + [temp])
    return temp

def unwind(stack, op2, assoc2, prec2, args2):
    """
    Only handles ties where the operators have identical associativity.
    Blows up if ties between different associativities.
    """
    scratch = args2
    # pop any stack levels with a higher prec than the current operator
    while len(stack) > 0:
        op1, assoc1, prec1, args1 = stack[-1]
        if prec2 > prec1:
            break
        # also needs to break if right associative
        if prec2 == prec1:
            if assoc1 != assoc2:
                raise ValueError('error -- equal precedence but different associativity')
            if assoc1 == 'right': # what about if it's non-associative?
                break
        stack.pop()
        scratch = [node(op1, args1 + scratch)]
    # now we perform the push
    return stack + [(op2, assoc2, prec2, scratch)]


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
        new_stack = stack + [(fst, 'right', prefix[fst], [])]
        return expr(new_stack, xs[1:])
    
    # so `fst` is our arg -- now let's see if it has a postfix operator
    # step 2 and step 4 (sort of)
    if len(xs) == 1:
        return done(stack, xs[0])
    
    # step 3
    # new stuff starts here
    # example:  `3 + 4 * 5 ?` (where `?` has a low, postfix precedence) becomes `(3 + (4 * 5))?`
    # `3 + 4 * 5 ??` (where `??` is between `+` and `*`) becomes `3 + ((4 * 5)?)`
    # `3 + 4 * 5 ???` (where `???` is the highest) becomes `3 + (4 * (5?))`
    # `3 + 4 * 5 ????` would be an error if `*` were right-associative
    arg, rest = fst, xs
    while True:
        rest = rest[1:]
        if len(rest) == 0:
            break
        post = rest[0]
        if not post in postfix:
            break
        # pop any stack levels with a higher prec than the current operator
        while len(stack) > 0:
            op1, assoc1, prec1, args1 = stack[-1]
            if postfix[post] > prec1:
                break
            # disallow mixed associativity if same precedence
            if postfix[post] == prec1 and op1 in rights: # postfix operators are always left-associative
                raise ValueError('error -- equal precedence but different associativity')
            stack.pop() # uh-oh, value mutation!
            arg = node(op1, arg1, arg) # WRONG
        arg = node(post, arg, None) # WRONG 
    # new stuff done here
    
    # step 4 (again)
    if len(rest) == 0:
        return done(stack, arg)
    
    # step 5
    op = rest[0]
    assoc = 'right' if op in rights else 'left'
    # steps 6 and 7
    print 'hum: ', stack
    popped_stack = unwind(stack, op, assoc, infix[op], [arg])
    print 'oh: ', popped_stack
    return expr(popped_stack, rest[1:])

def pp(node, indent):
    newIndent = indent + 2
    spaces = indent * ' '
    if isinstance(node, dict):
        lines = [spaces + '(' + node['op']] + [pp(a, newIndent) for a in node['args']]
        lines[-1] = lines[-1] + ')'
        return '\n'.join(lines)
    try:
        return spaces + node
    except:
        print 'whoops: ', node
        raise

def run(ys):
    v = expr([], ys.split())
    print json.dumps(v, indent=4)
    print pp(v, 0)
#    return v


def problems():
    run('! 3 X 1')
    print 'should have been:  (? ! (3 X 1))'
    print '-' * 80
    
    try:
        run('! 3 W 1')
    except Exception as e:
        print 'good: ', e
    print 'should have been an error since `!` and `W` have different associativities'
    print '-' * 80

    try:
        run('1 Z 2 ++')
    except Exception as e:
        print 'good: ', e
    print 'should have been an error'
    print '-' * 80
    
    run('1 Y 2 ++')
    print 'should have been: ((1 Y 2) ++ ?)'
