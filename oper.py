import json


precs = {
    '+': 50,
    '*': 60,
    '^': 70
}

# 3 + 4 * 2 + 5
# ((3 + (4 * 2)) + 5)
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


def expr2(ts1, power):
    if len(ts1) == 1:
        return (ts1[0], [])
    elif len(ts1) == 0:
        raise ValueError('bad input!  need args separated by operators')
    fst, op, ts2 = ts1[0], ts1[1], ts1[2:]
    if precs[op] > power:
        right, ts3 = expr2(ts2, precs[op])
        return ({'op': op,
                 'left': fst,
                 'right': right},
                ts3)
    else: # low precedence operator --> already found left arg, now find right
        # return (fst, ts1[1:])
        return rightSide2(fst, ts1[1:])
        

def rightSide2(left, ts1):
    power = precs[ts1[0]]
    right, ts2 = expr2(ts1[1:], power)
    return ({'op': ts1[0],
             'left': left,
             'right': right},
            ts2)

def run(xs):
    tree, rest = expr(lambda x: x, xs, 8000)
    print json.dumps(tree, indent=4)
    print "rest: ", rest
