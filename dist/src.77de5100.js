// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"ts/Utils.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var Random =
/** @class */
function () {
  function Random() {}

  Random.range = function (min, max, flag) {
    if (flag === void 0) {
      flag = false;
    }

    var r = (max - min) * Math.random() + min;
    return flag ? Math.floor(r) : r;
  };

  Object.defineProperty(Random, "vector", {
    get: function get() {
      var x = Random.range(-1, 1);
      var y = Random.range(-1, 1);
      return new Vector(x, y).normalized;
    },
    enumerable: true,
    configurable: true
  });
  return Random;
}();

var Color =
/** @class */
function () {
  function Color(red, green, blue, alpha) {
    if (red === void 0) {
      red = 0;
    }

    if (green === void 0) {
      green = 0;
    }

    if (blue === void 0) {
      blue = 0;
    }

    if (alpha === void 0) {
      alpha = 1;
    }

    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }

  Color.prototype.toString = function () {
    return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
  };

  Color.random = function (a) {
    if (a === void 0) {
      a = 1;
    }

    return new Color(Random.range(0, 255, true), Random.range(0, 255, true), Random.range(0, 255, true), a);
  };

  return Color;
}();

exports.Color = Color;

var Vector =
/** @class */
function () {
  function Vector(x, y, z) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    if (z === void 0) {
      z = 0;
    }

    this.x = x;
    this.y = y;
    this.z = z;
  }

  Object.defineProperty(Vector.prototype, "length", {
    get: function get() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Vector.prototype, "normalized", {
    get: function get() {
      var n = new Vector(this.x, this.y, this.z);
      return this.length !== 0 ? n.div(this.length) : n;
    },
    enumerable: true,
    configurable: true
  });

  Vector.prototype.add = function (v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  };

  Vector.prototype.sub = function (v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  };

  Vector.prototype.mul = function (s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  };

  Vector.prototype.div = function (s) {
    if (s === 0) throw new Error("Don't divide to zero");
    this.x /= s;
    this.y /= s;
    this.z /= s;
    return this;
  };

  Vector.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  };

  Vector.prototype.cross = function (v) {
    return this.x * v.y - this.y * v.x;
  };

  Object.defineProperty(Vector, "up", {
    get: function get() {
      return new Vector(0, 1, 0);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Vector, "down", {
    get: function get() {
      return new Vector(0, -1, 0);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Vector, "left", {
    get: function get() {
      return new Vector(-1, 0, 0);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Vector, "right", {
    get: function get() {
      return new Vector(1, 0, 0);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Vector, "forward", {
    get: function get() {
      return new Vector(0, 0, 1);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Vector, "back", {
    get: function get() {
      return new Vector(0, 0, -1);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Vector, "one", {
    get: function get() {
      return new Vector(1, 1, 1);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Vector, "zero", {
    get: function get() {
      return new Vector();
    },
    enumerable: true,
    configurable: true
  });
  return Vector;
}();

exports.Vector = Vector;

var Texture =
/** @class */
function () {
  function Texture(path, w, h) {
    var _this = this;

    this.image = new Image(w, h);
    this.image.src = path;

    this.image.onload = function () {
      return _this.image.setAttribute("loaded", "true");
    };
  }

  Object.defineProperty(Texture.prototype, "loaded", {
    get: function get() {
      return this.image.getAttribute("loaded");
    },
    enumerable: true,
    configurable: true
  });
  return Texture;
}();
},{}],"ts/Display.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var Utils_1 = require("./Utils");

var Normal = {
  type_: "normal"
};

exports.UseColor = function (color) {
  return {
    type_: "use_color",
    color: color
  };
};

var Display =
/** @class */
function () {
  function Display(id) {
    if (id === void 0) {
      id = "display";
    }

    this.children = [];
    this.event = {};
    this.clearMode = Normal;
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext("2d");
    this.loop(Date.now());
  }

  Object.defineProperty(Display.prototype, "width", {
    get: function get() {
      return this.canvas.width;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Display.prototype, "height", {
    get: function get() {
      return this.canvas.height;
    },
    enumerable: true,
    configurable: true
  });

  Display.prototype.addEventListener = function (target, func) {
    if (this.event[target] === undefined) {
      this.event[target] = [];
    }

    this.event[target].push(func);
  };

  Display.prototype.removeEventListener = function (target, func) {
    if (this.event[target] === undefined) return;
    this.event[target].filter(function (x) {
      return x !== func;
    });
  };

  Display.prototype.dispatchEvent = function (target, event) {
    this.children.filter(function (x) {
      return x.dispatchEvent !== undefined;
    }).map(function (x) {
      return x;
    }).forEach(function (x) {
      return x.dispatchEvent(target, event);
    });
    if (this.event[target] === undefined) return;
    this.event[target].forEach(function (func) {
      return func(event);
    });
  };

  Display.prototype.addChild = function (child) {
    this.children.push(child);
  };

  Display.prototype.removeChild = function (child) {
    this.children = this.children.filter(function (c) {
      return c !== child;
    });
  };

  Display.prototype.draw = function () {
    var _this = this;

    this.children.forEach(function (c) {
      return c.draw(_this.context);
    });
  };

  Display.prototype.loop = function (ms) {
    this.dispatchEvent("update", {
      type: "update",
      dt: (Date.now() - ms) * 1000
    });
    this.clear();
    this.draw();
    requestAnimationFrame(this.loop.bind(this, Date.now()));
  };

  Display.prototype.clear = function () {
    switch (this.clearMode.type_) {
      case "normal":
        this.context.save();
        this.context.fillStyle = new Utils_1.Color(255, 255, 255).toString();
        break;

      case "use_color":
        this.context.save();
        this.context.fillStyle = this.clearMode.color.toString();
        break;
    }

    this.context.fillRect(0, 0, this.width, this.height);
    this.context.restore();
  };

  return Display;
}();

exports.Display = Display;
},{"./Utils":"ts/Utils.ts"}],"ts/Drawable.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var Utils_1 = require("./Utils");

var Node =
/** @class */
function () {
  function Node() {
    this.rotate = 0;
    this.scale = new Utils_1.Vector(1, 1);
    this.event = {};
    this.children = [];
  }

  Node.prototype.addEventListener = function (target, func) {
    if (this.event[target] === undefined) {
      this.event[target] = [];
    }

    this.event[target].push(func);
  };

  Node.prototype.removeEventListener = function (target, func) {
    if (this.event[target] === undefined) return;
    this.event[target] = this.event[target].filter(function (x) {
      return x !== func;
    });
  };

  Node.prototype.dispatchEvent = function (target, event) {
    if (this.event[target] === undefined) return;
    this.event[target].forEach(function (func) {
      return func(event);
    });
  };

  Node.prototype.addChild = function (child) {
    this.children.push(child);
  };

  Node.prototype.removeChild = function (target) {
    this.children = this.children.filter(function (x) {
      return x !== target;
    });
  };

  Node.prototype.translate = function (ctx) {
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotate);
    ctx.scale(this.scale.x, this.scale.y);
  };

  return Node;
}();

exports.Node = Node;
},{"./Utils":"ts/Utils.ts"}],"ts/Drawable/Rect.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

exports.__esModule = true;

var Drawable_1 = require("../Drawable");

var Utils_1 = require("../Utils");

var Rect =
/** @class */
function (_super) {
  __extends(Rect, _super);

  function Rect(position, width, height, color) {
    if (width === void 0) {
      width = 0;
    }

    if (height === void 0) {
      height = 0;
    }

    if (color === void 0) {
      color = new Utils_1.Color();
    }

    var _this = _super.call(this) || this;

    _this.position = position;
    _this.width = width;
    _this.height = height;
    _this.color = color;
    return _this;
  }

  Rect.prototype.draw = function (ctx) {
    ctx.save();
    this.translate(ctx);
    this.children.forEach(function (x) {
      return x.draw(ctx);
    });
    ctx.fillStyle = this.color.toString();
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.setTransform(1, 0, 1, 0, 0, 0);
    ctx.restore();
  };

  return Rect;
}(Drawable_1.Node);

exports.Rect = Rect;
},{"../Drawable":"ts/Drawable.ts","../Utils":"ts/Utils.ts"}],"ts/Drawable/Circle.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

exports.__esModule = true;

var Drawable_1 = require("../Drawable");

var Utils_1 = require("../Utils");

var Circle =
/** @class */
function (_super) {
  __extends(Circle, _super);

  function Circle(position, radius, color) {
    if (radius === void 0) {
      radius = 0;
    }

    if (color === void 0) {
      color = new Utils_1.Color();
    }

    var _this = _super.call(this) || this;

    _this.position = position;
    _this.radius = radius;
    _this.color = color;
    return _this;
  }

  Circle.prototype.draw = function (ctx) {
    ctx.save();
    this.translate(ctx);
    this.children.forEach(function (x) {
      return x.draw(ctx);
    });
    ctx.fillStyle = this.color.toString();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.setTransform(1, 0, 1, 0, 0, 0);
    ctx.restore();
  };

  return Circle;
}(Drawable_1.Node);

exports.Circle = Circle;
},{"../Drawable":"ts/Drawable.ts","../Utils":"ts/Utils.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var Display_1 = require("./ts/Display");

var Rect_1 = require("./ts/Drawable/Rect");

var Utils_1 = require("./ts/Utils");

var Circle_1 = require("./ts/Drawable/Circle");

var display = new Display_1.Display();
var rect = new Rect_1.Rect(new Utils_1.Vector(100, 100), 100, 100, new Utils_1.Color(255, 0, 0));
var circle = new Circle_1.Circle(new Utils_1.Vector(200, 200), 50, new Utils_1.Color(0, 255, 0));
rect.addEventListener("update", function (_a) {
  var dt = _a.dt;
  rect.rotate += 10 * (180 / Math.PI / dt);
});
circle.addEventListener("update", function (_a) {
  var dt = _a.dt;
  circle.position = new Utils_1.Vector(Math.cos(dt), Math.sin(dt)).mul(10).add(Utils_1.Vector.one.mul(200));
});
rect.addChild(circle);
display.addChild(rect);
},{"./ts/Display":"ts/Display.ts","./ts/Drawable/Rect":"ts/Drawable/Rect.ts","./ts/Utils":"ts/Utils.ts","./ts/Drawable/Circle":"ts/Drawable/Circle.ts"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61877" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.map