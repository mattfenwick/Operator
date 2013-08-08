require(["views/ast", "views/rest", "views/status",
         "app/tokenizer", "app/parser", "app/languages",
         "views/parenthesized", "views/operators"], 
        function(AST, Rest, Status, Tk, Parser, L, Paren, Ops) {
    "use strict";
    
    var langs = {
            'python': L.python,
            'java'  : L.java,
            'test'  : L.test,
            'math'  : L.math,
            'new'   : new L.Language()
        },
        parser;
    
    // listeners needed:
    //   - language selection
    //   - operator table (later)
    //   - parse
    // output thingies:
    //   - `#operators tbody` -- operator table (when selecting a language, or when modifying operators)
    //   - don't want to do anything with #input -- just leave it alone
    //   - #parenthesized
    //   - #ast
    //   - #rest
    $(document).ready(function() {
        var status = new Status($("#status")),
            ast    = new AST($("#ast")),
            rest   = new Rest($("#rest")),
            paren  = new Paren($("#parenthesized")),
            ops    = new Ops($("#operators tbody"));
        
        function action(str) {
            var result, tree, remaining;
            try {
                console.log('input: ' + str);
                result = parser.expr(Tk(str));
                console.log(JSON.stringify(result));
                tree = result[0], remaining = result[1];
                console.log('looks good, I guess');
                status.display('success', 'everything worked fine I guess');
                paren.display(tree);
                ast.display(tree);
                // alert(rest + ' ' + JSON.stringify(rest));
                rest.display(remaining);
            } catch(e) {
                console.log('an error occurred: ' + e + JSON.stringify(e));
                status.display('error', JSON.stringify(e) + ' ' + e.message); // doesn't work on Error instances ???
                ast.display('');
            }
        }
        
        $("#input").bind('keydown', function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if( code === 13 ) {
                action($("#input").val());
            }
            return true;                                     // forgot why it has to return true
        });
        
        $("#language").change(function() {
            var langname = $("#language").val(),
                lang = langs[langname];
            // does this code deal with exceptions correctly?
            //   i.e. will any exceptions screw up the state of the app?
            ops.display(lang);
            parser = new Parser(lang);
        }).change();
    
    });
    
});
