require(["views/ast", "views/rest", "views/status",
         "app/tokenizer", "app/parser", "app/languages",
         "views/parenthesized"], 
        function(AST, Rest, Status, Tk, Parser, L, Paren) {
    "use strict";
    
    var parser = new Parser(L.test);    // for now, we'll hard-code this.  change it up later
    
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
            paren  = new Paren($("#parenthesized"));
        
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
	        if( code == 13 ) {                               // why isn't this `===`?
	            action($("#input").val());
	        }
	        return true;                                     // forgot why it has to return true
	    });
    
    });
    
});
