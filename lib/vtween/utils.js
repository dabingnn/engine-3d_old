import { vec2, vec3, vec4, color3, color4, quat } from '../vmath';

let _vec2 = vec2.create();
let _vec3 = vec3.create();
let _vec4 = vec4.create();
let _color3 = color3.create();
let _color4 = color4.create();
let _quat = quat.create();

function getCloneFromType(type, value) {
  if (type === 'number') {
    return value;
  } else if (type === 'vec2') {
    return vec2.clone(value);
  } else if (type === 'vec3') {
    return vec3.clone(value);
  } else if (type === 'vec4') {
    return vec4.clone(value);
  } else if (type === 'color3') {
    return color3.clone(value);
  } else if (type === 'color4') {
    return color4.clone(value);
  } else if (type === 'quat') {
    return quat.clone(value);
  }

  return value;
}

function _parseValue(type, value) {
  let ret;

  if (type === 'number') {
    return value;
  } else if (type === 'vec2') {
    ret = vec2.create();
    vec2.set(ret, value[0], value[1]);
    return ret;
  } else if (type === 'vec3') {
    ret = vec3.create();
    vec3.set(ret, value[0], value[1], value[2]);
    return ret;
  } else if (type === 'vec4') {
    ret = vec4.create();
    vec4.set(ret, value[0], value[1], value[2], value[3]);
    return ret;
  } else if (type === 'color3') {
    ret = color3.create();
    color3.set(ret, value[0], value[1], value[2]);
    return ret;
  } else if (type === 'color4') {
    ret = color4.create();
    color4.set(ret, value[0], value[1], value[2], value[3]);
    return ret;
  } else if (type === 'quat') {
    ret = quat.create();
    quat.set(ret, value[0], value[1], value[2], value[3]);
    return ret;
  }

  return null;
}

function getLerpFunc(type) {
  if (type === 'number') {
    return (from, to, t) => { let out = ((to - from) * t) + from; return out; };
  } else if (type === 'vec2') {
    return (from, to, t) => { return vec2.lerp(_vec2, from, to, t); };
  } else if (type === 'vec3') {
    return (from, to, t) => { return vec3.lerp(_vec3, from, to, t); };
  } else if (type === 'vec4') {
    return (from, to, t) => { return vec4.lerp(_vec4, from, to, t); };
  } else if (type === 'color3') {
    return (from, to, t) => { return color3.lerp(_color3, from, to, t); };
  } else if (type === 'color4') {
    return (from, to, t) => { return color4.lerp(_color4, from, to, t); };
  } else if (type === 'quat') {
    return (from, to, t) => { return quat.lerp(_quat, from, to, t); };
  }
}

function createClips(targetProperty, clipsProp, clipType, opts) {
  let clips = [];
  let prevClip;

  if (Array.isArray(clipsProp) === false) {
    clipsProp = [clipsProp];
  }

  for (let i = 0; i < clipsProp.length; ++i) {
    let clipProp = clipsProp[i];

    let duration = clipsProp[i].duration;
    if (duration === undefined) {
      duration = opts.duration;
    }

    let delay = clipProp.delay;
    if (delay === undefined) {
      delay = opts.delay;
    }

    let easing = clipProp.easing;
    if (easing === undefined) {
      easing = opts.easing;
    }

    // let elasticity = clipProp.elasticity;
    // if (elasticity === undefined) {
    //   elasticity = opts.elasticity;
    // }

    let to;
    let from;

    if (clipProp.value[0] instanceof Array === true) {
      from = _parseValue(clipType, clipProp.value[0]);
      to = _parseValue(clipType, clipProp.value[1]);
    } else {
      from = getCloneFromType(clipType, targetProperty);
      to = _parseValue(clipType, clipProp.value);
    }

    let startTime = prevClip ? prevClip.endTime : 0;

    let clip = {
      duration: duration,
      delay: delay,
      easing: easing,
      // elasticity: elasticity,
      startTime: startTime,
      endTime: startTime + duration + delay,
      to: to,
      from: prevClip ? prevClip.to : from,
    };

    prevClip = clip;
    clips.push(clip);
  }

  return clips;
}

function createTracks(targets, props, opts) {
  let tracks = [];

  if (Array.isArray(targets) === false) {
    targets = [targets];
  }

  for (let i = 0; i < targets.length; ++i) {
    let target = targets[i];

    for (let name in props) {
      let propInfo = props[name];

      let clips = createClips(target[name], propInfo.clips, propInfo.type, opts);

      let type = propInfo.type;

      // find the max endTime of clips
      let maxEndTime = -1;
      for (let j = 0; j < clips.length; ++j) {
        let _clip = clips[j];
        if (_clip.endTime > maxEndTime) {
          maxEndTime = _clip.endTime;
        }
      }

      tracks.push({
        target: target,
        property: name,
        type: type,
        clips: clips,
        duration: maxEndTime,
        // delay: clips[0].delay, // no need ?
        lerp: getLerpFunc(type),
      });
    }
  }

  return tracks;
}

let utils = {
  createClips,
  createTracks,
};

export default utils;