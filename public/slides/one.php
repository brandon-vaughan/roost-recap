<article id="one" class="on-display">

  <div class="backdrop"></div>

  <div class="copy">
    
    <h1>Roost Recap <span>A brain dump from Boston training</span></h1>
    
  </div>

  <div class="scene">
    
    <div class="frame preview" data-frame="one">

      <textarea class="code" data-code="html" name="code">
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>HTML5 canvas demo</title>
    <style>p {font-family: monospace;}</style>
  </head>
  <body>
    <p>Canvas pane goes here:</p>
    <canvas id="pane" width="300" height="200"></canvas>
    <script>
      var canvas = document.getElementById('pane');
      var context = canvas.getContext('2d');

      context.fillStyle = 'rgb(250,0,0)';
      context.fillRect(10, 10, 55, 50);

      context.fillStyle = 'rgba(0, 0, 250, 0.5)';
      context.fillRect(30, 30, 55, 50);
    </script>
  </body>
</html></textarea>
    
      <iframe id="html-preview"></iframe>
    
    </div>

  </div>

</article>
