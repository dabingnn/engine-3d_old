import { vec3, randomRange, randomRangeInt } from '../../../vmath';

export default class DefaultShape {
    
    generateEmitPosition()
    {
        return vec3.new(0,0,0);
    }

    generateEmitDirection()
    {
        return vec3.new(0,0,-1);
    }
}