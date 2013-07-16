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
    new_stack, rest = stack, xs
    while True:
        fst = rest[0]
        if fst not in prefix:
            break
        new_stack = new_stack + [(fst + ' [prefix]', 'right', prefix[fst], [])]
        rest = rest[1:]
    return (new_stack, rest)

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

def parsePostfixes(stack, xs):
    new_stack, arg2, rest = stack, xs[0], xs
    while True:
        rest = rest[1:]
        if len(rest) == 0:
            break
        post = rest[0]
        if not post in postfix:
            break
        # pop any stack levels with a higher precedence than the current operator
        while len(new_stack) > 0:
            op1, assoc1, prec1, args1 = stack[-1]
            if postfix[post] > prec1:
                break
            # disallow mixed associativity if same precedence
            if postfix[post] == prec1 and assoc1 == 'right': # postfix operators are always left-associative
                raise ValueError('error -- equal precedence but different associativity')
            new_stack = new_stack[:-1]
            arg2 = node(op1, args1 + [arg2])
        arg2 = node(post + ' [postfix]', [arg2])
    return new_stack, rest, arg2

def expr(stack1, xs):
    """
    step 1: prefixes
    step 2: find operand
    step 3: postfixes
    step 4: if input is empty, call `done` to pop all pending stack levels
    step 5: input not empty, thus next token is the binary op
    step 6: pop stack as far as necessary, based on comparing precedences
            of pending operators to current op
    step 7: push new stack level for op
    """
    stack2, ys = parsePrefixes(stack1, xs)
    
    # step 2 and step 4 (sort of)
    if len(ys) == 1: # len == 0 case handled by parsePrefixes
        return done(stack2, ys[0])
    
    # step 3
    stack3, zs, arg = parsePostfixes(stack2, ys)
    
    # step 4 (again)
    if len(zs) == 0:
        return done(stack3, arg)
    
    # step 5
    op = zs[0]
    assoc = 'right' if op in rights else 'left'
    # steps 6 and 7
    stack4 = unwind(stack3, op, assoc, infix[op], [arg])
    return expr(stack4, zs[1:])


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
