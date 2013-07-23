import json

# assumptions
# 1. prefix operators always associate to the right
#    `! ! ! x` => `(! (! (! x)))`
# 2. postfix operators always associate to the left
#    `x ++ ++ ++` => `(((x ++) ++) ++)`
# 3. each infix/mixfix operator may either always associate
#    to the left, or always associate to the right
#    `x + y + z` => `((x + y) + z)`
#    `a ^ b ^ c` => `(a ^ (b ^ c))`
# 4. an operator may be both infix and prefix, or
#    prefix and postfix, but not infix and postfix
# 5. an operator may also be an operand -- i.e.
#    `& & &` -- but not always ... not sure when
# 6. if precedences are equal, associativities must
#    also be equal
     
# stack frame fields:  (operator name, associativity, precedence, list of args)

postfix = {
    '++': 120, '--': 120,
    '@': 50
}

prefix = {
    '++': 110, '--': 110, '-': 110, '+': 110, '!': 110, '~': 110,
    '@': 50,
}

mixfix = {
    '?' : (0,  'left' ,  ':'   ),
    'if': (0,  'left' ,  'else'),
    '::': (0,  'right',  '??'  )
}

infix = {
    'Z'  : (120, 'right'),  'Y' : (120, 'left'),
    'X'  : (110, 'right'),  'W' : (110, 'left'),
    '*'  : (100, 'left' ),  '/' : (100, 'left'), 
    '%'  : (100, 'left' ),
    '+'  : (90,  'left' ),  '-' : (90,  'left'),
    '<<' : (80,  'left' ),  '>>': (80,  'left'), 
    '>>>': (80,  'left' ),
    '<'  : (70,  'left' ),  '>' : (70,  'left'),  
    '<=' : (70,  'left' ),  '>=': (70,  'left'),  'instanceof': (70, 'left'),
    '==' : (60,  'left' ),  '!=': (60,  'left'),
    '&'  : (50,  'left' ),
    '^'  : (40,  'left' ),
    '|'  : (30,  'left' ),
    '&&' : (20,  'left' ),
    '||' : (10,  'left' ),
    '='  : (-10, 'right'),  '+='  : (-10, 'right'), 
    '-=' : (-10, 'right'),  '*='  : (-10, 'right'),
    '/=' : (-10, 'right'),  '%='  : (-10, 'right'), 
    '&=' : (-10, 'right'),  '^='  : (-10, 'right'),
    '|=' : (-10, 'right'),  '<<=' : (-10, 'right'), 
    '>>=': (-10, 'right'),  '>>>=': (-10, 'right'),
    '^^' : (-20, 'left' )
}


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

def parseInfix(stack, arg, xs):
    op = xs[0]
    (prec, assoc) = infix[op]
    stack, arg2 = unwind(stack, assoc, prec, arg)
    stack = stack + [(op, assoc, prec, [arg2])]
    xs = xs[1:]
    return (stack, xs)

def parseMixfix(stack, arg, xs):
    op = xs[0]
    xs = xs[1:]
    (prec, assoc, second) = mixfix[op]
    stack, arg2 = unwind(stack, assoc, prec, arg)
    (arg3, xs) = expr(xs)
    if xs[0] != second:
        raise ValueError('mixfix operator ' + op + ': expected "' + second + '"')
    stack = stack + [(op + ',' + second + ' [mixfix]', assoc, prec, [arg2, arg3])]
    xs = xs[1:]
    return (stack, xs)

def expr(xs):
    """
    step 1: prefixes
    step 2: operand
    step 3: postfixes
    step 4: binary op
    step 5: pop stack (if necessary)
    step 6: push new stack frame
    """
    stack = []
    while True:
        stack, xs = parsePrefixes(stack, xs)
        if len(xs) == 1: # len == 0 case handled by parsePrefixes
            last = xs[0]
            xs = xs[1:]
            break
    
        stack, xs, arg = parsePostfixes(stack, xs[0], xs[1:])
        if len(xs) == 0:
            last = arg
            break
    
        op = xs[0]
        if op in infix:
            stack, xs = parseInfix(stack, arg, xs)
        elif op in mixfix:
            stack, xs = parseMixfix(stack, arg, xs)
        else:
            last = arg
            break

    return (done(stack, last), xs)


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
    return expr(ys.split())

def run(ys):
    (v, rest) = parse(ys)
#    print json.dumps(v, indent=4)
    print pp(v, 0)
    print 'rest: ', rest
