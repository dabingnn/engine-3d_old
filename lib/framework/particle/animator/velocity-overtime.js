import { vec3,mat4 } from '../../../vmath';

export default class VelocityOvertimeModule {
  constructor() {
    this.transform = mat4.create();
  }

  onInit(space,worldTransform) {
    this.systemSpace = space;
    this.worldTransform = worldTransform;
    this.needTransform = this.calculateTransform();
  }

  animate(p) {
    let normalizedTime = 1-p.remainingLifetime/p.startLifetime;
    let vel = vec3.new(this._x.evaluate(normalizedTime),this._y.evaluate(normalizedTime),this._z.evaluate(normalizedTime));
    if(this.needTransform) {
      vec3.transformMat4(vel,vel,this.transform);
    }
    vec3.add(p.animatedVelocity,p.animatedVelocity,vel);
  }

  calculateTransform() {
    if(this._space !== this.systemSpace) {
      if(this.systemSpace === 'world') {
        this.transform = this.worldTransform;
      }
      else {
        mat4.invert(this.transform,this.worldTransform);
      }
      return true;
    }
    else {
      mat4.identity(this.transform);
      return false;
    }
  }
}

VelocityOvertimeModule.schema = {

  enable:{
    type:'boolean',
    default:false
  },

  x:{
    type:'CurveRange',
    default:null
  },

  y:{
    type:'CurveRange',
    default:null
  },

  z:{
    type:'CurveRange',
    default:null
  },

  speedModifier:{
    type:'CurveRange',
    default:null
  },

  space:{
    type:'enums',
    options:[
      'local',
      'world'
    ],
    default: 'local',
    set (val) {
      this._space = val;
      this.needTransform = this.calculateTransform();
    }
  }
};