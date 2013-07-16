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


def node(op, args):
    if not isinstance(args, list):
        raise TypeError('expected list, got %s' % str(type(args)))
    return {'op': op, 'args': args}

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
        arg2 = node(op1, args1 + [arg2])
    return stack, arg2

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
    step 4: binary op
    step 5: pop stack (if necessary)
    step 6: push new stack frame
    """
    stack, xs = parsePrefixes(stack, xs)
    
    if len(xs) == 1: # len == 0 case handled by parsePrefixes
        return done(stack, xs[0])
    
    stack, xs, arg = parsePostfixes(stack, xs[0], xs[1:])
    
    if len(xs) == 0:
        return done(stack, arg)
    
    op = xs[0]
    assoc = 'right' if op in rights else 'left'
    # step 5
    stack, arg2 = unwind(stack, assoc, infix[op], arg)
    # step 6
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
