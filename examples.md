# Examples #


## _ op _ ##

    a + b
    

## op _ ##

    x ++


## _ op ##

    ++ x


## _ op1 _ op2 _ ##

    a ? b : c


## _ op1 _ op2 ##

    x [ y ]


## op1 _ op2 _ ##

no example
    

## op1 . op2 _ ##

prefix operator with some parameterizable grammar rules
on the inside

Python example: 
 - op1 = "lambda"
 - . = ,-separated list of variables
 - op2 = ":"
 _ = expression

        lambda x, y: x + y
    
Java example:
 - op1 = "("
 - . = a java type
 - op2 = ")"
 - _ = an expression

        (float) x
