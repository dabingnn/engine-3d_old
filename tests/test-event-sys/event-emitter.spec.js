const tap = require('tap');
const { EventEmitter } = require('./dist/event-sys');
console.log(EventEmitter);

tap.test('node', t => {

  t.test('works with ES6 symbols', t => {
    let e = new EventEmitter()
      , symbolCows = Symbol('cows')
      , symbolMoo = Symbol('moo');

    e.on(symbolCows, arg => {
      t.equal(e.listeners(symbolMoo).length, 0);
      t.equal(arg, 'bar');

      e.once(symbolMoo, onced => {
        t.equal(e.listeners(symbolMoo).length, 0);
        t.equal(onced, 'foo');
      });

      t.equal(e.listeners(symbolCows).length, 1);
      t.equal(e.listeners(symbolMoo).length, 1);

      e.off(symbolCows);
      t.equal(e.listeners(symbolCows).length, 0);
      t.equal(e.emit(symbolMoo, 'foo'), true);
    });

    t.equal(e.emit(symbolMoo, 'bar'), false);
    t.equal(e.emit(symbolCows, 'bar'), true);

    t.end();
  });

  t.test('emit', t => {
    t.test('should return false when there are not events to emit', t => {
      let e = new EventEmitter();

      t.equal(e.emit('foo'), false);
      t.equal(e.emit('bar'), false);

      t.end();
    });

    t.test('emits with context', t => {
      let context = { bar: 'baz' }
        , e = new EventEmitter();

      e.on('foo', function (bar) {
        t.equal(bar, 'bar');
        t.equal(this, context);

        t.end();
      }, context).emit('foo', 'bar');
    });

    t.test('emits with context, multiple arguments (force apply)', t => {
      let context = { bar: 'baz' }
        , e = new EventEmitter();

      e.on('foo', function (bar) {
        t.equal(bar, 'bar');
        t.equal(this, context);

        t.end();
      }, context).emit('foo', 'bar', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0);
    });

    t.test('can emit the function with multiple arguments', t => {
      let e = new EventEmitter();

      for (var i = 0; i < 100; i++) {
        (function (j) {
          for (var i = 0, args = []; i < j; i++) {
            args.push(j);
          }

          e.once('args', function () {
            t.equal(arguments.length, args.length);
          });

          e.emit.apply(e, ['args'].concat(args));
        })(i);
      }

      t.end();
    });

    t.test('can emit the function with multiple arguments, multiple listeners', t => {
      let e = new EventEmitter();

      for (var i = 0; i < 100; i++) {
        (function (j) {
          for (var i = 0, args = []; i < j; i++) {
            args.push(j);
          }

          e.once('args', function () {
            t.equal(arguments.length, args.length);
          });

          e.once('args', function () {
            t.equal(arguments.length, args.length);
          });

          e.once('args', function () {
            t.equal(arguments.length, args.length);
          });

          e.once('args', function () {
            t.equal(arguments.length, args.length);
          });

          e.emit.apply(e, ['args'].concat(args));
        })(i);
      }

      t.end();
    });

    t.test('emits with context, multiple listeners (force loop)', t => {
      let e = new EventEmitter();

      e.on('foo', function (bar) {
        t.deepEqual(this, { foo: 'bar' });
        t.equal(bar, 'bar');
      }, { foo: 'bar' });

      e.on('foo', function (bar) {
        t.deepEqual(this, { bar: 'baz' });
        t.equal(bar, 'bar');
      }, { bar: 'baz' });

      e.emit('foo', 'bar');

      t.end();
    });

    t.test('emits with different contexts', t => {
      let e = new EventEmitter()
        , pattern = '';

      function writer() {
        pattern += this;
      }

      e.on('write', writer, 'foo');
      e.on('write', writer, 'baz');
      e.once('write', writer, 'bar');
      e.once('write', writer, 'banana');

      e.emit('write');
      t.equal(pattern, 'foobazbarbanana');

      t.end();
    });

    t.test('should return true when there are events to emit', t => {
      let e = new EventEmitter()
        , called = 0;

      e.on('foo', function () {
        called++;
      });

      t.equal(e.emit('foo'), true);
      t.equal(e.emit('foob'), false);
      t.equal(called, 1);

      t.end();
    });

    t.test('receives the emitted events', t => {
      let e = new EventEmitter();

      e.on('data', function (a, b, c, d, undef) {
        t.equal(a, 'foo');
        t.equal(b, e);
        t.equal(c instanceof Date, true);
        t.equal(undef, undefined);
        t.equal(arguments.length, 3);

        t.end();
      });

      e.emit('data', 'foo', e, new Date());
    });

    t.test('emits to all event listeners', t => {
      let e = new EventEmitter()
        , pattern = [];

      e.on('foo', function () {
        pattern.push('foo1');
      });

      e.on('foo', function () {
        pattern.push('foo2');
      });

      e.emit('foo');

      t.equal(pattern.join(';'), 'foo1;foo2');

      t.end();
    });

    (function each(keys) {
      let key = keys.shift();

      if (!key) {
        return;
      }

      t.test('can store event which is a known property: ' + key, t => {
        let e = new EventEmitter();

        e.on(key, function (k) {
          t.equal(k, key);
          t.end();
        }).emit(key, key);
      });

      each(keys);
    })([
      'hasOwnProperty',
      'constructor',
      '__proto__',
      'toString',
      'toValue',
      'unwatch',
      'watch'
    ]);

    t.end();
  });

  t.test('listeners', t => {
    t.test('returns an empty array if no listeners are specified', t => {
      let e = new EventEmitter();

      t.equal(Array.isArray(e.listeners('foo')), true);
      t.equal(e.listeners('foo').length, 0);

      t.end();
    });

    t.test('returns an array of function', t => {
      let e = new EventEmitter();

      function foo() {}

      e.on('foo', foo);
      t.equal(Array.isArray(e.listeners('foo')), true);
      t.equal(e.listeners('foo').length, 1);
      t.deepEqual(e.listeners('foo'), [foo]);

      t.end();
    });

    t.test('is not vulnerable to modifications', t => {
      let e = new EventEmitter();

      function foo() {}

      e.on('foo', foo);

      t.deepEqual(e.listeners('foo'), [foo]);

      e.listeners('foo').length = 0;
      t.deepEqual(e.listeners('foo'), [foo]);

      t.end();
    });

    t.test('can return a boolean as indication if listeners exist', t => {
      let e = new EventEmitter();

      function foo() {}

      e.once('once', foo);
      e.once('multiple', foo);
      e.once('multiple', foo);
      e.on('on', foo);
      e.on('multi', foo);
      e.on('multi', foo);

      t.equal(e.listeners('foo', true), false);
      t.equal(e.listeners('multiple', true), true);
      t.equal(e.listeners('on', true), true);
      t.equal(e.listeners('multi', true), true);

      e.removeAllListeners();

      t.equal(e.listeners('multiple', true), false);
      t.equal(e.listeners('on', true), false);
      t.equal(e.listeners('multi', true), false);

      t.end();
    });

    t.end();
  });

  t.test('once', t => {
    t.test('only emits it once', t => {
      let e = new EventEmitter(), calls = 0;

      e.once('foo', function () {
        calls++;
      });

      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');

      t.equal(e.listeners('foo').length, 0);
      t.equal(calls, 1);

      t.end();
    });

    t.test('only emits once if emits are nested inside the listener', t => {
      let e = new EventEmitter(), calls = 0;

      e.once('foo', function () {
        calls++;
        e.emit('foo');
      });

      e.emit('foo');
      t.equal(e.listeners('foo').length, 0);
      t.equal(calls, 1);

      t.end();
    });

    t.test('only emits once for multiple events', t => {
      let e = new EventEmitter(), multi = 0, foo = 0, bar = 0;

      e.once('foo', function () {
        foo++;
      });

      e.once('foo', function () {
        bar++;
      });

      e.on('foo', function () {
        multi++;
      });

      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');

      t.equal(e.listeners('foo').length, 1);
      t.equal(multi, 5);
      t.equal(foo, 1);
      t.equal(bar, 1);

      t.end();
    });

    t.test('only emits once with context', t => {
      let context = { foo: 'bar' }, e = new EventEmitter();

      e.once('foo', function (bar) {
        t.equal(this, context);
        t.equal(bar, 'bar');

        t.end();
      }, context).emit('foo', 'bar');
    });

    t.end();
  });

  t.test('off', t => {
    t.test('removes all listeners when the listener is not specified', t => {
      let e = new EventEmitter();

      e.on('foo', function () {});
      e.on('foo', function () {});

      t.equal(e.off('foo'), e);
      t.deepEqual(e.listeners('foo'), []);

      t.end();
    });

    t.test('removes only the listeners matching the specified listener', t => {
      let e = new EventEmitter();

      function foo() {}
      function bar() {}
      function baz() {}

      e.on('foo', foo);
      e.on('bar', bar);
      e.on('bar', baz);

      t.equal(e.off('foo', bar), e);
      t.deepEqual(e.listeners('bar'), [bar, baz]);
      t.deepEqual(e.listeners('foo'), [foo]);
      t.equal(e._eventsCount, 2);

      t.equal(e.off('foo', foo), e);
      t.deepEqual(e.listeners('bar'), [bar, baz]);
      t.deepEqual(e.listeners('foo'), []);
      t.equal(e._eventsCount, 1);

      t.equal(e.off('bar', bar), e);
      t.deepEqual(e.listeners('bar'), [baz]);
      t.equal(e._eventsCount, 1);

      t.equal(e.off('bar', baz), e);
      t.deepEqual(e.listeners('bar'), []);
      t.equal(e._eventsCount, 0);

      e.on('foo', foo);
      e.on('foo', foo);
      e.on('bar', bar);

      t.equal(e.off('foo', foo), e);
      t.deepEqual(e.listeners('bar'), [bar]);
      t.deepEqual(e.listeners('foo'), []);
      t.equal(e._eventsCount, 1);

      t.end();
    });

    t.test('removes only the once listeners when using the once flag', t => {
      let e = new EventEmitter();

      function foo() {}

      e.on('foo', foo);

      t.equal(e.off('foo', function () {}, undefined, true), e);
      t.deepEqual(e.listeners('foo'), [foo]);
      t.equal(e._eventsCount, 1);

      t.equal(e.off('foo', foo, undefined, true), e);
      t.deepEqual(e.listeners('foo'), [foo]);
      t.equal(e._eventsCount, 1);

      t.equal(e.off('foo', foo), e);
      t.deepEqual(e.listeners('foo'), []);
      t.equal(e._eventsCount, 0);

      e.once('foo', foo);
      e.on('foo', foo);

      t.equal(e.off('foo', function () {}, undefined, true), e);
      t.deepEqual(e.listeners('foo'), [foo, foo]);
      t.equal(e._eventsCount, 1);

      t.equal(e.off('foo', foo, undefined, true), e);
      t.deepEqual(e.listeners('foo'), [foo]);
      t.equal(e._eventsCount, 1);

      e.once('foo', foo);

      t.equal(e.off('foo', foo), e);
      t.deepEqual(e.listeners('foo'), []);
      t.equal(e._eventsCount, 0);

      t.end();
    });

    t.test('removes only the listeners matching the correct context', t => {
      let context = { foo: 'bar' }, e = new EventEmitter();

      function foo() {}
      function bar() {}

      e.on('foo', foo, context);

      t.equal(e.off('foo', function () {}, context), e);
      t.deepEqual(e.listeners('foo'), [foo]);
      t.equal(e._eventsCount, 1);

      t.equal(e.off('foo', foo, { baz: 'quux' }), e);
      t.deepEqual(e.listeners('foo'), [foo]);
      t.equal(e._eventsCount, 1);

      t.equal(e.off('foo', foo, context), e);
      t.deepEqual(e.listeners('foo'), []);
      t.equal(e._eventsCount, 0);

      e.on('foo', foo, context);
      e.on('foo', bar);

      t.equal(e.off('foo', foo, { baz: 'quux' }), e);
      t.deepEqual(e.listeners('foo'), [foo, bar]);
      t.equal(e._eventsCount, 1);

      t.equal(e.off('foo', foo, context), e);
      t.deepEqual(e.listeners('foo'), [bar]);
      t.equal(e._eventsCount, 1);

      e.on('foo', bar, context);

      t.equal(e.off('foo', bar), e);
      t.deepEqual(e.listeners('foo'), []);
      t.equal(e._eventsCount, 0);

      t.end();
    });

    t.end();
  });

  t.test('removeAllListeners', t => {
    t.test('removes all events for the specified events', t => {
      let e = new EventEmitter();

      e.on('foo', function () { throw new Error('oops'); });
      e.on('foo', function () { throw new Error('oops'); });
      e.on('bar', function () { throw new Error('oops'); });
      e.on('aaa', function () { throw new Error('oops'); });

      t.equal(e.removeAllListeners('foo'), e);
      t.equal(e.listeners('foo').length, 0);
      t.equal(e.listeners('bar').length, 1);
      t.equal(e.listeners('aaa').length, 1);
      t.equal(e._eventsCount, 2);

      t.equal(e.removeAllListeners('bar'), e);
      t.equal(e._eventsCount, 1);
      t.equal(e.removeAllListeners('aaa'), e);
      t.equal(e._eventsCount, 0);

      t.equal(e.emit('foo'), false);
      t.equal(e.emit('bar'), false);
      t.equal(e.emit('aaa'), false);

      t.end();
    });

    t.test('just nukes the fuck out of everything', t => {
      let e = new EventEmitter();

      e.on('foo', function () { throw new Error('oops'); });
      e.on('foo', function () { throw new Error('oops'); });
      e.on('bar', function () { throw new Error('oops'); });
      e.on('aaa', function () { throw new Error('oops'); });

      t.equal(e.removeAllListeners(), e);
      t.equal(e.listeners('foo').length, 0);
      t.equal(e.listeners('bar').length, 0);
      t.equal(e.listeners('aaa').length, 0);
      t.equal(e._eventsCount, 0);

      t.equal(e.emit('foo'), false);
      t.equal(e.emit('bar'), false);
      t.equal(e.emit('aaa'), false);

      t.end();
    });

    t.end();
  });

  t.test('eventNames', t => {
    t.test('returns an empty array when there are no events', t => {
      let e = new EventEmitter();

      t.deepEqual(e.eventNames(), []);

      e.on('foo', function () {});
      e.removeAllListeners('foo');

      t.deepEqual(e.eventNames(), []);

      t.end();
    });

    t.test('returns an array listing the events that have listeners', t => {
      let e = new EventEmitter(), original;

      function bar() {}

      if (Object.getOwnPropertySymbols) {
        //
        // Monkey patch `Object.getOwnPropertySymbols()` to increase coverage
        // on EventEmitter.js > 0.10.
        //
        original = Object.getOwnPropertySymbols;
        Object.getOwnPropertySymbols = undefined;
      }

      e.on('foo', function () {});
      e.on('bar', bar);

      try {
        t.deepEqual(e.eventNames(), ['foo', 'bar']);
        e.off('bar', bar);

        t.deepEqual(e.eventNames(), ['foo']);
      } catch (ex) {
        throw ex;
      } finally {
        if (original) {
          Object.getOwnPropertySymbols = original;
        }
      }

      t.end();
    });

    t.test('does not return inherited property identifiers', t => {
      let e = new EventEmitter();

      function Collection() {}
      Collection.prototype.foo = function () {
        return 'foo';
      };

      e._events = new Collection();

      t.equal(e._events.foo(), 'foo');
      t.deepEqual(e.eventNames(), []);

      t.end();
    });

    t.test('includes ES6 symbols', t => {
      let e = new EventEmitter()
        , s = Symbol('s');

      function foo() {}

      e.on('foo', foo);
      e.on(s, function () {});

      t.deepEqual(e.eventNames(), ['foo', s]);

      e.off('foo', foo);

      t.deepEqual(e.eventNames(), [s]);

      t.end();
    });

    t.end();
  });

  t.test('mixin', t => {
    class Foo {
      constructor() {
        this.foo = 'foo';
        this.bar = 'bar';
        this.__initEventEmitter();
      }
    }
    EventEmitter.mixin(Foo);

    let foo1 = new Foo();
    foo1.on('foobar', (foo, bar) => {
      t.equal(foo, 'foo');
      t.equal(bar, 'bar');

      t.end();
    });

    foo1.emit('foobar', foo1.foo, foo1.bar);
  });

  t.end();
});