/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 38146:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(92163);
var tryToString = __webpack_require__(40368);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 98514:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(23041);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 64465:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIndexedObject = __webpack_require__(19130);
var toAbsoluteIndex = __webpack_require__(63828);
var lengthOfArrayLike = __webpack_require__(25474);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 74021:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(73074);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 85425:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(48624);
var aCallable = __webpack_require__(38146);
var anObject = __webpack_require__(98514);

// https://github.com/tc39/collection-methods
module.exports = function addAll(/* ...elements */) {
  var set = anObject(this);
  var adder = aCallable(set.add);
  for (var k = 0, len = arguments.length; k < len; k++) {
    call(adder, set, arguments[k]);
  }
  return set;
};


/***/ }),

/***/ 50011:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(48624);
var aCallable = __webpack_require__(38146);
var anObject = __webpack_require__(98514);

// https://github.com/tc39/collection-methods
module.exports = function deleteAll(/* ...elements */) {
  var collection = anObject(this);
  var remover = aCallable(collection['delete']);
  var allDeleted = true;
  var wasDeleted;
  for (var k = 0, len = arguments.length; k < len; k++) {
    wasDeleted = call(remover, collection, arguments[k]);
    allDeleted = allDeleted && wasDeleted;
  }
  return !!allDeleted;
};


/***/ }),

/***/ 61401:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasOwn = __webpack_require__(21325);
var ownKeys = __webpack_require__(20810);
var getOwnPropertyDescriptorModule = __webpack_require__(99206);
var definePropertyModule = __webpack_require__(16572);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 27767:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(46372);
var definePropertyModule = __webpack_require__(16572);
var createPropertyDescriptor = __webpack_require__(48602);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 48602:
/***/ ((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 14039:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(92163);
var definePropertyModule = __webpack_require__(16572);
var makeBuiltIn = __webpack_require__(85954);
var defineGlobalProperty = __webpack_require__(95861);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 95861:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(63406);

// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 46372:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7931);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ 94193:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(63406);
var isObject = __webpack_require__(23041);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 20283:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(39997);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ 55111:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(63406);
var userAgent = __webpack_require__(20283);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 46606:
/***/ ((module) => {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 65942:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(63406);
var getOwnPropertyDescriptor = (__webpack_require__(99206).f);
var createNonEnumerableProperty = __webpack_require__(27767);
var defineBuiltIn = __webpack_require__(14039);
var defineGlobalProperty = __webpack_require__(95861);
var copyConstructorProperties = __webpack_require__(61401);
var isForced = __webpack_require__(21637);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 7931:
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 62637:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7931);

module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 48624:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_BIND = __webpack_require__(62637);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 30233:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(46372);
var hasOwn = __webpack_require__(21325);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 73074:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_BIND = __webpack_require__(62637);

var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var uncurryThis = NATIVE_BIND && bind.bind(call, call);

module.exports = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 39997:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(63406);
var isCallable = __webpack_require__(92163);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 54462:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var aCallable = __webpack_require__(38146);
var isNullOrUndefined = __webpack_require__(57900);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 63406:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 21325:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(73074);
var toObject = __webpack_require__(77410);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es-x/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 43730:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 53202:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(46372);
var fails = __webpack_require__(7931);
var createElement = __webpack_require__(94193);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ 52170:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(73074);
var fails = __webpack_require__(7931);
var classof = __webpack_require__(74021);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 22089:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(73074);
var isCallable = __webpack_require__(92163);
var store = __webpack_require__(12846);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 3987:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_WEAK_MAP = __webpack_require__(24617);
var global = __webpack_require__(63406);
var uncurryThis = __webpack_require__(73074);
var isObject = __webpack_require__(23041);
var createNonEnumerableProperty = __webpack_require__(27767);
var hasOwn = __webpack_require__(21325);
var shared = __webpack_require__(12846);
var sharedKey = __webpack_require__(1320);
var hiddenKeys = __webpack_require__(43730);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 92163:
/***/ ((module) => {

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 21637:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7931);
var isCallable = __webpack_require__(92163);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 57900:
/***/ ((module) => {

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 23041:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(92163);

var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var SPECIAL_DOCUMENT_ALL = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = SPECIAL_DOCUMENT_ALL ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 2884:
/***/ ((module) => {

module.exports = false;


/***/ }),

/***/ 85666:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(39997);
var isCallable = __webpack_require__(92163);
var isPrototypeOf = __webpack_require__(3071);
var USE_SYMBOL_AS_UID = __webpack_require__(99525);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 25474:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toLength = __webpack_require__(1403);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 85954:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7931);
var isCallable = __webpack_require__(92163);
var hasOwn = __webpack_require__(21325);
var DESCRIPTORS = __webpack_require__(46372);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(30233).CONFIGURABLE);
var inspectSource = __webpack_require__(22089);
var InternalStateModule = __webpack_require__(3987);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 855:
/***/ ((module) => {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es-x/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 16572:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(46372);
var IE8_DOM_DEFINE = __webpack_require__(53202);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(58814);
var anObject = __webpack_require__(98514);
var toPropertyKey = __webpack_require__(41973);

var $TypeError = TypeError;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 99206:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(46372);
var call = __webpack_require__(48624);
var propertyIsEnumerableModule = __webpack_require__(42251);
var createPropertyDescriptor = __webpack_require__(48602);
var toIndexedObject = __webpack_require__(19130);
var toPropertyKey = __webpack_require__(41973);
var hasOwn = __webpack_require__(21325);
var IE8_DOM_DEFINE = __webpack_require__(53202);

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 83311:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var internalObjectKeys = __webpack_require__(51429);
var enumBugKeys = __webpack_require__(46606);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 50395:
/***/ ((__unused_webpack_module, exports) => {

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 3071:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(73074);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 51429:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(73074);
var hasOwn = __webpack_require__(21325);
var toIndexedObject = __webpack_require__(19130);
var indexOf = (__webpack_require__(64465).indexOf);
var hiddenKeys = __webpack_require__(43730);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 42251:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 29207:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(48624);
var isCallable = __webpack_require__(92163);
var isObject = __webpack_require__(23041);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 20810:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(39997);
var uncurryThis = __webpack_require__(73074);
var getOwnPropertyNamesModule = __webpack_require__(83311);
var getOwnPropertySymbolsModule = __webpack_require__(50395);
var anObject = __webpack_require__(98514);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 65727:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isNullOrUndefined = __webpack_require__(57900);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 1320:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var shared = __webpack_require__(78519);
var uid = __webpack_require__(76004);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 12846:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(63406);
var defineGlobalProperty = __webpack_require__(95861);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ 78519:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var IS_PURE = __webpack_require__(2884);
var store = __webpack_require__(12846);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.25.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.25.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 73874:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es-x/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(55111);
var fails = __webpack_require__(7931);

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 63828:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIntegerOrInfinity = __webpack_require__(70400);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 19130:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(52170);
var requireObjectCoercible = __webpack_require__(65727);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 70400:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var trunc = __webpack_require__(855);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 1403:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIntegerOrInfinity = __webpack_require__(70400);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 77410:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var requireObjectCoercible = __webpack_require__(65727);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 18732:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(48624);
var isObject = __webpack_require__(23041);
var isSymbol = __webpack_require__(85666);
var getMethod = __webpack_require__(54462);
var ordinaryToPrimitive = __webpack_require__(29207);
var wellKnownSymbol = __webpack_require__(4259);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 41973:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPrimitive = __webpack_require__(18732);
var isSymbol = __webpack_require__(85666);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 40368:
/***/ ((module) => {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 76004:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(73074);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 99525:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es-x/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(73874);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 58814:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(46372);
var fails = __webpack_require__(7931);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ 24617:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(63406);
var isCallable = __webpack_require__(92163);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 4259:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(63406);
var shared = __webpack_require__(78519);
var hasOwn = __webpack_require__(21325);
var uid = __webpack_require__(76004);
var NATIVE_SYMBOL = __webpack_require__(73874);
var USE_SYMBOL_AS_UID = __webpack_require__(99525);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 51747:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(65942);
var addAll = __webpack_require__(85425);

// `WeakSet.prototype.addAll` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'WeakSet', proto: true, real: true, forced: true }, {
  addAll: addAll
});


/***/ }),

/***/ 57000:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(65942);
var deleteAll = __webpack_require__(50011);

// `WeakSet.prototype.deleteAll` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'WeakSet', proto: true, real: true, forced: true }, {
  deleteAll: deleteAll
});


/***/ }),

/***/ 53679:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.10.0 - Fri Aug 12 2022 19:42:44 */

  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */

  /* vim: set sts=2 sw=2 et tw=80: */

  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!globalThis.chrome?.runtime?.id) {
    throw new Error("This script should only be loaded in a browser extension.");
  }

  if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received."; // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.

    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };

      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }
      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */


      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }

        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }

          return super.get(key);
        }

      }
      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */


      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };
      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */


      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };

      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";
      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */


      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }

          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }

          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args); // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.

                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };
      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */


      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }

        });
      };

      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */

      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },

          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }

            if (!(prop in target)) {
              return undefined;
            }

            let value = target[prop];

            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.
              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,

                get() {
                  return target[prop];
                },

                set(value) {
                  target[prop] = value;
                }

              });
              return value;
            }

            cache[prop] = value;
            return value;
          },

          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }

            return true;
          },

          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },

          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }

        }; // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.

        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };
      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */


      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },

        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },

        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }

      });

      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */


        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {}
          /* wrappers */
          , {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */


        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;

          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }

          const isResultThenable = result !== true && isThenable(result); // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.

          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          } // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).


          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;

              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }

              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          }; // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.


          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          } // Let Chrome know that the listener is replying.


          return true;
        };
      });

      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };

      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };

      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    }; // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.


    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./node_modules/@adguard/tsurlfilter/dist/TSUrlFilterContentScript.js
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var extendedCss_umd = {exports: {}};

