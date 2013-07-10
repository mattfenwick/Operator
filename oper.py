import json


precs = {
    '+': 50,
    '*': 60,
    '^': 70
}


count = 0
def result(op, l, r):
    global count
    val = {'op': op, 
           'left': l, 
           'count': count,
           'right': r}
    count += 1
    return val


def expr(f, ts1, powers):
    if len(ts1) == 0:
        raise ValueError('bad input! empty')
    elif len(ts1) == 1:
        return f(ts1[0])
    fst, op, ts2 = ts1[0], ts1[1], ts1[2:]
    print 'powers: ', precs[op], powers
    # `fst` is the entire lhs of `op`; need to find `op`s rhs and remember the previous power(s) for later
    if precs[op] > powers[0]:                       # ignore ties
        print ' first branch'
        return expr(lambda x: f(result(op, fst, x)), ts2, [precs[op]] + powers)
    else: # `fst` **ends** the lhs of `op`; now we need to find `op`s rhs
        # this means we can ditch the top power b/c its operator is done
        print '  second branch'
        return expr(lambda x: result(op, f(fst), x), ts2, [precs[op]] + powers[1:])


def start(xs):
    fst, op, ys = xs[0], xs[1], xs[2:]
    return expr(lambda x: result(op, fst, x), ys, [precs[op]])


def run(xs):
    tree = start(xs)
    print json.dumps(tree, indent=4)
