
import Module    from '../module';
import COLORS    from '../colors';
import ModalIn   from './modal-in';
import ModalHide from './modal-hide';

const modalHide = new ModalHide;

class Modal extends Module {
  _render () {
    super._render();

    this._isHidden = false;

    this.el.classList.add( 'modal-wrapper' );
    this.wrapper = this.el;

    this.el = this._createChild('div', 'modal');
    this.shakeEl = this._createElement( 'div' );
    this.shakeEl.classList.add( 'modal__shake' );
    this.el.appendChild( this.shakeEl );
    mojs.h.force3d( this.wrapper );
    mojs.h.force3d( this.el );

    let modalIn = new ModalIn({ el: this.shakeEl });

    this.buttonLove = this._findEl('#js-button-love');
    this.buttonHate = this._findEl('#js-button-hate');
    this.modalText  = this._findEl('#js-modal-text');
    this.modalAppend = this._findEl('#js-modal-append');
    this.hateCount = 0;

    mojs.h.force3d(this.el);
    const rotateCurve = mojs.easing.path('M0,100 C0,100 18.4374504,69.9344254 47.837504,100 C66.7065746,119.176264 100,100 100,100');
    const rotateTween = new mojs.Tween({
      duration: 2000,
      repeat: 999999,
      onUpdate: (ep, p) => {
        var rotateP = rotateCurve(p);
        this.el.style[ 'transform' ] = `rotate(${-10*rotateP}deg)`;
        this.el.style[ 'transform-origin' ] = `${10 + 55*rotateP}% ${80 * 10*rotateP}%`;
      }
    });

    this.rotateTween = rotateTween;
    this._createNoiseTween();
    this._createReleaseEffect();

    this.timeline = new mojs.Timeline;
    this.timeline.add( rotateTween, modalIn );

    return this;
  }

  init () {
    this._addListeners();
    this.timeline.play();
  }

  _createNoiseTween () {
    const prefix = mojs.h.prefix.css;
    const noise = mojs.easing.path('M0,100 L1.98696332,100.629117 L3.53838746,97.8756628 L5.99628366,101.223339 L7.55950567,96.8122389 L10.1815894,101.223339 L14.0277054,95.8836259 L16.1247825,101.164595 L20.9432423,95.6155105 L24.669413,101.207523 L29.2253694,93.4487468 L32.6556094,103.200313 L37.2037006,92.4636488 L40.1757887,103.28617 L41.8363434,91.0417336 L45.2449539,105.027414 L46.5555042,89.4345477 L50.5097677,105.294776 L55.6674171,87.3001687 L59.2510299,106.960707 L62.5721393,85.5431093 L65.6317285,105.27896 L69.6410488,83.6015324 L73.3996638,104.869256 L76.8859438,81.1907535 L78.8080186,106.960707 L80.7310767,80.0527695 L83.9656681,104.876787 L85.8887261,78.1774683 L88.3358076,107.094764 L91.3944137,78.7807278 L95.0763423,103.521901 L97.5234238,79.5677518 L100,100');
    let coef = 1;

    this.noiseTween = new mojs.Timeline;
    // let scale = 1;
    this.shakeTween = new mojs.Tween({
      duration: 800,
      onUpdate: ( ep, p, isFwd ) => {
        var nozieP    = noise(p),
            transform =
              `translate( ${ coef*(20*nozieP)}px, ${ coef*(20*nozieP)}px )`;

        this.shakeEl.style[ 'transform' ] = transform;
      },
      onComplete: ( isFwd ) => {
        if ( this._isShake ) {
          coef = Math.random() < .5 ? -1 : 1; 
          setTimeout( () => {
            this.shakeTween.play();
          }, 1)
        }
      }
    });

    const sideOpts = {
      left:       0,
      shape:      'curve',
      parent:     this.shakeEl,
      easing:     'cubic.out',
      backwardEasing: 'cubic.in',
      fill:       COLORS.RED,
      x:          { 2 : 10 },
      angle:      { 0: 2 },
      radiusY:    28,
      radiusX:    76,
      angle:     -90,
      scaleY:     { 0: 1 },
      scaleX:     { 1: 1.1 },
      duration:   300,
      isShowStart: true,
      isForce3d:  true
    }

    const leftSide = new mojs.Shape({
      ...sideOpts,
      onUpdate: ( ep, p, isFwd ) => {
        var transform = `scale(${ 1 + .05*ep })`;

        this.wrapper.style[ 'transform' ] = transform;
        this.wrapper.style[ `${prefix}transform` ] = transform;
      },
    });

    const rightSide = new mojs.Shape({
      ...sideOpts,
      left: '100%', top: '50%',
      x:          { [-2] : -10 },
      angle:      90,
    });

    const topSide = new mojs.Shape({
      ...sideOpts,
      left: '50%', top: 0,
      radiusY:    25,
      radiusX:    101,
      y:          { 2 : 5 },
      x:          0,
      angle:      0,
    });

    const bottomSide = new mojs.Shape({
      ...sideOpts,
      left: '50%', top: '100%',
      radiusY:    25,
      radiusX:    102,
      y:          { [-2] : -7 },
      x:          1,
      angle:      180,
      onUpdate: (ep, p) => {
        this.modalText.style[ 'transform' ] = `translateY(${ -10*ep }px) scaleY(${ 1 + .05*ep })`;
        this.buttonLove.style[ 'transform' ] = `scaleX(${1 + .05*ep}) translate( ${ -4*ep }px, ${ 4*ep }px ) skewX(${ 4*ep }deg) rotate(${ 4*ep }deg)`;
        this.buttonHate.style[ 'transform' ] = `scaleX(${1 + .05*ep}) translate( ${ 4*ep }px, ${ 4*ep }px ) skewX(${ -4*ep }deg) rotate(${ -4*ep }deg)`;
      }
    });

    this.noiseTween.add(
        leftSide, rightSide,
        topSide, bottomSide
    );
  }

