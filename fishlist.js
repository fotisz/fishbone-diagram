;(function(d3, marked, CodeMirror){
  "use strict";
  
  d3.fishlist = function(){
    var _editor,
      _fb = d3.fishbone(),
      _data = {},
      _container,
      _started,
      _lexer = new marked.Lexer();
    
    var api = function($){
      _container = $;
      _change();
    };
    
    api.editor = function(_){
      if(!_){ return _editor; }
      _editor = _;
      _editor.on("change", _change);
      return api;
    };
    
    function _change(){
      _fb.force().stop();
      var stack = [_data = {}],
        tokens = _lexer.lex(_editor.getValue()),
        child;

      tokens.forEach(function(t){
        switch(t.type){
          case "list_start":
            stack[0].children = [];
            break;
          case "list_item_start":
            child = {};
            stack[0].children.push(child);
            stack.unshift(child);
            break;
          case "text":
            stack[0].name = t.text;
            break;
          case "list_item_end":
            stack.shift();
            break;
        }
      });
      _container
        .datum(_data.children[0])
        .call(_fb);
      
      _fb.force().start();
    };
    
    api.force = _fb.force;
    api.fishbone = function(){ return _fb; };
    
    return api;
