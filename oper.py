import json


precs = {
    '+': 50,
    '*': 60,
    '^': 70
}


def expr(f, ts1, power):
    if len(ts1) == 0:
        raise ValueError('bad input! empty')
    elif len(ts1) == 1:
        return (f(ts1[0]), [])
    fst, op, ts2 = ts1[0], ts1[1], ts1[2:]
    # keep parsing this expression until the precedence < power
    print 'powers: ', precs[op], power
    if precs[op] > power: # hmm, pretending like there's no ties
        print ' first branch'
        # return expr(lambda x: {'op': op, 'left': f(fst), 'right': x}, ts2, precs[op])
        return expr(lambda x: f({'op': op, 'left': fst, 'right': x}), ts2, precs[op])
    else: # now have to find right side arg of op
        print '  second branch'
        left = f(fst)
        right, ts3 = expr(lambda x: x, ts2, precs[op])
        return ({'op': op, 'left': left, 'right': right}, ts3)


def run(xs):
    tree, rest = expr(lambda x: x, xs, 8000)
    print json.dumps(tree, indent=4)
    print "rest: ", rest
