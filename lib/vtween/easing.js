var easing = {
  linear: {
    none: function (k) {
      return k;
    }
  },
  quadratic: {
    in: function (k) {
      return k * k;
    },
    out: function (k) {
      return k * (2 - k);
    },
    inOut: function (k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k;
      }
      return - 0.5 * (--k * (k - 2) - 1);
    }
  },
  cubic: {
    in: function (k) {
      return k * k * k;
    },
    out: function (k) {
      return --k * k * k + 1;
    },
    inOut: function (k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k;
      }
      return 0.5 * ((k -= 2) * k * k + 2);
    }
  },
  quartic: {
    in: function (k) {
      return k * k * k * k;
    },
    out: function (k) {
      return 1 - (--k * k * k * k);
    },
    inOut: function (k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k;
      }
      return - 0.5 * ((k -= 2) * k * k * k - 2);
    }
  },
  quintic: {
    in: function (k) {
      return k * k * k * k * k;
    },
    out: function (k) {
      return --k * k * k * k * k + 1;
    },
    inOut: function (k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k * k;
      }
      return 0.5 * ((k -= 2) * k * k * k * k + 2);
    }
  },
  sinusoidal: {
    in: function (k) {
      return 1 - Math.cos(k * Math.PI / 2);
    },
    out: function (k) {
      return Math.sin(k * Math.PI / 2);
    },
    inOut: function (k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }
  },
  exponential: {
    in: function (k) {
      return k === 0 ? 0 : Math.pow(1024, k - 1);
    },
    out: function (k) {
      return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);
    },
    inOut: function (k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      if ((k *= 2) < 1) {
        return 0.5 * Math.pow(1024, k - 1);
      }
      return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);
    }
  },
  circular: {
    in: function (k) {
      return 1 - Math.sqrt(1 - k * k);
    },
    out: function (k) {
      return Math.sqrt(1 - (--k * k));
    },
    inOut: function (k) {
      if ((k *= 2) < 1) {
        return - 0.5 * (Math.sqrt(1 - k * k) - 1);
      }
      return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    }
  },
  elastic: {
    in: function (k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    },
    out: function (k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
    },
    inOut: function (k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      k *= 2;
      if (k < 1) {
        return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
      }
      return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
    }
  },
  back: {
    in: function (k) {
      var s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },
    out: function (k) {
      var s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },
    inOut: function (k) {
      var s = 1.70158 * 1.525;
      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }
  },
  bounce: {
    in: function (k) {
      return 1 - easing.bounce.out(1 - k);
    },
    out: function (k) {
      if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
      } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
      } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
      } else {
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
      }
    },
    inOut: function (k) {
      if (k < 0.5) {
        return easing.bounce.in(k * 2) * 0.5;
      }
      return easing.bounce.out(k * 2 - 1) * 0.5 + 0.5;
    }
  }
};

export { easing };