(function (module, exports) {
(function (global, factory) {
    factory(exports) ;
})(commonjsGlobal, (function (exports) {    const LEFT_SQUARE_BRACKET = '[';
    const RIGHT_SQUARE_BRACKET = ']';
    const LEFT_PARENTHESIS = '(';
    const RIGHT_PARENTHESIS = ')';
    const LEFT_CURLY_BRACKET = '{';
    const RIGHT_CURLY_BRACKET = '}';
    const BRACKETS = {
      SQUARE: {
        LEFT: LEFT_SQUARE_BRACKET,
        RIGHT: RIGHT_SQUARE_BRACKET
      },
      PARENTHESES: {
        LEFT: LEFT_PARENTHESIS,
        RIGHT: RIGHT_PARENTHESIS
      },
      CURLY: {
        LEFT: LEFT_CURLY_BRACKET,
        RIGHT: RIGHT_CURLY_BRACKET
      }
    };
    const SLASH = '/';
    const BACKSLASH = '\\';
    const SPACE = ' ';
    const COMMA = ',';
    const DOT = '.';
    const SEMICOLON = ';';
    const COLON = ':';
    const SINGLE_QUOTE = '\'';
    const DOUBLE_QUOTE = '"';
    const CARET = '^';
    const DOLLAR_SIGN = '$';
    const EQUAL_SIGN = '=';
    const TAB = '\t';
    const CARRIAGE_RETURN = '\r';
    const LINE_FEED = '\n';
    const FORM_FEED = '\f';
    const WHITE_SPACE_CHARACTERS = [SPACE, TAB, CARRIAGE_RETURN, LINE_FEED, FORM_FEED];
    const ASTERISK = '*';
    const ID_MARKER = '#';
    const CLASS_MARKER = DOT;
    const DESCENDANT_COMBINATOR = SPACE;
    const CHILD_COMBINATOR = '>';
    const NEXT_SIBLING_COMBINATOR = '+';
    const SUBSEQUENT_SIBLING_COMBINATOR = '~';
    const COMBINATORS = [DESCENDANT_COMBINATOR, CHILD_COMBINATOR, NEXT_SIBLING_COMBINATOR, SUBSEQUENT_SIBLING_COMBINATOR];
    const SUPPORTED_SELECTOR_MARKS = [LEFT_SQUARE_BRACKET, RIGHT_SQUARE_BRACKET, LEFT_PARENTHESIS, RIGHT_PARENTHESIS, LEFT_CURLY_BRACKET, RIGHT_CURLY_BRACKET, SLASH, BACKSLASH, SEMICOLON, COLON, COMMA, SINGLE_QUOTE, DOUBLE_QUOTE, CARET, DOLLAR_SIGN, ASTERISK, ID_MARKER, CLASS_MARKER, DESCENDANT_COMBINATOR, CHILD_COMBINATOR, NEXT_SIBLING_COMBINATOR, SUBSEQUENT_SIBLING_COMBINATOR, TAB, CARRIAGE_RETURN, LINE_FEED, FORM_FEED];
    const CONTAINS_PSEUDO = 'contains';
    const HAS_TEXT_PSEUDO = 'has-text';
    const ABP_CONTAINS_PSEUDO = '-abp-contains';
    const MATCHES_CSS_PSEUDO = 'matches-css';
    const MATCHES_CSS_BEFORE_PSEUDO = 'matches-css-before';
    const MATCHES_CSS_AFTER_PSEUDO = 'matches-css-after';
    const MATCHES_ATTR_PSEUDO_CLASS_MARKER = 'matches-attr';
    const MATCHES_PROPERTY_PSEUDO_CLASS_MARKER = 'matches-property';
    const XPATH_PSEUDO_CLASS_MARKER = 'xpath';
    const NTH_ANCESTOR_PSEUDO_CLASS_MARKER = 'nth-ancestor';
    const CONTAINS_PSEUDO_NAMES = [CONTAINS_PSEUDO, HAS_TEXT_PSEUDO, ABP_CONTAINS_PSEUDO];
    const UPWARD_PSEUDO_CLASS_MARKER = 'upward';
    const REMOVE_PSEUDO_MARKER = 'remove';
    const HAS_PSEUDO_CLASS_MARKER = 'has';
    const IF_PSEUDO_CLASS_MARKER = 'if';
    const ABP_HAS_PSEUDO_CLASS_MARKER = '-abp-has';
    const HAS_PSEUDO_CLASS_MARKERS = [HAS_PSEUDO_CLASS_MARKER, IF_PSEUDO_CLASS_MARKER, ABP_HAS_PSEUDO_CLASS_MARKER];
    const IF_NOT_PSEUDO_CLASS_MARKER = 'if-not';
    const IS_PSEUDO_CLASS_MARKER = 'is';
    const NOT_PSEUDO_CLASS_MARKER = 'not';
    const ABSOLUTE_PSEUDO_CLASSES = [CONTAINS_PSEUDO, HAS_TEXT_PSEUDO, ABP_CONTAINS_PSEUDO, MATCHES_CSS_PSEUDO, MATCHES_CSS_BEFORE_PSEUDO, MATCHES_CSS_AFTER_PSEUDO, MATCHES_ATTR_PSEUDO_CLASS_MARKER, MATCHES_PROPERTY_PSEUDO_CLASS_MARKER, XPATH_PSEUDO_CLASS_MARKER, NTH_ANCESTOR_PSEUDO_CLASS_MARKER, UPWARD_PSEUDO_CLASS_MARKER];
    const RELATIVE_PSEUDO_CLASSES = [...HAS_PSEUDO_CLASS_MARKERS, IF_NOT_PSEUDO_CLASS_MARKER, IS_PSEUDO_CLASS_MARKER, NOT_PSEUDO_CLASS_MARKER];
    const SUPPORTED_PSEUDO_CLASSES = [...ABSOLUTE_PSEUDO_CLASSES, ...RELATIVE_PSEUDO_CLASSES];
    const SCOPE_CSS_PSEUDO_CLASS = ':scope';
    const REGULAR_PSEUDO_ELEMENTS = {
      AFTER: 'after',
      BACKDROP: 'backdrop',
      BEFORE: 'before',
      CUE: 'cue',
      CUE_REGION: 'cue-region',
      FIRST_LETTER: 'first-letter',
      FIRST_LINE: 'first-line',
      FILE_SELECTION_BUTTON: 'file-selector-button',
      GRAMMAR_ERROR: 'grammar-error',
      MARKER: 'marker',
      PART: 'part',
      PLACEHOLDER: 'placeholder',
      SELECTION: 'selection',
      SLOTTED: 'slotted',
      SPELLING_ERROR: 'spelling-error',
      TARGET_TEXT: 'target-text'
    };
    const PSEUDO_PROPERTY_POSITIVE_VALUE = 'true';
    const DEBUG_PSEUDO_PROPERTY_GLOBAL_VALUE = 'global';
    const STYLESHEET_ERROR_PREFIX = {
      NO_STYLE: 'No style declaration at stylesheet part',
      NO_SELECTOR: 'Selector should be defined before style declaration in stylesheet',
      INVALID_STYLE: 'Invalid style declaration at stylesheet part',
      UNCLOSED_STYLE: 'Unclosed style declaration at stylesheet part',
      NO_PROPERTY: 'Missing style property in declaration at stylesheet part',
      NO_VALUE: 'Missing style value in declaration at stylesheet part',
      NO_STYLE_OR_REMOVE: 'Invalid stylesheet - no style declared or :remove() pseudo-class used',
      NO_COMMENT: 'Comments in stylesheet are not supported'
    };
    const REMOVE_ERROR_PREFIX = {
      INVALID_REMOVE: 'Invalid :remove() pseudo-class in selector',
      NO_TARGET_SELECTOR: 'Selector should be specified before :remove() pseudo-class',
      MULTIPLE_USAGE: 'Pseudo-class :remove() appears more than once in selector',
      INVALID_POSITION: 'Pseudo-class :remove() should be at the end of selector'
    };
    const MATCHING_ELEMENT_ERROR_PREFIX = 'Error while matching element';
    const MAX_STYLE_PROTECTION_COUNT = 50;
    const removeSuffix = (str, suffix) => {
      const index = str.indexOf(suffix, str.length - suffix.length);
      if (index >= 0) {
        return str.substring(0, index);
      }
      return str;
    };
    const replaceAll = (input, pattern, replacement) => {
      if (!input) {
        return input;
      }
      return input.split(pattern).join(replacement);
    };
    const toRegExp = str => {
      if (str.startsWith(SLASH) && str.endsWith(SLASH)) {
        return new RegExp(str.slice(1, -1));
      }
      const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(escaped);
    };
    const convertTypeIntoString = value => {
      let output;
      switch (value) {
        case undefined:
          output = 'undefined';
          break;
        case null:
          output = 'null';
          break;
        default:
          output = value.toString();
      }
      return output;
    };
    const convertTypeFromString = value => {
      const numValue = Number(value);
      let output;
      if (!Number.isNaN(numValue)) {
        output = numValue;
      } else {
        switch (value) {
          case 'undefined':
            output = undefined;
            break;
          case 'null':
            output = null;
            break;
          case 'true':
            output = true;
            break;
          case 'false':
            output = false;
            break;
          default:
            output = value;
        }
      }
      return output;
    };
    const logger = {
      error: typeof console !== 'undefined' && console.error && console.error.bind ? console.error.bind(window.console) : console.error,
      info: typeof console !== 'undefined' && console.info && console.info.bind ? console.info.bind(window.console) : console.info
    };
    var BrowserName;
    (function (BrowserName) {
      BrowserName["Chrome"] = "Chrome";
      BrowserName["Firefox"] = "Firefox";
      BrowserName["Edge"] = "Edg";
      BrowserName["Opera"] = "Opera";
      BrowserName["Safari"] = "Safari";
    })(BrowserName || (BrowserName = {}));
    const CHROMIUM_BRAND_NAME = 'Chromium';
    const GOOGLE_CHROME_BRAND_NAME = 'Google Chrome';
    const isSafariBrowser = navigator.vendor === 'Apple Computer, Inc.';
    const SUPPORTED_BROWSERS_DATA = {
      [BrowserName.Chrome]: {
        MASK: /\s(Chrome)\/(\d+)\..+\s(?!.*Edg\/)/,
        MIN_VERSION: 55
      },
      [BrowserName.Firefox]: {
        MASK: /\s(Firefox)\/(\d+)\./,
        MIN_VERSION: 52
      },
      [BrowserName.Edge]: {
        MASK: /\s(Edg)\/(\d+)\./,
        MIN_VERSION: 80
      },
      [BrowserName.Opera]: {
        MASK: /\s(OPR)\/(\d+)\./,
        MIN_VERSION: 80
      },
      [BrowserName.Safari]: {
        MASK: /\sVersion\/(\d{2}\.\d)(.+\s|\s)(Safari)\//,
        MIN_VERSION: 11.1
      }
    };
    const getChromiumBrand = () => {
      var _navigator$userAgentD;
      const brandsData = (_navigator$userAgentD = navigator.userAgentData) === null || _navigator$userAgentD === void 0 ? void 0 : _navigator$userAgentD.brands;
      if (!brandsData) {
        return null;
      }
      const chromiumBrand = brandsData.find(brandData => {
        return brandData.brand === CHROMIUM_BRAND_NAME || brandData.brand === GOOGLE_CHROME_BRAND_NAME;
      });
      return chromiumBrand || null;
    };
    const parseUserAgent = () => {
      let browserName;
      let currentVersion;
      const browserNames = Object.values(BrowserName);
      for (let i = 0; i < browserNames.length; i += 1) {
        const match = SUPPORTED_BROWSERS_DATA[browserNames[i]].MASK.exec(navigator.userAgent);
        if (match) {
          if (match[3] === browserNames[i]) {
            browserName = match[3];
            currentVersion = Number(match[1]);
          } else {
            browserName = match[1];
            currentVersion = Number(match[2]);
          }
          return {
            browserName,
            currentVersion
          };
        }
      }
      return null;
    };
    const getCurrentBrowserInfoAsSupported = () => {
      const brandData = getChromiumBrand();
      if (!brandData) {
        const uaInfo = parseUserAgent();
        if (!uaInfo) {
          return null;
        }
        const browserName = uaInfo.browserName,
              currentVersion = uaInfo.currentVersion;
        return {
          browserName,
          currentVersion
        };
      }
      const brand = brandData.brand,
            version = brandData.version;
      const browserName = brand === CHROMIUM_BRAND_NAME || brand === GOOGLE_CHROME_BRAND_NAME ? BrowserName.Chrome : brand;
      return {
        browserName,
        currentVersion: Number(version)
      };
    };
    const isBrowserSupported = () => {
      const ua = navigator.userAgent;
      if (ua.includes('MSIE') || ua.includes('Trident/')) {
        return false;
      }
      if (ua.includes('jsdom')) {
        return true;
      }
      const currentBrowserData = getCurrentBrowserInfoAsSupported();
      if (!currentBrowserData) {
        return false;
      }
      const browserName = currentBrowserData.browserName,
            currentVersion = currentBrowserData.currentVersion;
      return currentVersion >= SUPPORTED_BROWSERS_DATA[browserName].MIN_VERSION;
    };
    const natives = {
      MutationObserver: window.MutationObserver || window.WebKitMutationObserver
    };
    const nodeTextContentGetter = (() => {
      var _Object$getOwnPropert;
      const nativeNode = window.Node || Node;
      return (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(nativeNode.prototype, 'textContent')) === null || _Object$getOwnPropert === void 0 ? void 0 : _Object$getOwnPropert.get;
    })();
    const getNodeTextContent = domElement => {
      return (nodeTextContentGetter === null || nodeTextContentGetter === void 0 ? void 0 : nodeTextContentGetter.apply(domElement)) || '';
    };
    const getElementSelectorDesc = element => {
      let selectorText = element.tagName.toLowerCase();
      selectorText += Array.from(element.attributes).map(attr => {
        return "[".concat(attr.name, "=\"").concat(element.getAttribute(attr.name), "\"]");
      }).join('');
      return selectorText;
    };
    const getElementSelectorPath = inputEl => {
      if (!(inputEl instanceof Element)) {
        throw new Error('Function received argument with wrong type');
      }
      let el;
      el = inputEl;
      const path = [];
      while (!!el && el.nodeType === Node.ELEMENT_NODE) {
        let selector = el.nodeName.toLowerCase();
        if (el.id && typeof el.id === 'string') {
          selector += "#".concat(el.id);
          path.unshift(selector);
          break;
        }
        let sibling = el;
        let nth = 1;
        while (sibling.previousElementSibling) {
          sibling = sibling.previousElementSibling;
          if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName.toLowerCase() === selector) {
            nth += 1;
          }
        }
        if (nth !== 1) {
          selector += ":nth-of-type(".concat(nth, ")");
        }
        path.unshift(selector);
        el = el.parentElement;
      }
      return path.join(' > ');
    };
    const isHtmlElement = element => {
      return element instanceof HTMLElement;
    };
    var CssProperty;
    (function (CssProperty) {
      CssProperty["Background"] = "background";
      CssProperty["BackgroundImage"] = "background-image";
      CssProperty["Content"] = "content";
      CssProperty["Opacity"] = "opacity";
    })(CssProperty || (CssProperty = {}));
    const REGEXP_ANY_SYMBOL = '.*';
    const REGEXP_WITH_FLAGS_REGEXP = /^\s*\/.*\/[gmisuy]*\s*$/;
    const removeContentQuotes = str => {
      return str.replace(/^(["'])([\s\S]*)\1$/, '$2');
    };
    const addUrlPropertyQuotes = str => {
      if (!str.includes('url("')) {
        const re = /url\((.*?)\)/g;
        return str.replace(re, 'url("$1")');
      }
      return str;
    };
    const addUrlQuotesTo = {
      regexpArg: str => {
        const re = /(\^)?url(\\)?\\\((\w|\[\w)/g;
        return str.replace(re, '$1url$2\\(\\"?$3');
      },
      noneRegexpArg: addUrlPropertyQuotes
    };
    const escapeRegExp = str => {
      const specials = ['.', '+', '?', '$', '{', '}', '(', ')', '[', ']', '\\', '/'];
      const specialsRegex = new RegExp("[".concat(specials.join('\\'), "]"), 'g');
      return str.replace(specialsRegex, '\\$&');
    };
    const convertStyleMatchValueToRegexp = rawValue => {
      let value;
      if (rawValue.startsWith(SLASH) && rawValue.endsWith(SLASH)) {
        value = addUrlQuotesTo.regexpArg(rawValue);
        value = value.slice(1, -1);
      } else {
        value = addUrlQuotesTo.noneRegexpArg(rawValue);
        value = value.replace(/\\([\\()[\]"])/g, '$1');
        value = escapeRegExp(value);
        value = replaceAll(value, ASTERISK, REGEXP_ANY_SYMBOL);
      }
      return new RegExp(value, 'i');
    };
    const normalizePropertyValue = (propertyName, propertyValue) => {
      let normalized = '';
      switch (propertyName) {
        case CssProperty.Background:
        case CssProperty.BackgroundImage:
          normalized = addUrlPropertyQuotes(propertyValue);
          break;
        case CssProperty.Content:
          normalized = removeContentQuotes(propertyValue);
          break;
        case CssProperty.Opacity:
          normalized = isSafariBrowser ? (Math.round(parseFloat(propertyValue) * 100) / 100).toString() : propertyValue;
          break;
        default:
          normalized = propertyValue;
      }
      return normalized;
    };
    const getComputedStylePropertyValue = (domElement, propertyName, regularPseudoElement) => {
      const style = window.getComputedStyle(domElement, regularPseudoElement);
      const propertyValue = style.getPropertyValue(propertyName);
      return normalizePropertyValue(propertyName, propertyValue);
    };
    const getPseudoArgData = (pseudoArg, separator) => {
      const index = pseudoArg.indexOf(separator);
      let name;
      let value;
      if (index > -1) {
        name = pseudoArg.substring(0, index).trim();
        value = pseudoArg.substring(index + 1).trim();
      } else {
        name = pseudoArg;
      }
      return {
        name,
        value
      };
    };
    const parseStyleMatchArg = (pseudoName, rawArg) => {
      const _getPseudoArgData = getPseudoArgData(rawArg, COMMA),
            name = _getPseudoArgData.name,
            value = _getPseudoArgData.value;
      let regularPseudoElement = name;
      let styleMatchArg = value;
      if (!Object.values(REGULAR_PSEUDO_ELEMENTS).includes(name)) {
        regularPseudoElement = null;
        styleMatchArg = rawArg;
      }
      if (!styleMatchArg) {
        throw new Error("Required style property argument part is missing in :".concat(pseudoName, "() arg: '").concat(rawArg, "'"));
      }
      return {
        regularPseudoElement,
        styleMatchArg
      };
    };
    const isStyleMatched = argsData => {
      const pseudoName = argsData.pseudoName,
            pseudoArg = argsData.pseudoArg,
            domElement = argsData.domElement;
      const _parseStyleMatchArg = parseStyleMatchArg(pseudoName, pseudoArg),
            regularPseudoElement = _parseStyleMatchArg.regularPseudoElement,
            styleMatchArg = _parseStyleMatchArg.styleMatchArg;
      const _getPseudoArgData2 = getPseudoArgData(styleMatchArg, COLON),
            matchName = _getPseudoArgData2.name,
            matchValue = _getPseudoArgData2.value;
      if (!matchName || !matchValue) {
        throw new Error("Required property name or value is missing in :".concat(pseudoName, "() arg: '").concat(styleMatchArg, "'"));
      }
      let valueRegexp;
      try {
        valueRegexp = convertStyleMatchValueToRegexp(matchValue);
      } catch (e) {
        logger.error(e);
        throw new Error("Invalid argument of :".concat(pseudoName, "() pseudo-class: '").concat(styleMatchArg, "'"));
      }
      const value = getComputedStylePropertyValue(domElement, matchName, regularPseudoElement);
      return valueRegexp && valueRegexp.test(value);
    };
    const validateStrMatcherArg = arg => {
      if (arg.includes(SLASH)) {
        return false;
      }
      if (!/^[\w-]+$/.test(arg)) {
        return false;
      }
      return true;
    };
    const getValidMatcherArg = function getValidMatcherArg(rawArg) {
      let isWildcardAllowed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      let arg;
      if (rawArg.length > 1 && rawArg.startsWith(DOUBLE_QUOTE) && rawArg.endsWith(DOUBLE_QUOTE)) {
        rawArg = rawArg.slice(1, -1);
      }
      if (rawArg === '') {
        throw new Error('Argument should be specified. Empty arg is invalid.');
      }
      if (rawArg.startsWith(SLASH) && rawArg.endsWith(SLASH)) {
        if (rawArg.length > 2) {
          arg = toRegExp(rawArg);
        } else {
          throw new Error("Invalid regexp: '".concat(rawArg, "'"));
        }
      } else if (rawArg.includes(ASTERISK)) {
        if (rawArg === ASTERISK && !isWildcardAllowed) {
          throw new Error("Argument should be more specific than ".concat(rawArg));
        }
        arg = replaceAll(rawArg, ASTERISK, REGEXP_ANY_SYMBOL);
        arg = new RegExp(arg);
      } else {
        if (!validateStrMatcherArg(rawArg)) {
          throw new Error("Invalid argument: '".concat(rawArg, "'"));
        }
        arg = rawArg;
      }
      return arg;
    };
    const getRawMatchingData = (pseudoName, pseudoArg) => {
      const _getPseudoArgData3 = getPseudoArgData(pseudoArg, EQUAL_SIGN),
            rawName = _getPseudoArgData3.name,
            rawValue = _getPseudoArgData3.value;
      if (!rawName) {
        throw new Error("Required attribute name is missing in :".concat(pseudoName, " arg: ").concat(pseudoArg));
      }
      return {
        rawName,
        rawValue
      };
    };
    const isAttributeMatched = argsData => {
      const pseudoName = argsData.pseudoName,
            pseudoArg = argsData.pseudoArg,
            domElement = argsData.domElement;
      const elementAttributes = domElement.attributes;
      if (elementAttributes.length === 0) {
        return false;
      }
      const _getRawMatchingData = getRawMatchingData(pseudoName, pseudoArg),
            rawAttrName = _getRawMatchingData.rawName,
            rawAttrValue = _getRawMatchingData.rawValue;
      let attrNameMatch;
      try {
        attrNameMatch = getValidMatcherArg(rawAttrName);
      } catch (e) {
        logger.error(e);
        throw new SyntaxError(e.message);
      }
      let isMatched = false;
      let i = 0;
      while (i < elementAttributes.length && !isMatched) {
        const attr = elementAttributes[i];
        const isNameMatched = attrNameMatch instanceof RegExp ? attrNameMatch.test(attr.name) : attrNameMatch === attr.name;
        if (!rawAttrValue) {
          isMatched = isNameMatched;
        } else {
          let attrValueMatch;
          try {
            attrValueMatch = getValidMatcherArg(rawAttrValue);
          } catch (e) {
            logger.error(e);
            throw new SyntaxError(e.message);
          }
          const isValueMatched = attrValueMatch instanceof RegExp ? attrValueMatch.test(attr.value) : attrValueMatch === attr.value;
          isMatched = isNameMatched && isValueMatched;
        }
        i += 1;
      }
      return isMatched;
    };
    const parseRawPropChain = input => {
      if (input.length > 1 && input.startsWith(DOUBLE_QUOTE) && input.endsWith(DOUBLE_QUOTE)) {
        input = input.slice(1, -1);
      }
      const chainChunks = input.split(DOT);
      const chainPatterns = [];
      let patternBuffer = '';
      let isRegexpPattern = false;
      let i = 0;
      while (i < chainChunks.length) {
        const chunk = chainChunks[i];
        if (chunk.startsWith(SLASH) && chunk.endsWith(SLASH) && chunk.length > 2) {
          chainPatterns.push(chunk);
        } else if (chunk.startsWith(SLASH)) {
          isRegexpPattern = true;
          patternBuffer += chunk;
        } else if (chunk.endsWith(SLASH)) {
          isRegexpPattern = false;
          patternBuffer += ".".concat(chunk);
          chainPatterns.push(patternBuffer);
          patternBuffer = '';
        } else {
          if (isRegexpPattern) {
            patternBuffer += chunk;
          } else {
            chainPatterns.push(chunk);
          }
        }
        i += 1;
      }
      if (patternBuffer.length > 0) {
        throw new Error("Invalid regexp property pattern '".concat(input, "'"));
      }
      const chainMatchPatterns = chainPatterns.map(pattern => {
        if (pattern.length === 0) {
          throw new Error("Empty pattern '".concat(pattern, "' is invalid in chain '").concat(input, "'"));
        }
        let validPattern;
        try {
          validPattern = getValidMatcherArg(pattern, true);
        } catch (e) {
          logger.error(e);
          throw new Error("Invalid property pattern '".concat(pattern, "' in property chain '").concat(input, "'"));
        }
        return validPattern;
      });
      return chainMatchPatterns;
    };
    const filterRootsByRegexpChain = function filterRootsByRegexpChain(base, chain) {
      let output = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      const tempProp = chain[0];
      if (chain.length === 1) {
        let key;
        for (key in base) {
          if (tempProp instanceof RegExp) {
            if (tempProp.test(key)) {
              output.push({
                base,
                prop: key,
                value: base[key]
              });
            }
          } else if (tempProp === key) {
            output.push({
              base,
              prop: tempProp,
              value: base[key]
            });
          }
        }
        return output;
      }
      if (tempProp instanceof RegExp) {
        const nextProp = chain.slice(1);
        const baseKeys = [];
        for (const key in base) {
          if (tempProp.test(key)) {
            baseKeys.push(key);
          }
        }
        baseKeys.forEach(key => {
          var _Object$getOwnPropert;
          const item = (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(base, key)) === null || _Object$getOwnPropert === void 0 ? void 0 : _Object$getOwnPropert.value;
          filterRootsByRegexpChain(item, nextProp, output);
        });
      }
      if (base && typeof tempProp === 'string') {
        var _Object$getOwnPropert2;
        const nextBase = (_Object$getOwnPropert2 = Object.getOwnPropertyDescriptor(base, tempProp)) === null || _Object$getOwnPropert2 === void 0 ? void 0 : _Object$getOwnPropert2.value;
        chain = chain.slice(1);
        if (nextBase !== undefined) {
          filterRootsByRegexpChain(nextBase, chain, output);
        }
      }
      return output;
    };
    const isPropertyMatched = argsData => {
      const pseudoName = argsData.pseudoName,
            pseudoArg = argsData.pseudoArg,
            domElement = argsData.domElement;
      const _getRawMatchingData2 = getRawMatchingData(pseudoName, pseudoArg),
            rawPropertyName = _getRawMatchingData2.rawName,
            rawPropertyValue = _getRawMatchingData2.rawValue;
      if (rawPropertyName.includes('\\/') || rawPropertyName.includes('\\.')) {
        throw new Error("Invalid :".concat(pseudoName, " name pattern: ").concat(rawPropertyName));
      }
      let propChainMatches;
      try {
        propChainMatches = parseRawPropChain(rawPropertyName);
      } catch (e) {
        logger.error(e);
        throw new SyntaxError(e.message);
      }
      const ownerObjArr = filterRootsByRegexpChain(domElement, propChainMatches);
      if (ownerObjArr.length === 0) {
        return false;
      }
      let isMatched = true;
      if (rawPropertyValue) {
        let propValueMatch;
        try {
          propValueMatch = getValidMatcherArg(rawPropertyValue);
        } catch (e) {
          logger.error(e);
          throw new SyntaxError(e.message);
        }
        if (propValueMatch) {
          for (let i = 0; i < ownerObjArr.length; i += 1) {
            const realValue = ownerObjArr[i].value;
            if (propValueMatch instanceof RegExp) {
              isMatched = propValueMatch.test(convertTypeIntoString(realValue));
            } else {
              if (realValue === 'null' || realValue === 'undefined') {
                isMatched = propValueMatch === realValue;
                break;
              }
              isMatched = convertTypeFromString(propValueMatch) === realValue;
            }
            if (isMatched) {
              break;
            }
          }
        }
      }
      return isMatched;
    };
    const isTextMatched = argsData => {
      const pseudoName = argsData.pseudoName,
            pseudoArg = argsData.pseudoArg,
            domElement = argsData.domElement;
      const textContent = getNodeTextContent(domElement);
      let isTextContentMatched;
      let pseudoArgToMatch = pseudoArg;
      if (pseudoArgToMatch.startsWith(SLASH) && REGEXP_WITH_FLAGS_REGEXP.test(pseudoArgToMatch)) {
        const flagsIndex = pseudoArgToMatch.lastIndexOf('/');
        const flagsStr = pseudoArgToMatch.substring(flagsIndex + 1);
        pseudoArgToMatch = pseudoArgToMatch.substring(0, flagsIndex + 1).slice(1, -1).replace(/\\([\\"])/g, '$1');
        let regex;
        try {
          regex = new RegExp(pseudoArgToMatch, flagsStr);
        } catch (e) {
          throw new Error("Invalid argument of :".concat(pseudoName, "() pseudo-class: ").concat(pseudoArg));
        }
        isTextContentMatched = regex.test(textContent);
      } else {
        pseudoArgToMatch = pseudoArgToMatch.replace(/\\([\\()[\]"])/g, '$1');
        isTextContentMatched = textContent.includes(pseudoArgToMatch);
      }
      return isTextContentMatched;
    };
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    let NodeType;
    (function (NodeType) {
      NodeType["SelectorList"] = "SelectorList";
      NodeType["Selector"] = "Selector";
      NodeType["RegularSelector"] = "RegularSelector";
      NodeType["ExtendedSelector"] = "ExtendedSelector";
      NodeType["AbsolutePseudoClass"] = "AbsolutePseudoClass";
      NodeType["RelativePseudoClass"] = "RelativePseudoClass";
    })(NodeType || (NodeType = {}));
    class AnySelectorNode {
      constructor(type) {
        _defineProperty(this, "children", []);
        this.type = type;
      }
      addChild(child) {
        this.children.push(child);
      }
    }
    class RegularSelectorNode extends AnySelectorNode {
      constructor(value) {
        super(NodeType.RegularSelector);
        this.value = value;
      }
    }
    class RelativePseudoClassNode extends AnySelectorNode {
      constructor(name) {
        super(NodeType.RelativePseudoClass);
        this.name = name;
      }
    }
    class AbsolutePseudoClassNode extends AnySelectorNode {
      constructor(name) {
        super(NodeType.AbsolutePseudoClass);
        _defineProperty(this, "value", '');
        this.name = name;
      }
    }
    const REGEXP_VALID_OLD_SYNTAX = /\[-(?:ext)-([a-z-_]+)=(["'])((?:(?=(\\?))\4.)*?)\2\]/g;
    const INVALID_OLD_SYNTAX_MARKER = '[-ext-';
    const evaluateMatch = (match, name, quoteChar, rawValue) => {
      const re = new RegExp("([^\\\\]|^)\\\\".concat(quoteChar), 'g');
      const value = rawValue.replace(re, "$1".concat(quoteChar));
      return ":".concat(name, "(").concat(value, ")");
    };
    const reScope = /\(:scope >/g;
    const SCOPE_REPLACER = '(>';
    const MATCHES_CSS_PSEUDO_ELEMENT_REGEXP = /(:matches-css)-(before|after)\(/g;
    const convertMatchesCss = (match, extendedPseudoClass, regularPseudoElement) => {
      return "".concat(extendedPseudoClass).concat(BRACKETS.PARENTHESES.LEFT).concat(regularPseudoElement).concat(COMMA);
    };
    const normalize = selector => {
      const normalizedSelector = selector.replace(REGEXP_VALID_OLD_SYNTAX, evaluateMatch).replace(reScope, SCOPE_REPLACER).replace(MATCHES_CSS_PSEUDO_ELEMENT_REGEXP, convertMatchesCss);
      if (normalizedSelector.includes(INVALID_OLD_SYNTAX_MARKER)) {
        throw new Error("Invalid extended-css old syntax selector: '".concat(selector, "'"));
      }
      return normalizedSelector;
    };
    const convert = rawSelector => {
      const trimmedSelector = rawSelector.trim();
      return normalize(trimmedSelector);
    };
    let TokenType;
    (function (TokenType) {
      TokenType["Mark"] = "mark";
      TokenType["Word"] = "word";
    })(TokenType || (TokenType = {}));
    const tokenize = rawSelector => {
      const selector = convert(rawSelector);
      let symbol;
      let buffer = '';
      const tokens = [];
      for (let i = 0; i < selector.length; i += 1) {
        symbol = selector[i];
        if (SUPPORTED_SELECTOR_MARKS.includes(symbol)) {
          tokens.push({
            type: TokenType.Mark,
            value: symbol
          });
          continue;
        }
        buffer += symbol;
        const nextSymbol = selector[i + 1];
        if (!nextSymbol || SUPPORTED_SELECTOR_MARKS.includes(nextSymbol)) {
          tokens.push({
            type: TokenType.Word,
            value: buffer
          });
          buffer = '';
        }
      }
      return tokens;
    };
    const flatten = input => {
      const stack = [];
      input.forEach(el => stack.push(el));
      const res = [];
      while (stack.length) {
        const next = stack.pop();
        if (!next) {
          throw new Error('Unable to make array flat');
        }
        if (Array.isArray(next)) {
          next.forEach(el => stack.push(el));
        } else {
          res.push(next);
        }
      }
      return res.reverse();
    };
    const getLast = array => {
      return array[array.length - 1];
    };
    const IS_OR_NOT_PSEUDO_SELECTING_ROOT = "html ".concat(ASTERISK);
    const XPATH_PSEUDO_SELECTING_ROOT = 'body';
    const isSupportedExtendedPseudo = tokenValue => SUPPORTED_PSEUDO_CLASSES.includes(tokenValue);
    const doesRegularContinueAfterSpace = (nextTokenType, nextTokenValue) => {
      return COMBINATORS.includes(nextTokenValue) || nextTokenType === TokenType.Word
      || nextTokenValue === ASTERISK || nextTokenValue === ID_MARKER || nextTokenValue === CLASS_MARKER
      || nextTokenValue === COLON
      || nextTokenValue === SINGLE_QUOTE
      || nextTokenValue === DOUBLE_QUOTE || nextTokenValue === BRACKETS.SQUARE.LEFT;
    };
    const POSSIBLE_MARKS_BEFORE_REGEXP = {
      COMMON: [
      BRACKETS.PARENTHESES.LEFT,
      SINGLE_QUOTE,
      DOUBLE_QUOTE,
      EQUAL_SIGN,
      DOT,
      COLON,
      SPACE],
      CONTAINS: [
      BRACKETS.PARENTHESES.LEFT,
      SINGLE_QUOTE,
      DOUBLE_QUOTE]
    };
    const isRegexpOpening = (context, prevTokenValue, bufferNodeValue) => {
      const lastExtendedPseudoClassName = getLast(context.extendedPseudoNamesStack);
      if (CONTAINS_PSEUDO_NAMES.includes(lastExtendedPseudoClassName)) {
        return POSSIBLE_MARKS_BEFORE_REGEXP.CONTAINS.includes(prevTokenValue);
      }
      if (prevTokenValue === SLASH && lastExtendedPseudoClassName !== XPATH_PSEUDO_CLASS_MARKER) {
        const rawArgDesc = bufferNodeValue ? "in arg part: '".concat(bufferNodeValue, "'") : 'arg';
        throw new Error("Invalid regexp pattern for :".concat(lastExtendedPseudoClassName, "() pseudo-class ").concat(rawArgDesc));
      }
      return POSSIBLE_MARKS_BEFORE_REGEXP.COMMON.includes(prevTokenValue);
    };
    const getBufferNode = context => {
      if (context.pathToBufferNode.length === 0) {
        return null;
      }
      return getLast(context.pathToBufferNode);
    };
    const getLastRegularSelectorNode = context => {
      const bufferNode = getBufferNode(context);
      if (!bufferNode) {
        throw new Error('No bufferNode found');
      }
      if (bufferNode.type !== NodeType.Selector) {
        throw new Error('Unsupported bufferNode type');
      }
      const selectorRegularChildren = bufferNode.children.filter(node => node.type === NodeType.RegularSelector);
      if (selectorRegularChildren.length === 0) {
        throw new Error('No RegularSelector node found');
      }
      const lastRegularSelectorNode = getLast(selectorRegularChildren);
      context.pathToBufferNode.push(lastRegularSelectorNode);
      return lastRegularSelectorNode;
    };
    const updateBufferNode = (context, tokenValue) => {
      const bufferNode = getBufferNode(context);
      if (bufferNode === null) {
        throw new Error('No bufferNode to update');
      }
      const type = bufferNode.type;
      if (type === NodeType.RegularSelector || type === NodeType.AbsolutePseudoClass) {
        bufferNode.value += tokenValue;
      } else {
        throw new Error("".concat(bufferNode.type, " node can not be updated. Only RegularSelector and AbsolutePseudoClass are supported"));
      }
    };
    const addSelectorListNode = context => {
      const selectorListNode = new AnySelectorNode(NodeType.SelectorList);
      context.ast = selectorListNode;
      context.pathToBufferNode.push(selectorListNode);
    };
    const addAstNodeByType = function addAstNodeByType(context, type) {
      let tokenValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      const bufferNode = getBufferNode(context);
      if (bufferNode === null) {
        throw new Error('No buffer node');
      }
      let node;
      if (type === NodeType.RegularSelector) {
        node = new RegularSelectorNode(tokenValue);
      } else if (type === NodeType.AbsolutePseudoClass) {
        node = new AbsolutePseudoClassNode(tokenValue);
      } else if (type === NodeType.RelativePseudoClass) {
        node = new RelativePseudoClassNode(tokenValue);
      } else {
        node = new AnySelectorNode(type);
      }
      bufferNode.addChild(node);
      context.pathToBufferNode.push(node);
    };
    const initAst = (context, tokenValue) => {
      addSelectorListNode(context);
      addAstNodeByType(context, NodeType.Selector);
      addAstNodeByType(context, NodeType.RegularSelector, tokenValue);
    };
    const initRelativeSubtree = function initRelativeSubtree(context) {
      let tokenValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      addAstNodeByType(context, NodeType.SelectorList);
      addAstNodeByType(context, NodeType.Selector);
      addAstNodeByType(context, NodeType.RegularSelector, tokenValue);
    };
    const upToClosest = (context, parentType) => {
      for (let i = context.pathToBufferNode.length - 1; i >= 0; i -= 1) {
        if (context.pathToBufferNode[i].type === parentType) {
          context.pathToBufferNode = context.pathToBufferNode.slice(0, i + 1);
          break;
        }
      }
    };
    const getUpdatedBufferNode = context => {
      upToClosest(context, NodeType.Selector);
      const selectorNode = getBufferNode(context);
      if (!selectorNode) {
        throw new Error('No SelectorNode, impossible to continue selector parsing by ExtendedCss');
      }
      const lastSelectorNodeChild = getLast(selectorNode.children);
      const hasExtended = lastSelectorNodeChild.type === NodeType.ExtendedSelector
      && context.standardPseudoBracketsStack.length === 0;
      const lastExtendedPseudoName = hasExtended && lastSelectorNodeChild.children[0].name;
      const isLastExtendedNameRelative = lastExtendedPseudoName && RELATIVE_PSEUDO_CLASSES.includes(lastExtendedPseudoName);
      const isLastExtendedNameAbsolute = lastExtendedPseudoName && ABSOLUTE_PSEUDO_CLASSES.includes(lastExtendedPseudoName);
      const hasRelativeExtended = isLastExtendedNameRelative && context.extendedPseudoBracketsStack.length > 0 && context.extendedPseudoBracketsStack.length === context.extendedPseudoNamesStack.length;
      const hasAbsoluteExtended = isLastExtendedNameAbsolute && lastExtendedPseudoName === getLast(context.extendedPseudoNamesStack);
      let newNeededBufferNode = selectorNode;
      if (hasRelativeExtended) {
        context.pathToBufferNode.push(lastSelectorNodeChild);
        newNeededBufferNode = lastSelectorNodeChild.children[0];
      } else if (hasAbsoluteExtended) {
        context.pathToBufferNode.push(lastSelectorNodeChild);
        newNeededBufferNode = lastSelectorNodeChild.children[0];
      } else if (hasExtended) {
        newNeededBufferNode = selectorNode;
      } else {
        newNeededBufferNode = getLastRegularSelectorNode(context);
      }
      context.pathToBufferNode.push(newNeededBufferNode);
      return newNeededBufferNode;
    };
    const handleNextTokenOnColon = (context, selector, tokenValue, nextTokenValue, nextToNextTokenValue) => {
      if (!isSupportedExtendedPseudo(nextTokenValue.toLowerCase())) {
        if (nextTokenValue.toLowerCase() === REMOVE_PSEUDO_MARKER) {
          throw new Error("Selector parser error: invalid :remove() pseudo-class in selector: '".concat(selector, "'"));
        }
        updateBufferNode(context, tokenValue);
        if (nextToNextTokenValue === BRACKETS.PARENTHESES.LEFT
        && !context.isAttributeBracketsOpen) {
          context.standardPseudoNamesStack.push(nextTokenValue);
        }
      } else {
        if (HAS_PSEUDO_CLASS_MARKERS.includes(nextTokenValue) && context.standardPseudoNamesStack.length > 0) {
          throw new Error("Usage of :".concat(nextTokenValue, "() pseudo-class is not allowed inside regular pseudo: '").concat(getLast(context.standardPseudoNamesStack), "'"));
        } else {
          upToClosest(context, NodeType.Selector);
          addAstNodeByType(context, NodeType.ExtendedSelector);
        }
      }
    };
    const parse$1 = selector => {
      var _bufferNode, _bufferNode2, _bufferNode3, _bufferNode4, _bufferNode5, _bufferNode6, _bufferNode7, _bufferNode8, _bufferNode9, _bufferNode10, _bufferNode11, _bufferNode12, _bufferNode13, _bufferNode14, _bufferNode15, _bufferNode16, _bufferNode17, _bufferNode18, _bufferNode19, _bufferNode20;
      const tokens = tokenize(selector);
      const context = {
        ast: null,
        pathToBufferNode: [],
        extendedPseudoNamesStack: [],
        extendedPseudoBracketsStack: [],
        standardPseudoNamesStack: [],
        standardPseudoBracketsStack: [],
        isAttributeBracketsOpen: false,
        isRegexpOpen: false
      };
      let i = 0;
      while (i < tokens.length) {
        const token = tokens[i];
        const tokenType = token.type,
              tokenValue = token.value;
        const nextToken = tokens[i + 1] || [];
        const nextTokenType = nextToken.type,
              nextTokenValue = nextToken.value;
        const nextToNextToken = tokens[i + 2] || [];
        const nextToNextTokenValue = nextToNextToken.value;
        const previousToken = tokens[i - 1] || [];
        const prevTokenType = previousToken.type,
              prevTokenValue = previousToken.value;
        const previousToPreviousToken = tokens[i - 2] || [];
        const prevToPrevTokenValue = previousToPreviousToken.value;
        let bufferNode = getBufferNode(context);
        switch (tokenType) {
          case TokenType.Word:
            if (bufferNode === null) {
              initAst(context, tokenValue);
            } else if (bufferNode.type === NodeType.SelectorList) {
              addAstNodeByType(context, NodeType.Selector);
              addAstNodeByType(context, NodeType.RegularSelector, tokenValue);
            } else if (bufferNode.type === NodeType.RegularSelector) {
              updateBufferNode(context, tokenValue);
            } else if (bufferNode.type === NodeType.ExtendedSelector) {
              if (WHITE_SPACE_CHARACTERS.includes(nextTokenValue) && nextToNextTokenValue === BRACKETS.PARENTHESES.LEFT) {
                throw new Error("No white space is allowed before or after extended pseudo-class name in selector: '".concat(selector, "'"));
              }
              context.extendedPseudoNamesStack.push(tokenValue.toLowerCase());
              if (ABSOLUTE_PSEUDO_CLASSES.includes(tokenValue.toLowerCase())) {
                addAstNodeByType(context, NodeType.AbsolutePseudoClass, tokenValue.toLowerCase());
              } else {
                addAstNodeByType(context, NodeType.RelativePseudoClass, tokenValue.toLowerCase());
              }
            } else if (bufferNode.type === NodeType.AbsolutePseudoClass) {
              updateBufferNode(context, tokenValue);
            } else if (bufferNode.type === NodeType.RelativePseudoClass) {
              initRelativeSubtree(context, tokenValue);
            }
            break;
          case TokenType.Mark:
            switch (tokenValue) {
              case COMMA:
                if (!bufferNode || typeof bufferNode !== 'undefined' && !nextTokenValue) {
                  throw new Error("'".concat(selector, "' is not a valid selector"));
                } else if (bufferNode.type === NodeType.RegularSelector) {
                  if (context.isAttributeBracketsOpen) {
                    updateBufferNode(context, tokenValue);
                  } else {
                    upToClosest(context, NodeType.SelectorList);
                  }
                } else if (bufferNode.type === NodeType.AbsolutePseudoClass) {
                  updateBufferNode(context, tokenValue);
                } else if (((_bufferNode = bufferNode) === null || _bufferNode === void 0 ? void 0 : _bufferNode.type) === NodeType.Selector) {
                  upToClosest(context, NodeType.SelectorList);
                }
                break;
              case SPACE:
                if (((_bufferNode2 = bufferNode) === null || _bufferNode2 === void 0 ? void 0 : _bufferNode2.type) === NodeType.RegularSelector
                && !context.isAttributeBracketsOpen) {
                  bufferNode = getUpdatedBufferNode(context);
                }
                if (((_bufferNode3 = bufferNode) === null || _bufferNode3 === void 0 ? void 0 : _bufferNode3.type) === NodeType.RegularSelector) {
                  if (!context.isAttributeBracketsOpen
                  && (prevTokenValue === COLON && nextTokenType === TokenType.Word
                  || prevTokenType === TokenType.Word && nextTokenValue === BRACKETS.PARENTHESES.LEFT)) {
                    throw new Error("'".concat(selector, "' is not a valid selector"));
                  }
                  if (!nextTokenValue || doesRegularContinueAfterSpace(nextTokenType, nextTokenValue)
                  || context.isAttributeBracketsOpen) {
                    updateBufferNode(context, tokenValue);
                  }
                }
                if (((_bufferNode4 = bufferNode) === null || _bufferNode4 === void 0 ? void 0 : _bufferNode4.type) === NodeType.AbsolutePseudoClass) {
                  updateBufferNode(context, tokenValue);
                }
                if (((_bufferNode5 = bufferNode) === null || _bufferNode5 === void 0 ? void 0 : _bufferNode5.type) === NodeType.RelativePseudoClass) {
                  initRelativeSubtree(context);
                }
                if (((_bufferNode6 = bufferNode) === null || _bufferNode6 === void 0 ? void 0 : _bufferNode6.type) === NodeType.Selector) {
                  if (nextTokenValue && doesRegularContinueAfterSpace(nextTokenType, nextTokenValue)) {
                    addAstNodeByType(context, NodeType.RegularSelector);
                  }
                }
                break;
              case DESCENDANT_COMBINATOR:
              case CHILD_COMBINATOR:
              case NEXT_SIBLING_COMBINATOR:
              case SUBSEQUENT_SIBLING_COMBINATOR:
              case SEMICOLON:
              case SLASH:
              case BACKSLASH:
              case SINGLE_QUOTE:
              case DOUBLE_QUOTE:
              case CARET:
              case DOLLAR_SIGN:
              case BRACKETS.CURLY.LEFT:
              case BRACKETS.CURLY.RIGHT:
              case ASTERISK:
              case ID_MARKER:
              case CLASS_MARKER:
              case BRACKETS.SQUARE.LEFT:
                if (COMBINATORS.includes(tokenValue)) {
                  if (bufferNode === null) {
                    throw new Error("'".concat(selector, "' is not a valid selector"));
                  }
                  bufferNode = getUpdatedBufferNode(context);
                }
                if (bufferNode === null) {
                  if (tokenValue === ASTERISK && nextTokenValue === COLON && (nextToNextTokenValue === IS_PSEUDO_CLASS_MARKER || nextToNextTokenValue === NOT_PSEUDO_CLASS_MARKER)) {
                    initAst(context, IS_OR_NOT_PSEUDO_SELECTING_ROOT);
                  } else {
                    initAst(context, tokenValue);
                    if (tokenValue === BRACKETS.SQUARE.LEFT) {
                      context.isAttributeBracketsOpen = true;
                    }
                  }
                } else if (bufferNode.type === NodeType.RegularSelector) {
                  updateBufferNode(context, tokenValue);
                  if (tokenValue === BRACKETS.SQUARE.LEFT) {
                    context.isAttributeBracketsOpen = true;
                  }
                } else if (bufferNode.type === NodeType.AbsolutePseudoClass) {
                  updateBufferNode(context, tokenValue);
                  if (!bufferNode.value) {
                    throw new Error('bufferNode should have value by now');
                  }
                  if (tokenValue === SLASH && context.extendedPseudoNamesStack.length > 0) {
                    if (prevTokenValue === SLASH && prevToPrevTokenValue === BACKSLASH) {
                      context.isRegexpOpen = false;
                    } else if (prevTokenValue !== BACKSLASH) {
                      if (isRegexpOpening(context, prevTokenValue, bufferNode.value)) {
                        context.isRegexpOpen = !context.isRegexpOpen;
                      } else {
                        context.isRegexpOpen = false;
                      }
                    }
                  }
                } else if (bufferNode.type === NodeType.RelativePseudoClass) {
                  initRelativeSubtree(context, tokenValue);
                  if (tokenValue === BRACKETS.SQUARE.LEFT) {
                    context.isAttributeBracketsOpen = true;
                  }
                } else if (bufferNode.type === NodeType.Selector) {
                  if (COMBINATORS.includes(tokenValue)) {
                    addAstNodeByType(context, NodeType.RegularSelector, tokenValue);
                  } else if (!context.isRegexpOpen) {
                    bufferNode = getLastRegularSelectorNode(context);
                    updateBufferNode(context, tokenValue);
                    if (tokenValue === BRACKETS.SQUARE.LEFT) {
                      context.isAttributeBracketsOpen = true;
                    }
                  }
                } else if (bufferNode.type === NodeType.SelectorList) {
                  addAstNodeByType(context, NodeType.Selector);
                  addAstNodeByType(context, NodeType.RegularSelector, tokenValue);
                  if (tokenValue === BRACKETS.SQUARE.LEFT) {
                    context.isAttributeBracketsOpen = true;
                  }
                }
                break;
              case BRACKETS.SQUARE.RIGHT:
                if (((_bufferNode7 = bufferNode) === null || _bufferNode7 === void 0 ? void 0 : _bufferNode7.type) === NodeType.RegularSelector) {
                  context.isAttributeBracketsOpen = false;
                  updateBufferNode(context, tokenValue);
                }
                if (((_bufferNode8 = bufferNode) === null || _bufferNode8 === void 0 ? void 0 : _bufferNode8.type) === NodeType.AbsolutePseudoClass) {
                  updateBufferNode(context, tokenValue);
                }
                break;
              case COLON:
                if (WHITE_SPACE_CHARACTERS.includes(nextTokenValue) && SUPPORTED_PSEUDO_CLASSES.includes(nextToNextTokenValue)) {
                  throw new Error("No white space is allowed before or after extended pseudo-class name in selector: '".concat(selector, "'"));
                }
                if (bufferNode === null) {
                  if (nextTokenValue === XPATH_PSEUDO_CLASS_MARKER) {
                    initAst(context, XPATH_PSEUDO_SELECTING_ROOT);
                  } else if (nextTokenValue === IS_PSEUDO_CLASS_MARKER || nextTokenValue === NOT_PSEUDO_CLASS_MARKER) {
                    initAst(context, IS_OR_NOT_PSEUDO_SELECTING_ROOT);
                  } else if (nextTokenValue === UPWARD_PSEUDO_CLASS_MARKER || nextTokenValue === NTH_ANCESTOR_PSEUDO_CLASS_MARKER) {
                    throw new Error("Selector should be specified before :".concat(nextTokenValue, "() pseudo-class"));
                  } else {
                    initAst(context, ASTERISK);
                  }
                  bufferNode = getBufferNode(context);
                }
                if (!bufferNode) {
                  throw new Error('bufferNode has to be specified by now');
                }
                if (bufferNode.type === NodeType.SelectorList) {
                  addAstNodeByType(context, NodeType.Selector);
                  addAstNodeByType(context, NodeType.RegularSelector);
                  bufferNode = getBufferNode(context);
                }
                if (((_bufferNode9 = bufferNode) === null || _bufferNode9 === void 0 ? void 0 : _bufferNode9.type) === NodeType.RegularSelector) {
                  if (COMBINATORS.includes(prevTokenValue) || prevTokenValue === COMMA) {
                    updateBufferNode(context, ASTERISK);
                  }
                  handleNextTokenOnColon(context, selector, tokenValue, nextTokenValue, nextToNextTokenValue);
                }
                if (((_bufferNode10 = bufferNode) === null || _bufferNode10 === void 0 ? void 0 : _bufferNode10.type) === NodeType.Selector) {
                  if (isSupportedExtendedPseudo(nextTokenValue.toLowerCase())) {
                    addAstNodeByType(context, NodeType.ExtendedSelector);
                  } else if (nextTokenValue.toLowerCase() === REMOVE_PSEUDO_MARKER) {
                    throw new Error("Selector parser error: invalid :remove() pseudo-class in selector: '".concat(selector, "'"));
                  } else {
                    bufferNode = getLastRegularSelectorNode(context);
                    handleNextTokenOnColon(context, selector, tokenValue, nextTokenType, nextToNextTokenValue);
                  }
                }
                if (((_bufferNode11 = bufferNode) === null || _bufferNode11 === void 0 ? void 0 : _bufferNode11.type) === NodeType.AbsolutePseudoClass) {
                  if (bufferNode.name === XPATH_PSEUDO_CLASS_MARKER && SUPPORTED_PSEUDO_CLASSES.includes(nextToken.value) && nextToNextToken.value === BRACKETS.PARENTHESES.LEFT) {
                    throw new Error(":xpath() pseudo-class should be at the end of selector: '".concat(selector, "'"));
                  }
                  updateBufferNode(context, tokenValue);
                }
                if (((_bufferNode12 = bufferNode) === null || _bufferNode12 === void 0 ? void 0 : _bufferNode12.type) === NodeType.RelativePseudoClass) {
                  initRelativeSubtree(context, ASTERISK);
                  if (!isSupportedExtendedPseudo(nextTokenValue.toLowerCase())) {
                    updateBufferNode(context, tokenValue);
                    if (nextToNextTokenValue === BRACKETS.PARENTHESES.LEFT) {
                      context.standardPseudoNamesStack.push(nextTokenValue);
                    }
                  } else {
                    upToClosest(context, NodeType.Selector);
                    addAstNodeByType(context, NodeType.ExtendedSelector);
                  }
                }
                break;
              case BRACKETS.PARENTHESES.LEFT:
                if (((_bufferNode13 = bufferNode) === null || _bufferNode13 === void 0 ? void 0 : _bufferNode13.type) === NodeType.AbsolutePseudoClass) {
                  if (bufferNode.name !== XPATH_PSEUDO_CLASS_MARKER && context.isRegexpOpen) {
                    updateBufferNode(context, tokenValue);
                  } else {
                    context.extendedPseudoBracketsStack.push(tokenValue);
                    if (context.extendedPseudoBracketsStack.length > context.extendedPseudoNamesStack.length) {
                      updateBufferNode(context, tokenValue);
                    }
                  }
                }
                if (((_bufferNode14 = bufferNode) === null || _bufferNode14 === void 0 ? void 0 : _bufferNode14.type) === NodeType.RegularSelector) {
                  if (context.standardPseudoNamesStack.length > 0) {
                    updateBufferNode(context, tokenValue);
                    context.standardPseudoBracketsStack.push(tokenValue);
                  }
                  if (context.isAttributeBracketsOpen) {
                    updateBufferNode(context, tokenValue);
                  }
                }
                if (((_bufferNode15 = bufferNode) === null || _bufferNode15 === void 0 ? void 0 : _bufferNode15.type) === NodeType.RelativePseudoClass) {
                  context.extendedPseudoBracketsStack.push(tokenValue);
                }
                break;
              case BRACKETS.PARENTHESES.RIGHT:
                if (((_bufferNode16 = bufferNode) === null || _bufferNode16 === void 0 ? void 0 : _bufferNode16.type) === NodeType.AbsolutePseudoClass) {
                  if (bufferNode.name !== XPATH_PSEUDO_CLASS_MARKER && context.isRegexpOpen) {
                    updateBufferNode(context, tokenValue);
                  } else {
                    context.extendedPseudoBracketsStack.pop();
                    if (bufferNode.name !== XPATH_PSEUDO_CLASS_MARKER) {
                      context.extendedPseudoNamesStack.pop();
                      if (context.extendedPseudoBracketsStack.length > context.extendedPseudoNamesStack.length) {
                        updateBufferNode(context, tokenValue);
                      } else if (context.extendedPseudoBracketsStack.length >= 0 && context.extendedPseudoNamesStack.length >= 0) {
                        upToClosest(context, NodeType.Selector);
                      }
                    } else {
                      if (context.extendedPseudoBracketsStack.length < context.extendedPseudoNamesStack.length) {
                        context.extendedPseudoNamesStack.pop();
                      } else {
                        updateBufferNode(context, tokenValue);
                      }
                    }
                  }
                }
                if (((_bufferNode17 = bufferNode) === null || _bufferNode17 === void 0 ? void 0 : _bufferNode17.type) === NodeType.RegularSelector) {
                  if (context.isAttributeBracketsOpen) {
                    updateBufferNode(context, tokenValue);
                  } else if (context.standardPseudoNamesStack.length > 0 && context.standardPseudoBracketsStack.length > 0) {
                    updateBufferNode(context, tokenValue);
                    context.standardPseudoBracketsStack.pop();
                    const lastStandardPseudo = context.standardPseudoNamesStack.pop();
                    if (!lastStandardPseudo) {
                      throw new Error("Parsing error. Invalid selector: ".concat(selector));
                    }
                    if (Object.values(REGULAR_PSEUDO_ELEMENTS).includes(lastStandardPseudo)
                    && nextTokenValue === COLON && nextToNextTokenValue && HAS_PSEUDO_CLASS_MARKERS.includes(nextToNextTokenValue)) {
                      throw new Error("Usage of :".concat(nextToNextTokenValue, "() pseudo-class is not allowed after any regular pseudo-element: '").concat(lastStandardPseudo, "'"));
                    }
                  } else {
                    context.extendedPseudoBracketsStack.pop();
                    context.extendedPseudoNamesStack.pop();
                    upToClosest(context, NodeType.ExtendedSelector);
                    upToClosest(context, NodeType.Selector);
                  }
                }
                if (((_bufferNode18 = bufferNode) === null || _bufferNode18 === void 0 ? void 0 : _bufferNode18.type) === NodeType.Selector) {
                  context.extendedPseudoBracketsStack.pop();
                  context.extendedPseudoNamesStack.pop();
                  upToClosest(context, NodeType.ExtendedSelector);
                  upToClosest(context, NodeType.Selector);
                }
                if (((_bufferNode19 = bufferNode) === null || _bufferNode19 === void 0 ? void 0 : _bufferNode19.type) === NodeType.RelativePseudoClass) {
                  if (context.extendedPseudoNamesStack.length > 0 && context.extendedPseudoBracketsStack.length > 0) {
                    context.extendedPseudoBracketsStack.pop();
                    context.extendedPseudoNamesStack.pop();
                  }
                }
                break;
              case LINE_FEED:
              case FORM_FEED:
              case CARRIAGE_RETURN:
                throw new Error("'".concat(selector, "' is not a valid selector"));
              case TAB:
                if (((_bufferNode20 = bufferNode) === null || _bufferNode20 === void 0 ? void 0 : _bufferNode20.type) === NodeType.RegularSelector && context.isAttributeBracketsOpen) {
                  updateBufferNode(context, tokenValue);
                } else {
                  throw new Error("'".concat(selector, "' is not a valid selector"));
                }
            }
            break;
          default:
            throw new Error("Unknown type of token: '".concat(tokenValue, "'"));
        }
        i += 1;
      }
      if (context.ast === null) {
        throw new Error("'".concat(selector, "' is not a valid selector"));
      }
      if (context.extendedPseudoNamesStack.length > 0 || context.extendedPseudoBracketsStack.length > 0) {
        throw new Error("Unbalanced brackets for extended pseudo-class: '".concat(getLast(context.extendedPseudoNamesStack), "'"));
      }
      if (context.isAttributeBracketsOpen) {
        throw new Error("Unbalanced attribute brackets is selector: '".concat(selector, "'"));
      }
      return context.ast;
    };
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _s, _e;
      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    const getValidNumberAncestorArg = (rawArg, pseudoName) => {
      const deep = Number(rawArg);
      if (Number.isNaN(deep) || deep < 1 || deep >= 256) {
        throw new Error("Invalid argument of :".concat(pseudoName, " pseudo-class: '").concat(rawArg, "'"));
      }
      return deep;
    };
    const getNthAncestor = (domElement, nth, pseudoName) => {
      let ancestor = null;
      let i = 0;
      while (i < nth) {
        ancestor = domElement.parentElement;
        if (!ancestor) {
          throw new Error("Argument of :".concat(pseudoName, "() pseudo-class is too big \u2014 '").concat(nth, "', out of DOM elements root."));
        }
        domElement = ancestor;
        i += 1;
      }
      return ancestor;
    };
    const validateStandardSelector = selector => {
      let isValid;
      try {
        document.querySelectorAll(selector);
        isValid = true;
      } catch (e) {
        isValid = false;
      }
      return isValid;
    };
    const matcherWrapper = (callback, argsData, errorMessage) => {
      let isMatched;
      try {
        isMatched = callback(argsData);
      } catch (e) {
        logger.error(e);
        throw new Error(errorMessage);
      }
      return isMatched;
    };
    const getAbsolutePseudoError = (propDesc, pseudoName, pseudoArg) => {
      return "".concat(MATCHING_ELEMENT_ERROR_PREFIX, " ").concat(propDesc, ", may be invalid :").concat(pseudoName, "() pseudo-class arg: '").concat(pseudoArg, "'");
    };
    const isMatchedByAbsolutePseudo = (domElement, pseudoName, pseudoArg) => {
      let argsData;
      let errorMessage;
      let callback;
      switch (pseudoName) {
        case CONTAINS_PSEUDO:
        case HAS_TEXT_PSEUDO:
        case ABP_CONTAINS_PSEUDO:
          callback = isTextMatched;
          argsData = {
            pseudoName,
            pseudoArg,
            domElement
          };
          errorMessage = getAbsolutePseudoError('text content', pseudoName, pseudoArg);
          break;
        case MATCHES_CSS_PSEUDO:
        case MATCHES_CSS_AFTER_PSEUDO:
        case MATCHES_CSS_BEFORE_PSEUDO:
          callback = isStyleMatched;
          argsData = {
            pseudoName,
            pseudoArg,
            domElement
          };
          errorMessage = getAbsolutePseudoError('style', pseudoName, pseudoArg);
          break;
        case MATCHES_ATTR_PSEUDO_CLASS_MARKER:
          callback = isAttributeMatched;
          argsData = {
            domElement,
            pseudoName,
            pseudoArg
          };
          errorMessage = getAbsolutePseudoError('attributes', pseudoName, pseudoArg);
          break;
        case MATCHES_PROPERTY_PSEUDO_CLASS_MARKER:
          callback = isPropertyMatched;
          argsData = {
            domElement,
            pseudoName,
            pseudoArg
          };
          errorMessage = getAbsolutePseudoError('properties', pseudoName, pseudoArg);
          break;
        default:
          throw new Error("Unknown absolute pseudo-class :".concat(pseudoName, "()"));
      }
      return matcherWrapper(callback, argsData, errorMessage);
    };
    const findByAbsolutePseudoPseudo = {
      nthAncestor: (domElements, rawPseudoArg, pseudoName) => {
        const deep = getValidNumberAncestorArg(rawPseudoArg, pseudoName);
        const ancestors = domElements.map(domElement => {
          let ancestor = null;
          try {
            ancestor = getNthAncestor(domElement, deep, pseudoName);
          } catch (e) {
            logger.error(e);
          }
          return ancestor;
        }).filter(isHtmlElement);
        return ancestors;
      },
      xpath: (domElements, rawPseudoArg) => {
        const foundElements = domElements.map(domElement => {
          const result = [];
          let xpathResult;
          try {
            xpathResult = document.evaluate(rawPseudoArg, domElement, null, window.XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
          } catch (e) {
            logger.error(e);
            throw new Error("Invalid argument of :xpath pseudo-class: '".concat(rawPseudoArg, "'"));
          }
          let node = xpathResult.iterateNext();
          while (node) {
            if (isHtmlElement(node)) {
              result.push(node);
            }
            node = xpathResult.iterateNext();
          }
          return result;
        });
        return flatten(foundElements);
      },
      upward: (domElements, rawPseudoArg) => {
        if (!validateStandardSelector(rawPseudoArg)) {
          throw new Error("Invalid argument of :upward pseudo-class: '".concat(rawPseudoArg, "'"));
        }
        const closestAncestors = domElements.map(domElement => {
          const parent = domElement.parentElement;
          if (!parent) {
            return null;
          }
          return parent.closest(rawPseudoArg);
        }).filter(isHtmlElement);
        return closestAncestors;
      }
    };
    const hasRelativesBySelectorList = argsData => {
      const element = argsData.element,
            relativeSelectorList = argsData.relativeSelectorList,
            pseudoName = argsData.pseudoName;
      return relativeSelectorList.children
      .every(selector => {
        var _relativeRegularSelec, _relativeRegularSelec2;
        const _selector$children = _slicedToArray(selector.children, 1),
              relativeRegularSelector = _selector$children[0];
        if (!relativeRegularSelector) {
          throw new Error("RegularSelector is missing for :".concat(pseudoName, "() pseudo-class"));
        }
        let specifiedSelector = '';
        let rootElement = null;
        if ((_relativeRegularSelec = relativeRegularSelector.value) !== null && _relativeRegularSelec !== void 0 && _relativeRegularSelec.startsWith(NEXT_SIBLING_COMBINATOR) || (_relativeRegularSelec2 = relativeRegularSelector.value) !== null && _relativeRegularSelec2 !== void 0 && _relativeRegularSelec2.startsWith(SUBSEQUENT_SIBLING_COMBINATOR)) {
          rootElement = element.parentElement;
          const elementSelectorText = getElementSelectorDesc(element);
          specifiedSelector = "".concat(SCOPE_CSS_PSEUDO_CLASS).concat(CHILD_COMBINATOR).concat(elementSelectorText).concat(relativeRegularSelector.value);
        } else if (relativeRegularSelector.value === ASTERISK) {
          rootElement = element;
          specifiedSelector = "".concat(SCOPE_CSS_PSEUDO_CLASS).concat(DESCENDANT_COMBINATOR).concat(ASTERISK);
        } else {
          specifiedSelector = "".concat(SCOPE_CSS_PSEUDO_CLASS).concat(DESCENDANT_COMBINATOR).concat(relativeRegularSelector.value);
          rootElement = element;
        }
        if (!rootElement) {
          throw new Error("Selection by :".concat(pseudoName, "() pseudo-class is not possible"));
        }
        let relativeElements;
        try {
          relativeElements = getElementsForSelectorNode(selector, rootElement, specifiedSelector);
        } catch (e) {
          logger.error(e);
          throw new Error("Invalid selector for :".concat(pseudoName, "() pseudo-class: '").concat(relativeRegularSelector.value, "'"));
        }
        return relativeElements.length > 0;
      });
    };
    const isAnyElementBySelectorList = argsData => {
      const element = argsData.element,
            relativeSelectorList = argsData.relativeSelectorList,
            pseudoName = argsData.pseudoName;
      return relativeSelectorList.children
      .some(selector => {
        const _selector$children2 = _slicedToArray(selector.children, 1),
              relativeRegularSelector = _selector$children2[0];
        if (!relativeRegularSelector) {
          throw new Error("RegularSelector is missing for :".concat(pseudoName, "() pseudo-class"));
        }
        const rootElement = element.parentElement;
        if (!rootElement) {
          throw new Error("Selection by :".concat(pseudoName, "() pseudo-class is not possible"));
        }
        const specifiedSelector = "".concat(SCOPE_CSS_PSEUDO_CLASS).concat(CHILD_COMBINATOR).concat(relativeRegularSelector.value);
        let anyElements;
        try {
          anyElements = getElementsForSelectorNode(selector, rootElement, specifiedSelector);
        } catch (e) {
          return false;
        }
        return anyElements.includes(element);
      });
    };
    const notElementBySelectorList = argsData => {
      const element = argsData.element,
            relativeSelectorList = argsData.relativeSelectorList,
            pseudoName = argsData.pseudoName;
      return relativeSelectorList.children
      .every(selector => {
        const _selector$children3 = _slicedToArray(selector.children, 1),
              relativeRegularSelector = _selector$children3[0];
        if (!relativeRegularSelector) {
          throw new Error("RegularSelector is missing for :".concat(pseudoName, "() pseudo-class"));
        }
        const rootElement = element.parentElement;
        if (!rootElement) {
          throw new Error("Selection by :".concat(pseudoName, "() pseudo-class is not possible"));
        }
        const specifiedSelector = "".concat(SCOPE_CSS_PSEUDO_CLASS).concat(CHILD_COMBINATOR).concat(relativeRegularSelector.value);
        let anyElements;
        try {
          anyElements = getElementsForSelectorNode(selector, rootElement, specifiedSelector);
        } catch (e) {
          logger.error(e);
          throw new Error("Invalid selector for :".concat(pseudoName, "() pseudo-class: '").concat(relativeRegularSelector.value, "'"));
        }
        return !anyElements.includes(element);
      });
    };
    const getByRegularSelector = (regularSelectorNode, root, specifiedSelector) => {
      if (!regularSelectorNode.value) {
        throw new Error('RegularSelector value should be specified');
      }
      const selectorText = specifiedSelector ? specifiedSelector : regularSelectorNode.value;
      let selectedElements = [];
      try {
        selectedElements = Array.from(root.querySelectorAll(selectorText));
      } catch (e) {
        throw new Error("Error: unable to select by '".concat(selectorText, "' \u2014 ").concat(e.message));
      }
      return selectedElements;
    };
    const getByExtendedSelector = (domElements, extendedSelectorNode) => {
      let foundElements = [];
      const pseudoName = extendedSelectorNode.children[0].name;
      if (!pseudoName) {
        throw new Error('Extended pseudo-class should have a name');
      }
      if (ABSOLUTE_PSEUDO_CLASSES.includes(pseudoName)) {
        const absolutePseudoArg = extendedSelectorNode.children[0].value;
        if (!absolutePseudoArg) {
          throw new Error("Missing arg for :".concat(pseudoName, "() pseudo-class"));
        }
        if (pseudoName === NTH_ANCESTOR_PSEUDO_CLASS_MARKER) {
          foundElements = findByAbsolutePseudoPseudo.nthAncestor(domElements, absolutePseudoArg, pseudoName);
        } else if (pseudoName === XPATH_PSEUDO_CLASS_MARKER) {
          try {
            document.createExpression(absolutePseudoArg, null);
          } catch (e) {
            throw new Error("Invalid argument of :".concat(pseudoName, "() pseudo-class: '").concat(absolutePseudoArg, "'"));
          }
          foundElements = findByAbsolutePseudoPseudo.xpath(domElements, absolutePseudoArg);
        } else if (pseudoName === UPWARD_PSEUDO_CLASS_MARKER) {
          if (Number.isNaN(Number(absolutePseudoArg))) {
            foundElements = findByAbsolutePseudoPseudo.upward(domElements, absolutePseudoArg);
          } else {
            foundElements = findByAbsolutePseudoPseudo.nthAncestor(domElements, absolutePseudoArg, pseudoName);
          }
        } else {
          foundElements = domElements.filter(element => {
            return isMatchedByAbsolutePseudo(element, pseudoName, absolutePseudoArg);
          });
        }
      } else if (RELATIVE_PSEUDO_CLASSES.includes(pseudoName)) {
        const relativeSelectorNodes = extendedSelectorNode.children[0].children;
        if (relativeSelectorNodes.length === 0) {
          throw new Error("Missing arg for :".concat(pseudoName, "() pseudo-class"));
        }
        const _relativeSelectorNode = _slicedToArray(relativeSelectorNodes, 1),
              relativeSelectorList = _relativeSelectorNode[0];
        let relativePredicate;
        switch (pseudoName) {
          case HAS_PSEUDO_CLASS_MARKER:
          case IF_PSEUDO_CLASS_MARKER:
          case ABP_HAS_PSEUDO_CLASS_MARKER:
            relativePredicate = element => hasRelativesBySelectorList({
              element,
              relativeSelectorList,
              pseudoName
            });
            break;
          case IF_NOT_PSEUDO_CLASS_MARKER:
            relativePredicate = element => !hasRelativesBySelectorList({
              element,
              relativeSelectorList,
              pseudoName
            });
            break;
          case IS_PSEUDO_CLASS_MARKER:
            relativePredicate = element => isAnyElementBySelectorList({
              element,
              relativeSelectorList,
              pseudoName
            });
            break;
          case NOT_PSEUDO_CLASS_MARKER:
            relativePredicate = element => notElementBySelectorList({
              element,
              relativeSelectorList,
              pseudoName
            });
            break;
          default:
            throw new Error("Unknown relative pseudo-class: '".concat(pseudoName, "'"));
        }
        foundElements = domElements.filter(relativePredicate);
      } else {
        throw new Error("Unknown extended pseudo-class: '".concat(pseudoName, "'"));
      }
      return foundElements;
    };
    const getByFollowingRegularSelector = (domElements, regularSelectorNode) => {
      let foundElements = [];
      const value = regularSelectorNode.value;
      if (!value) {
        throw new Error('RegularSelector should have a value.');
      }
      if (value.startsWith(CHILD_COMBINATOR)) {
        foundElements = domElements.map(root => {
          const specifiedSelector = "".concat(SCOPE_CSS_PSEUDO_CLASS).concat(value);
          return getByRegularSelector(regularSelectorNode, root, specifiedSelector);
        });
      } else if (value.startsWith(NEXT_SIBLING_COMBINATOR) || value.startsWith(SUBSEQUENT_SIBLING_COMBINATOR)) {
        foundElements = domElements.map(element => {
          const rootElement = element.parentElement;
          if (!rootElement) {
            return [];
          }
          const elementSelectorText = getElementSelectorDesc(element);
          const specifiedSelector = "".concat(SCOPE_CSS_PSEUDO_CLASS).concat(CHILD_COMBINATOR).concat(elementSelectorText).concat(value);
          const selected = getByRegularSelector(regularSelectorNode, rootElement, specifiedSelector);
          return selected;
        });
      } else {
        foundElements = domElements.map(root => {
          const specifiedSelector = "".concat(SCOPE_CSS_PSEUDO_CLASS).concat(DESCENDANT_COMBINATOR).concat(regularSelectorNode.value);
          return getByRegularSelector(regularSelectorNode, root, specifiedSelector);
        });
      }
      return flatten(foundElements);
    };
    const getElementsForSelectorNode = (selectorNode, root, specifiedSelector) => {
      let selectedElements = [];
      let i = 0;
      while (i < selectorNode.children.length) {
        const selectorNodeChild = selectorNode.children[i];
        if (i === 0) {
          selectedElements = getByRegularSelector(selectorNodeChild, root, specifiedSelector);
        } else if (selectorNodeChild.type === NodeType.ExtendedSelector) {
          selectedElements = getByExtendedSelector(selectedElements, selectorNodeChild);
        } else if (selectorNodeChild.type === NodeType.RegularSelector) {
          selectedElements = getByFollowingRegularSelector(selectedElements, selectorNodeChild);
        }
        i += 1;
      }
      return selectedElements;
    };
    const selectElementsByAst = function selectElementsByAst(ast) {
      let doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
      const selectedElements = [];
      ast.children.forEach(selectorNode => {
        selectedElements.push(...getElementsForSelectorNode(selectorNode, doc));
      });
      const uniqueElements = [...new Set(flatten(selectedElements))];
      return uniqueElements;
    };
    class ExtCssDocument {
      constructor() {
        this.astCache = new Map();
      }
      saveAstToCache(selector, ast) {
        this.astCache.set(selector, ast);
      }
      getAstFromCache(selector) {
        const cachedAst = this.astCache.get(selector) || null;
        return cachedAst;
      }
      getSelectorAst(selector) {
        let ast = this.getAstFromCache(selector);
        if (!ast) {
          ast = parse$1(selector);
        }
        this.saveAstToCache(selector, ast);
        return ast;
      }
      querySelectorAll(selector) {
        const ast = this.getSelectorAst(selector);
        return selectElementsByAst(ast);
      }
    }
    const extCssDocument = new ExtCssDocument();
    const parseRemoveSelector = rawSelector => {
      const VALID_REMOVE_MARKER = "".concat(COLON).concat(REMOVE_PSEUDO_MARKER).concat(BRACKETS.PARENTHESES.LEFT).concat(BRACKETS.PARENTHESES.RIGHT);
      const INVALID_REMOVE_MARKER = "".concat(COLON).concat(REMOVE_PSEUDO_MARKER).concat(BRACKETS.PARENTHESES.LEFT);
      let selector;
      let shouldRemove = false;
      const firstIndex = rawSelector.indexOf(VALID_REMOVE_MARKER);
      if (firstIndex === 0) {
        throw new Error("".concat(REMOVE_ERROR_PREFIX.NO_TARGET_SELECTOR, ": '").concat(rawSelector, "'"));
      } else if (firstIndex > 0) {
        if (firstIndex !== rawSelector.lastIndexOf(VALID_REMOVE_MARKER)) {
          throw new Error("".concat(REMOVE_ERROR_PREFIX.MULTIPLE_USAGE, ": '").concat(rawSelector, "'"));
        } else if (firstIndex + VALID_REMOVE_MARKER.length < rawSelector.length) {
          throw new Error("".concat(REMOVE_ERROR_PREFIX.INVALID_POSITION, ": '").concat(rawSelector, "'"));
        } else {
          selector = rawSelector.substring(0, firstIndex);
          shouldRemove = true;
        }
      } else if (rawSelector.includes(INVALID_REMOVE_MARKER)) {
        throw new Error("".concat(REMOVE_ERROR_PREFIX.INVALID_REMOVE, ": '").concat(rawSelector, "'"));
      } else {
        selector = rawSelector;
      }
      const stylesOfSelector = shouldRemove ? [{
        property: REMOVE_PSEUDO_MARKER,
        value: String(shouldRemove)
      }] : [];
      return {
        selector,
        stylesOfSelector
      };
    };
    const getObjectFromEntries = entries => {
      const initAcc = {};
      const object = entries.reduce((acc, el) => {
        const key = el[0];
        const value = el[1];
        acc[key] = value;
        return acc;
      }, initAcc);
      return object;
    };
    const DEBUG_PSEUDO_PROPERTY_KEY = 'debug';
    const REGEXP_DECLARATION_END = /[;}]/g;
    const REGEXP_DECLARATION_DIVIDER = /[;:}]/g;
    const REGEXP_NON_WHITESPACE = /\S/g;
    const AT_RULE_MARKER = '@';
    const initRawRuleData = {
      selector: ''
    };
    const restoreRuleAcc = context => {
      context.rawRuleData = initRawRuleData;
    };
    const parseSelectorPart = (context, extCssDoc) => {
      let selector = context.selectorBuffer.trim();
      if (selector.startsWith(AT_RULE_MARKER)) {
        throw new Error("At-rules are not supported: '".concat(selector, "'."));
      }
      let removeSelectorData;
      try {
        removeSelectorData = parseRemoveSelector(selector);
      } catch (e) {
        logger.error(e.message);
        throw new Error("".concat(REMOVE_ERROR_PREFIX.INVALID_REMOVE, ": '").concat(selector, "'"));
      }
      if (context.nextIndex === -1) {
        if (selector === removeSelectorData.selector) {
          throw new Error("".concat(STYLESHEET_ERROR_PREFIX.NO_STYLE_OR_REMOVE, ": '").concat(context.cssToParse, "'"));
        }
        context.cssToParse = '';
      }
      let stylesOfSelector = [];
      let success = false;
      let ast;
      try {
        selector = removeSelectorData.selector;
        stylesOfSelector = removeSelectorData.stylesOfSelector;
        ast = extCssDoc.getSelectorAst(selector);
        success = true;
      } catch (e) {
        success = false;
      }
      if (context.nextIndex > 0) {
        context.cssToParse = context.cssToParse.slice(context.nextIndex);
      }
      return {
        success,
        selector,
        ast,
        stylesOfSelector
      };
    };
    const parseUntilClosingBracket = (context, styles) => {
      REGEXP_DECLARATION_DIVIDER.lastIndex = context.nextIndex;
      let match = REGEXP_DECLARATION_DIVIDER.exec(context.cssToParse);
      if (match === null) {
        throw new Error("".concat(STYLESHEET_ERROR_PREFIX.INVALID_STYLE, ": '").concat(context.cssToParse, "'"));
      }
      let matchPos = match.index;
      let matched = match[0];
      if (matched === BRACKETS.CURLY.RIGHT) {
        const declarationChunk = context.cssToParse.slice(context.nextIndex, matchPos);
        if (declarationChunk.trim().length === 0) {
          if (styles.length === 0) {
            throw new Error("".concat(STYLESHEET_ERROR_PREFIX.NO_STYLE, ": '").concat(context.cssToParse, "'"));
          }
        } else {
          throw new Error("".concat(STYLESHEET_ERROR_PREFIX.INVALID_STYLE, ": '").concat(context.cssToParse, "'"));
        }
        return matchPos;
      }
      if (matched === COLON) {
        const colonIndex = matchPos;
        REGEXP_DECLARATION_END.lastIndex = colonIndex;
        match = REGEXP_DECLARATION_END.exec(context.cssToParse);
        if (match === null) {
          throw new Error("".concat(STYLESHEET_ERROR_PREFIX.UNCLOSED_STYLE, ": '").concat(context.cssToParse, "'"));
        }
        matchPos = match.index;
        matched = match[0];
        const property = context.cssToParse.slice(context.nextIndex, colonIndex).trim();
        if (property.length === 0) {
          throw new Error("".concat(STYLESHEET_ERROR_PREFIX.NO_PROPERTY, ": '").concat(context.cssToParse, "'"));
        }
        const value = context.cssToParse.slice(colonIndex + 1, matchPos).trim();
        if (value.length === 0) {
          throw new Error("".concat(STYLESHEET_ERROR_PREFIX.NO_VALUE, ": '").concat(context.cssToParse, "'"));
        }
        styles.push({
          property,
          value
        });
        if (matched === BRACKETS.CURLY.RIGHT) {
          return matchPos;
        }
      }
      context.cssToParse = context.cssToParse.slice(matchPos + 1);
      context.nextIndex = 0;
      return parseUntilClosingBracket(context, styles);
    };
    const parseNextStyle = context => {
      const styles = [];
      const styleEndPos = parseUntilClosingBracket(context, styles);
      REGEXP_NON_WHITESPACE.lastIndex = styleEndPos + 1;
      const match = REGEXP_NON_WHITESPACE.exec(context.cssToParse);
      if (match === null) {
        context.cssToParse = '';
        return styles;
      }
      const matchPos = match.index;
      context.cssToParse = context.cssToParse.slice(matchPos);
      return styles;
    };
    const isRemoveSetInStyles = styles => {
      return styles.some(s => {
        return s.property === REMOVE_PSEUDO_MARKER && s.value === PSEUDO_PROPERTY_POSITIVE_VALUE;
      });
    };
    const getDebugStyleValue = styles => {
      const debugStyle = styles.find(s => {
        return s.property === DEBUG_PSEUDO_PROPERTY_KEY;
      });
      return debugStyle === null || debugStyle === void 0 ? void 0 : debugStyle.value;
    };
    const prepareRuleData = (selector, ast, rawStyles) => {
      const ruleData = {
        selector,
        ast
      };
      const debugValue = getDebugStyleValue(rawStyles);
      const shouldRemove = isRemoveSetInStyles(rawStyles);
      let styles = rawStyles;
      if (debugValue) {
        styles = rawStyles.filter(s => s.property !== DEBUG_PSEUDO_PROPERTY_KEY);
        if (debugValue === PSEUDO_PROPERTY_POSITIVE_VALUE || debugValue === DEBUG_PSEUDO_PROPERTY_GLOBAL_VALUE) {
          ruleData.debug = debugValue;
        }
      }
      if (shouldRemove) {
        ruleData.style = {
          [REMOVE_PSEUDO_MARKER]: PSEUDO_PROPERTY_POSITIVE_VALUE
        };
      } else {
        if (styles.length > 0) {
          const stylesAsEntries = styles.map(style => {
            const property = style.property,
                  value = style.value;
            return [property, value];
          });
          const preparedStyleData = getObjectFromEntries(stylesAsEntries);
          ruleData.style = preparedStyleData;
        }
      }
      return ruleData;
    };
    const saveToRawResults = (rawResults, rawRuleData) => {
      const selector = rawRuleData.selector,
            ast = rawRuleData.ast,
            styles = rawRuleData.styles;
      if (!styles) {
        throw new Error("No style declaration for selector: '".concat(selector, "'"));
      }
      if (!ast) {
        throw new Error("No ast parsed for selector: '".concat(selector, "'"));
      }
      const storedRuleData = rawResults.get(selector);
      if (!storedRuleData) {
        rawResults.set(selector, {
          ast,
          styles
        });
      } else {
        storedRuleData.styles.push(...styles);
      }
    };
    const parse = (rawStylesheet, extCssDoc) => {
      const stylesheet = rawStylesheet.trim();
      if (stylesheet.includes("".concat(SLASH).concat(ASTERISK)) && stylesheet.includes("".concat(ASTERISK).concat(SLASH))) {
        throw new Error("".concat(STYLESHEET_ERROR_PREFIX.NO_COMMENT, ": '").concat(stylesheet, "'"));
      }
      const context = {
        isSelector: true,
        nextIndex: 0,
        cssToParse: stylesheet,
        selectorBuffer: '',
        rawRuleData: initRawRuleData
      };
      const rawResults = new Map();
      let selectorData;
      while (context.cssToParse) {
        if (context.isSelector) {
          context.nextIndex = context.cssToParse.indexOf(BRACKETS.CURLY.LEFT);
          if (context.selectorBuffer.length === 0 && context.nextIndex === 0) {
            throw new Error("".concat(STYLESHEET_ERROR_PREFIX.NO_SELECTOR, ": '").concat(context.cssToParse, "'"));
          }
          if (context.nextIndex === -1) {
            context.selectorBuffer = context.cssToParse;
          } else {
            context.selectorBuffer += context.cssToParse.slice(0, context.nextIndex);
          }
          selectorData = parseSelectorPart(context, extCssDoc);
          if (selectorData.success) {
            context.rawRuleData.selector = selectorData.selector.trim();
            context.rawRuleData.ast = selectorData.ast;
            context.rawRuleData.styles = selectorData.stylesOfSelector;
            context.isSelector = false;
            if (context.nextIndex === -1) {
              saveToRawResults(rawResults, context.rawRuleData);
              restoreRuleAcc(context);
            } else {
              context.nextIndex = 1;
              context.selectorBuffer = '';
            }
          } else {
            context.selectorBuffer += BRACKETS.CURLY.LEFT;
            context.cssToParse = context.cssToParse.slice(1);
          }
        } else {
          var _context$rawRuleData$;
          const parsedStyles = parseNextStyle(context);
          (_context$rawRuleData$ = context.rawRuleData.styles) === null || _context$rawRuleData$ === void 0 ? void 0 : _context$rawRuleData$.push(...parsedStyles);
          saveToRawResults(rawResults, context.rawRuleData);
          context.nextIndex = 0;
          restoreRuleAcc(context);
          context.isSelector = true;
        }
      }
      const results = [];
      rawResults.forEach((value, key) => {
        const selector = key;
        const ast = value.ast,
              rawStyles = value.styles;
        results.push(prepareRuleData(selector, ast, rawStyles));
      });
      return results;
    };
    const isNumber = arg => {
      return typeof arg === 'number' && !Number.isNaN(arg);
    };
    const isSupported = typeof window.requestAnimationFrame !== 'undefined';
    const timeout = isSupported ? requestAnimationFrame : window.setTimeout;
    const deleteTimeout = isSupported ? cancelAnimationFrame : clearTimeout;
    const perf = isSupported ? performance : Date;
    const DEFAULT_THROTTLE_DELAY_MS = 150;
    class ThrottleWrapper {
      constructor(context, callback, throttleMs) {
        this.context = context;
        this.callback = callback;
        this.throttleDelayMs = throttleMs || DEFAULT_THROTTLE_DELAY_MS;
        this.wrappedCb = this.wrappedCallback.bind(this);
      }
      wrappedCallback(timestamp) {
        this.lastRunTime = isNumber(timestamp) ? timestamp : perf.now();
        if (this.timeoutId) {
          deleteTimeout(this.timeoutId);
          delete this.timeoutId;
        }
        clearTimeout(this.timerId);
        delete this.timerId;
        if (this.callback) {
          this.callback(this.context);
        }
      }
      hasPendingCallback() {
        return isNumber(this.timeoutId) || isNumber(this.timerId);
      }
      run() {
        if (this.hasPendingCallback()) {
          return;
        }
        if (typeof this.lastRunTime !== 'undefined') {
          const elapsedTime = perf.now() - this.lastRunTime;
          if (elapsedTime < this.throttleDelayMs) {
            this.timerId = window.setTimeout(this.wrappedCb, this.throttleDelayMs - elapsedTime);
            return;
          }
        }
        this.timeoutId = timeout(this.wrappedCb);
      }
      static now() {
        return perf.now();
      }
    }
    const LAST_EVENT_TIMEOUT_MS = 10;
    const IGNORED_EVENTS = ['mouseover', 'mouseleave', 'mouseenter', 'mouseout'];
    const SUPPORTED_EVENTS = [
    'keydown', 'keypress', 'keyup',
    'auxclick', 'click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup', 'pointerlockchange', 'pointerlockerror', 'select', 'wheel'];
    const SAFARI_PROBLEMATIC_EVENTS = ['wheel'];
    class EventTracker {
      constructor() {
        _defineProperty(this, "getLastEventType", () => this.lastEventType);
        _defineProperty(this, "getTimeSinceLastEvent", () => {
          if (!this.lastEventTime) {
            return null;
          }
          return Date.now() - this.lastEventTime;
        });
        this.trackedEvents = isSafariBrowser ? SUPPORTED_EVENTS.filter(event => !SAFARI_PROBLEMATIC_EVENTS.includes(event)) : SUPPORTED_EVENTS;
        this.trackedEvents.forEach(eventName => {
          document.documentElement.addEventListener(eventName, this.trackEvent, true);
        });
      }
      trackEvent(event) {
        this.lastEventType = event.type;
        this.lastEventTime = Date.now();
      }
      isIgnoredEventType() {
        const lastEventType = this.getLastEventType();
        const sinceLastEventTime = this.getTimeSinceLastEvent();
        return !!lastEventType && IGNORED_EVENTS.includes(lastEventType) && !!sinceLastEventTime && sinceLastEventTime < LAST_EVENT_TIMEOUT_MS;
      }
      stopTracking() {
        this.trackedEvents.forEach(eventName => {
          document.documentElement.removeEventListener(eventName, this.trackEvent, true);
        });
      }
    }
    const isEventListenerSupported = typeof window.addEventListener !== 'undefined';
    const observeDocument = (context, callback) => {
      const shouldIgnoreMutations = mutations => {
        return mutations.every(m => m.type === 'attributes');
      };
      if (natives.MutationObserver) {
        context.domMutationObserver = new natives.MutationObserver(mutations => {
          if (!mutations || mutations.length === 0) {
            return;
          }
          const eventTracker = new EventTracker();
          if (eventTracker.isIgnoredEventType() && shouldIgnoreMutations(mutations)) {
            return;
          }
          context.eventTracker = eventTracker;
          callback();
        });
        context.domMutationObserver.observe(document, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['id', 'class']
        });
      } else if (isEventListenerSupported) {
        document.addEventListener('DOMNodeInserted', callback, false);
        document.addEventListener('DOMNodeRemoved', callback, false);
        document.addEventListener('DOMAttrModified', callback, false);
      }
    };
    const disconnectDocument = (context, callback) => {
      var _context$eventTracker;
      if (context.domMutationObserver) {
        context.domMutationObserver.disconnect();
      } else if (isEventListenerSupported) {
        document.removeEventListener('DOMNodeInserted', callback, false);
        document.removeEventListener('DOMNodeRemoved', callback, false);
        document.removeEventListener('DOMAttrModified', callback, false);
      }
      (_context$eventTracker = context.eventTracker) === null || _context$eventTracker === void 0 ? void 0 : _context$eventTracker.stopTracking();
    };
    const mainObserve = (context, mainCallback) => {
      if (context.isDomObserved) {
        return;
      }
      context.isDomObserved = true;
      observeDocument(context, mainCallback);
    };
    const mainDisconnect = (context, mainCallback) => {
      if (!context.isDomObserved) {
        return;
      }
      context.isDomObserved = false;
      disconnectDocument(context, mainCallback);
    };
    const removeElement = (context, affectedElement) => {
      const node = affectedElement.node;
      affectedElement.removed = true;
      const elementSelector = getElementSelectorPath(node);
      const elementRemovalsCounter = context.removalsStatistic[elementSelector] || 0;
      if (elementRemovalsCounter > MAX_STYLE_PROTECTION_COUNT) {
        logger.error("ExtendedCss: infinite loop protection for selector: '".concat(elementSelector, "'"));
        return;
      }
      if (node.parentElement) {
        node.parentElement.removeChild(node);
        context.removalsStatistic[elementSelector] = elementRemovalsCounter + 1;
      }
    };
    const setStyleToElement = (node, style) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }
      Object.keys(style).forEach(prop => {
        if (typeof node.style.getPropertyValue(prop) !== 'undefined') {
          let value = style[prop];
          value = removeSuffix(value.trim(), '!important').trim();
          node.style.setProperty(prop, value, 'important');
        }
      });
    };
    const applyStyle = (context, affectedElement) => {
      if (affectedElement.protectionObserver) {
        return;
      }
      if (context.beforeStyleApplied) {
        affectedElement = context.beforeStyleApplied(affectedElement);
        if (!affectedElement) {
          return;
        }
      }
      const _affectedElement = affectedElement,
            node = _affectedElement.node,
            rules = _affectedElement.rules;
      for (let i = 0; i < rules.length; i += 1) {
        const _rules$i = rules[i],
              selector = _rules$i.selector,
              style = _rules$i.style,
              debug = _rules$i.debug;
        if (style) {
          if (style[REMOVE_PSEUDO_MARKER] === PSEUDO_PROPERTY_POSITIVE_VALUE) {
            removeElement(context, affectedElement);
            return;
          }
          setStyleToElement(node, style);
        } else if (!debug) {
          throw new Error("No style declaration in rule for selector: '".concat(selector, "'"));
        }
      }
    };
    const revertStyle = affectedElement => {
      if (affectedElement.protectionObserver) {
        affectedElement.protectionObserver.disconnect();
      }
      affectedElement.node.style.cssText = affectedElement.originalStyle;
    };
    class ExtMutationObserver {
      constructor(protectionCallback) {
        this.styleProtectionCount = 0;
        this.observer = new natives.MutationObserver(mutations => {
          if (!mutations.length) {
            return;
          }
          this.styleProtectionCount += 1;
          protectionCallback(mutations, this);
        });
      }
      observe(target, options) {
        if (this.styleProtectionCount < MAX_STYLE_PROTECTION_COUNT) {
          this.observer.observe(target, options);
        } else {
          logger.error('ExtendedCss: infinite loop protection for style');
        }
      }
      disconnect() {
        this.observer.disconnect();
      }
    }
    const PROTECTION_OBSERVER_OPTIONS = {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['style']
    };
    const createProtectionCallback = styles => {
      const protectionCallback = (mutations, extObserver) => {
        const target = mutations[0].target;
        extObserver.disconnect();
        styles.forEach(style => {
          setStyleToElement(target, style);
        });
        extObserver.observe(target, PROTECTION_OBSERVER_OPTIONS);
      };
      return protectionCallback;
    };
    const protectStyleAttribute = (node, rules) => {
      if (!natives.MutationObserver) {
        return null;
      }
      const styles = [];
      rules.forEach(ruleData => {
        const style = ruleData.style;
        if (style) {
          styles.push(style);
        }
      });
      const protectionObserver = new ExtMutationObserver(createProtectionCallback(styles));
      protectionObserver.observe(node, PROTECTION_OBSERVER_OPTIONS);
      return protectionObserver;
    };
    const STATS_DECIMAL_DIGITS_COUNT = 4;
    class TimingStats {
      constructor() {
        this.appliesTimings = [];
        this.appliesCount = 0;
        this.timingsSum = 0;
        this.meanTiming = 0;
        this.squaredSum = 0;
        this.standardDeviation = 0;
      }
      push(elapsedTimeMs) {
        this.appliesTimings.push(elapsedTimeMs);
        this.appliesCount += 1;
        this.timingsSum += elapsedTimeMs;
        this.meanTiming = this.timingsSum / this.appliesCount;
        this.squaredSum += elapsedTimeMs * elapsedTimeMs;
        this.standardDeviation = Math.sqrt(this.squaredSum / this.appliesCount - Math.pow(this.meanTiming, 2));
      }
    }
    const beautifyTimingNumber = timestamp => {
      return Number(timestamp.toFixed(STATS_DECIMAL_DIGITS_COUNT));
    };
    const beautifyTimings = rawTimings => {
      return {
        appliesTimings: rawTimings.appliesTimings.map(t => beautifyTimingNumber(t)),
        appliesCount: beautifyTimingNumber(rawTimings.appliesCount),
        timingsSum: beautifyTimingNumber(rawTimings.timingsSum),
        meanTiming: beautifyTimingNumber(rawTimings.meanTiming),
        standardDeviation: beautifyTimingNumber(rawTimings.standardDeviation)
      };
    };
    const printTimingInfo = context => {
      if (context.areTimingsPrinted) {
        return;
      }
      context.areTimingsPrinted = true;
      const timingsLogData = {};
      context.parsedRules.forEach(ruleData => {
        if (ruleData.timingStats) {
          const selector = ruleData.selector,
                style = ruleData.style,
                debug = ruleData.debug,
                matchedElements = ruleData.matchedElements;
          if (!style && !debug) {
            throw new Error("Rule should have style declaration for selector: '".concat(selector, "'"));
          }
          const selectorData = {
            selectorParsed: selector,
            timings: beautifyTimings(ruleData.timingStats)
          };
          if (style && style[REMOVE_PSEUDO_MARKER] === PSEUDO_PROPERTY_POSITIVE_VALUE) {
            selectorData.removed = true;
          } else {
            selectorData.styleApplied = style || null;
            selectorData.matchedElements = matchedElements;
          }
          timingsLogData[selector] = selectorData;
        }
      });
      if (Object.keys(timingsLogData).length === 0) {
        return;
      }
      logger.info('[ExtendedCss] Timings in milliseconds for %o:\n%o', window.location.href, timingsLogData);
    };
    const findAffectedElement = (affElements, domNode) => {
      return affElements.find(affEl => affEl.node === domNode);
    };
    const applyRule = (context, ruleData) => {
      const isDebuggingMode = !!ruleData.debug || context.debug;
      let startTime;
      if (isDebuggingMode) {
        startTime = ThrottleWrapper.now();
      }
      const ast = ruleData.ast;
      const nodes = selectElementsByAst(ast);
      nodes.forEach(node => {
        let affectedElement = findAffectedElement(context.affectedElements, node);
        if (affectedElement) {
          affectedElement.rules.push(ruleData);
          applyStyle(context, affectedElement);
        } else {
          const originalStyle = node.style.cssText;
          affectedElement = {
            node,
            rules: [ruleData],
            originalStyle,
            protectionObserver: null
          };
          applyStyle(context, affectedElement);
          context.affectedElements.push(affectedElement);
        }
      });
      if (isDebuggingMode && startTime) {
        const elapsedTimeMs = ThrottleWrapper.now() - startTime;
        if (!ruleData.timingStats) {
          ruleData.timingStats = new TimingStats();
        }
        ruleData.timingStats.push(elapsedTimeMs);
      }
      return nodes;
    };
    const applyRules = context => {
      const newSelectedElements = [];
      mainDisconnect(context, context.mainCallback);
      context.parsedRules.forEach(ruleData => {
        const nodes = applyRule(context, ruleData);
        Array.prototype.push.apply(newSelectedElements, nodes);
        if (ruleData.debug) {
          ruleData.matchedElements = nodes;
        }
      });
      let affLength = context.affectedElements.length;
      while (affLength) {
        const affectedElement = context.affectedElements[affLength - 1];
        if (!newSelectedElements.includes(affectedElement.node)) {
          revertStyle(affectedElement);
          context.affectedElements.splice(affLength - 1, 1);
        } else if (!affectedElement.removed) {
          if (!affectedElement.protectionObserver) {
            affectedElement.protectionObserver = protectStyleAttribute(affectedElement.node, affectedElement.rules);
          }
        }
        affLength -= 1;
      }
      mainObserve(context, context.mainCallback);
      printTimingInfo(context);
    };
    const APPLY_RULES_DELAY = 150;
    class ExtendedCss {
      constructor(configuration) {
        if (!isBrowserSupported()) {
          throw new Error('Browser is not supported by ExtendedCss.');
        }
        if (!configuration) {
          throw new Error('ExtendedCss configuration should be provided.');
        }
        this.context = {
          beforeStyleApplied: configuration.beforeStyleApplied,
          debug: false,
          affectedElements: [],
          isDomObserved: false,
          removalsStatistic: {},
          parsedRules: parse(configuration.styleSheet, extCssDocument),
          mainCallback: () => {}
        };
        this.context.debug = configuration.debug || this.context.parsedRules.some(ruleData => {
          return ruleData.debug === DEBUG_PSEUDO_PROPERTY_GLOBAL_VALUE;
        });
        this.applyRulesScheduler = new ThrottleWrapper(this.context, applyRules, APPLY_RULES_DELAY);
        this.context.mainCallback = this.applyRulesScheduler.run.bind(this.applyRulesScheduler);
        if (this.context.beforeStyleApplied && typeof this.context.beforeStyleApplied !== 'function') {
          throw new Error("Invalid configuration. Type of 'beforeStyleApplied' should be a function, received: '".concat(typeof this.context.beforeStyleApplied, "'"));
        }
        this.applyRulesCallbackListener = () => {
          applyRules(this.context);
        };
      }
      apply() {
        applyRules(this.context);
        if (document.readyState !== 'complete') {
          document.addEventListener('DOMContentLoaded', this.applyRulesCallbackListener, false);
        }
      }
      dispose() {
        mainDisconnect(this.context, this.context.mainCallback);
        this.context.affectedElements.forEach(el => {
          revertStyle(el);
        });
        document.removeEventListener('DOMContentLoaded', this.applyRulesCallbackListener, false);
      }
      getAffectedElements() {
        return this.context.affectedElements;
      }
      static query(selector) {
        let noTiming = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        if (typeof selector !== 'string') {
          throw new Error('Selector should be defined as a string.');
        }
        const start = ThrottleWrapper.now();
        try {
          return extCssDocument.querySelectorAll(selector);
        } finally {
          const end = ThrottleWrapper.now();
          if (!noTiming) {
            logger.info("[ExtendedCss] Elapsed: ".concat(Math.round((end - start) * 1000), " \u03BCs."));
          }
        }
      }
      static validate(inputSelector) {
        try {
          const _parseRemoveSelector = parseRemoveSelector(inputSelector),
                selector = _parseRemoveSelector.selector;
          ExtendedCss.query(selector);
          return {
            ok: true,
            error: null
          };
        } catch (e) {
          const error = "Selector is not valid: '".concat(inputSelector, "' -- ").concat(e.message);
          return {
            ok: false,
            error
          };
        }
      }
    }
    exports.ExtendedCss = ExtendedCss;
    Object.defineProperty(exports, '__esModule', { value: true });
}));
}(extendedCss_umd, extendedCss_umd.exports));
getDefaultExportFromCjs(extendedCss_umd.exports);

/**
 * Utils class
 */
var ElementUtils = /** @class */ (function () {
    function ElementUtils() {
    }
    /**
     * Serialize HTML element
     *
     * @param element
     */
    ElementUtils.elementToString = function (element) {
        var s = [];
        s.push('<');
        s.push(element.localName);
        var attributes = element.attributes;
        for (var i = 0; i < attributes.length; i += 1) {
            var attr = attributes[i];
            s.push(' ');
            s.push(attr.name);
            s.push('="');
            var value = attr.value === null ? '' : attr.value.replace(/"/g, '\\"');
            s.push(value);
            s.push('"');
        }
        s.push('>');
        return s.join('');
    };
    /**
     * Appends node children to the array
     *
     * @param node - element whose children we would like to add
     * @param arrayWithNodes - array where we add children
     */
    ElementUtils.appendChildren = function (node, arrayWithNodes) {
        var children = node.querySelectorAll('*');
        if (children && children.length > 0) {
            for (var i = 0; i < children.length; i += 1) {
                arrayWithNodes.push(children[i]);
            }
        }
    };
    /**
     * Adds elements into array if they are not in the array yet
     *
     * @param {*} targetArray
     * @param {*} sourceArray
     */
    ElementUtils.addUnique = function (targetArray, sourceArray) {
        if (sourceArray.length > 0) {
            for (var i = 0; i < sourceArray.length; i += 1) {
                var sourceElement = sourceArray[i];
                if (targetArray.indexOf(sourceElement) === -1) {
                    targetArray.push(sourceElement);
                }
            }
        }
    };
    /**
     * Removes all elements in array
     *
     * @param elements
     */
    ElementUtils.removeElements = function (elements) {
        for (var i = 0; i < elements.length; i += 1) {
            var element = elements[i];
            element.remove();
        }
    };
    /**
     * Parses hits info from style content
     *
     * @param content style
     * @param attributeMarker
     */
    ElementUtils.parseInfo = function (content, attributeMarker) {
        if (!content || content.indexOf(attributeMarker) < 0) {
            return null;
        }
        var filterIdAndRuleText = decodeURIComponent(content);
        // 'content' value may include open and close quotes.
        filterIdAndRuleText = ElementUtils.removeQuotes(filterIdAndRuleText);
        // Remove prefix
        filterIdAndRuleText = filterIdAndRuleText.substring(attributeMarker.length);
        // Attribute 'content' in css looks like: {content: 'adguard{filterId};{ruleText}'}
        var index = filterIdAndRuleText.indexOf(';');
        if (index < 0) {
            return null;
        }
        var filterId = parseInt(filterIdAndRuleText.substring(0, index), 10);
        if (Number.isNaN(filterId)) {
            return null;
        }
        var ruleText = filterIdAndRuleText.substring(index + 1);
        return { filterId: filterId, ruleText: ruleText };
    };
    /**
     * Parses hits info from style content
     *
     * @param content style
     * @param attributeMarker
     */
    // eslint-disable-next-line max-len
    ElementUtils.parseExtendedStyleInfo = function (content, attributeMarker) {
        var important = '!important';
        var indexOfImportant = content.lastIndexOf(important);
        if (indexOfImportant === -1) {
            return ElementUtils.parseInfo(content, attributeMarker);
        }
        var contentWithoutImportant = content.substring(0, indexOfImportant).trim();
        return ElementUtils.parseInfo(contentWithoutImportant, attributeMarker);
    };
    /**
     * Unquotes specified value
     */
    ElementUtils.removeQuotes = function (value) {
        if (value.length > 1
            && ((value[0] === '"' && value[value.length - 1] === '"')
                || (value[0] === '\'' && value[value.length - 1] === '\''))) {
            // Remove double-quotes or single-quotes
            return value.substring(1, value.length - 1);
        }
        return value;
    };
    return ElementUtils;
}());

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This storage is used to keep track of counted rules
 * regarding to node elements
 */
var HitsStorage = /** @class */ (function () {
    function HitsStorage() {
        /**
         * Start count number
         */
        this.counter = 0;
        /**
         * Storage random identificator
         */
        this.randomKey = HitsStorage.generateRandomKey();
        /**
         * Map storage
         */
        this.map = new Map();
    }
    /**
     * Checks if element is counted
     *
     * @param element html element
     * @param rule rule text
     */
    HitsStorage.prototype.isCounted = function (element, rule) {
        var hitAddress = element[this.randomKey];
        if (hitAddress) {
            var countedHit = this.map.get(hitAddress);
            if (countedHit) {
                return countedHit.element === element && countedHit.rule === rule;
            }
        }
        return false;
    };
    /**
     * Stores rule-element info in storage
     *
     * @param element html element
     * @param rule rule text
     */
    HitsStorage.prototype.setCounted = function (element, rule) {
        var counter = this.getCounter();
        // eslint-disable-next-line no-param-reassign
        element[this.randomKey] = counter;
        this.map.set(counter, { element: element, rule: rule });
    };
    /**
     * @return current count number
     */
    HitsStorage.prototype.getCounter = function () {
        this.counter += 1;
        return this.counter;
    };
    /**
     * Random id generator
     * @returns {String} - random key with desired length
     */
    HitsStorage.generateRandomKey = function () {
        var keyLength = 10;
        var possibleValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < keyLength; i += 1) {
            result += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
        }
        return result;
    };
    return HitsStorage;
}());

/* eslint-disable no-param-reassign */
/**
 * Class represents collecting css style hits process
 *
 * During applying css styles to element we add special 'content:' attribute
 * Example:
 * .selector -> .selector { content: 'adguard{filterId};{ruleText} !important;}
 *
 * then here we parse this attribute and calls provided callback function
 */
var CssHitsCounter = /** @class */ (function () {
    /**
     * This function prepares calculation of css hits.
     * We are waiting for 'load' event and start calculation.
     * @param callback - ({filterId: number; ruleText: string; element: string}[]) => {} handles counted css hits
     */
    function CssHitsCounter(callback) {
        /**
         * Hits storage
         */
        this.hitsStorage = new HitsStorage();
        /**
         * Mutation observer
         */
        this.observer = null;
        /**
         * Counting on process flag
         */
        this.countIsWorking = false;
        this.onCssHitsFoundCallback = callback;
        if (document.readyState === 'complete'
            || document.readyState === 'interactive') {
            this.countCssHits();
        }
        else {
            document.addEventListener('readystatechange', this.startCounter.bind(this));
        }
    }
    /**
     * Stops css hits counting process
     */
    CssHitsCounter.prototype.stop = function () {
        this.onCssHitsFoundCallback = function () { };
        if (this.observer) {
            this.observer.disconnect();
        }
    };
    /**
     * Callback used to collect statistics of elements affected by extended css rules
     *
     * @param {object} affectedEl
     * @return {object} affectedEl
     */
    CssHitsCounter.prototype.countAffectedByExtendedCss = function (affectedEl) {
        if (affectedEl && affectedEl.rules && affectedEl.rules.length > 0) {
            var result = [];
            for (var _i = 0, _a = affectedEl.rules; _i < _a.length; _i++) {
                var rule = _a[_i];
                if (rule.style && rule.style.content) {
                    var styleInfo = ElementUtils.parseExtendedStyleInfo(rule.style.content, CssHitsCounter.CONTENT_ATTR_PREFIX);
                    if (styleInfo === null) {
                        continue;
                    }
                    var filterId = styleInfo.filterId, ruleText = styleInfo.ruleText;
                    if (filterId !== undefined && ruleText !== undefined) {
                        result.push({
                            filterId: filterId,
                            ruleText: ruleText,
                            element: ElementUtils.elementToString(affectedEl.node),
                        });
                        // clear style content to avoid duplicate counting
                        rule.style.content = '';
                    }
                }
            }
            this.onCssHitsFoundCallback(result);
        }
        return affectedEl;
    };
    /**
     * Starts counting process
     */
    CssHitsCounter.prototype.startCounter = function () {
        if (document.readyState === 'interactive'
            || document.readyState === 'complete') {
            this.countCssHits();
            document.removeEventListener('readystatechange', this.startCounter);
        }
    };
    /**
     * Counts css hits
     */
    CssHitsCounter.prototype.countCssHits = function () {
        this.countAllCssHits();
        this.countCssHitsForMutations();
    };
    /**
     * Counts css hits for already affected elements
     */
    CssHitsCounter.prototype.countAllCssHits = function () {
        var _this = this;
        // we don't start counting again all css hits till previous count process wasn't finished
        if (this.countIsWorking) {
            return;
        }
        this.countIsWorking = true;
        var elements = document.querySelectorAll('*');
        this.countCssHitsBatch(elements, 0, CssHitsCounter.CSS_HITS_BATCH_SIZE, CssHitsCounter.CSS_HITS_BATCH_SIZE, [], function (result) {
            if (result.length > 0) {
                _this.onCssHitsFoundCallback(result);
            }
            _this.countIsWorking = false;
        });
    };
    /**
     * Main calculation function.
     * 1. Selects sub collection from elements.
     * 2. For each element from sub collection: retrieves calculated css 'content'
     * attribute and if it contains 'adguard'
     * marker then retrieves rule text and filter identifier.
     * 3. Starts next task with some delay.
     *
     * @param elements Collection of all elements
     * @param start Start of batch
     * @param end End of batch
     * @param step Size of batch
     * @param result Collection for save result
     * @param callback Finish callback
     */
    // eslint-disable-next-line max-len
    CssHitsCounter.prototype.countCssHitsBatch = function (elements, start, end, step, result, callback) {
        var _this = this;
        var length = Math.min(end, elements.length);
        result = result.concat(this.countCssHitsForElements(elements, start, length));
        if (length === elements.length) {
            callback(result);
            return;
        }
        start = end;
        end += step;
        // Start next task with some delay
        window.setTimeout(function () {
            _this.countCssHitsBatch(elements, start, end, step, result, callback);
        }, CssHitsCounter.COUNT_CSS_HITS_BATCH_DELAY);
    };
    /**
     * Counts css hits for array of elements
     *
     * @param elements
     * @param start
     * @param length
     */
    CssHitsCounter.prototype.countCssHitsForElements = function (elements, start, length) {
        var RULE_FILTER_SEPARATOR = ';';
        start = start || 0;
        length = length || elements.length;
        var result = [];
        for (var i = start; i < length; i += 1) {
            var element = elements[i];
            var cssHitData = CssHitsCounter.getCssHitData(element);
            if (!cssHitData) {
                continue;
            }
            var filterId = cssHitData.filterId, ruleText = cssHitData.ruleText;
            var ruleAndFilterString = filterId + RULE_FILTER_SEPARATOR + ruleText;
            if (this.hitsStorage.isCounted(element, ruleAndFilterString)) {
                continue;
            }
            this.hitsStorage.setCounted(element, ruleAndFilterString);
            result.push({
                filterId: filterId,
                ruleText: ruleText,
                element: ElementUtils.elementToString(element),
            });
        }
        return result;
    };
    /**
     * Counts css hits for mutations
     */
    CssHitsCounter.prototype.countCssHitsForMutations = function () {
        var _this = this;
        // eslint-disable-next-line prefer-destructuring
        var MutationObserver = window.MutationObserver;
        if (!MutationObserver) {
            return;
        }
        if (this.observer) {
            this.observer.disconnect();
        }
        var timeoutId = null;
        this.observer = new MutationObserver((function (mutationRecords) {
            // Collect probe elements, count them, then remove from their targets
            var probeElements = [];
            var childrenOfProbeElements = [];
            var potentialProbeElements = [];
            mutationRecords.forEach(function (mutationRecord) {
                if (mutationRecord.addedNodes.length === 0) {
                    return;
                }
                for (var i = 0; i < mutationRecord.addedNodes.length; i += 1) {
                    var node = mutationRecord.addedNodes[i];
                    if (!(node instanceof Element) || CssHitsCounter.isIgnoredNodeTag(node.tagName)) {
                        continue;
                    }
                    var target = mutationRecord.target;
                    if (!node.parentNode && target) {
                        // Most likely this is a "probe" element that was added and then
                        // immediately removed from DOM.
                        // We re-add it and check if any rule matched it
                        probeElements.push(node);
                        // CSS rules could be applied to the nodes inside probe element
                        // that's why we get all child elements of added node
                        ElementUtils.appendChildren(node, childrenOfProbeElements);
                        if (_this.observer) {
                            _this.observer.disconnect();
                        }
                        mutationRecord.target.appendChild(node);
                    }
                    else if (node.parentNode && target) {
                        // Sometimes probe elements are appended to the DOM
                        potentialProbeElements.push(node);
                        ElementUtils.appendChildren(node, potentialProbeElements);
                    }
                }
            });
            // If the list of potential probe elements is relatively small,
            // we can count CSS hits immediately
            if (potentialProbeElements.length > 0
                && potentialProbeElements.length <= CssHitsCounter.CSS_HITS_BATCH_SIZE) {
                var result = _this.countCssHitsForElements(potentialProbeElements, 0, null);
                if (result.length > 0) {
                    _this.onCssHitsFoundCallback(result);
                }
            }
            var allProbeElements = [];
            ElementUtils.addUnique(allProbeElements, childrenOfProbeElements);
            ElementUtils.addUnique(allProbeElements, probeElements);
            if (allProbeElements.length > 0) {
                var result = _this.countCssHitsForElements(allProbeElements, 0, null);
                if (result.length > 0) {
                    _this.onCssHitsFoundCallback(result);
                }
                /**
                 * don't remove child elements of probe elements
                 * https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1096
                 */
                ElementUtils.removeElements(probeElements);
                _this.startObserver();
            }
            // debounce counting all css hits when mutation record fires
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            timeoutId = window.setTimeout(function () {
                _this.countAllCssHits();
                window.clearTimeout(timeoutId);
            }, CssHitsCounter.COUNT_ALL_CSS_HITS_TIMEOUT_MS);
        }));
        this.startObserver();
    };
    /**
     * Starts mutation observer
     */
    CssHitsCounter.prototype.startObserver = function () {
        if (this.observer) {
            this.observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }
    };
    /**
     * Function checks if elements style content attribute contains data injected with AdGuard
     *
     * @param {Node} element
     * @returns {({filterId: Number, ruleText: String} | null)}
     */
    CssHitsCounter.getCssHitData = function (element) {
        var style = getComputedStyle(element);
        return ElementUtils.parseInfo(style.content, CssHitsCounter.CONTENT_ATTR_PREFIX);
    };
    /**
     * Check if tag is ignored
     * @param nodeTag
     */
    CssHitsCounter.isIgnoredNodeTag = function (nodeTag) {
        var ignoredTags = ['script'];
        return ignoredTags.includes(nodeTag.toLowerCase());
    };
    /**
     * We split CSS hits counting into smaller batches of elements
     * and schedule them one by one using setTimeout
     */
    CssHitsCounter.COUNT_CSS_HITS_BATCH_DELAY = 5;
    /**
     * Size of small batches of elements we count
     */
    CssHitsCounter.CSS_HITS_BATCH_SIZE = 25;
    /**
     * In order to find elements hidden by AdGuard we look for a `:content` pseudo-class
     * with values starting with this prefix. Filter information will be
     * encoded in this value as well.
     */
    CssHitsCounter.CONTENT_ATTR_PREFIX = 'adguard';
    /**
     * We delay countAllCssHits function if it was called too frequently from mutationObserver
     */
    CssHitsCounter.COUNT_ALL_CSS_HITS_TIMEOUT_MS = 500;
    return CssHitsCounter;
}());

/**
 * This class applies cookie rules in page context
 *
 * - Removes cookies matching rules
 * - Listens to new cookies, then tries to apply rules to them
 */
var CookieController = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param callback
     */
    function CookieController(callback) {
        /**
         * Is current context third-party
         */
        this.isThirdPartyContext = false;
        this.onRuleAppliedCallback = callback;
        this.isThirdPartyContext = this.isThirdPartyFrame();
    }
    /**
     * Applies rules
     *
     * @param rules
     */
    CookieController.prototype.apply = function (rules) {
        var _this = this;
        this.applyRules(rules);
        var lastCookie = document.cookie;
        this.listenCookieChange(function (oldValue, newValue) {
            if (newValue === lastCookie) {
                // Skip changes made by this class
                return;
            }
            _this.applyRules(rules);
            lastCookie = document.cookie;
        });
        window.addEventListener('beforeunload', function () {
            _this.applyRules(rules);
        });
    };
    /**
     * Polling document cookie
     *
     * @param callback
     * @param interval
     */
    // eslint-disable-next-line class-methods-use-this
    CookieController.prototype.listenCookieChange = function (callback, interval) {
        if (interval === void 0) { interval = 1000; }
        var lastCookie = document.cookie;
        setInterval(function () {
            var cookie = document.cookie;
            if (cookie !== lastCookie) {
                try {
                    callback(lastCookie, cookie);
                }
                finally {
                    lastCookie = cookie;
                }
            }
        }, interval);
    };
    /**
     * Checks if current context is third-party
     */
    // eslint-disable-next-line class-methods-use-this
    CookieController.prototype.isThirdPartyFrame = function () {
        try {
            return window.self !== window.top && document.location.hostname !== window.parent.location.hostname;
        }
        catch (e) {
            return true;
        }
    };
    /**
     * Applies rules to document cookies
     * Inspired by remove-cookie scriptlet
     * https://github.com/AdguardTeam/Scriptlets/blob/master/src/scriptlets/remove-cookie.js
     *
     * @param rules
     */
    CookieController.prototype.applyRules = function (rules) {
        var _this = this;
        document.cookie.split(';').forEach(function (cookieStr) {
            var pos = cookieStr.indexOf('=');
            if (pos === -1) {
                return;
            }
            var cookieName = cookieStr.slice(0, pos).trim();
            var cookieValue = cookieStr.slice(pos + 1).trim();
            var matchingRules = rules.filter(function (r) {
                if (_this.isThirdPartyContext !== r.isThirdParty) {
                    return false;
                }
                var regex = r.match ? CookieController.toRegExp(r.match) : CookieController.toRegExp('/.?/');
                return regex.test(cookieName);
            });
            var importantRules = matchingRules.filter(function (r) { return r.ruleText.includes('important'); });
            if (importantRules.length > 0) {
                importantRules.forEach(function (rule) {
                    _this.applyRule(rule, cookieName, cookieValue);
                });
            }
            else {
                var allowlistRules = matchingRules.filter(function (r) { return r.isAllowlist; });
                if (allowlistRules.length > 0) {
                    allowlistRules.forEach(function (rule) {
                        _this.applyRule(rule, cookieName, cookieValue);
                    });
                }
                else {
                    matchingRules.forEach(function (rule) {
                        _this.applyRule(rule, cookieName, cookieValue);
                    });
                }
            }
        });
    };
    /**
     * Applies rule
     *
     * @param rule
     * @param cookieName
     * @param cookieValue
     */
    CookieController.prototype.applyRule = function (rule, cookieName, cookieValue) {
        if (!rule.isAllowlist) {
            var hostParts = document.location.hostname.split('.');
            for (var i = 0; i <= hostParts.length - 1; i += 1) {
                var hostName = hostParts.slice(i).join('.');
                if (hostName) {
                    CookieController.removeCookieFromHost(cookieName, hostName);
                }
            }
        }
        this.onRuleAppliedCallback({
            cookieName: cookieName,
            cookieValue: cookieValue,
            cookieDomain: document.location.hostname,
            cookieRuleText: rule.ruleText,
            thirdParty: rule.isThirdParty,
            filterId: rule.filterId,
        });
    };
    /**
     * Removes cookie for host
     *
     * @param cookieName
     * @param hostName
     */
    CookieController.removeCookieFromHost = function (cookieName, hostName) {
        var cookieSpec = "".concat(cookieName, "=");
        var domain1 = "; domain=".concat(hostName);
        var domain2 = "; domain=.".concat(hostName);
        var path = '; path=/';
        var expiration = '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = cookieSpec + expiration;
        document.cookie = cookieSpec + domain1 + expiration;
        document.cookie = cookieSpec + domain2 + expiration;
        document.cookie = cookieSpec + path + expiration;
        document.cookie = cookieSpec + domain1 + path + expiration;
        document.cookie = cookieSpec + domain2 + path + expiration;
    };
    /**
     * Converts cookie rule match to regular expression
     *
     * @param str
     */
    CookieController.toRegExp = function (str) {
        if (str[0] === '/' && str[str.length - 1] === '/') {
            return new RegExp(str.slice(1, -1));
        }
        var escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp("^".concat(escaped, "$"));
    };
    return CookieController;
}());

/**
 * This module applies stealth actions in page context
 */
var StealthHelper = /** @class */ (function () {
    function StealthHelper() {
    }
    /**
     * Sends a Global Privacy Control DOM signal
     */
    StealthHelper.setDomSignal = function () {
        try {
            if ('globalPrivacyControl' in Navigator.prototype) {
                return;
            }
            Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', {
                get: function () { return true; },
                configurable: true,
                enumerable: true,
            });
        }
        catch (ex) {
            // Ignore
        }
    };
    return StealthHelper;
}());

/**
 * This module exports libraries used in the extension via content scripts
 */
var index = {
    ExtendedCss: extendedCss_umd.exports.ExtendedCss,
    CssHitsCounter: CssHitsCounter,
    CookieController: CookieController,
    StealthHelper: StealthHelper,
};



// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.weak-set.add-all.js
var esnext_weak_set_add_all = __webpack_require__(51747);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.weak-set.delete-all.js
var esnext_weak_set_delete_all = __webpack_require__(57000);
// EXTERNAL MODULE: ./node_modules/webextension-polyfill/dist/browser-polyfill.js
var browser_polyfill = __webpack_require__(53679);
var browser_polyfill_default = /*#__PURE__*/__webpack_require__.n(browser_polyfill);
;// CONCATENATED MODULE: ./Extension/src/background/extension-api/windows.js
/* eslint-disable no-unused-vars */

/**
 * This function patches if necessary browser.windows implementation for Firefox for Android
 */
const patchWindows = function (browser) {
  // Make compatible with Android WebExt
  if (typeof browser.windows === 'undefined') {
    browser.windows = function () {
      const defaultWindow = {
        id: 1,
        type: 'normal'
      };
      const emptyListener = {
        addListener() {// Doing nothing
        }

      };

      const create = function (createData) {
        return Promise.resolve(defaultWindow);
      };

      const update = function (windowId, data) {
        return Promise.resolve();
      };

      const getAll = function (query) {
        return Promise.resolve(defaultWindow);
      };

      const getLastFocused = function () {
        return Promise.resolve(defaultWindow);
      };

      return {
        onCreated: emptyListener,
        onRemoved: emptyListener,
        onFocusChanged: emptyListener,
        create,
        update,
        getAll,
        getLastFocused
      };
    }();
  }
};
;// CONCATENATED MODULE: ./Extension/src/background/extension-api/browser.js


patchWindows((browser_polyfill_default()));

;// CONCATENATED MODULE: ./Extension/src/common/common-script.js
/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adguard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */

const runtimeImpl = (() => {
  return {
    onMessage: (browser_polyfill_default()).runtime.onMessage,
    sendMessage: (browser_polyfill_default()).runtime.sendMessage
  };
})(); // eslint-disable-next-line prefer-destructuring

const i18n = (browser_polyfill_default()).i18n;
/**
 * Sleeps given period of time
 * @param wait
 * @returns {Promise<unknown>}
 */

const sleep = wait => {
  return new Promise(resolve => {
    setTimeout(resolve, wait);
  });
};
/**
 * Sleeps necessary period of time if minimum duration didn't pass since entry time
 * @param {number} entryTimeMs
 * @param {number} minDurationMs
 * @returns {Promise<void>}
 */

const sleepIfNecessary = async (entryTimeMs, minDurationMs) => {
  if (Date.now() - entryTimeMs < minDurationMs) {
    await sleep(minDurationMs - (Date.now() - entryTimeMs));
  }
};
/**
 * Executes async function with at least required time
 * @param fn
 * @param minDurationMs
 */

const addMinDurationTime = (fn, minDurationMs) => {
  return async (...args) => {
    const start = Date.now();

    try {
      const response = await fn(...args);
      await sleepIfNecessary(start, minDurationMs);
      return response;
    } catch (e) {
      await sleepIfNecessary(start, minDurationMs);
      throw e;
    }
  };
};
;// CONCATENATED MODULE: ./Extension/src/content-script/content-script.js
/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adguard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */

const contentPage = {
  sendMessage: runtimeImpl.sendMessage,
  onMessage: runtimeImpl.onMessage
};
;// CONCATENATED MODULE: ./Extension/src/common/constants.js
/**
 * Filter ids used in the code on the background page and filtering log page
 */
const ANTIBANNER_FILTERS_ID = {
  STEALTH_MODE_FILTER_ID: -1,
  USER_FILTER_ID: 0,
  RUSSIAN_FILTER_ID: 1,
  ENGLISH_FILTER_ID: 2,
  TRACKING_FILTER_ID: 3,
  SOCIAL_FILTER_ID: 4,
  SEARCH_AND_SELF_PROMO_FILTER_ID: 10,
  URL_TRACKING_FILTER_ID: 17,
  ALLOWLIST_FILTER_ID: 100,
  EASY_PRIVACY: 118,
  FANBOY_ANNOYANCES: 122,
  FANBOY_SOCIAL: 123,
  FANBOY_ENHANCED: 215,
  MOBILE_ADS_FILTER_ID: 11
};
/**
 * Group ids used in the code on the multiple entry points
 */

const ANTIBANNER_GROUPS_ID = {
  // custom filters group identifier
  CUSTOM_FILTERS_GROUP_ID: 0,
  PRIVACY_FILTERS_GROUP_ID: 2,
  // other filters group identifier
  OTHER_FILTERS_GROUP_ID: 6,
  // language-specific group identifier
  LANGUAGE_FILTERS_GROUP_ID: 7
};
/**
 * Stealth action bitwise masks used o the background page and on the filtering log page
 */

const STEALTH_ACTIONS = {
  HIDE_REFERRER: 1 << 0,
  HIDE_SEARCH_QUERIES: 1 << 1,
  BLOCK_CHROME_CLIENT_DATA: 1 << 2,
  SEND_DO_NOT_TRACK: 1 << 3,
  STRIPPED_TRACKING_URL: 1 << 4,
  FIRST_PARTY_COOKIES: 1 << 5,
  THIRD_PARTY_COOKIES: 1 << 6
};
/**
 * Message types used for message passing between background page and
 * other pages (popup, filtering log, content scripts)
 */

const MESSAGE_TYPES = {
  SCRIPTLET_CLOSE_WINDOW: 'scriptletCloseWindow',
  CREATE_EVENT_LISTENER: 'createEventListener',
  REMOVE_LISTENER: 'removeListener',
  OPEN_EXTENSION_STORE: 'openExtensionStore',
  OPEN_COMPARE_PAGE: 'openComparePage',
  ADD_AND_ENABLE_FILTER: 'addAndEnableFilter',
  APPLY_SETTINGS_JSON: 'applySettingsJson',
  OPEN_FILTERING_LOG: 'openFilteringLog',
  SET_FILTERING_LOG_WINDOW_STATE: 'setFilteringLogWindowState',
  OPEN_FULLSCREEN_USER_RULES: 'openFullscreenUserRules',
  RESET_BLOCKED_ADS_COUNT: 'resetBlockedAdsCount',
  RESET_SETTINGS: 'resetSettings',
  GET_USER_RULES: 'getUserRules',
  SAVE_USER_RULES: 'saveUserRules',
  GET_ALLOWLIST_DOMAINS: 'getAllowlistDomains',
  SAVE_ALLOWLIST_DOMAINS: 'saveAllowlistDomains',
  CHECK_ANTIBANNER_FILTERS_UPDATE: 'checkAntiBannerFiltersUpdate',
  DISABLE_FILTERS_GROUP: 'disableFiltersGroup',
  DISABLE_ANTIBANNER_FILTER: 'disableAntiBannerFilter',
  LOAD_CUSTOM_FILTER_INFO: 'loadCustomFilterInfo',
  SUBSCRIBE_TO_CUSTOM_FILTER: 'subscribeToCustomFilter',
  REMOVE_ANTIBANNER_FILTER: 'removeAntiBannerFilter',
  GET_TAB_INFO_FOR_POPUP: 'getTabInfoForPopup',
  CHANGE_APPLICATION_FILTERING_DISABLED: 'changeApplicationFilteringDisabled',
  OPEN_SETTINGS_TAB: 'openSettingsTab',
  OPEN_ASSISTANT: 'openAssistant',
  OPEN_ABUSE_TAB: 'openAbuseTab',
  OPEN_SITE_REPORT_TAB: 'openSiteReportTab',
  RESET_CUSTOM_RULES_FOR_PAGE: 'resetCustomRulesForPage',
  REMOVE_ALLOWLIST_DOMAIN: 'removeAllowlistDomainPopup',
  ADD_ALLOWLIST_DOMAIN_POPUP: 'addAllowlistDomainPopup',
  GET_STATISTICS_DATA: 'getStatisticsData',
  ON_OPEN_FILTERING_LOG_PAGE: 'onOpenFilteringLogPage',
  GET_FILTERING_LOG_DATA: 'getFilteringLogData',
  INITIALIZE_FRAME_SCRIPT: 'initializeFrameScript',
  ON_CLOSE_FILTERING_LOG_PAGE: 'onCloseFilteringLogPage',
  GET_FILTERING_INFO_BY_TAB_ID: 'getFilteringInfoByTabId',
  SYNCHRONIZE_OPEN_TABS: 'synchronizeOpenTabs',
  CLEAR_EVENTS_BY_TAB_ID: 'clearEventsByTabId',
  REFRESH_PAGE: 'refreshPage',
  OPEN_TAB: 'openTab',
  CONTENT_SCRIPT_ADD_USER_RULE: 'contentScriptAddUserRule',
  FILTERING_LOG_ADD_USER_RULE: 'filteringLogAddUserRule',
  DEVTOOLS_ADD_USER_RULE: 'devtoolsAddUserRule',
  UN_ALLOWLIST_FRAME: 'unAllowlistFrame',
  REMOVE_USER_RULE: 'removeUserRule',
  GET_TAB_FRAME_INFO_BY_ID: 'getTabFrameInfoById',
  ENABLE_FILTERS_GROUP: 'enableFiltersGroup',
  NOTIFY_LISTENERS: 'notifyListeners',
  ADD_LONG_LIVED_CONNECTION: 'addLongLivedConnection',
  GET_OPTIONS_DATA: 'getOptionsData',
  CHANGE_USER_SETTING: 'changeUserSetting',
  CHECK_REQUEST_FILTER_READY: 'checkRequestFilterReady',
  OPEN_THANKYOU_PAGE: 'openThankYouPage',
  OPEN_SAFEBROWSING_TRUSTED: 'openSafebrowsingTrusted',
  GET_SELECTORS_AND_SCRIPTS: 'getSelectorsAndScripts',
  CHECK_PAGE_SCRIPT_WRAPPER_REQUEST: 'checkPageScriptWrapperRequest',
  PROCESS_SHOULD_COLLAPSE: 'processShouldCollapse',
  PROCESS_SHOULD_COLLAPSE_MANY: 'processShouldCollapseMany',
  ADD_FILTERING_SUBSCRIPTION: 'addFilterSubscription',
  SET_NOTIFICATION_VIEWED: 'setNotificationViewed',
  SAVE_CSS_HITS_STATS: 'saveCssHitStats',
  GET_COOKIE_RULES: 'getCookieRules',
  SAVE_COOKIE_LOG_EVENT: 'saveCookieRuleEvent',
  LOAD_SETTINGS_JSON: 'loadSettingsJson',
  ADD_URL_TO_TRUSTED: 'addUrlToTrusted',
  SET_PRESERVE_LOG_STATE: 'setPreserveLogState',
  GET_USER_RULES_EDITOR_DATA: 'getUserRulesEditorData',
  GET_EDITOR_STORAGE_CONTENT: 'getEditorStorageContent',
  SET_EDITOR_STORAGE_CONTENT: 'setEditorStorageContent',
  CONVERT_RULES_TEXT: 'convertRulesText'
};
const NOTIFIER_TYPES = {
  ADD_RULES: 'event.add.rules',
  REMOVE_RULE: 'event.remove.rule',
  UPDATE_FILTER_RULES: 'event.update.filter.rules',
  FILTER_GROUP_ENABLE_DISABLE: 'filter.group.enable.disable',
  // enabled or disabled filter group
  FILTER_ENABLE_DISABLE: 'event.filter.enable.disable',
  // Enabled or disabled
  FILTER_ADD_REMOVE: 'event.filter.add.remove',
  // Added or removed
  ADS_BLOCKED: 'event.ads.blocked',
  START_DOWNLOAD_FILTER: 'event.start.download.filter',
  SUCCESS_DOWNLOAD_FILTER: 'event.success.download.filter',
  ERROR_DOWNLOAD_FILTER: 'event.error.download.filter',
  ENABLE_FILTER_SHOW_POPUP: 'event.enable.filter.show.popup',
  LOG_EVENT: 'event.log.track',
  UPDATE_TAB_BUTTON_STATE: 'event.update.tab.button.state',
  REQUEST_FILTER_UPDATED: 'event.request.filter.updated',
  APPLICATION_INITIALIZED: 'event.application.initialized',
  APPLICATION_UPDATED: 'event.application.updated',
  CHANGE_PREFS: 'event.change.prefs',
  UPDATE_FILTERS_SHOW_POPUP: 'event.update.filters.show.popup',
  USER_FILTER_UPDATED: 'event.user.filter.updated',
  UPDATE_ALLOWLIST_FILTER_RULES: 'event.update.allowlist.filter.rules',
  SETTING_UPDATED: 'event.update.setting.value',
  FILTERS_UPDATE_CHECK_READY: 'event.update.filters.check',
  // Log events
  TAB_ADDED: 'log.tab.added',
  TAB_CLOSE: 'log.tab.close',
  TAB_UPDATE: 'log.tab.update',
  TAB_RESET: 'log.tab.reset',
  LOG_EVENT_ADDED: 'log.event.added',
  // Sync events
  SETTINGS_UPDATED: 'event.sync.finished',
  // Fullscreen user rules events
  FULLSCREEN_USER_RULES_EDITOR_UPDATED: 'event.user.rules.editor.updated'
};
const FULLSCREEN_USER_RULES_EDITOR = 'fullscreen_user_rules_editor';
const FILTERING_LOG = 'filtering-log';
const NAVIGATION_TAGS = {
  REGULAR: 'regular',
  PARTY: 'party'
};
/**
 * Trusted tag for custom filters
 */

const TRUSTED_TAG = 'trusted';
/**
 * Custom filters group display number
 *
 * @type {number}
 */

const CUSTOM_FILTERS_GROUP_DISPLAY_NUMBER = 99;
/**
 * Custom filters identifiers starts from this number
 *
 * @type {number}
 */

const CUSTOM_FILTERS_START_ID = 1000; // Unnecessary characters that will be replaced

const WASTE_CHARACTERS = /[.*+?^${}()|[\]\\]/g; // Custom scrollbar width

const SCROLLBAR_WIDTH = 12;
;// CONCATENATED MODULE: ./node_modules/nanoid/index.browser.js

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)
let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte > 62) {
      id += '-'
    } else {
      id += '_'
    }
    return id
  }, '')


;// CONCATENATED MODULE: ./Extension/src/content-script/trusted-types-policy.js


const createPolicy = () => {
  const defaultPolicy = {
    createHTML: input => {
      return input;
    },
    createScript: input => {
      return input;
    },
    createScriptURL: input => {
      return input;
    }
  };

  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    return window.trustedTypes.createPolicy(`AGPolicy-${nanoid()}`, defaultPolicy);
  }

  return defaultPolicy;
};

const AGPolicy = createPolicy();
;// CONCATENATED MODULE: ./Extension/src/content-script/wrappers.js



/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adguard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */



/**
 * !!! Important do not change function declaration, otherwise it would loose its name,
 * which is needed in the script
 *
 * Function for injecting some helper API into page context, that is used by request wrappers.
 *
 * @param scriptName Unique script name
 * @param shouldOverrideWebRTC If true we should override WebRTC objects
 * @param isInjected True means that we've already injected scripts in the contentWindow,
 * i.e. wrapped request objects and passed message channel
 */

function injectPageScriptAPI(scriptName, shouldOverrideWebRTC, isInjected) {
  /**
   * If script have been injected into a frame via contentWindow then we can simply take
   * the copy of messageChannel left for us by parent document
   * Otherwise creates new message channel that sends a message to the content-script
   * to check if request should be allowed or not.
   */
  const messageChannel = isInjected ? window[scriptName] : function () {
    // Save original postMessage and addEventListener functions to prevent webpage from tampering both.
    const {
      postMessage,
      addEventListener
    } = window; // Current request ID (incremented every time we send a new message)

    let currentRequestId = 0;
    const requestsMap = {};
    /**
     * Handles messages sent from the content script back to the page script.
     *
     * @param event Event with necessary data
     */

    const onMessageReceived = function (event) {
      if (!event.data || !event.data.direction || event.data.direction !== 'to-page-script@adguard') {
        return;
      }

      const requestData = requestsMap[event.data.requestId];

      if (requestData) {
        const {
          wrapper
        } = requestData;
        requestData.onResponseReceived(wrapper, event.data.block);
        delete requestsMap[event.data.requestId];
      }
    };
    /**
     * @param url                The URL to which wrapped object is willing to connect
     * @param requestType        Request type ( WEBSOCKET or WEBRTC)
     * @param wrapper            WebSocket wrapper instance
     * @param onResponseReceived Called when response is received
     */


    const sendMessage = function (url, requestType, wrapper, onResponseReceived) {
      if (currentRequestId === 0) {
        // Subscribe to response when this method is called for the first time
        addEventListener.call(window, 'message', onMessageReceived, false);
      }

      currentRequestId += 1;
      const requestId = currentRequestId;
      requestsMap[requestId] = {
        wrapper,
        onResponseReceived
      };
      const message = {
        requestId,
        direction: 'from-page-script@adguard',
        elementUrl: url,
        documentUrl: document.URL,
        requestType
      }; // Send a message to the background page to check if the request should be blocked

      postMessage.call(window, message, '*');
    };

    return {
      sendMessage
    };
  }();
  /**
   * In some case Chrome won't run content scripts inside frames.
   * So we have to intercept access to contentWindow/contentDocument and manually
   * inject wrapper script into this context
   *
   * Based on: https://github.com/adblockplus/adblockpluschrome/commit/1aabfb3346dc0821c52dd9e97f7d61b8c99cd707
   */

  const injectedToString = Function.prototype.toString.bind(injectPageScriptAPI);
  let injectedFramesAdd;
  let injectedFramesHas;

  if (window.WeakSet instanceof Function) {
    const injectedFrames = new WeakSet();
    injectedFramesAdd = WeakSet.prototype.add.bind(injectedFrames);
    injectedFramesHas = WeakSet.prototype.has.bind(injectedFrames);
  } else {
    const frames = [];

    injectedFramesAdd = function (el) {
      if (frames.indexOf(el) < 0) {
        frames.push(el);
      }
    };

    injectedFramesHas = function (el) {
      return frames.indexOf(el) >= 0;
    };
  }
  /**
   * Injects wrapper's script into passed window
   * @param contentWindow Frame's content window
   */


  function injectPageScriptAPIInWindow(contentWindow) {
    try {
      if (contentWindow && !injectedFramesHas(contentWindow)) {
        injectedFramesAdd(contentWindow);
        contentWindow[scriptName] = messageChannel; // Left message channel for the injected script

        const args = `'${scriptName}', ${shouldOverrideWebRTC}, true`;
        contentWindow.eval(AGPolicy.createScript(`(${injectedToString()})(${args});`));
        delete contentWindow[scriptName];
      }
    } catch (e) {// ignore
    }
  }
  /**
   * Overrides access to contentWindow/contentDocument for the passed HTML element's interface (iframe, frame, object)
   * If the content of one of these objects is requested we will inject our wrapper script.
   * @param iface HTML element's interface
   */


  function overrideContentAccess(iface) {
    const contentWindowDescriptor = Object.getOwnPropertyDescriptor(iface.prototype, 'contentWindow');
    const contentDocumentDescriptor = Object.getOwnPropertyDescriptor(iface.prototype, 'contentDocument'); // Apparently in HTMLObjectElement.prototype.contentWindow does not exist
    // in older versions of Chrome such as 42.

    if (!contentWindowDescriptor) {
      return;
    }

    const getContentWindow = Function.prototype.call.bind(contentWindowDescriptor.get);
    const getContentDocument = Function.prototype.call.bind(contentDocumentDescriptor.get);

    contentWindowDescriptor.get = function () {
      const contentWindow = getContentWindow(this);
      injectPageScriptAPIInWindow(contentWindow);
      return contentWindow;
    };

    contentDocumentDescriptor.get = function () {
      injectPageScriptAPIInWindow(getContentWindow(this));
      return getContentDocument(this);
    };

    Object.defineProperty(iface.prototype, 'contentWindow', contentWindowDescriptor);
    Object.defineProperty(iface.prototype, 'contentDocument', contentDocumentDescriptor);
  }

  const interfaces = [HTMLFrameElement, HTMLIFrameElement, HTMLObjectElement];

  for (let i = 0; i < interfaces.length; i += 1) {
    overrideContentAccess(interfaces[i]);
  }
  /**
   * Defines properties in destination object
   * @param src Source object
   * @param dest Destination object
   * @param properties Properties to copy
   */


  const copyProperties = function (src, dest, properties) {
    for (let i = 0; i < properties.length; i += 1) {
      const prop = properties[i];
      const descriptor = Object.getOwnPropertyDescriptor(src, prop); // Passed property may be undefined

      if (descriptor) {
        Object.defineProperty(dest, prop, descriptor);
      }
    }
  };
  /**
   * Check request by sending message to content script
   * @param url URL to block
   * @param type Request type
   * @param callback Result callback
   */


  const checkRequest = function (url, type, callback) {
    messageChannel.sendMessage(url, type, this, (wrapper, blockConnection) => {
      callback(blockConnection);
    });
  };
  /**
   * The function overrides window.RTCPeerConnection with our wrapper,
   * that will check ice servers URLs with filters through messaging with content-script.
   *
   * IMPORTANT NOTE:
   * This function is first loaded as a content script. The only purpose of it is to call
   * the "toString" method and use resulting string as a text content for injected script.
   */


  const overrideWebRTC = function () {
    if (!(window.RTCPeerConnection instanceof Function) && !(window.webkitRTCPeerConnection instanceof Function)) {
      return;
    }
    /**
     * RTCPeerConnection wrapper implementation.
     * https://github.com/AdguardTeam/AdguardBrowserExtension/issues/588
     *
     * Based on:
     * https://github.com/adblockplus/adblockpluschrome/commit/af0585137be19011eace1cf68bf61eed2e6db974
     *
     * Chromium webRequest API doesn't allow the blocking of WebRTC connections
     * https://bugs.chromium.org/p/chromium/issues/detail?id=707683
     */


    const RealRTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;
    const closeRTCPeerConnection = Function.prototype.call.bind(RealRTCPeerConnection.prototype.close);
    const RealArray = Array;
    const RealString = String;
    const createObject = Object.create;
    const {
      defineProperty
    } = Object;
    /**
     * Convert passed url to string
     * @param url URL
     * @returns {string}
     */

    function urlToString(url) {
      if (typeof url !== 'undefined') {
        return RealString(url);
      }
    }
    /**
     * Creates new immutable array from original with some transform function
     * @param original
     * @param transform
     * @returns {*}
     */


    function safeCopyArray(original, transform) {
      if (original === null || typeof original !== 'object') {
        return original;
      }

      const immutable = RealArray(original.length);

      for (let i = 0; i < immutable.length; i += 1) {
        defineProperty(immutable, i, {
          configurable: false,
          enumerable: false,
          writable: false,
          value: transform(original[i])
        });
      }

      defineProperty(immutable, 'length', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: immutable.length
      });
      return immutable;
    }
    /**
     * Protect configuration from mutations
     * @param configuration RTCPeerConnection configuration object
     * @returns {*}
     */


    function protectConfiguration(configuration) {
      if (configuration === null || typeof configuration !== 'object') {
        return configuration;
      }

      const iceServers = safeCopyArray(configuration.iceServers, iceServer => {
        let {
          urls
        } = iceServer;
        const {
          url
        } = iceServer; // RTCPeerConnection doesn't iterate through pseudo Arrays of urls.

        if (typeof urls !== 'undefined' && !(urls instanceof RealArray)) {
          urls = [urls];
        }

        return createObject(iceServer, {
          url: {
            configurable: false,
            enumerable: false,
            writable: false,
            value: urlToString(url)
          },
          urls: {
            configurable: false,
            enumerable: false,
            writable: false,
            value: safeCopyArray(urls, urlToString)
          }
        });
      });
      return createObject(configuration, {
        iceServers: {
          configurable: false,
          enumerable: false,
          writable: false,
          value: iceServers
        }
      });
    }
    /**
     * Check WebRTC connection's URL and close if it's blocked by rule
     * @param connection Connection
     * @param url URL to check
     */


    function checkWebRTCRequest(connection, url) {
      checkRequest(url, 'WEBRTC', blocked => {
        if (blocked) {
          try {
            closeRTCPeerConnection(connection);
          } catch (e) {// Ignore exceptions
          }
        }
      });
    }
    /**
     * Check each URL of ice server in configuration for blocking.
     *
     * @param connection RTCPeerConnection
     * @param configuration Configuration for RTCPeerConnection
     * https://developer.mozilla.org/en-US/docs/Web/API/RTCConfiguration
     */


    function checkConfiguration(connection, configuration) {
      if (!configuration || !configuration.iceServers) {
        return;
      }

      const {
        iceServers
      } = configuration;

      for (let i = 0; i < iceServers.length; i += 1) {
        const iceServer = iceServers[i];

        if (!iceServer) {
          continue;
        }

        if (iceServer.url) {
          checkWebRTCRequest(connection, iceServer.url);
        }

        if (iceServer.urls) {
          for (let j = 0; j < iceServer.urls.length; j += 1) {
            checkWebRTCRequest(connection, iceServer.urls[j]);
          }
        }
      }
    }
    /**
     * Overrides setConfiguration method
     * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setConfiguration
     */


    if (RealRTCPeerConnection.prototype.setConfiguration) {
      const realSetConfiguration = Function.prototype.call.bind(RealRTCPeerConnection.prototype.setConfiguration);

      RealRTCPeerConnection.prototype.setConfiguration = function (configuration) {
        configuration = protectConfiguration(configuration); // Call the real method first, so that validates the configuration

        realSetConfiguration(this, configuration);
        checkConfiguration(this, configuration);
      };
    }

    function WrappedRTCPeerConnection(configuration, arg) {
      if (!(this instanceof WrappedRTCPeerConnection)) {
        return RealRTCPeerConnection();
      }

      configuration = protectConfiguration(configuration);
      /**
       * The old webkitRTCPeerConnection constructor takes an optional second argument and we must pass it.
       */

      const connection = new RealRTCPeerConnection(configuration, arg);
      checkConfiguration(connection, configuration);
      return connection;
    }

    WrappedRTCPeerConnection.prototype = RealRTCPeerConnection.prototype;
    const boundWrappedRTCPeerConnection = WrappedRTCPeerConnection.bind();
    copyProperties(RealRTCPeerConnection, boundWrappedRTCPeerConnection, ['caller', 'generateCertificate', 'name', 'prototype']);
    RealRTCPeerConnection.prototype.constructor = boundWrappedRTCPeerConnection;

    if ('RTCPeerConnection' in window) {
      window.RTCPeerConnection = boundWrappedRTCPeerConnection;
    }

    if ('webkitRTCPeerConnection' in window) {
      window.webkitRTCPeerConnection = boundWrappedRTCPeerConnection;
    }
  };

  if (shouldOverrideWebRTC) {
    overrideWebRTC();
  }
}
/**
 * This function is executed in the content script.
 * It starts listening to events from the page script and passes them further to the background page.
 */

const initPageMessageListener = function () {
  /**
   * Listener for websocket wrapper messages.
   *
   * @param event
   */
  async function pageMessageListener(event) {
    if (!(event.source === window && event.data.direction && event.data.direction === 'from-page-script@adguard' && event.data.elementUrl && event.data.documentUrl)) {
      return;
    }

    const message = {
      type: MESSAGE_TYPES.CHECK_PAGE_SCRIPT_WRAPPER_REQUEST,
      elementUrl: event.data.elementUrl,
      documentUrl: event.data.documentUrl,
      requestType: event.data.requestType,
      requestId: event.data.requestId
    };
    const response = await contentPage.sendMessage(message);

    if (!response) {
      return;
    }

    const responseMessage = {
      direction: 'to-page-script@adguard',
      elementUrl: event.data.elementUrl,
      documentUrl: event.data.documentUrl,
      requestType: event.data.requestType,
      requestId: response.requestId,
      block: response.block
    };
    event.source.postMessage(responseMessage, event.origin);
  }

  window.addEventListener('message', pageMessageListener, false);
};
;// CONCATENATED MODULE: ./Extension/src/content-script/element-collapser.js
/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adguard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Object that collapses or hides DOM elements and able to roll it back.
 */
const ElementCollapser = function () {
  /**
   * https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1436
   * Because Edge doesn't support CSS.escape use next function
   */
  const cssEscape = CSS.escape || function (value) {
    if (arguments.length === 0) {
      throw new TypeError('`CSS.escape` requires an argument.');
    }

    const string = String(value);
    const {
      length
    } = string;
    let index = -1;
    let codeUnit;
    let result = '';
    const firstCodeUnit = string.charCodeAt(0); // eslint-disable-next-line no-plusplus

    while (++index < length) {
      codeUnit = string.charCodeAt(index); // Note: there’s no need to special-case astral symbols, surrogate
      // pairs, or lone surrogates.
      // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
      // (U+FFFD).

      if (codeUnit === 0x0000) {
        result += '\uFFFD';
        continue;
      }

      if ( // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
      // U+007F, […]
      codeUnit >= 0x0001 && codeUnit <= 0x001F || codeUnit === 0x007F // If the character is the first character and is in the range [0-9]
      // (U+0030 to U+0039), […]
      || index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039 // If the character is the second character and is in the range [0-9]
      // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
      || index === 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit === 0x002D) {
        // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
        result += `\\${codeUnit.toString(16)} `;
        continue;
      }

      if ( // If the character is the first character and is a `-` (U+002D), and
      // there is no second character, […]
      index === 0 && length === 1 && codeUnit === 0x002D) {
        result += `\\${string.charAt(index)}`;
        continue;
      } // If the character is not handled by one of the above rules and is
      // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
      // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
      // U+005A), or [a-z] (U+0061 to U+007A), […]


      if (codeUnit >= 0x0080 || codeUnit === 0x002D || codeUnit === 0x005F || codeUnit >= 0x0030 && codeUnit <= 0x0039 || codeUnit >= 0x0041 && codeUnit <= 0x005A || codeUnit >= 0x0061 && codeUnit <= 0x007A) {
        // the character itself
        result += string.charAt(index);
        continue;
      } // Otherwise, the escaped character.
      // https://drafts.csswg.org/cssom/#escape-a-character


      result += `\\${string.charAt(index)}`;
    }

    return result;
  };
  /**
   * The <style> node that contains all the collapsing styles
   */


  let styleNode;
  /**
   * Adds "selectorText { display:none!important; }" style
   * @param selectorText
   * @param cssText optional
   */

  const hideBySelector = function (selectorText, cssText) {
    const rule = `${selectorText}{${cssText || 'display: none!important;'}}`;

    if (!styleNode) {
      styleNode = document.createElement('style');
      styleNode.setAttribute('type', 'text/css');
      (document.head || document.documentElement).appendChild(styleNode);
    }

    styleNode.sheet.insertRule(rule, styleNode.sheet.cssRules.length);
  };
  /**
   * Adds "selectorText { display:none!important; }" style
   */


  const hideBySelectorAndTagName = function (selectorText, tagName) {
    if (tagName === 'frame' || tagName === 'iframe') {
      // Use specific style for frames due to these issues:
      // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/346
      // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/355
      // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/347
      // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/733
      hideBySelector(selectorText, 'visibility: hidden!important; height: 0px!important; min-height: 0px!important;');
    } else {
      hideBySelector(selectorText, null);
    }
  };
  /**
   * Creates selector for specified tagName and src attribute
   */


  const createSelectorForSrcAttr = function (srcAttrValue, tagName) {
    return `${tagName}[src="${cssEscape(srcAttrValue)}"]`;
  };
  /**
   * Clears priority for specified styles
   *
   * @param {HTMLElement} element element affected
   * @param {Array.<string>} styles array of style names
   */


  const clearElStylesPriority = function (element, styles) {
    const elementStyle = element.style;
    styles.forEach(prop => {
      const elCssPriority = elementStyle.getPropertyPriority(prop);

      if (elCssPriority && elCssPriority.toLowerCase() === 'important') {
        const elCssValue = elementStyle.getPropertyValue(prop);
        elementStyle.setProperty(prop, elCssValue, null);
      }
    });
  };
  /**
   * Checks if specified element is already collapsed or not.
   * There is a big chance that we've already done it from the background page
   * (see collapseElement method in webrequest.js)
   *
   * @param {HTMLElement} element Element to check
   */


  const isCollapsed = function (element) {
    const computedStyle = window.getComputedStyle(element);
    return computedStyle && computedStyle.display === 'none';
  };
  /**
   * Collapses the specified element using a CSS style if possible (or inline style if not)
   *
   * @param {HTMLElement} element Element to collapse
   * @param {string} elementUrl Element's source url
   */


  const collapseElement = function (element, elementUrl) {
    if (isCollapsed(element)) {
      return;
    }

    const tagName = element.tagName.toLowerCase();

    if (elementUrl) {
      // Check that element still has the same "src" attribute
      // If it has changed, we do not need to collapse it anymore
      if (element.src === elementUrl) {
        // To not to keep track of changing src for elements, we are going to collapse it with a CSS rule
        // But we take element url, cause current source could be already modified
        // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/408
        const srcAttribute = element.getAttribute('src');
        const srcSelector = createSelectorForSrcAttr(srcAttribute, tagName);
        hideBySelectorAndTagName(srcSelector, tagName); // Remove important priority from the element style
        // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/733

        clearElStylesPriority(element, ['display', 'visibility', 'height', 'min-height']);
      } // Do not process it further in any case


      return;
    }

    let cssProperty = 'display';
    let cssValue = 'none';
    const cssPriority = 'important';

    if (tagName === 'frame') {
      cssProperty = 'visibility';
      cssValue = 'hidden';
    }

    const elementStyle = element.style;
    const elCssValue = elementStyle.getPropertyValue(cssProperty);
    const elCssPriority = elementStyle.getPropertyPriority(cssProperty); // <input type="image"> elements try to load their image again
    // when the "display" CSS property is set. So we have to check
    // that it isn't already collapsed to avoid an infinite recursion.

    if (elCssValue !== cssValue || elCssPriority !== cssPriority) {
      elementStyle.setProperty(cssProperty, cssValue, cssPriority);
    }
  };
  /**
   * Removes the collapser's style node
   */


  const clear = function () {
    if (!styleNode) {
      return;
    }

    styleNode.parentNode.removeChild(styleNode);
  }; // EXPOSE


  return {
    collapseElement,
    isCollapsed,
    clear
  };
}();
;// CONCATENATED MODULE: ./Extension/src/content-script/preload.js
/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adguard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */





const preload = function () {
  const requestTypeMap = {
    'img': 'IMAGE',
    'input': 'IMAGE',
    'audio': 'MEDIA',
    'video': 'MEDIA',
    'object': 'OBJECT',
    'frame': 'SUBDOCUMENT',
    'iframe': 'SUBDOCUMENT',
    'embed': 'OBJECT'
  };
  const collapseRequests = Object.create(null);
  let collapseRequestId = 1;
  let cssHitsCounter;
  /**
   * Checks if it is html document
   *
   * @returns {boolean}
   */

  const isHtml = function () {
    return document instanceof HTMLDocument // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/233
    || document instanceof XMLDocument && document.createElement('div') instanceof HTMLDivElement;
  };
  /**
   * Execute scripts in a page context and cleanup itself when execution completes
   * @param {string} script Script to execute
   */


  const executeScript = function (script) {
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'text/javascript'); // grep "localScriptRulesService" for details about script source

    scriptTag.textContent = script;
    const parent = document.head || document.documentElement;
    parent.appendChild(scriptTag);

    if (scriptTag.parentNode) {
      scriptTag.parentNode.removeChild(scriptTag);
    }
  };
  /**
   * Applies JS injections.
   * @param scripts Array with JS scripts and scriptSource ('remote' or 'local')
   */


  const applyScripts = function (scripts) {
    if (!scripts || scripts.length === 0) {
      return;
    }
    /**
     * JS injections are created by JS filtering rules:
     * http://adguard.com/en/filterrules.html#javascriptInjection
     */


    executeScript(scripts);
  };
  /**
   * When Background page receives 'onCommitted' frame event then it sends scripts to corresponding frame
   * It allows us to execute script as soon as possible, because runtime.messaging makes huge overhead
   * If onCommitted event doesn't occur for the frame, scripts will be applied in usual way.
   */


  contentPage.onMessage.addListener((response, sender, sendResponse) => {
    if (response.type === 'injectScripts') {
      // Notify background-page that content-script was received scripts
      sendResponse({
        applied: true
      });

      if (!isHtml()) {
        return;
      }

      applyScripts(response.scripts);
    }
  });
  /**
   * Uses in `initRequestWrappers` method.
   * We insert wrapper's code into http/https documents and dynamically created frames.
   * The last one is due to the circumvention with using iframe's contentWindow.
   */

  const isHttpOrAboutPage = function () {
    const {
      protocol
    } = window.location;
    return protocol.indexOf('http') === 0 || protocol.indexOf('about:') === 0;
  };
  /**
   * Execute several scripts
   * @param {Array<string>} scripts Scripts to execute
   */


  const executeScripts = function (scripts) {
    if (!scripts || scripts.length === 0) {
      return;
    } // Wraps with try catch and appends cleanup


    scripts.unshift('( function () { try {');
    scripts.push("} catch (ex) { console.error('Error executing AG js: ' + ex); } })();");
    executeScript(scripts.join('\r\n'));
  };
  /**
   * Overrides window.RTCPeerConnection running the function from wrappers.js
   * https://github.com/AdguardTeam/AdguardBrowserExtension/issues/588
   */


  const initRequestWrappers = function () {
    // Only for dynamically created frames and http/https documents.
    if (!isHttpOrAboutPage()) {
      return;
    }
    /**
     * The code below is supposed to be used in WebExt extensions.
     * This code overrides RTCPeerConnection constructor, so that we could inspect & block them.
     */


    initPageMessageListener();
    const wrapperScriptName = `wrapper-script-${Math.random().toString().substr(2)}`;
    const script = `(${injectPageScriptAPI.toString()})('${wrapperScriptName}', true);`;
    executeScripts([script]);
  };
  /**
   * Extracts element URL from the dom node
   * @param element DOM node
   */


  const getElementUrl = function (element) {
    let elementUrl = element.src || element.data;

    if (!elementUrl || elementUrl.indexOf('http') !== 0 // Some sources could not be set yet, lazy loaded images or smth.
    // In some cases like on gog.com, collapsing these elements could break
    // the page script loading their sources
    || elementUrl === element.baseURI) {
      return null;
    } // truncate too long urls
    // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1493


    const MAX_URL_LENGTH = 16 * 1024;

    if (elementUrl.length > MAX_URL_LENGTH) {
      elementUrl = elementUrl.slice(0, MAX_URL_LENGTH);
    }

    return elementUrl;
  };
  /**
   * Saves collapse request (to be reused after we get result from bg page)
   * @param element Element to check
   * @return request ID
   */


  const saveCollapseRequest = function (element) {
    const tagName = element.tagName.toLowerCase();
    const requestId = collapseRequestId;
    collapseRequestId += 1;
    collapseRequests[requestId] = {
      element,
      src: element.src,
      tagName
    };
    return requestId;
  };
  /**
   * Response callback for "processShouldCollapse" message.
   * @param response Response got from the background page
   */


  const onProcessShouldCollapseResponse = function (response) {
    if (!response) {
      return;
    } // Get original collapse request


    const collapseRequest = collapseRequests[response.requestId];

    if (!collapseRequest) {
      return;
    }

    delete collapseRequests[response.requestId];
    const {
      element
    } = collapseRequest;

    if (response.collapse === true) {
      const elementUrl = collapseRequest.src;
      ElementCollapser.collapseElement(element, elementUrl);
    }
  };
  /**
   * Checks if element is blocked by AG and should be hidden
   * @param element Element to check
   */


  const checkShouldCollapseElement = async function (element) {
    const requestType = requestTypeMap[element.localName];

    if (!requestType) {
      return;
    }

    const elementUrl = getElementUrl(element);

    if (!elementUrl) {
      return;
    }

    if (ElementCollapser.isCollapsed(element)) {
      return;
    } // Save request to a map (it will be used in response callback)


    const requestId = saveCollapseRequest(element); // Send a message to the background page to check if the element really should be collapsed

    const message = {
      type: MESSAGE_TYPES.PROCESS_SHOULD_COLLAPSE,
      elementUrl,
      documentUrl: document.URL,
      requestType,
      requestId
    };
    const response = await contentPage.sendMessage(message);
    onProcessShouldCollapseResponse(response);
  };
  /**
   * Checks if loaded element is blocked by AG and should be hidden
   * @param event Load or error event
   */


  const checkShouldCollapse = function (event) {
    const element = event.target;
    const eventType = event.type;
    const tagName = element.tagName.toLowerCase();
    const expectedEventType = tagName === 'iframe' || tagName === 'frame' || tagName === 'embed' ? 'load' : 'error';

    if (eventType !== expectedEventType) {
      return;
    }

    checkShouldCollapseElement(element);
  };
  /**
   * Init listeners for error and load events.
   * We will then check loaded elements if they are blocked by our extension.
   * In this case we'll hide these blocked elements.
   */


  const initCollapseEventListeners = function () {
    document.addEventListener('error', checkShouldCollapse, true); // We need to listen for load events to hide blocked iframes (they don't raise error event)

    document.addEventListener('load', checkShouldCollapse, true);
  };
  /**
   * Sets "style" DOM element content.
   * @param styleEl       "style" DOM element
   * @param cssContent    CSS content to set
   */


  const setStyleContent = function (styleEl, cssContent) {
    styleEl.textContent = cssContent;
  };
  /**
   * Protects specified style element from changes to the current document
   * Add a mutation observer, which is adds our rules again if it was removed
   *
   * @param protectStyleEl protected style element
   */


  const protectStyleElementContent = function (protectStyleEl) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    if (!MutationObserver) {
      return;
    }
    /* observer, which observe protectStyleEl inner changes, without deleting styleEl */


    const innerObserver = new MutationObserver(mutations => {
      for (let i = 0; i < mutations.length; i += 1) {
        const m = mutations[i];

        if (protectStyleEl.hasAttribute('mod') && protectStyleEl.getAttribute('mod') === 'inner') {
          protectStyleEl.removeAttribute('mod');
          break;
        }

        protectStyleEl.setAttribute('mod', 'inner');
        let isProtectStyleElModified = false;
        /**
         * further, there are two mutually exclusive situations: either there were changes
         * the text of protectStyleEl, either there was removes a whole child "text"
         * element of protectStyleEl we'll process both of them
         */

        if (m.removedNodes.length > 0) {
          for (let j = 0; j < m.removedNodes.length; j += 1) {
            isProtectStyleElModified = true;
            protectStyleEl.appendChild(m.removedNodes[j]);
          }
        } else if (m.oldValue) {
          isProtectStyleElModified = true;
          protectStyleEl.textContent = m.oldValue;
        }

        if (!isProtectStyleElModified) {
          protectStyleEl.removeAttribute('mod');
        }
      }
    });
    innerObserver.observe(protectStyleEl, {
      'childList': true,
      'characterData': true,
      'subtree': true,
      'characterDataOldValue': true
    });
  };
  /**
   * Applies CSS stylesheets
   *
   * @param css Array with CSS stylesheets
   */


  const applyCss = function (css) {
    if (!css || css.length === 0) {
      return;
    }

    const stylesheet = css.join('\n');
    const styleEl = document.createElement('style');
    styleEl.setAttribute('type', 'text/css');
    setStyleContent(styleEl, stylesheet);
    (document.head || document.documentElement).appendChild(styleEl);
    protectStyleElementContent(styleEl);
  };
  /**
   * Applies Extended Css stylesheet
   *
   * @param extendedCss Array with ExtendedCss stylesheets
   */


  const applyExtendedCss = function (extendedCss) {
    if (!extendedCss || !extendedCss.length) {
      return;
    }

    const styleSheet = extendedCss.join('\n');

    if (!styleSheet) {
      return;
    }

    const extcss = new index.ExtendedCss({
      styleSheet,
      beforeStyleApplied: cssHitsCounter ? cssHitsCounter.countAffectedByExtendedCss.bind(cssHitsCounter) : el => el
    });
    extcss.apply();
  };
  /**
   * Applies CSS and extended CSS stylesheets
   * @param selectors     Object with the stylesheets got from the background page.
   */


  const applySelectors = function (selectors) {
    if (!selectors) {
      return;
    }

    applyCss(selectors.css);
    applyExtendedCss(selectors.extendedCss);
  };
  /**
   * Response callback for "processShouldCollapseMany" message.
   * @param response Response from bg page.
   */


  const onProcessShouldCollapseManyResponse = function (response) {
    if (!response) {
      return;
    }

    const {
      requests
    } = response;

    for (let i = 0; i < requests.length; i += 1) {
      const collapseRequest = requests[i];
      onProcessShouldCollapseResponse(collapseRequest);
    }
  };
  /**
   * Collects all elements from the page and checks if we should hide them.
   */


  const checkBatchShouldCollapse = async () => {
    const requests = []; // Collect collapse requests
    // eslint-disable-next-line guard-for-in,no-restricted-syntax

    for (const tagName in requestTypeMap) {
      const requestType = requestTypeMap[tagName];
      const elements = document.getElementsByTagName(tagName);

      for (let j = 0; j < elements.length; j += 1) {
        const element = elements[j];
        const elementUrl = getElementUrl(element);

        if (!elementUrl) {
          continue;
        }

        const requestId = saveCollapseRequest(element);
        requests.push({
          elementUrl,
          requestType,
          requestId,
          tagName
        });
      }
    }

    const message = {
      type: MESSAGE_TYPES.PROCESS_SHOULD_COLLAPSE_MANY,
      requests,
      documentUrl: document.URL
    }; // Send all prepared requests in one message

    onProcessShouldCollapseManyResponse(await contentPage.sendMessage(message));
  };
  /**
   * This method is used when we need to check all page elements with collapse rules.
   * We need this when the browser is just started and add-on is not yet initialized.
   * In this case content scripts waits for add-on initialization and the
   * checks all page elements.
   */


  const initBatchCollapse = function () {
    if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
      checkBatchShouldCollapse();
    } else {
      document.addEventListener('DOMContentLoaded', checkBatchShouldCollapse);
    }
  };
  /**
   * Processes response from the background page containing CSS and JS injections
   * @param response Response from the background page
   */


  const processCssAndScriptsResponse = response => {
    if (!response || response.requestFilterReady === false) {
      /**
       * This flag (requestFilterReady) means that we should wait for a while, because the
       * request filter is not ready yet. This is possible only on browser startup.
       * In this case we'll delay injections until extension is fully initialized.
       */
      // eslint-disable-next-line no-use-before-define
      setTimeout(tryLoadCssAndScripts, 100);
      return;
    }

    if (response.collectRulesHits) {
      cssHitsCounter = new index.CssHitsCounter(stats => {
        contentPage.sendMessage({
          type: MESSAGE_TYPES.SAVE_CSS_HITS_STATS,
          stats
        });
      });
    }

    if (response.collapseAllElements) {
      /**
       * This flag (collapseAllElements) means that we should check all page elements
       * and collapse them if needed. Why? On browser startup we can't block some
       * ad/tracking requests because extension is not yet initialized when
       * these requests are executed. At least we could hide these elements.
       */
      applySelectors(response.selectors);
      applyScripts(response.scripts);
      initBatchCollapse();
    } else {
      applySelectors(response.selectors);
      applyScripts(response.scripts);
    }
  };
  /**
   * Loads CSS and JS injections
   */


  const tryLoadCssAndScripts = async () => {
    const message = {
      type: MESSAGE_TYPES.GET_SELECTORS_AND_SCRIPTS,
      documentUrl: window.location.href
    };
    /**
     * Sending message to background page and passing a callback function
     */

    processCssAndScriptsResponse(await contentPage.sendMessage(message));
  };
  /**
   * Initializes cookie content script
   *
   * @return {Promise<void>}
   */


  const initCookieController = async () => {
    const response = await contentPage.sendMessage({
      type: MESSAGE_TYPES.GET_COOKIE_RULES,
      documentUrl: window.location.href
    });

    if (!response) {
      return;
    }

    if (response.rulesData) {
      try {
        const cookieController = new index.CookieController(({
          cookieName,
          cookieValue,
          cookieDomain,
          cookieRuleText,
          thirdParty,
          filterId
        }) => {
          contentPage.sendMessage({
            type: MESSAGE_TYPES.SAVE_COOKIE_LOG_EVENT,
            data: {
              cookieName,
              cookieValue,
              cookieDomain,
              ruleText: cookieRuleText,
              thirdParty,
              filterId
            }
          });
        });
        cookieController.apply(response.rulesData);
      } catch (e) {// Ignore exceptions
      }
    }
  };
  /**
   * Initializing content script
   */


  const init = function () {
    if (!isHtml()) {
      return;
    }

    initRequestWrappers();
    initCollapseEventListeners();
    tryLoadCssAndScripts();
    initCookieController();
  };

  return {
    init
  };
}();
;// CONCATENATED MODULE: ./Extension/src/content-script/content-utils.js
/* eslint-disable max-len */

/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adguard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */


const contentUtils = function () {
  const MAX_Z_INDEX = '2147483647';
  /**
   * Create style element with provided css
   * @param css
   * @returns {any | HTMLElement}
   */

  const createStyleElement = css => {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(css));
    return styleElement;
  };
  /**
   * Creates iframe and appends it after target open tag
   * @param target Node where to append iframe with html
   * @param html html string to write inside iframe
   * @param alertStyles popup styles text
   * @returns {HTMLElement} iframe element
   */


  const appendIframe = (target, html, alertStyles) => {
    const styleElement = createStyleElement(alertStyles);
    const prependedHtml = `${styleElement.outerHTML}\n${html}`;
    const iframe = document.createElement('iframe');
    iframe.src = 'about:blank';
    iframe.style.position = 'fixed';
    iframe.style.zIndex = MAX_Z_INDEX;
    iframe.srcdoc = prependedHtml;
    target.insertAdjacentElement('afterbegin', iframe);
    return iframe;
  };
  /**
   * Creates div and appends it to the page
   * @param target
   * @param html
   * @returns {any | HTMLElement}
   */


  const appendDiv = (target, html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    target.insertAdjacentElement('afterbegin', div);
    div.style.zIndex = MAX_Z_INDEX;
    return div;
  };
  /**
   * If isAdguardTab we append div, else we append iframe
   * @param target
   * @param html
   * @param isAdguardTab
   * @param alertStyles
   * @param alertContainerStyles
   * @returns {HTMLElement}
   */


  const appendAlertElement = (target, html, isAdguardTab, alertStyles, alertContainerStyles) => {
    const alertContainerElement = createStyleElement(alertContainerStyles);
    document.body.insertAdjacentElement('afterbegin', alertContainerElement);

    if (isAdguardTab) {
      return appendDiv(target, html);
    }

    return appendIframe(target, html, alertStyles);
  };
  /**
   * Generates alert html
   * @param {string} title
   * @param {string} text
   * @returns {string}
   */


  const genAlertHtml = (title, text) => {
    let descBlock = '';

    if (text && text.length > 0) {
      descBlock = `<div class="adguard-popup-alert__desc">
                            ${text}
                        </div>`;
    } // don't show description text if it is same as title or if it is equal to undefined


    if (title === text || text === 'undefined') {
      descBlock = '';
    }

    let titleBlock = '';

    if (title && title.length > 0) {
      titleBlock = `<div class="adguard-popup-alert__title">
                            ${title}
                        </div>`;
    }

    return `<div class="adguard-popup-alert">
                    ${titleBlock}
                    ${descBlock}
                </div>`;
  };
  /**
   * Shows alert popup.
   * Popup content is added right to the page content.
   *
   * @param message Message text
   */


  function showAlertPopup(message) {
    const {
      text,
      title,
      isAdguardTab,
      alertStyles,
      alertContainerStyles
    } = message;

    if (!title && !text) {
      return;
    }

    let messages = [];

    if (Array.isArray(text)) {
      messages = text;
    } else {
      messages = [text];
    }

    let fullText = '';

    for (let i = 0; i < messages.length; i += 1) {
      if (i > 0) {
        fullText += ', ';
      }

      fullText += messages[i];
    }

    const alertDivHtml = genAlertHtml(title, fullText);
    const triesCount = 10;

    function appendPopup(count) {
      if (count >= triesCount) {
        return;
      }

      if (document.body) {
        const alertElement = appendAlertElement(document.body, alertDivHtml, isAdguardTab, alertStyles, alertContainerStyles);
        alertElement.classList.add('adguard-alert-iframe');

        alertElement.onload = () => {
          alertElement.style.visibility = 'visible';
        };

        setTimeout(() => {
          if (alertElement && alertElement.parentNode) {
            alertElement.parentNode.removeChild(alertElement);
          }
        }, 4000);
      } else {
        setTimeout(() => {
          appendPopup(count + 1);
        }, 500);
      }
    }

    appendPopup(0);
  }
  /**
   * Shows version updated popup.
   * Popup content is added right to the page content.
   *
   * @param {{title,description, changelogHref, changelogText, offer, offerDesc, offerButtonHref, offerButtonText}} message
   */


  function showVersionUpdatedPopup(message) {
    const {
      title,
      offer,
      description,
      isAdguardTab,
      changelogHref,
      changelogText,
      offerButtonHref,
      offerButtonText,
      showPromoNotification,
      disableNotificationText,
      alertStyles,
      updateIframeStyles
    } = message;
    const updateIframeHtml = `
                            <div id="adguard-new-version-popup" class="adguard-update-popup adguard-update-popup--active${showPromoNotification ? ' adguard-update-popup--promo' : ''}">
                                <div id="adguard-new-version-popup-close" class="adguard-update-popup__close close-iframe"></div>
                                <div class="adguard-update-popup__logo"></div>
                                <div class="adguard-update-popup__title">
                                    ${title}
                                </div>
                                <div class="adguard-update-popup__desc">
                                    ${description}
                                </div>
                                <div class="adguard-update-popup__links">
                                    <a href="${changelogHref}" class="adguard-update-popup__link close-iframe" target="_blank">
                                        ${changelogText}
                                    </a>
                                    <a href="#" class="adguard-update-popup__link adguard-update-popup__link--disable close-iframe disable-notifications">
                                        ${disableNotificationText}
                                    </a>
                                </div>
                                <div class="adguard-update-popup__offer${showPromoNotification ? ' adguard-update-popup__offer--show' : ''}">
                                    <div class="adguard-update-popup__offer-close close-iframe set-notification-viewed"></div>
                                    <div class="adguard-update-popup__offer-content">
                                        <div class="adguard-update-popup__offer-title">
                                            ${offer}
                                        </div>
                                        <a href="${offerButtonHref}" class="adguard-update-popup__btn close-iframe set-notification-viewed${showPromoNotification ? ' adguard-update-popup__btn--promo' : ''}" target="_blank">
                                            ${offerButtonText}
                                        </a>
                                    </div>
                                </div>
                            </div>`;
    const triesCount = 10;

    const handleCloseIframe = iframe => {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const closeElements = iframeDocument.querySelectorAll('.close-iframe');

      if (closeElements.length > 0) {
        closeElements.forEach(element => {
          element.addEventListener('click', () => {
            if (element.classList.contains('disable-notifications')) {
              // disable update notifications
              contentPage.sendMessage({
                type: MESSAGE_TYPES.CHANGE_USER_SETTING,
                key: 'show-app-updated-disabled',
                value: true
              });
            }

            if (showPromoNotification && element.classList.contains('set-notification-viewed')) {
              contentPage.sendMessage({
                type: 'setNotificationViewed',
                withDelay: false
              });
            } // Remove iframe after click event fire on link
            // NOTICE: if here is used value equal to 0,
            // then iframe is closed early than link is clicked


            const REMOVE_FRAMEWORK_TIMEOUT_MS = 10;
            setTimeout(() => {
              iframe.parentNode.removeChild(iframe);
            }, REMOVE_FRAMEWORK_TIMEOUT_MS);
          });
        });
        return true;
      }

      return false;
    };

    function appendPopup(count) {
      if (count >= triesCount) {
        return;
      }

      if (document.body && !isAdguardTab) {
        const updateIframeCss = createStyleElement(updateIframeStyles);
        document.body.insertAdjacentElement('afterbegin', updateIframeCss);
        const iframe = appendIframe(document.body, updateIframeHtml, alertStyles);
        iframe.classList.add('adguard-update-iframe');
        const isListening = handleCloseIframe(iframe);

        if (!isListening) {
          iframe.addEventListener('load', () => {
            handleCloseIframe(iframe);
          });
        }
      } else {
        setTimeout(() => {
          appendPopup(count + 1);
        }, 500);
      }
    }

    appendPopup(0);
  }
  /**
   * Reload page without cache
   */


  function noCacheReload() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', document.location.href);
    xhr.setRequestHeader('Pragma', 'no-cache');
    xhr.setRequestHeader('Expires', '-1');
    xhr.setRequestHeader('Expires', 'no-cache');

    const reload = () => {
      document.location.reload(true);
    };

    xhr.onload = reload;
    xhr.onerror = reload;
    xhr.onabort = reload;
    xhr.send(null);
  }

  const init = () => {
    if (window !== window.top) {
      return;
    }

    if (!(document instanceof HTMLDocument)) {
      return;
    }
    /**
     * On extension startup contentPage is undefined
     */


    if (typeof contentPage === 'undefined') {
      return;
    }

    contentPage.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'show-alert-popup') {
        showAlertPopup(message);
      } else if (message.type === 'show-version-updated-popup') {
        showVersionUpdatedPopup(message);
        sendResponse(true);
      } else if (message.type === 'no-cache-reload') {
        noCacheReload();
      } else if (message.type === 'update-tab-url') {
        window.location = message.url;
      }
    });
  };

  return {
    init
  };
}();
;// CONCATENATED MODULE: ./Extension/src/content-script/subscribe-to-scriptlets.js
/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adguard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Script used to subscribe to scriptlets dispatched events
 * Loaded on content script start to ensure the fastest load
 */

const subscribeToScriptlets = function () {
  /**
   * Subscribe to close-window scriptlet's event
   * window.close() usage is restricted in Chrome so we use tabs API to do that
   * https://github.com/AdguardTeam/Scriptlets/issues/170
   */
  const subscribeToCloseWindow = async () => {
    const closeWindowHandler = () => {
      contentPage.sendMessage({
        type: 'scriptletCloseWindow'
      });
    }; // Events may be passed differently in MV3


    window.addEventListener('adguard:scriptlet-close-window', closeWindowHandler);
    setTimeout(() => {
      window.removeEventListener('adguard:scriptlet-close-window', closeWindowHandler);
    }, 1000); // Scriptlet is loaded first so we notify it that content script is ready

    dispatchEvent(new Event('adguard:subscribed-to-close-window'));
  };
  /**
   * Initializing content script
   */


  const init = function () {
    subscribeToCloseWindow();
  };

  return {
    init
  };
}();
;// CONCATENATED MODULE: ./Extension/pages/content-script-start/index.js



 // expose content page for subscribe.js

__webpack_require__.g.contentPage = contentPage;
preload.init();
contentUtils.init();
subscribeToScriptlets.init();
})();

/******/ })()
;