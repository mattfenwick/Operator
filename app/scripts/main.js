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
            ops    = new Ops($("#prefix tbody"), $("#infix tbody"), 
                             $("#mixfix tbody"), $("#postfix tbody")),
            model  = new Model();
        
        model.listen('set-language', function() {
            ops.display(model.getOperators());
            // use ops, get the data from the model, send it to ops for displaying
        });
        
        model.listen('change-op', function() {
            // ????????????????????
        });
        
        model.listen('remove-op', function() {
            // ?????
        });
        
        model.listen('reset-op', function() {
            // look up the attribute values in the model
            // then reset them in the html
            // how do I identify the correct row?
        });
        
        model.listen('new-op', function() {
            // draw a new row for op (??) 
            // and create another `new` row ... or wait, can I just insert rows before
            // the `new` row, or perhaps put them in separate tbody elements?
            // how did I solve this problem in the financeplanner app?
        });
        
        model.listen('op-error', function() {
            // is the only one to worry about the duplicate name problem?
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
            model.setLanguage($("#language").val());
        }).change();

        $(document).on('click', ".save", function() { // use `.on` so that future .save elements also have this listener
            /*
            // how do I access the parent row, so that I can grab stuff from its $.data business?
            var parent = $(this).parent(),  // what is `this` bound to -- ??
                name = parent.data().name,
                fixity = parent.data().fixity,
                newname = $(".name", parent).val(),
                newfixity = $(".fixity", parent).val(),
                newprec = $(".prec", parent).val(),
                newassoc = $(".assoc", parent).val();
            model.changeOp(name, fixity, newname, newfixity, newprec, newassoc);
            questions:
             1. will this work for all operators, or just infix (i.e. do I have to do separate versions for each?)
                can I create a generic, data-driven version based off of, I don't know, reading class names or
                something from the child `td` elements of the parent row?
            */
        });
        
        $(document).on('click', '.reset', function() {
            // call a model method ??
        });
        
        $("#newop").click(function() {
            // save the operator in the model
        });

    });
    
});
