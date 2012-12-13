define(['jquery', 'socket'], function( $, socket ) {


  // -------------------------- Slider -------------------------- //
  var Modernizr = window.Modernizr;
  var isTransition = Modernizr.csstransitions;

  function Prez(elem, options) {

    if ( !elem ) {
      return;
    }

    // Define Options
    this.options = {};

    // setup defaults
    for( var prop in Prez.defaults ) {
      this.options[prop] = Prez.defaults[prop];
    }

    // get user options
    for( prop in options ) {
      this.options[prop] = options[prop];
    }

    // get slide effect ( fade or slide )
    this.effect = this.options.effect;
    this.duration = this.options.duration;

    // default slide animations
    this.slide = {
      onDisplay: { left: 0, opacity: 1 },
      past: { left: '-100%', opacity: 0 },
      coming: { left: '100%', opacity: 0 }
    };

    // Setup Variables
    this.prez = elem;
    this.deck = this.prez.find('#deck');
    this.slides = this.deck.find('article');
    this.nav = this.prez.find('#nav');

    // get movement type ( transition or callback )
    this.movement = isTransition ? 'transition' : 'animate';

    // Build simple deck and frame array for class injection
    this.slidesIndex = ['one'];
    this.propsIndex = ['','one','two'];

    this.setup();

  }

  Prez.defaults = {
    effect: 'slide',
    autoPlay: false,
    duration: 1000
  };

  Prez.prototype.setup = function() {

    this.$onDisplay = $('#one');
    this.onDisplay = 0;
    this.onStage = 0;

    // inject state class
    this.slides.addClass('is-' + this.movement);

    // Queue key state changes
    this.bindings();

  };


  Prez.prototype.bindings = function() {

    var instance = this;
    var socketInstance = socket;

    $(document).keyup(function(e){
      // Move Slide
      if ( Auth.isHost() && !e.shiftKey && e.altKey && ( e.keyCode === 3 || e.keyCode === 34 ) ) {

        var direction = e.keyCode === 34 ? 'next' : 'prev';
        instance.move(direction);
        socketInstance.emit('prez:changeslide', { direction: direction, onDisplay: instance.onDisplay } );
        return false;
      }

      // Move Props
      if ( Auth.isHost() && e.shiftKey && e.altKey && ( e.keyCode === 33 || e.keyCode === 34 ) ) {

        var direction = e.keyCode === 34 ? 'next' : 'prev';
        instance.moveFrames(direction);
        socketInstance.emit('prez:changeframe', { direction: direction, onStage: instance.onStage } );
        return false;
      }

    });

    socket.emit('prez:getcurrent');

    socket.on('prez:gotocurrent', function(data) {

      if ( data.onDisplay !== instance.onDisplay ) {

        instance.onDisplay = data.onDisplay;  
        instance.move();
      
      }
      
      if ( data.onStage !== instance.onStage ) {
        instance.onStage = data.onStage;
        instance.moveFrames();
      }

    });

    socket.on('prez:updateslide', function(data) {
      instance.move(data.direction);
    });

    socket.on('prez:updateframe', function(data) {
      instance.moveFrames(data.direction);
    });

  };

  Prez.prototype.move = function(direction) {

    this.curClass = this.slidesIndex[this.onDisplay];

    if ( !direction ) {
      this.index = this.onDisplay;
    } else {
      this.index = direction === 'next' ? (this.onDisplay + 1) : (this.onDisplay - 1);
    }

    this.onDisplay = ( this.index + this.slidesIndex.length ) % this.slidesIndex.length;

    this.moveClass = this.slidesIndex[this.onDisplay];

    if ( this.moveClass !== this.curClass ) {
      this.pastClass = this.slidesIndex[( ( this.onDisplay - 1 ) + this.slidesIndex.length ) % this.slidesIndex.length];
      this.comingClass = this.slidesIndex[( ( this.onDisplay + 1 ) + this.slidesIndex.length ) % this.slidesIndex.length];

      // Assign Classes
      this.deck.removeClass(this.curClass).addClass(this.moveClass);

      // Reset on display
      this.slides.removeClass('on-display').removeClass('just-past').removeClass('coming-up');

      // Select elements
      this.$onDisplay = $('#'+this.moveClass);
      this.$past = $('#'+this.pastClass);
      this.$coming = $('#'+this.comingClass);

      this.$onDisplay.addClass('on-display');
      this.$past.toggleClass('just-past');
      this.$coming.toggleClass('coming-up');

      // Animate move if no transition
      if ( !isTransition ) {
        this.animate( this.effect );
      }

      // Reset Stage for props
      this.onStage = 0;

    }

  };

  Prez.prototype.moveFrames = function(direction) {

    this.curpropClass = this.propsIndex[this.onStage];

    if ( !direction ) {
      this.propIndex = this.onStage;
    } else {
      this.propIndex = direction === 'next' ? (this.onStage + 1) : (this.onStage - 1);
    }

    this.onStage = ( this.propIndex + this.propsIndex.length ) % this.propsIndex.length;

    this.propClass = this.propsIndex[this.onStage];

    // Assign Classes
    this.$onDisplay.find('.scene').removeClass(this.curpropClass).addClass(this.propClass);

  };

  Prez.prototype.animate = function() {

    // queue up jquery objects and animate them via the effecttype object
    this.$onDisplay.animate(this[this.effect].onDisplay, this.duration );
    this.$past.animate(this[this.effect].past, this.duration );
    this.$coming.animate(this[this.effect].coming, this.duration );

  };


  return Prez;


});