define([
  'jquery',
  'codemirror',
  '../vendors/mode/xml',
  '../vendors/mode/css',
  '../vendors/mode/javascript',
  '../vendors/mode/htmlmixed'
], function( $, CM ) {

  var EditorBlock = function( elem, options ) {

    if ( !elem ) {
      return;
    }

    // setup elem
    this.elem = elem;

    // Define Options
    this.options = {};

    // setup defaults
    for( var prop in EditorBlock.defaults ) {
      this.options[prop] = EditorBlock.defaults[prop];
    }

    // get user options
    for( prop in options ) {
      this.options[prop] = options[prop];
    }

    this.setup();

  };

  /**
   * defaults: define default options
   * @type {Object}
   */
  EditorBlock.defaults = {
    hasControls: false,
    livePreview: false,
    editor: {
      mode: 'text/html',
      tabMode: 'indent',
      theme: 'prism',
      lineNumbers: true,
      lineHighlight: true,
      autofocus: true
    }
  };

  
  /**
   * setup: cache and setup elemen attrs and prep for optional functions
   */
  EditorBlock.prototype.setup = function() {

    // get id of instance
    this.id = this.elem.data('code');

    // Instanciate CodeMirror
    this.editor = CM.fromTextArea( this.elem[0], this.options.editor );

    if ( this.options.livePreview ) {

      // get and cache preview iframe ( id = editorid-preview )
      this.previewFrame = document.getElementById( this.id + '-preview' );
      this.preview =  this.previewFrame.contentDocument ||  this.previewFrame.contentWindow.document;

      // load updatePreview for initial view;
      this.updatePreview();

    }

    // Queue bindings
    this.bindings();

    // Add lineHighlight
    if ( this.options.editor.lineHighlight ) this.lineHighlight();

  };


  /**
   * bindings: Queue various event bindings
   * @return {[type]} [description]
   */
  EditorBlock.prototype.bindings = function() {

    var instance = this;

    this.editor.on("change", function() {
      instance.onChange();
      instance.updatePreview();
    });

  };


  /**
   * onChange: on text change
   * @return {[type]} [description]
   */
  EditorBlock.prototype.onChange = function() {
    console.log('on change...');
  };


  /**
   * updatePreview: updates priview iframe with changed value
   * @trigger when editorblock is changed
   */
  EditorBlock.prototype.updatePreview = function() {

    // get new editor value
    var newValue = this.editor.getValue();
    
    // write newValue to iframe
    this.preview.open();
    this.preview.write( newValue );
    this.preview.close();

  };

  /**
   * lineHighlight: Add activeline class to current line
   */
  EditorBlock.prototype.lineHighlight = function() {
    var editor = this.editor;
    var hlLine = editor.addLineClass(0, "background", "activeline");
    this.editor.on("cursorActivity", function() {
      var cur = editor.getLineHandle(editor.getCursor().line);
      if (cur != hlLine) {
        editor.removeLineClass(hlLine, "background", "activeline");
        hlLine = editor.addLineClass(cur, "background", "activeline");
      }
    });
  };

  return EditorBlock;

});