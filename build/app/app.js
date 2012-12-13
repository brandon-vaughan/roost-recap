require([
  
  'jquery',
  'prez',
  'editorblock',
  'auth',
], function( $, Prez, EditorBlock, Auth ) {

  /*==========================================
  =            Prezentation Class            =
  ==========================================*/
  
  // Initialize Prezentation
  var prez = new Prez($('#prez'));
  
  /*-----  End of Prezentation Class  ------*/
  
  /*=====================================
  =            Editor Blocks            =
  =====================================*/
  
  var $htmlCode = $('#code-html');
  var htmlEditor = new EditorBlock( $htmlCode, { livePreview: true } );

  var $javascriptCode = $('#code-javascript');
  var javascriptEditor = new EditorBlock( $javascriptCode, {},{ mode: 'javascript' } );
  
  
  /*-----  End of Editor Blocks  ------*/
  
  var Auth = new Auth();
  window.Auth = Auth;
  
  
});