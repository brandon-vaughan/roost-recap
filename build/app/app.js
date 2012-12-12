require([
  
  'jquery',
  'prez',
  'editorblock'

], function( $, Prez, EditorBlock ) {

  /*==========================================
  =            Prezentation Class            =
  ==========================================*/
  
  // Initialize Prezentation
  var prez = new Prez($('#prez'));
  
  /*-----  End of Prezentation Class  ------*/
  
  /*=====================================
  =            Editor Blocks            =
  =====================================*/
  
  var $htmlCode = $('textarea').data('code', 'html');
  var htmlEditor = new EditorBlock( $htmlCode, { livePreview: true } );
  
  
  /*-----  End of Editor Blocks  ------*/
  
  
  
  
});