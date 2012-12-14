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
      lineHighlight: true,
      readOnly: true
    }
  };

  
  /**
   * setup: cache and setup elemen attrs and prep for optional functions
   */
  EditorBlock.prototype.setup = function() {

    // get id of instance
    this.id = this.elem.attr('id');

    // get toolbar
    this.toolbar = $('#' + this.id + '-toolbar');

    // Instantiate CodeMirror
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

    // Catch instance for use in scope
    var instance = this;

    var delay;

    // When editor is changed send event to server
    this.editor.on("change", function() {
      clearTimeout(delay);
      delay = setTimeout(function() {
        instance.onChange();
      }, 300);
      
    });

    // Listen for editor updates 
    socket.on("editor:update", function(data) {

      if ( data.id === instance.id ) {

        if ( !Auth.isHost() && data.value !== instance.editor.getValue() ) {
          instance.updateEditor(data.value);
        }

        if ( instance.options.livePreview )
          instance.updatePreview(data.value);
      }

    });

    // Listen for welcoming host
    socket.on("editor:welcomehost", function(data) {
      instance.grantAccess();
    });

    // Listen for Edit Mode
    this.toolbar.find('a.edit').on('click', function() {
      instance.requestEditMode();
      return false;
    });

    // Listen for request guest access
    socket.on('editor:requestaccess', function(request) {
      instance.hostConfirmAccess(request);
    });

    // Listen for welcoming guest
    socket.on('editor:welcomeguest', function(request) {
      if ( instance.id === request.editorid ) {
        instance.grantAccess();
      }
    });

    // Listen for declining guest
    socket.on('editor:declineguest', function(request) {
      if ( instance.id === request.editorid ) {
        instance.declineGuestAccess();
      }
    });
  };


  /**
   * requestEditMode: send request to host to access edit mode
   * @return {event} requesteditmode
   */
  EditorBlock.prototype.requestEditMode = function() {
    var request = { editorid: this.id }
    this.toolbar.find('.message').text('requesting editor...').addClass('pulse');
    socket.emit('editor:guestrequest', request);

  };

  EditorBlock.prototype.hostConfirmAccess = function( request ) {

    if ( request.editorid === this.id ) {
      var access = confirm('Grant guest access?');
      if ( access ) {
        socket.emit('editor:guestapproved', request);
      } else {
        socket.emit('editor:guestdeclined', request);
      }
    }
  }


  /**
   * onChange: emit editor:change event
   * @return { obj } [instance id, current editor value]
   */
  EditorBlock.prototype.onChange = function() {
    var changeData = {
      id: this.id,
      value: this.editor.getValue()
    };
    socket.emit('editor:change', changeData);

  };

  EditorBlock.prototype.grantAccess = function( data ) {

    // Instantiate CodeMirror
    this.editor.setOption('readOnly', false);

    if ( this.options.livePreview ) {
      // load updatePreview for initial view;
      this.updatePreview();
    }

  };

  EditorBlock.prototype.declineGuestAccess = function( request ) {
    this.toolbar.find('.message').text('declined; please try again in 5 min').removeClass('pulse');
  }

  /**
   * updateEditor: Update the editor with new value
   * @param  { string } newValue [ full string replace for editor ]
   */
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