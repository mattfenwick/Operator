## Operator parsing issues ##

### Precedence ###

- which operator binds tighter?  Is

        1 + 2 * 3
  
  parsed as `1 + (2 * 3)` or `(1 + 2) * 3`?
  If precedences are different, associativity does not come into play.
 
### Associativity ###

Only matters when precedences are equal.

 - left vs. right:  `1 + 2 + 3` parsed as `1 + (2 + 3)` or `(1 + 2) + 3`?
 
 - non-associativity:  `1 @@ 2 @@ 3` where `@@` is a non-associative operator:  parse error
 
 - mixed associativity, same precedence:  `x = 3 + 1` or `2 + 3 = x`, assuming that `+` and `=`
   have the same precedence but opposite associativities.  **Probably should result in parse
   error.**
 
 - prefix vs. postfix
  
        ! x ++
        
   Is it `(!x) ++` or `!(x++)`?  (Probably the latter -- but I guess it should be resolved by precedences)


### Prefix and Postfix ###

 - prefix vs. infix:  what does each use of `-` mean?
 
        3 - - - -- q
 
 - prefix vs. postfix:  what does each use of `++` mean?
 
        ++ x + ++ y * z ++
 
 - associativity of prefix operators:  right-only (???)
 
        ! ! ! ! x
 
 - precedence of prefix vs. postfix:  irrelevant, since can't do both on same operand (???)
   i.e. can't do:
   
        ++ x ++
 
 - associativity of postfix operators:  none, b/c only one allowed?  i.e. can't do
 
        x ++ ++
        
   Counterpoint:  C and C++ [might](http://en.wikipedia.org/wiki/Operators_in_C_and_C%2B%2B)
   support multiple postfix operators.
 
 - low-precedence postfix:  parse this:
   
        3 + x ++ * 5
   
   as `((3 + x) ++) * 5`, assuming `++` is lower precedence than `+`?
   
    - `(3 + x) ++` doesn't make sense
    - I haven't found any low-precedence postfix operators in practice
    - would the `++` really interfere with `*`?


### Ternary ###

 - unsolved: how to parse the ternary ` ? : ` operator
 
