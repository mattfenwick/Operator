require(["views/ast", "views/rest", "views/status",
         "views/parenthesized", "views/operators",
         "app/model"], 
        function(AST, Rest, Status, Paren, Ops, Model) {
    "use strict";
    
    $(document).ready(function() {
        var status = new Status($("#status")),
            ast    = new AST($("#ast")),
            rest   = new Rest($("#rest")),
            paren  = new Paren($("#parenthesized")),
            ops    = new Ops($("#operators")),
            model  = new Model();
        
        model.listen('save-ops', function() {
            // does anything have to happen?
            // maybe remove a css class or something
            $("#operators").removeClass('changed');
        });
        
        model.listen('reset-ops', function() {
            ops.display(model.getOperators());
            $("#operators").removeClass('changed');
        });
        
        model.listen('op-error', function(message) {
            status.display('error', message);
        });
        
        // is there any advantage to separating these out into 3 listeners ??
        model.listen('parse-success', function(tree, remaining) {
            paren.display(tree);
            ast.display(tree);
            rest.display(remaining);
        });
        
        model.listen('parse-success', function(_1, _2) {
            status.display('success', 'everything worked fine I guess');
        });
        
        model.listen('parse-error', function(e) {
            status.display('error', JSON.stringify(e) + ' ' + e.message);
        });
        
        
        // these listeners are for things happening on the actual web page
        // put these after the model listeners because at
        //   least one actually does something to the model
        
        $("#input").bind('keydown', function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if ( code === 13 ) {
                model.parse($("#input").val());
            }
            return true;                                     // forgot why it has to return true
        });
        
        $("#language").change(function() {
            model.displayLanguage($("#language").val());
        }).change();
        
        $("#operators").bind('keydown', function(e) {
            // a bit overexcited since it adds the class even when no change occurs,
            // but it's better than the `change` event because that doesn't update until the focus leaves
            $("#operators").addClass('changed');
        });

        $("#saveops").click(function() {
            model.setOperators($("#operators").val());
        });
        
        $("#resetops").click(function() {
            model.resetOperators();
        });
        
    });
    
});
