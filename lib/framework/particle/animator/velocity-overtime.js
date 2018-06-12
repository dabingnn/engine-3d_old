import { vec3,quat } from '../../../vmath';
import { calculateTransform } from '../particle-general-function';

export default class VelocityOvertimeModule {
  constructor() {
    this.rotation = quat.create();
  }

  update(space,worldTransform) {
    this.needTransform = calculateTransform(space,this._space,worldTransform,this.rotation);
  }

  animate(p) {
    let normalizedTime = 1-p.remainingLifetime/p.startLifetime;
    let vel = vec3.new(this._x.evaluate(normalizedTime),this._y.evaluate(normalizedTime),this._z.evaluate(normalizedTime));
    if(this.needTransform) {
      vec3.transformQuat(vel,vel,this.rotation);
    }
    vec3.add(p.animatedVelocity,p.animatedVelocity,vel);
    vec3.add(p.ultimateVelocity,p.velocity,p.animatedVelocity);
    vec3.scale(p.ultimateVelocity,p.ultimateVelocity,this._speedModifier.evaluate(1-p.remainingLifetime/p.startLifetime));
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
    default: 'local'
  }
};