  _createReleaseEffect () {

    const smokeOpts = {
      top:            '78%',
      fill:           'white',
      x:              'rand(-40, 40)',
      y:              { 0: -100 },
      pathScale:      'rand(.35, 1)',
      direction:      [ 1, -1 ],
      radius:         'rand( 3, 7 )',
      scale:          { 1: 0 },
      swirlSize:      'rand( 8, 12 )',
      swirlFrequency: 'rand( 2, 5 )',
      parent:         this.el,
      duration:       1000,
      isForce3d:      true
    }

    const count = 3;
    this.loveSmokeTimeline = new mojs.Timeline;
    this.loveSmoke = [];
    for ( let i = 0; i < count; i++ ) {
      this.loveSmoke.push(new mojs.ShapeSwirl({
        ...smokeOpts,
        direction:  [ 1, -1 ][ i % (count-1) ],
        left:    '28%',
      }));
    }
    this.loveSmokeTimeline.add( this.loveSmoke );

    this.hateSmokeTimeline = new mojs.Timeline;
    this.hateSmoke = [];
    for ( let i = 0; i < count; i++ ) {
      this.hateSmoke.push(new mojs.ShapeSwirl({
        ...smokeOpts,
        direction:  [ 1, -1 ][ i % (count-1) ],
        left:    '72%',
      }));
    }
    this.hateSmokeTimeline.add( this.hateSmoke );

  }

  _addListeners () {
    var self = this;
    this.buttonLove.addEventListener( 'mouseenter', this._buttonEnter.bind(this) );
    this.buttonHate.addEventListener( 'mouseenter', this._buttonEnter.bind(this) );
    this.buttonLove.addEventListener( 'mouseleave', this._buttonLeave.bind(this) );
    this.buttonHate.addEventListener( 'mouseleave', this._buttonLeave.bind(this) );
    
    this.buttonLove.addEventListener( 'click', () => {
      this._setWord( 'love' );
      this._playHide();
    });
    this.buttonHate.addEventListener( 'click', () => {
      this._setWord( 'hate' );
      // this._playHide();
      this.hateCount++;

      if (this.hateCount === 1) {
        this.buttonHate.style.display = 'none';
        this.modalAppend.style.display = 'block';
        setTimeout(function(){
          self.buttonHate.style.display = 'inline-block';
          self.modalAppend.innerHTML='只是想再让你考虑一下(*／ω＼*)';
        }, 3000);
      } else if (this.hateCount === 2) {
        self.modalAppend.innerHTML='(｡•́︿•̀｡)';
      } else {
        self.modalAppend.innerHTML='没关系，做朋友吧(•̀ω•́)✧';
        this.modalAppend.style.fontSize = '14px';
        this.buttonLove.style.display = 'none';
        this.buttonHate.style.display = 'none';
        this.modalText.innerHTML='';
      }
      
    });
  }

  _buttonEnter (e) {
    this.noiseTween.play();
    this.shakeTween.play();
    this.rotateTween.pause();
    this._isShake = true;
  }

  _buttonLeave (e) {
    if ( this._isHidden ) { return; }
    this.noiseTween.pause().playBackward();
    this.shakeTween.stop();
    this.rotateTween.play();

    if ( e.target === this.buttonLove ) {
      for ( let module of this.loveSmoke ) {
        module.generate();
      }
      this.loveSmokeTimeline.replay(); 
    } else {
      for ( let module of this.hateSmoke ) {
        module.generate();
      }
      this.hateSmokeTimeline.replay();
    }

    this._isShake = false;
  }
  
  _setWord ( word ) { modalHide.characters.setWord( word ); }

  _playHide () {
    this._isHidden = true;
    mojs.h.setPrefixedStyle( this.el, 'transform', 'scale(0)' );

    this.noiseTween.pause();
    this.shakeTween.pause();
    this.timeline.pause();

    modalHide.play();
  }

}

export default Modal;
