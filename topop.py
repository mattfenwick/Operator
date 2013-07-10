import json


def node(op, l, r):
    return {'op': op, 'left': l, 'right': r}


precs = {
    '+': 50,
    '*': 60,
    '^': 70
}


def expr(stack, xs):
    print 'calling expr: ', stack, xs
    if len(xs) == 0:
        raise ValueError('oops, empty input')
    elif len(xs) == 1:
        temp = xs[0]
        for (op, l) in stack[::-1]: # iterate through stack frames in reverse order
            temp = node(op, l, temp)
            print 'dumping stack ...' , op, l
        return temp
    fst, op, ys = xs[0], xs[1], xs[2:]
# what if stack is empty?
    scratch = fst
    while True:
        if len(stack) == 0:
            break # wow, this is ghetto.  the length check only should be performed once!
        old_op, old_arg = stack[-1]
        if precs[op] > precs[old_op]:
            break
        stack.pop()
        scratch = node(old_op, old_arg, scratch)
        print 'scratch: ', scratch
    # now we perform the push
    new_stack = stack + [(op, scratch)]
    print 'new stack:', new_stack
    return expr(new_stack, ys)


def run(ys):
    v = json.dumps(expr([], list(ys)), indent=4)
    print v
#    return v
