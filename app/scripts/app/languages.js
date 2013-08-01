define([], function () {
    "use strict";

    var java = {},
        python = {},
        math = {},
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
			'infix' {
			    'Z'  : [120, 'right'],  'Y' : [120, 'left'],
			    'X'  : [110, 'right'],  'W' : [110, 'left'],
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


    return {
        'java'    :  java,
        'python'  :  python,
        'math'    :  math,
        'test'    :  test
    };

});
