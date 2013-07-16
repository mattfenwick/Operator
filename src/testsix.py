import unittest
from . import six

n = six.node
p = six.parse

class TextSix(unittest.TestCase):

    def testLoneOperand(self):
        self.assertEqual('3', p('3'))
    
    def testInfix(self):
        self.assertEqual(n('+', ['a', 'b']), p('a + b'))
    
    def testPrefix(self):
        self.assertEqual(n('! [prefix]', ['true']), p('! true'))
    
    def testPostfix(self):
        self.assertEqual(n('++ [postfix]', ['yy']), p('yy ++'))
    
    def testLeftAssociativity(self):
        self.assertEqual(n('+', [n('+', ['2', '3']), '4']), p('2 + 3 + 4'))
    
    def testRightAssociativity(self):
        self.assertEqual(n('=', ['x', n('=', ['y', 'z'])]), p('x = y = z'))
    
    def testInfixPrecedence(self):
        self.assertEqual(n('+', ['3', n('*', ['4', '5'])]), p('3 + 4 * 5'))
        self.assertEqual(n('+', [n('*', ['3', '4']), '5']), p('3 * 4 + 5'))
    
    def testPrefixInfixPrecedence(self):
        self.assertEqual(n('*', [n('++ [prefix]', ['x']), '3']), p('++ x * 3'))
        self.assertEqual(n('? [prefix]', [n('*', ['x', '3'])]), p('? x * 3'))
    
    def testInfixPostfixPrecedence(self):
        self.assertEqual(n('*', ['3', n('++ [postfix]', ['x'])]), p('3 * x ++'))
        self.assertEqual(n('? [postfix]', [n('*', ['3', 'x'])]), p('3 * x ?'))
        
    def testPrefixPostfixPrecedence(self):
        self.assertEqual(n('? [postfix]', [n('++ [prefix]', ['x'])]), p('++ x ?'))
        self.assertEqual(n('? [prefix]', [n('-- [postfix]', ['x'])]), p('? x --'))
    
    def testMixedAssociativity(self):
        cases = [
            ('infix-infix'   ,  'a Z b Y c'),
            ('infix-infix'   ,  'a Y b Z c'),
            ('prefix-postfix',  '? 3 ?'    ),
            ('prefix-infix'  ,  '++ x W 4' ),
            ('infix-postfix' ,  '3 Z q --' )
        ]
        for (message, string) in cases:
            raised = True
            e = ''
            try:
                print message
                p(string)
                raised = False
            except Exception as e:
                pass
            
            print message, string
            self.assertTrue(raised)

    
    def testPrefixVsInfix(self):
        self.assertEqual(n('-', ['3',
                                 n('+ [prefix]', [n('- [prefix]', ['2'])])]), 
                         p('3 - + - 2'))
    
    def testPrefixVsPostfix(self):
        self.assertEqual(n('++ [prefix]', [n('++ [postfix]', ['x'])]),
                         p('++ x ++'))
