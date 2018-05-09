const tap = require('./tap');
const { easing } = require('./dist/vtween');
tap.test('easing', t => {

  t.test('linear', t => {
    let a = 0.5;
    a = easing.linear.none(a);
    t.approximate(a, 0.5);
    t.end();
  });

  t.test('quadratic', t => {

    t.test('in', t => {

      let a = 0.5;
      a = easing.quadratic.in(a);
      t.approximate(a, 0.25);

      t.end();
    });

    t.test('out', t => {

      let a = 0.5;
      a = easing.quadratic.out(a);
      t.approximate(a, 0.75);

      t.end();
    });

    t.test('inOut', t => {

      let a = 0.5;
      a = easing.quadratic.inOut(a);
      t.approximate(a, 0.5);

      t.end();
    });

    t.end();
  });

  t.test('cubic', t => {

    t.test('in', t => {

      let a = 0.5;
      a = easing.cubic.in(a);
      t.approximate(a, 0.125);

      t.end();
    });

    t.test('out', t => {

      let a = 0.5;
      a = easing.cubic.out(a);
      t.approximate(a, 0.875);

      t.end();
    });

    t.test('inOut', t => {

      let a = 0.5;
      a = easing.cubic.inOut(a);
      t.approximate(a, 0.5);

      t.end();
    });

    t.end();
  });

  t.test('quartic', t => {

    t.test('in', t => {

      let a = 0.5;
      a = easing.quartic.in(a);
      t.approximate(a, 0.0625);
      t.end();
    });

    t.test('out', t => {

      let a = 0.5;
      a = easing.quartic.out(a);
      t.approximate(a, 0.9375);

      t.end();
    });

    t.test('inOut', t => {

      let a = 0.5;
      a = easing.quartic.inOut(a);
      t.approximate(a, 0.5);

      t.end();
    });

    t.end();
  });

  t.test('quintic', t => {

    t.test('in', t => {

      let a = 0.5;
      a = easing.quintic.in(a);
      t.approximate(a, 0.03125);

      t.end();
    });

    t.test('out', t => {

      let a = 0.5;
      a = easing.quintic.out(a);
      t.approximate(a, 0.96875);

      t.end();
    });

    t.test('inOut', t => {

      let a = 0.5;
      a = easing.quintic.inOut(a);
      t.approximate(a, 0.5);

      t.end();
    });

    t.end();
  });

  t.test('sinusoidal', t => {

    t.test('in', t => {

      let a = 0.5;
      a = easing.sinusoidal.in(a);
      t.approximate(a, 0.29289321);

      t.end();
    });

    t.test('out', t => {

      let a = 0.5;
      a = easing.sinusoidal.out(a);
      t.approximate(a, 0.70710678);

      t.end();
    });

    t.test('inOut', t => {

      let a = 0.5;
      a = easing.sinusoidal.inOut(a);
      t.approximate(a, 0.5);

      t.end();
    });

    t.end();
  });

  t.test('exponential', t => {

    t.test('in', t => {

      let a = 0.5;
      a = easing.exponential.in(a);
      t.approximate(a, 0.03125);

      t.end();
    });

    t.test('out', t => {

      let a = 0.5;
      a = easing.exponential.out(a);
      t.approximate(a, 0.96875);

      t.end();
    });

    t.test('inOut', t => {

      let a = 0.5;
      a = easing.exponential.inOut(a);
      t.approximate(a, 0.5);

      t.end();
    });

    t.end();
  });

  t.test('circular', t => {

    t.test('in', t => {

      let a = 0.5;
      a = easing.circular.in(a);
      t.approximate(a, 0.1339745962155614);

      t.end();
    });

    t.test('out', t => {

      let a = 0.5;
      a = easing.circular.out(a);
      t.approximate(a, 0.8660254037844386);

      t.end();
    });

    t.test('inOut', t => {

      let a = 0.5;
      a = easing.circular.inOut(a);
      t.approximate(a, 0.5);

      t.end();
    });

    t.end();
  });

  t.test('elastic', t => {

    t.test('in', t => {

      let a = 0.5;
      a = easing.elastic.in(a);
      t.approximate(a, 0);

      t.end();
    });

    t.test('out', t => {

      let a = 0.5;
      a = easing.elastic.out(a);
      t.approximate(a, 1);

      t.end();
    });

    t.test('inOut', t => {

      let a = 0.5;
      a = easing.elastic.inOut(a);
      t.approximate(a, 0.5);

      t.end();
    });

    t.end();
  });

  t.test('back', t => {

    t.test('in', t => {

      let a = 0.5;
      a = easing.back.in(a);
      t.approximate(a, -0.0876975);

      t.end();
    });

    t.test('out', t => {

      let a = 0.5;
      a = easing.back.out(a);
      t.approximate(a, 1.0876975);

      t.end();
    });

    t.test('inOut', t => {

      let a = 0.5;
      a = easing.back.inOut(a);
      t.approximate(a, 0.5);

      t.end();
    });

    t.end();
  });

  t.test('bounce', t => {

    t.test('in', t => {

      let a = 0.5;
      a = easing.bounce.in(a);
      t.approximate(a, 0.234375);

      t.end();
    });

    t.test('out', t => {

      let a = 0.5;
      a = easing.bounce.out(a);
      t.approximate(a, 0.765625);

      t.end();
    });

    t.test('inOut', t => {

      let a = 0.5;
      a = easing.bounce.inOut(a);
      t.approximate(a, 0.5);

      t.end();
    });

    t.end();
  });

  t.end();
});