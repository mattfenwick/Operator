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
# 5. an operator may also be an operand -- i.e.
#    `& & &` -- but not always ... not sure when
# 6. if precedences are equal, associativities must
#    also be equal
#    cases: infix-infix, prefix-infix, infix-postfix
     
# stack
# (operator name, associativity, precedence, list of args)

def node(op, args):
    if not isinstance(args, list):
        raise TypeError('expected list, got %s' % str(type(args)))
    return {'op': op, 'args': args}


prefix = {
    '++': 110, '--': 110, '-': 110, '+': 110, '!': 110, '~': 110,
    '?': 50
}

postfix = {
    '++': 120, '--': 120, 
    '?': 50
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

rights = set(['=',  '+=',  '-=',  '*=', 'Z', 'X', # check pre/post-fix associativity problem reporting 
              '/=', '%=',  '&=',  '^=',
              '|=', '<<=', '>>=', '>>>='])

def done(stack, last):
    temp = last
    for (op, a, _p, args) in stack[::-1]: # iterate through stack in reverse, ignore precedence and associativity
        temp = node(op, args + [temp])
    return temp

def parsePrefixes(stack, xs):
    while True:
        fst = xs[0]
        if fst not in prefix:
            break
        stack = stack + [(fst + ' [prefix]', 'right', prefix[fst], [])]
        xs = xs[1:]
    return (stack, xs)

def unwind(stack, assoc2, prec2, arg2):
    """
    Only handles ties where the operators have identical associativity.
    Blows up if ties between different associativities.
    """
    scratch = arg2
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
        stack = stack[:-1]
        scratch = node(op1, args1 + [scratch])
    return stack, scratch

def parsePostfixes(stack, arg2, xs):
    while True:
        if len(xs) == 0:
            break
        post = xs[0]
        if not post in postfix:
            break
        stack, arg2 = unwind(stack, 'left', postfix[post], arg2)
        arg2 = node(post + ' [postfix]', [arg2])
        xs = xs[1:]
    return stack, xs, arg2

def expr(stack, xs):
    """
    step 1: prefixes
    step 2: operand
    step 3: postfixes
    step 4: if input is empty, call `done` to pop all pending stack levels
    step 5: input not empty, thus next token is the binary op
    step 6: pop stack as far as necessary, based on comparing precedences
            of pending operators to current op
    step 7: push new stack level for op
    """
    stack, xs = parsePrefixes(stack, xs)
    
    # step 2 and step 4 (sort of)
    if len(xs) == 1: # len == 0 case handled by parsePrefixes
        return done(stack, xs[0])
    
    # step 3
    stack, xs, arg = parsePostfixes(stack, xs[0], xs[1:])
    
    # step 4 (again)
    if len(xs) == 0:
        return done(stack, arg)
    
    # step 5
    op = xs[0]
    assoc = 'right' if op in rights else 'left'
    # step 6
    stack, arg2 = unwind(stack, assoc, infix[op], arg)
    # step 7
    stack = stack + [(op, assoc, infix[op], [arg2])]
    return expr(stack, xs[1:])


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


def parse(ys):
    return expr([], ys.split())

def run(ys):
    v = parse(ys)
#    print json.dumps(v, indent=4)
    print pp(v, 0)
