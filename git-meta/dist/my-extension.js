// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/sourcegraph/src/index.js":[function(require,module,exports) {
var global = arguments[3];
// This is the module that is bundled with extensions when they use `import ... from 'sourcegraph'` or
// `require('sourcegraph')`. It delegates to the extension host's runtime implementation of this module by calling
// `global.require` (which ensures that the extension host's `require` is called at runtime).
//
// This dummy file is used when the extension is bundled with a JavaScript bundler that lacks support for externals
// (or when `sourcegraph` is not configured as an external module). Parcel does not support externals
// (https://github.com/parcel-bundler/parcel/issues/144). Webpack, Rollup, and Microbundle support externals.
module.exports = global.require('sourcegraph')

},{}],"my-extension.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activate = activate;

var sourcegraph = _interopRequireWildcard(require("sourcegraph"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

const repositoryDeleted = repoName => Promise.resolve(true);

const getRepoName = ({
  uri
}) => {
  const {
    hostname,
    pathname
  } = new URL(uri);
  return `${hostname}${pathname}`;
};

const getDeletedFileDecorations = ({
  text
}) => {
  var _a, _b;

  return _b = (_a = text) === null || _a === void 0 ? void 0 : _a.split(`\n`).map((_, index) => ({
    range: new sourcegraph.Range(new sourcegraph.Position(index, 0), new sourcegraph.Position(index, 0)),
    backgroundColor: 'hsl(0, 50%, 50%)'
  })), _b !== null && _b !== void 0 ? _b : [];
};

function activate(ctx) {
  const decorationType = sourcegraph.app.createDecorationType();
  const activeEditorChanges = ctx.subscriptions.add(sourcegraph.app.activeWindowChanges.subscribe(activeWindow => {
    if (!activeWindow) {
      return;
    }

    ctx.subscriptions.add(activeWindow.activeViewComponentChanges.subscribe(editor => __awaiter(this, void 0, void 0, function* () {
      if (!editor) {
        return;
      }

      const deleted = yield repositoryDeleted(getRepoName(editor.document)); // Add a red background color to code views in deleted repositories.

      if (deleted) {
        editor.setDecorations(decorationType, getDeletedFileDecorations(editor.document));
      }
    })));
  }));
  sourcegraph.search.registerQueryTransformer({
    // Register a query transformer to exclude deleted repositories.
    transformQuery: query => `${query} -r:^bitbucket\.sgdev\.org/SGDEMO`
  });
}
},{"sourcegraph":"../node_modules/sourcegraph/src/index.js"}]},{},["my-extension.ts"], null)
//# sourceMappingURL=/my-extension.js.map