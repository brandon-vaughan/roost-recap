define([
  'socket',
  'jquery',
  'codemirror',
  '../vendors/mode/shell',
  '../vendors/mode/xml',
  '../vendors/mode/css',
  '../vendors/mode/javascript',
  '../vendors/mode/htmlmixed'
], function( socket, $, CM ) {

  var EditorBlock = function( elem, options, editorOptions ) {

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

    // Define Editor Options
    this.options.editor = {};

    // setup defaults
    for( var prop in EditorBlock.defaults.editor ) {
      this.options.editor[prop] = EditorBlock.defaults.editor[prop];
    }

    // get user options
    for( prop in editorOptions ) {
      this.options.editor[prop] = editorOptions[prop];
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
      lineHighlight: true
    }
  };

  
  /**
   * setup: cache and setup elemen attrs and prep for optional functions
   */
  EditorBlock.prototype.setup = function() {

    // get id of instance
    this.id = this.elem.attr('id');

    console.log(this.id);

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

    // When editor is changed send event to server
    this.editor.on("change", function() {
      instance.onChange();
    });

    // 
    socket.on("editor:update", function(data) {

      if ( data.id === instance.id ) {

        if ( data.value !== instance.editor.getValue() ) {
          instance.updateEditor(data.value);
        }
          

        if ( instance.options.livePreview )
          instance.updatePreview(data.value);
      }

    });

  };


  /**
   * onChange: on text change
   * @return {[type]} [description]
   */
  EditorBlock.prototype.onChange = function() {
    var changeData = {
      id: this.id,
      value: this.editor.getValue()
    };

    socket.emit('editor:change', changeData);

  };


  EditorBlock.prototype.updateEditor = function( newValue ) {

    this.editor.setValue( newValue );

  }


  /**
   * updatePreview: updates priview iframe with changed value
   * @trigger when editorblock is changed
   */
  EditorBlock.prototype.updatePreview = function( newValue ) {

    // get new editor value
    var editorValue = newValue ? newValue : this.editor.getValue();

    // write newValue to iframe
    this.preview.open();
    this.preview.write( editorValue );
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