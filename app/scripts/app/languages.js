define([], function () {
    "use strict";

    var python = {
	        'prefix': {
	            '+'  :  70,
	            '-'  :  70,
	            '~'  :  70,
	            'not': -10
	        },
	        'infix': {
	            '**': [80, 'right'],
	            '*': [60, 'left'],
	            '+': [50, 'left']
	        },
	        'mixfix': {
	            'if': [0, 'left', 'else']
	        },
	        'postfix': {}
        },
       
        java = {
            'postfix': {
                '++': 120, '--': 120
            },
            'prefix': {
                '++': 110, '--': 110, '-': 110, '+': 110, '!': 110, '~': 110
            },
            'mixfix': {
                '?' : [0,  'left' ,  ':']
            },
            'infix': {
                '*'  : [100, 'left' ],  '/' : [100, 'left'], 
                '%'  : [100, 'left' ],
                '+'  : [90,  'left' ],  '-' : [90,  'left'],
                '<<' : [80,  'left' ],  '>>': [80,  'left'], 
                '>>>': [80,  'left' ],
                '<'  : [70,  'left' ],  '>' : [70,  'left'],  
                '<=' : [70,  'left' ],  '>=': [70,  'left'],  'instanceof': [70, 'left'],
                '==' : [60,  'left' ],  '!=': [60,  'left'],
                '&'  : [50,  'left' ],
                '^'  : [40,  'left' ],
                '|'  : [30,  'left' ],
                '&&' : [20,  'left' ],
                '||' : [10,  'left' ],
                '='  : [-10, 'right'],  '+='  : [-10, 'right'], 
                '-=' : [-10, 'right'],  '*='  : [-10, 'right'],
                '/=' : [-10, 'right'],  '%='  : [-10, 'right'], 
                '&=' : [-10, 'right'],  '^='  : [-10, 'right'],
                '|=' : [-10, 'right'],  '<<=' : [-10, 'right'], 
                '>>=': [-10, 'right'],  '>>>=': [-10, 'right']
            }
        },
       
        math = {
            'postfix': {},
            'prefix': {'+': 110, '-': 110, '!': 110},
            'infix': {
                '+': [90,  'left'  ], '-': [90,  'left'],
                '*': [100, 'left'  ], '/': [100, 'left'],
                '^': [110, 'right' ],
                '=': [50,  'right' ] // uh, not really sure about this one
            },
            'mixfix': {}
        },
        
        test = {
            'postfix': {
                '++': 120, '--': 120,
                '@': 50
            },
            'prefix': {
                '++': 110, '--': 110, '-': 110, '+': 110, '!': 110, '~': 110,
                '@': 50,
            },
            'mixfix': {
                '?' : [0,  'left' ,  ':'   ],
                'if': [0,  'left' ,  'else'],
                '::': [0,  'right',  '??'  ]
            },
            'infix': {
                'R120'  : [120, 'right'],  'L120' : [120, 'left'],
                'R110'  : [110, 'right'],  'L110' : [110, 'left'],
                '*'  : [100, 'left' ],  '/' : [100, 'left'], 
                '%'  : [100, 'left' ],
                '+'  : [90,  'left' ],  '-' : [90,  'left'],
                '<<' : [80,  'left' ],  '>>': [80,  'left'], 
                '>>>': [80,  'left' ],
                '<'  : [70,  'left' ],  '>' : [70,  'left'],  
                '<=' : [70,  'left' ],  '>=': [70,  'left'],  'instanceof': [70, 'left'],
                '==' : [60,  'left' ],  '!=': [60,  'left'],
                '&'  : [50,  'left' ],
                '^'  : [40,  'left' ],
                '|'  : [30,  'left' ],
                '&&' : [20,  'left' ],
                '||' : [10,  'left' ],
                '='  : [-10, 'right'],  '+='  : [-10, 'right'], 
                '-=' : [-10, 'right'],  '*='  : [-10, 'right'],
                '/=' : [-10, 'right'],  '%='  : [-10, 'right'], 
                '&=' : [-10, 'right'],  '^='  : [-10, 'right'],
                '|=' : [-10, 'right'],  '<<=' : [-10, 'right'], 
                '>>=': [-10, 'right'],  '>>>=': [-10, 'right'],
                '^^' : [-20, 'left' ]
            }
        };

    function Language(operators) {
        this.prefix = {};
        this.infix = {};
        this.mixfix = {};
        this.postfix = {};
        var name, temp;
        if ( operators ) {
            for ( name in operators.prefix ) {
                this.addPrefix(name, operators.prefix[name]);
            }
            temp = operators.infix;
            for ( name in temp ) {
                this.addInfix(name, temp[name][0], temp[name][1]);
            }
            temp = operators.mixfix;
            for ( name in temp ) {
                this.addMixfix(name, temp[name][2], temp[name][0], temp[name][1]);
            }
            for ( name in operators.postfix ) {
                this.addPostfix(name, operators.postfix[name]);
            }
        }
    }
    
    Language.prototype.checkName = function(name) {
        if ( name in this.infix || name in this.mixfix || name in this.postfix ) {
            throw new Error('infix operator name ' + name + ' already used as in/mix/post-fix operator');
        }
    };
    
    Language.prototype.addPrefix = function(name, prec) {
        if ( name in this.prefix ) {
            throw new Error('prefix operator name ' + name + ' already used');
        }
        this.prefix[name] = prec;
    };
    
    Language.prototype.addInfix = function(name, prec, assoc) {
        this.checkName(name);
        this.infix[name] = [prec, assoc];
    };
    
    Language.prototype.addMixfix = function(name1, name2, prec, assoc) {
        this.checkName(name1);
        this.checkName(name2); // what checks does name2 need?  
        this.mixfix[name1] = [prec, assoc, name2];
    };
    
    Language.prototype.addPostfix = function(name, prec) {
        this.checkName(name);
        this.postfix[name] = prec;
    };

    return {
        'java'     :  new Language(java)    ,
        'python'   :  new Language(python)  ,
        'math'     :  new Language(math)    ,
        'test'     :  new Language(test)    ,
        'Language' :  Language
    };

});
