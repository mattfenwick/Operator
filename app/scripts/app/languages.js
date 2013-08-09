define([], function () {
    "use strict";

    function operators() {
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
	            'prefix': {'+': 120, '-': 120, '!': 120},
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
	
	    return {
	        'java'     :  java    ,
	        'python'   :  python  ,
	        'math'     :  math    ,
	        'test'     :  test
	    };
	}
	
	return operators;

});
