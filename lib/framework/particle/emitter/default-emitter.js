import { vec3 } from '../../../vmath';

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