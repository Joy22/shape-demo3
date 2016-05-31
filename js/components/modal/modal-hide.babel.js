import Module           from '../module';
import COLORS           from '../colors';
import Characters       from './characters';
import GeometricShapes  from './geometric-shapes';

class ModalHide extends Module {
  _render () {
    super._render();

    this.parent = this._findEl( '#js-modal-hide-layer' );

    // parent.appendChild( this.el );

    this.timeline = new mojs.Timeline;

    // document.body.style[ 'background' ] = COLORS.BLACK;

    const whiteBg = new mojs.Shape({
      parent:       this.parent,
      fill:         COLORS.WHITE,
      left:         '50%', top: '50%',
      radius:       500,
      duration:     700,
      scale:        { .25 : 2 },
      // scale:        .25,
      easing:       'cubic.out',
      // isShowStart:  true,
      isTimelineLess: 1,
      isForce3d: true
    });

    const redBg = new mojs.Shape({
      parent:       this.parent,
      fill:         COLORS.RED,
      left:         '50%', top: '50%',
      radius:       500,
      duration:     700,
      delay:        50,
      scale:        { .25 : 2 },
      // scale:        .25,
      easing:       'quad.out',
      // isShowStart:  true,
      isTimelineLess: 1,
      isForce3d: true
    });

    const burst = new mojs.Burst({
      count: 3,
      left: '50%', top: '50%',
      radius: { 100: 250 },
      parent: this.parent,
      childOptions: {
        fill: 'white',
        shape: 'line',
        stroke: [ COLORS.WHITE, COLORS.VINOUS ],
        strokeWidth: 12, 
        radius: 'rand(30, 60)',
        radiusY: 0,
        scale: { 1: 0 },
        // duration: 800,
        pathScale: 'rand(.5, 1)',
        isForce3d: true
        // degreeShift: 90,
        // angle: 90
      }
    });

    const burst2 = new mojs.Burst({
      count: 3,
      left: '50%', top: '50%',
      radius: { 100: 250 },
      parent: this.parent,
      angle: 90,
      childOptions: {
        fill: 'white',
        shape: 'line',
        stroke: [ COLORS.WHITE, COLORS.VINOUS ],
        strokeWidth: 12, 
        radius: 'rand(30, 60)',
        radiusY: 0,
        scale: { 1: 0 },
        // duration: 800,
        pathScale: 'rand(.5, 1)',
        isForce3d: true
        // degreeShift: 90,
        // angle: 90
      }
    });

    const burst3 = new mojs.Burst({
      count: 5,
      left: '50%', top: '50%',
      radius: { 0: 150 },
      parent: this.parent,
      childOptions: {
        shape: [ 'circle', 'rect', 'polygon' ],
        points: 5,
        fill: [ COLORS.WHITE, COLORS.VINOUS ],
        radius: 'rand(30, 60)',
        scale: { 1: 0 },
        pathScale: 'rand(.5, 1)',
        isForce3d: true
      }
    });

    const circle = new mojs.Shape({
      fill:     COLORS.WHITE,
      parent:   this.parent,
      left:     '50%', top: '50%',
      radius:   200,
      scale:    { .2: 1 },
      opacity: { 1: 0 },
      isForce3d: true,
      isShowEnd: false
    });

    const circle2 = new mojs.Shape({
      fill:     COLORS.WHITE,
      parent:   this.parent,
      left:     '50%', top: '50%',
      radius:   240,
      scale:    { .2: 1 },
      opacity: { 1: 0 },
      isForce3d: true,
      isShowEnd: false,
      easing: 'cubic.out',
      delay: 150,
    });

    this.characters = new Characters({ delay: 1600 });

    this.timeline
      .add(
        redBg,
        whiteBg,
        burst,
        burst2,
        burst3,
        circle,
        circle2,
        new GeometricShapes,
        this.characters
      );

    return this;
  }

  play () {
    this.timeline.play();
    mojs.h.setPrefixedStyle( this.parent, 'transform', 'none' );
  }
}

export default ModalHide;