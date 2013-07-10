import json


def node(op, l, r):
    return {'op': op, 'left': l, 'right': r}


precs = {
    '+': 50,
    '*': 60,
    '^': 70
}

def done(stack, last):
    temp = last
    for (op, l) in stack[::-1]: # iterate through stack in reverse
        temp = node(op, l, temp)
        print 'stack frame: ', op, l
    return temp

def unwind(stack, op2, arg2):
    scratch = arg2
    # pop any stack levels with a higher prec than the current operator
    while len(stack) > 0:
        op1, arg1 = stack[-1]
        if precs[op2] > precs[op1]:
            break
        stack.pop()
        scratch = node(op1, arg1, scratch)
    # now we perform the push
    return stack + [(op2, scratch)]

def expr(stack, xs):
    print 'calling expr: ', stack, xs
    if len(xs) == 0:
        raise ValueError('oops, bad input')
    elif len(xs) == 1:
        return done(stack, xs[0])
    fst, op, ys = xs[0], xs[1], xs[2:]
    new_stack = unwind(stack, op, fst)
    return expr(new_stack, ys)


def run(ys):
    v = json.dumps(expr([], list(ys)), indent=4)
    print v
#    return v
