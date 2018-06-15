
let Layers = {
  // built-in layers, reserved up to (1 << 7)
  Default: (1 << 0),
  IgnoreRaycast: (1 << 1)
};

Layers.nextAvailable = 8;

Layers.addLayer = function(name) {
  if (Layers.nextAvailable > 31) 
    return new Error('maximum layers reached.');
  Layers[name] = (1 << Layers.nextAvailable++);
  return Layers[name];
};

Layers.makeInclusiveMask = function(includes) {
  let mask = 0;
  for (let i = 0; i < includes.length; i++)
    mask += includes[i];
  return mask;
};

Layers.makeExclusiveMask = function(excludes) {
  return ~Layers.makeInclusiveMask(excludes);
};

Layers.check = function(layer, mask) {
  return (layer & mask) == layer;
};

// masks
Layers.RaycastMask = Layers.makeExclusiveMask([Layers.IgnoreRaycast]);

export default Layers;