"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CinderDissolve: () => CinderDissolve,
  Cryptext: () => Cryptext,
  LensMagnifier: () => LensMagnifier,
  RadialMenu: () => RadialMenu,
  RefractiveFractal: () => RefractiveFractal,
  RingPuzzle: () => RingPuzzle,
  ScratchCard: () => ScratchCard
});
module.exports = __toCommonJS(index_exports);

// src/components/RingPuzzle.tsx
var import_react = require("react");

// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// node_modules/tailwind-merge/dist/bundle-mjs.mjs
var CLASS_PART_SEPARATOR = "-";
var createClassGroupUtils = (config) => {
  const classMap = createClassMap(config);
  const {
    conflictingClassGroups,
    conflictingClassGroupModifiers
  } = config;
  const getClassGroupId = (className) => {
    const classParts = className.split(CLASS_PART_SEPARATOR);
    if (classParts[0] === "" && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  };
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    const conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
    }
    return conflicts;
  };
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
};
var getGroupRecursive = (classParts, classPartObject) => {
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  const currentClassPart = classParts[0];
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return void 0;
  }
  const classRest = classParts.join(CLASS_PART_SEPARATOR);
  return classPartObject.validators.find(({
    validator
  }) => validator(classRest))?.classGroupId;
};
var arbitraryPropertyRegex = /^\[(.+)\]$/;
var getGroupIdForArbitraryProperty = (className) => {
  if (arbitraryPropertyRegex.test(className)) {
    const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(":"));
    if (property) {
      return "arbitrary.." + property;
    }
  }
};
var createClassMap = (config) => {
  const {
    theme,
    prefix
  } = config;
  const classMap = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
  prefixedClassGroupEntries.forEach(([classGroupId, classGroup]) => {
    processClassesRecursively(classGroup, classMap, classGroupId, theme);
  });
  return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  classGroup.forEach((classDefinition) => {
    if (typeof classDefinition === "string") {
      const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === "function") {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(([key, classGroup2]) => {
      processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme);
    });
  });
};
var getPart = (classPartObject, path) => {
  let currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
};
var isThemeGetter = (func) => func.isThemeGetter;
var getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
  if (!prefix) {
    return classGroupEntries;
  }
  return classGroupEntries.map(([classGroupId, classGroup]) => {
    const prefixedClassGroup = classGroup.map((classDefinition) => {
      if (typeof classDefinition === "string") {
        return prefix + classDefinition;
      }
      if (typeof classDefinition === "object") {
        return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]));
      }
      return classDefinition;
    });
    return [classGroupId, prefixedClassGroup];
  });
};
var createLruCache = (maxCacheSize) => {
  if (maxCacheSize < 1) {
    return {
      get: () => void 0,
      set: () => {
      }
    };
  }
  let cacheSize = 0;
  let cache = /* @__PURE__ */ new Map();
  let previousCache = /* @__PURE__ */ new Map();
  const update = (key, value) => {
    cache.set(key, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = /* @__PURE__ */ new Map();
    }
  };
  return {
    get(key) {
      let value = cache.get(key);
      if (value !== void 0) {
        return value;
      }
      if ((value = previousCache.get(key)) !== void 0) {
        update(key, value);
        return value;
      }
    },
    set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value);
      } else {
        update(key, value);
      }
    }
  };
};
var IMPORTANT_MODIFIER = "!";
var createParseClassName = (config) => {
  const {
    separator,
    experimentalParseClassName
  } = config;
  const isSeparatorSingleCharacter = separator.length === 1;
  const firstSeparatorCharacter = separator[0];
  const separatorLength = separator.length;
  const parseClassName = (className) => {
    const modifiers = [];
    let bracketDepth = 0;
    let modifierStart = 0;
    let postfixModifierPosition;
    for (let index = 0; index < className.length; index++) {
      let currentCharacter = className[index];
      if (bracketDepth === 0) {
        if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + separatorLength;
          continue;
        }
        if (currentCharacter === "/") {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === "[") {
        bracketDepth++;
      } else if (currentCharacter === "]") {
        bracketDepth--;
      }
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
    const baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
    const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    };
  };
  if (experimentalParseClassName) {
    return (className) => experimentalParseClassName({
      className,
      parseClassName
    });
  }
  return parseClassName;
};
var sortModifiers = (modifiers) => {
  if (modifiers.length <= 1) {
    return modifiers;
  }
  const sortedModifiers = [];
  let unsortedModifiers = [];
  modifiers.forEach((modifier) => {
    const isArbitraryVariant = modifier[0] === "[";
    if (isArbitraryVariant) {
      sortedModifiers.push(...unsortedModifiers.sort(), modifier);
      unsortedModifiers = [];
    } else {
      unsortedModifiers.push(modifier);
    }
  });
  sortedModifiers.push(...unsortedModifiers.sort());
  return sortedModifiers;
};
var createConfigUtils = (config) => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  ...createClassGroupUtils(config)
});
var SPLIT_CLASSES_REGEX = /\s+/;
var mergeClassList = (classList, configUtils) => {
  const {
    parseClassName,
    getClassGroupId,
    getConflictingClassGroupIds
  } = configUtils;
  const classGroupsInConflict = [];
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
  let result = "";
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index];
    const {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    } = parseClassName(originalClassName);
    let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
    let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      hasPostfixModifier = false;
    }
    const variantModifier = sortModifiers(modifiers).join(":");
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    const classId = modifierId + classGroupId;
    if (classGroupsInConflict.includes(classId)) {
      continue;
    }
    classGroupsInConflict.push(classId);
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i];
      classGroupsInConflict.push(modifierId + group);
    }
    result = originalClassName + (result.length > 0 ? " " + result : result);
  }
  return result;
};
function twJoin() {
  let index = 0;
  let argument;
  let resolvedValue;
  let string = "";
  while (index < arguments.length) {
    if (argument = arguments[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
}
var toValue = (mix) => {
  if (typeof mix === "string") {
    return mix;
  }
  let resolvedValue;
  let string = "";
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
  let configUtils;
  let cacheGet;
  let cacheSet;
  let functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    const cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    const result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}
var fromTheme = (key) => {
  const themeGetter = (theme) => theme[key] || [];
  themeGetter.isThemeGetter = true;
  return themeGetter;
};
var arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
var fractionRegex = /^\d+\/\d+$/;
var stringLengths = /* @__PURE__ */ new Set(["px", "full", "screen"]);
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var isLength = (value) => isNumber(value) || stringLengths.has(value) || fractionRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, "length", isLengthOnly);
var isNumber = (value) => Boolean(value) && !Number.isNaN(Number(value));
var isArbitraryNumber = (value) => getIsArbitraryValue(value, "number", isNumber);
var isInteger = (value) => Boolean(value) && Number.isInteger(Number(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var sizeLabels = /* @__PURE__ */ new Set(["length", "size", "percentage"]);
var isArbitrarySize = (value) => getIsArbitraryValue(value, sizeLabels, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, "position", isNever);
var imageLabels = /* @__PURE__ */ new Set(["image", "url"]);
var isArbitraryImage = (value) => getIsArbitraryValue(value, imageLabels, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, "", isShadow);
var isAny = () => true;
var getIsArbitraryValue = (value, label, testValue) => {
  const result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return typeof label === "string" ? result[1] === label : label.has(result[1]);
    }
    return testValue(result[2]);
  }
  return false;
};
var isLengthOnly = (value) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var getDefaultConfig = () => {
  const colors = fromTheme("colors");
  const spacing = fromTheme("spacing");
  const blur = fromTheme("blur");
  const brightness = fromTheme("brightness");
  const borderColor = fromTheme("borderColor");
  const borderRadius = fromTheme("borderRadius");
  const borderSpacing = fromTheme("borderSpacing");
  const borderWidth = fromTheme("borderWidth");
  const contrast = fromTheme("contrast");
  const grayscale = fromTheme("grayscale");
  const hueRotate = fromTheme("hueRotate");
  const invert = fromTheme("invert");
  const gap = fromTheme("gap");
  const gradientColorStops = fromTheme("gradientColorStops");
  const gradientColorStopPositions = fromTheme("gradientColorStopPositions");
  const inset = fromTheme("inset");
  const margin = fromTheme("margin");
  const opacity = fromTheme("opacity");
  const padding = fromTheme("padding");
  const saturate = fromTheme("saturate");
  const scale = fromTheme("scale");
  const sepia = fromTheme("sepia");
  const skew = fromTheme("skew");
  const space = fromTheme("space");
  const translate = fromTheme("translate");
  const getOverscroll = () => ["auto", "contain", "none"];
  const getOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
  const getSpacingWithAutoAndArbitrary = () => ["auto", isArbitraryValue, spacing];
  const getSpacingWithArbitrary = () => [isArbitraryValue, spacing];
  const getLengthWithEmptyAndArbitrary = () => ["", isLength, isArbitraryLength];
  const getNumberWithAutoAndArbitrary = () => ["auto", isNumber, isArbitraryValue];
  const getPositions = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"];
  const getLineStyles = () => ["solid", "dashed", "dotted", "double", "none"];
  const getBlendModes = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
  const getAlign = () => ["start", "end", "center", "between", "around", "evenly", "stretch"];
  const getZeroAndEmpty = () => ["", "0", isArbitraryValue];
  const getBreaks = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
  const getNumberAndArbitrary = () => [isNumber, isArbitraryValue];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [isAny],
      spacing: [isLength, isArbitraryLength],
      blur: ["none", "", isTshirtSize, isArbitraryValue],
      brightness: getNumberAndArbitrary(),
      borderColor: [colors],
      borderRadius: ["none", "", "full", isTshirtSize, isArbitraryValue],
      borderSpacing: getSpacingWithArbitrary(),
      borderWidth: getLengthWithEmptyAndArbitrary(),
      contrast: getNumberAndArbitrary(),
      grayscale: getZeroAndEmpty(),
      hueRotate: getNumberAndArbitrary(),
      invert: getZeroAndEmpty(),
      gap: getSpacingWithArbitrary(),
      gradientColorStops: [colors],
      gradientColorStopPositions: [isPercent, isArbitraryLength],
      inset: getSpacingWithAutoAndArbitrary(),
      margin: getSpacingWithAutoAndArbitrary(),
      opacity: getNumberAndArbitrary(),
      padding: getSpacingWithArbitrary(),
      saturate: getNumberAndArbitrary(),
      scale: getNumberAndArbitrary(),
      sepia: getZeroAndEmpty(),
      skew: getNumberAndArbitrary(),
      space: getSpacingWithArbitrary(),
      translate: getSpacingWithArbitrary()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", isArbitraryValue]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isTshirtSize]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": getBreaks()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": getBreaks()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...getPositions(), isArbitraryValue]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: getOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": getOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": getOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: getOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": getOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": getOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [inset]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [inset]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [inset]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [inset]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [inset]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [inset]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [inset]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [inset]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [inset]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", isInteger, isArbitraryValue]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: getSpacingWithAutoAndArbitrary()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: getZeroAndEmpty()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: getZeroAndEmpty()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", isInteger, isArbitraryValue]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [isAny]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [isAny]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [gap]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [gap]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [gap]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...getAlign()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...getAlign(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...getAlign(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [padding]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [padding]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [padding]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [padding]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [padding]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [padding]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [padding]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [padding]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [padding]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [margin]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [margin]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [margin]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [margin]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [margin]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [margin]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [margin]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [margin]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [margin]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [space]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [space]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", isArbitraryValue, spacing]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [isArbitraryValue, spacing, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [isArbitraryValue, spacing, "none", "full", "min", "max", "fit", "prose", {
          screen: [isTshirtSize]
        }, isTshirtSize]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [isArbitraryValue, spacing, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [isArbitraryValue, spacing, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", isTshirtSize, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", isArbitraryNumber]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [isAny]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", isNumber, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", isLength, isArbitraryValue]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", isArbitraryValue]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [colors]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [opacity]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [colors]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [opacity]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...getLineStyles(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", isLength, isArbitraryLength]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", isLength, isArbitraryValue]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [colors]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: getSpacingWithArbitrary()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", isArbitraryValue]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [opacity]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...getPositions(), isArbitraryPosition]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", isArbitrarySize]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, isArbitraryImage]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [colors]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [gradientColorStops]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [borderRadius]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [borderRadius]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [borderRadius]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [borderRadius]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [borderRadius]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [borderRadius]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [borderRadius]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [borderRadius]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [borderRadius]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [borderRadius]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [borderRadius]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [borderRadius]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [borderRadius]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [borderRadius]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [borderRadius]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [borderWidth]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [borderWidth]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [borderWidth]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [borderWidth]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [borderWidth]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [borderWidth]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [borderWidth]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [borderWidth]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [borderWidth]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [opacity]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...getLineStyles(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [borderWidth]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [borderWidth]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [opacity]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: getLineStyles()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [borderColor]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [borderColor]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [borderColor]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [borderColor]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [borderColor]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [borderColor]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [borderColor]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [borderColor]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [borderColor]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [borderColor]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...getLineStyles()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [isLength, isArbitraryValue]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [isLength, isArbitraryLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [colors]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: getLengthWithEmptyAndArbitrary()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [colors]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [opacity]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [isLength, isArbitraryLength]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [colors]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", isTshirtSize, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [isAny]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [opacity]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...getBlendModes(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": getBlendModes()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [blur]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [brightness]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [contrast]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", isTshirtSize, isArbitraryValue]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [grayscale]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [hueRotate]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [invert]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [saturate]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [sepia]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [blur]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [brightness]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [contrast]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [grayscale]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [hueRotate]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [invert]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [opacity]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [saturate]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [sepia]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [borderSpacing]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [borderSpacing]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [borderSpacing]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", isArbitraryValue]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: getNumberAndArbitrary()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: getNumberAndArbitrary()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", isArbitraryValue]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [scale]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [scale]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [scale]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [isInteger, isArbitraryValue]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [translate]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [translate]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [skew]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [skew]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", isArbitraryValue]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", colors]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryValue]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [colors]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", isArbitraryValue]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [colors, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [isLength, isArbitraryLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [colors, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
};
var twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);

// src/lib/utils.ts
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/RingPuzzle.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var normalizeAngle = (angle) => (angle % 360 + 360) % 360;
var isCloseToTarget = (current, target, tolerance) => {
  const diff = Math.abs(normalizeAngle(current) - normalizeAngle(target));
  return diff <= tolerance || diff >= 360 - tolerance;
};
var RingPuzzle = (0, import_react.forwardRef)(
  ({
    rings,
    onChange,
    onSolve,
    renderItem,
    size = 400,
    className,
    snapTolerance = 8,
    showCenterPivot = true,
    disabled = false
  }, ref) => {
    const containerRef = (0, import_react.useRef)(null);
    const [hasSolved, setHasSolved] = (0, import_react.useState)(false);
    const getInitialRotations = () => rings.reduce(
      (acc, r2) => ({ ...acc, [r2.id]: r2.initialRotation || 0 }),
      {}
    );
    const getInitialLocks = () => rings.reduce(
      (acc, r2) => ({
        ...acc,
        [r2.id]: r2.targetRotation !== void 0 ? isCloseToTarget(
          r2.initialRotation || 0,
          r2.targetRotation,
          snapTolerance
        ) : false
      }),
      {}
    );
    const [rotations, setRotations] = (0, import_react.useState)(getInitialRotations);
    const [lockedRings, setLockedRings] = (0, import_react.useState)(getInitialLocks);
    const [draggingRing, setDraggingRing] = (0, import_react.useState)(null);
    const [startAngle, setStartAngle] = (0, import_react.useState)(0);
    const [startRotation, setStartRotation] = (0, import_react.useState)(0);
    (0, import_react.useImperativeHandle)(ref, () => ({
      reset: () => {
        setRotations(getInitialRotations());
        setLockedRings(getInitialLocks());
        setHasSolved(false);
      },
      solve: () => {
        const solvedRotations = { ...rotations };
        const solvedLocks = { ...lockedRings };
        rings.forEach((r2) => {
          if (r2.targetRotation !== void 0) {
            solvedRotations[r2.id] = r2.targetRotation;
            solvedLocks[r2.id] = true;
          }
        });
        setRotations(solvedRotations);
        setLockedRings(solvedLocks);
        setHasSolved(true);
        setTimeout(() => {
          onChange?.(solvedLocks, solvedRotations);
          onSolve?.();
        }, 0);
      },
      setRotation: (ringId, degrees) => {
        handleRotationUpdate(ringId, degrees);
      },
      getRotations: () => rotations
    }));
    const handleRotationUpdate = (ringId, newRotation) => {
      const ringConfig = rings.find((r2) => r2.id === ringId);
      if (!ringConfig) return;
      if (ringConfig.step) {
        newRotation = Math.round(newRotation / ringConfig.step) * ringConfig.step;
      }
      setRotations((prev) => ({ ...prev, [ringId]: newRotation }));
      if (ringConfig.targetRotation !== void 0) {
        if (isCloseToTarget(newRotation, ringConfig.targetRotation, snapTolerance)) {
          newRotation = ringConfig.targetRotation;
          setRotations((prev) => ({ ...prev, [ringId]: newRotation }));
          setLockedRings((prev) => {
            const nextLocked = { ...prev, [ringId]: true };
            const allTargetsMet = rings.filter((r2) => r2.targetRotation !== void 0).every((r2) => nextLocked[r2.id]);
            if (allTargetsMet && !hasSolved) {
              setHasSolved(true);
              setTimeout(() => onSolve?.(), 0);
            }
            setTimeout(
              () => onChange?.(nextLocked, { ...rotations, [ringId]: newRotation }),
              0
            );
            return nextLocked;
          });
          setDraggingRing(null);
        }
      }
    };
    const getAngle = (clientX, clientY) => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    };
    const handlePointerDown = (e, ringId) => {
      if (disabled) return;
      const ringConfig = rings.find((r2) => r2.id === ringId);
      if (ringConfig?.disabled || lockedRings[ringId]) return;
      e.stopPropagation();
      e.preventDefault();
      setDraggingRing(ringId);
      setStartAngle(getAngle(e.clientX, e.clientY));
      setStartRotation(rotations[ringId] || 0);
    };
    const handleKeyDown = (e, ringId) => {
      if (disabled || lockedRings[ringId]) return;
      const ringConfig = rings.find((r2) => r2.id === ringId);
      if (ringConfig?.disabled) return;
      const deltaAmount = ringConfig?.step || 5;
      let delta = 0;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = deltaAmount;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -deltaAmount;
      if (delta !== 0) {
        e.preventDefault();
        handleRotationUpdate(ringId, (rotations[ringId] || 0) + delta);
      }
    };
    (0, import_react.useEffect)(() => {
      const handlePointerMove = (e) => {
        if (!draggingRing) return;
        const deltaAngle = getAngle(e.clientX, e.clientY) - startAngle;
        handleRotationUpdate(draggingRing, startRotation + deltaAngle);
      };
      const handlePointerUp = () => {
        if (draggingRing) {
          onChange?.(lockedRings, rotations);
          setDraggingRing(null);
        }
      };
      if (draggingRing) {
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
      }
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }, [
      draggingRing,
      startAngle,
      startRotation,
      rings,
      snapTolerance,
      lockedRings,
      rotations
    ]);
    const sortedRings = (0, import_react.useMemo)(
      () => [...rings].sort((a, b) => b.radius - a.radius),
      [rings]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        ref: containerRef,
        className: cn(
          "relative rounded-full flex items-center justify-center overflow-hidden select-none",
          "bg-background text-foreground border border-border shadow-lg",
          className
        ),
        style: {
          width: size,
          height: size
        },
        children: [
          showCenterPivot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-1/2 w-8 h-8 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-50 shadow-md border-4 border-background pointer-events-none" }),
          sortedRings.map((ring, index) => {
            const rotation = rotations[ring.id] || 0;
            const ringSize = ring.radius * 2;
            const items = ring.items || [];
            const itemAngle = items.length > 0 ? 360 / items.length : 0;
            const isLocked = Boolean(lockedRings[ring.id]);
            const isInteractable = !disabled && !ring.disabled && !isLocked;
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                role: isInteractable ? "slider" : "presentation",
                "aria-valuemin": 0,
                "aria-valuemax": 360,
                "aria-valuenow": Math.round(normalizeAngle(rotation)),
                "aria-label": `Anillo ${ring.id}`,
                tabIndex: isInteractable ? 0 : -1,
                onPointerDown: (e) => handlePointerDown(e, ring.id),
                onKeyDown: (e) => handleKeyDown(e, ring.id),
                className: cn(
                  "absolute rounded-full border overflow-hidden box-border",
                  "border-border bg-secondary/30 text-foreground",
                  isLocked ? "cursor-default drop-shadow-md" : "cursor-grab active:cursor-grabbing",
                  isInteractable && "hover:border-primary focus:outline-none focus:ring-4 focus:ring-ring transition-shadow",
                  isLocked && "transition-transform duration-300 ease-out",
                  ring.ringClassName
                ),
                style: {
                  width: ringSize,
                  height: ringSize,
                  left: (size - ringSize) / 2,
                  top: (size - ringSize) / 2,
                  transform: `rotate(${rotation}deg)`,
                  borderWidth: ring.thickness === ring.radius ? 0 : 2,
                  borderColor: "inherit",
                  // Para permitir overriders por tailwind
                  touchAction: "none",
                  backgroundColor: ring.bgImage ? "transparent" : void 0,
                  backgroundImage: ring.bgImage ? `url(${ring.bgImage})` : void 0,
                  backgroundSize: "cover",
                  zIndex: 10 + index
                },
                children: [
                  ring.bgContent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 w-full h-full pointer-events-none", children: ring.bgContent }),
                  !ring.hideDividers && items.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "div",
                    {
                      className: "absolute left-1/2 top-0 w-[2px] bg-border origin-bottom pointer-events-none",
                      style: {
                        height: ring.thickness,
                        transform: `translateX(-50%) rotate(${i * itemAngle}deg)`,
                        transformOrigin: `50% ${ring.radius}px`
                      }
                    },
                    `line-${i}`
                  )),
                  items.map((item, i) => {
                    const currentItemAngle = i * itemAngle;
                    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "div",
                      {
                        className: "absolute left-1/2 top-1/2 flex items-center justify-center pointer-events-none",
                        style: {
                          transform: `translate(-50%, -50%) rotate(${currentItemAngle}deg) translateY(-${ring.radius - ring.thickness / 2}px)`,
                          width: ring.thickness * 1.5,
                          height: ring.thickness,
                          textAlign: "center"
                        },
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          "div",
                          {
                            style: {
                              transform: ring.itemOrientation === "upright" ? "rotate(0deg)" : "rotate(90deg)",
                              opacity: isLocked ? 1 : 0.85,
                              fontWeight: isLocked ? "bold" : "normal",
                              fontSize: `${Math.min(ring.thickness * 0.4, 32)}px`
                            },
                            children: renderItem ? renderItem(item, i, ring, isLocked) : item
                          }
                        )
                      },
                      `item-${i}`
                    );
                  })
                ]
              },
              ring.id
            );
          })
        ]
      }
    );
  }
);
RingPuzzle.displayName = "RingPuzzle";

// src/components/RefractiveFractal.tsx
var import_react2 = __toESM(require("react"), 1);
var import_jsx_runtime2 = require("react/jsx-runtime");
var RefractiveFractal = import_react2.default.forwardRef(
  ({
    as: Tag = "div",
    complexity = 5,
    refractionFactor = 30,
    frequency = 0.02,
    seed = 0,
    animate = false,
    speed = 10,
    className,
    children,
    style,
    ...props
  }, ref) => {
    const id = (0, import_react2.useId)();
    const filterId = `fractal-${id.replace(/:/g, "")}`;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      Tag,
      {
        ref,
        className: cn("relative overflow-visible", className),
        style: { filter: `url(#${filterId})`, ...style },
        ...props,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "svg",
            {
              className: "absolute w-[0px] h-[0px] pointer-events-none -left-[9999px]",
              "aria-hidden": "true",
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "filter",
                {
                  id: filterId,
                  x: "-100%",
                  y: "-100%",
                  width: "300%",
                  height: "300%",
                  colorInterpolationFilters: "sRGB",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                      "feTurbulence",
                      {
                        type: "fractalNoise",
                        baseFrequency: frequency,
                        numOctaves: complexity,
                        seed,
                        result: "noise",
                        children: animate && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                          "animate",
                          {
                            attributeName: "baseFrequency",
                            values: `${frequency}; ${Number(frequency) * 1.5}; ${frequency}`,
                            dur: `${speed}s`,
                            repeatCount: "indefinite"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                      "feDisplacementMap",
                      {
                        in: "SourceGraphic",
                        in2: "noise",
                        scale: refractionFactor,
                        xChannelSelector: "R",
                        yChannelSelector: "G",
                        result: "displacement"
                      }
                    )
                  ]
                }
              ) })
            }
          ),
          children
        ]
      }
    );
  }
);
RefractiveFractal.displayName = "RefractiveFractal";

// src/components/CinderDissolve.tsx
var import_react3 = __toESM(require("react"), 1);
var import_jsx_runtime3 = require("react/jsx-runtime");
var clamp = (value, min, max) => Math.min(max, Math.max(min, value));
var easeOutCubic = (value) => 1 - (1 - value) ** 3;
var axisMap = {
  top: { gradientDirection: "to bottom", driftX: 0, driftY: 22 },
  right: { gradientDirection: "to left", driftX: 22, driftY: -10 },
  bottom: { gradientDirection: "to top", driftX: 0, driftY: -32 },
  left: { gradientDirection: "to right", driftX: -22, driftY: -10 }
};
var getEdgeMaskImage = (origin, progress, edgeWidth) => {
  const direction = axisMap[origin].gradientDirection;
  const edge = clamp(progress * 100, 0, 100);
  const softA = clamp(edge + edgeWidth * 44, 0, 100);
  const softB = clamp(edge + edgeWidth * 88, 0, 100);
  return `linear-gradient(${direction}, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${edge}%, rgba(0,0,0,0.56) ${softA}%, rgba(0,0,0,0.95) ${softB}%, rgba(0,0,0,1) 100%)`;
};
var seededUnit = (seed, index) => {
  const value = Math.sin((index + 1) * 12.9898 + seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
};
var buildBurnPath = (width, height, progress, seeds, jitter, tick, animate, paused, origin, pattern) => {
  const count = seeds.length;
  let centerX = width / 2;
  let centerY = height / 2;
  if (pattern === "edge") {
    switch (origin) {
      case "top":
        centerY = -height * 0.28;
        break;
      case "right":
        centerX = width * 1.28;
        break;
      case "bottom":
        centerY = height * 1.28;
        break;
      case "left":
        centerX = -width * 0.28;
        break;
    }
  }
  const maxRadius = Math.hypot(width, height) * 0.62;
  const baseRadius = clamp(progress, 0, 1) * maxRadius;
  if (baseRadius <= 0.4 || count < 3) {
    return "";
  }
  const phase = tick * 22e-4;
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const angle = i / count * Math.PI * 2;
    const seed = seeds[i] ?? 0.5;
    const staticNoise = (seed - 0.5) * jitter;
    const dynamicNoise = animate && !paused ? Math.sin(phase + i * 1.37) * 0.08 + Math.cos(phase * 0.73 + i * 0.91) * 0.05 : 0;
    const radiusFactor = clamp(0.74 + staticNoise + dynamicNoise, 0.45, 1.38);
    const radius = baseRadius * radiusFactor;
    points.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  }
  if (points.length === 0) {
    return "";
  }
  const first = points[0];
  if (!first) {
    return "";
  }
  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
  for (let i = 1; i < points.length; i += 1) {
    const point = points[i];
    if (!point) {
      continue;
    }
    d += ` L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }
  d += " Z";
  return d;
};
var buildBurnPoints = (width, height, progress, seeds, jitter, tick, animate, paused, origin, pattern) => {
  const count = seeds.length;
  let centerX = width / 2;
  let centerY = height / 2;
  if (pattern === "edge") {
    switch (origin) {
      case "top":
        centerY = -height * 0.28;
        break;
      case "right":
        centerX = width * 1.28;
        break;
      case "bottom":
        centerY = height * 1.28;
        break;
      case "left":
        centerX = -width * 0.28;
        break;
    }
  }
  const maxRadius = Math.hypot(width, height) * 0.62;
  const baseRadius = clamp(progress, 0, 1) * maxRadius;
  if (baseRadius <= 0.4 || count < 3) {
    return [];
  }
  const phase = tick * 22e-4;
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const angle = i / count * Math.PI * 2;
    const seed = seeds[i] ?? 0.5;
    const staticNoise = (seed - 0.5) * jitter;
    const dynamicNoise = animate && !paused ? Math.sin(phase + i * 1.37) * 0.08 + Math.cos(phase * 0.73 + i * 0.91) * 0.05 : 0;
    const radiusFactor = clamp(0.74 + staticNoise + dynamicNoise, 0.45, 1.38);
    const radius = baseRadius * radiusFactor;
    points.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  }
  return points;
};
var CinderDissolve = import_react3.default.forwardRef(
  ({
    as: Tag = "div",
    progress = 0,
    animate = false,
    paused = false,
    pauseAt,
    duration = 6,
    loop = true,
    origin = "bottom",
    mode = "burn",
    edgeWidth = 0.16,
    distortion = 18,
    turbulence = 0.018,
    particleCount = 12,
    flameVariant = "front",
    burnPattern = "center",
    glowColor,
    emberColor,
    smokeColor,
    pointAmount = 30,
    burnSeed = 21,
    className,
    children,
    style,
    ...props
  }, ref) => {
    const containerRef = (0, import_react3.useRef)(null);
    const [size, setSize] = (0, import_react3.useState)({ width: 1, height: 1 });
    const [animatedProgress, setAnimatedProgress] = (0, import_react3.useState)(progress);
    const [tick, setTick] = (0, import_react3.useState)(0);
    const id = (0, import_react3.useId)();
    const safeId = id.replace(/:/g, "");
    const filterId = `cinder-distort-${safeId}`;
    const maskId = `cinder-mask-${safeId}`;
    const flameFilterId = `cinder-flame-filter-${safeId}`;
    const emberGradientId = `cinder-ember-grad-${safeId}`;
    const flameGradientId = `cinder-flame-grad-${safeId}`;
    const safeDuration = Math.max(duration, 0.1);
    const clampedPauseAt = pauseAt === void 0 ? void 0 : clamp(pauseAt, 0, 1);
    (0, import_react3.useEffect)(() => {
      const node = containerRef.current;
      if (!node || typeof ResizeObserver === "undefined") {
        return;
      }
      const observer = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (!rect) {
          return;
        }
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        setSize({ width, height });
      });
      observer.observe(node);
      return () => observer.disconnect();
    }, []);
    (0, import_react3.useEffect)(() => {
      if (!animate) {
        setAnimatedProgress(progress);
        return;
      }
      if (paused) {
        if (clampedPauseAt !== void 0) {
          setAnimatedProgress(clampedPauseAt);
        }
        return;
      }
      let frameId = 0;
      let startTime = 0;
      const frame = (timestamp) => {
        if (!startTime) {
          startTime = timestamp;
        }
        const rawPhase = (timestamp - startTime) / (safeDuration * 1e3);
        const cyclePhase = loop ? rawPhase % 1 : Math.min(rawPhase, 1);
        const nextProgress = easeOutCubic(cyclePhase);
        if (clampedPauseAt !== void 0 && nextProgress >= clampedPauseAt) {
          setAnimatedProgress(clampedPauseAt);
          setTick(timestamp);
          return;
        }
        setAnimatedProgress(nextProgress);
        setTick(timestamp);
        if (loop || rawPhase < 1) {
          frameId = window.requestAnimationFrame(frame);
        }
      };
      frameId = window.requestAnimationFrame(frame);
      return () => window.cancelAnimationFrame(frameId);
    }, [animate, clampedPauseAt, loop, paused, progress, safeDuration]);
    const resolvedProgress = clamp(animate ? animatedProgress : progress, 0, 1);
    const boundedEdgeWidth = clamp(edgeWidth, 0.05, 0.35);
    const hasFrontier = resolvedProgress > 5e-3 && resolvedProgress < 0.998;
    const palette = (0, import_react3.useMemo)(
      () => mode === "burn" ? {
        smoke: smokeColor ?? "rgba(46, 33, 27, 0.54)",
        warm: glowColor ?? "rgba(255, 122, 52, 0.92)",
        hot: emberColor ?? "rgba(255, 231, 168, 0.96)",
        emberA: glowColor ?? "#ff7a1a",
        emberB: emberColor ?? "#ffe8a3"
      } : {
        smoke: smokeColor ?? "rgba(203, 213, 225, 0.26)",
        warm: glowColor ?? "rgba(148, 163, 184, 0.46)",
        hot: emberColor ?? "rgba(241, 245, 249, 0.86)",
        emberA: glowColor ?? "#cbd5e1",
        emberB: emberColor ?? "#f8fafc"
      },
      [emberColor, glowColor, mode, smokeColor]
    );
    const seeds = (0, import_react3.useMemo)(
      () => Array.from(
        { length: Math.max(8, pointAmount) },
        (_, index) => seededUnit(burnSeed, index)
      ),
      [burnSeed, pointAmount]
    );
    const burnPath = (0, import_react3.useMemo)(
      () => buildBurnPath(
        size.width,
        size.height,
        resolvedProgress,
        seeds,
        0.62,
        tick,
        animate,
        paused,
        origin,
        burnPattern
      ),
      [
        animate,
        burnPattern,
        origin,
        paused,
        resolvedProgress,
        seeds,
        size.height,
        size.width,
        tick
      ]
    );
    const burnPoints = (0, import_react3.useMemo)(
      () => buildBurnPoints(
        size.width,
        size.height,
        resolvedProgress,
        seeds,
        0.62,
        tick,
        animate,
        paused,
        origin,
        burnPattern
      ),
      [
        animate,
        burnPattern,
        origin,
        paused,
        resolvedProgress,
        seeds,
        size.height,
        size.width,
        tick
      ]
    );
    const smokePlumes = (0, import_react3.useMemo)(() => {
      if (mode !== "burn") {
        return [];
      }
      const total = Math.max(5, Math.ceil(particleCount * 0.62));
      return Array.from({ length: total }, (_, index) => {
        const anchor = burnPoints[index * 3 % Math.max(1, burnPoints.length)] ?? {
          x: size.width * 0.5,
          y: size.height * 0.5
        };
        return {
          id: `${safeId}-smoke-${index}`,
          x: anchor.x,
          y: anchor.y,
          size: 54 + index % 4 * 18,
          opacity: 0.18 + index % 3 * 0.08,
          duration: 3.8 + index % 4 * 0.7,
          delay: `${-index * 0.38}s`
        };
      });
    }, [burnPoints, mode, particleCount, safeId, size.height, size.width]);
    const ashParticles = (0, import_react3.useMemo)(() => {
      if (mode !== "burn") {
        return [];
      }
      const total = Math.max(6, Math.ceil(particleCount * 0.7));
      return Array.from({ length: total }, (_, index) => {
        const anchor = burnPoints[(index * 2 + 1) % Math.max(1, burnPoints.length)] ?? {
          x: size.width * 0.5,
          y: size.height * 0.5
        };
        return {
          id: `${safeId}-ash-${index}`,
          x: anchor.x,
          y: anchor.y,
          size: 4 + index % 4 * 2,
          opacity: 0.18 + index % 3 * 0.1,
          duration: 2.4 + index % 4 * 0.45,
          delay: `${-index * 0.31}s`,
          rotate: (index % 2 === 0 ? -1 : 1) * (8 + index % 3 * 7)
        };
      });
    }, [burnPoints, mode, particleCount, safeId, size.height, size.width]);
    const flameParticles = (0, import_react3.useMemo)(() => {
      if (mode !== "burn" || flameVariant !== "particles") {
        return [];
      }
      const total = Math.max(12, Math.ceil(particleCount * 1.5));
      return Array.from({ length: total }, (_, index) => {
        const step = Math.max(1, Math.floor(burnPoints.length / total));
        const anchor = burnPoints[index * step % Math.max(1, burnPoints.length)] ?? {
          x: size.width * 0.5,
          y: size.height * 0.5
        };
        return {
          id: `${safeId}-flame-${index}`,
          x: anchor.x,
          y: anchor.y,
          width: 24 + index % 5 * 8,
          height: 50 + index % 4 * 16,
          duration: 0.7 + index % 3 * 0.3,
          delay: -index * 0.15,
          driftX: (index % 2 === 0 ? -1 : 1) * (8 + index % 3 * 6),
          driftY: -50 - index % 4 * 15,
          sway: (index % 2 === 0 ? -1 : 1) * (12 + index % 3 * 8)
        };
      });
    }, [
      burnPoints,
      mode,
      flameVariant,
      particleCount,
      safeId,
      size.height,
      size.width
    ]);
    const shouldFreezeMotion = paused || animate && clampedPauseAt !== void 0 && resolvedProgress >= clampedPauseAt - 5e-4;
    const distortionScale = clamp(
      distortion * (0.26 + resolvedProgress * 1.08),
      0,
      120
    );
    const baseFrequency = mode === "burn" ? `${turbulence} ${turbulence * 1.9}` : `${turbulence * 0.72} ${turbulence * 1.32}`;
    const edgeMaskImage = (0, import_react3.useMemo)(
      () => getEdgeMaskImage(origin, resolvedProgress, boundedEdgeWidth),
      [origin, resolvedProgress, boundedEdgeWidth]
    );
    const contentStyle = mode === "burn" ? {
      filter: `url(#${filterId})`,
      WebkitMask: `url(#${maskId})`,
      mask: `url(#${maskId})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%"
    } : {
      filter: `url(#${filterId})`,
      WebkitMaskImage: edgeMaskImage,
      maskImage: edgeMaskImage,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%"
    };
    const burnOpacity = hasFrontier ? clamp(0.35 + resolvedProgress * 0.62, 0.35, 1) : 0;
    const outlineWidth = Math.max(3, Math.min(size.width, size.height) * 0.016);
    const charWidth = outlineWidth * 2.6;
    const glowWidth = outlineWidth * 3.8;
    const flameWidth = outlineWidth * 4.6;
    const lineCap = "round";
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      Tag,
      {
        ref: (node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        },
        className: cn("relative isolate overflow-hidden", className),
        style,
        ...props,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "svg",
            {
              className: "absolute h-0 w-0 pointer-events-none -left-[9999px]",
              "aria-hidden": "true",
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("defs", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                  "filter",
                  {
                    id: filterId,
                    x: "-35%",
                    y: "-35%",
                    width: "170%",
                    height: "170%",
                    colorInterpolationFilters: "sRGB",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        "feTurbulence",
                        {
                          type: "fractalNoise",
                          baseFrequency,
                          numOctaves: 3,
                          seed: mode === "burn" ? 19 : 41,
                          result: "noise",
                          children: animate && !shouldFreezeMotion && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                            "animate",
                            {
                              attributeName: "baseFrequency",
                              dur: `${Math.max(safeDuration * 0.42, 1.7)}s`,
                              values: mode === "burn" ? `${baseFrequency}; ${turbulence * 1.4} ${turbulence * 2.4}; ${baseFrequency}` : `${baseFrequency}; ${turbulence * 0.55} ${turbulence * 1.05}; ${baseFrequency}`,
                              repeatCount: "indefinite"
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        "feDisplacementMap",
                        {
                          in: "SourceGraphic",
                          in2: "noise",
                          scale: distortionScale,
                          xChannelSelector: "R",
                          yChannelSelector: "G"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                  "mask",
                  {
                    id: maskId,
                    maskUnits: "userSpaceOnUse",
                    x: "0",
                    y: "0",
                    width: size.width,
                    height: size.height,
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        "rect",
                        {
                          x: "0",
                          y: "0",
                          width: size.width,
                          height: size.height,
                          fill: "white"
                        }
                      ),
                      mode === "burn" && burnPath && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: burnPath, fill: "black" })
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                  "linearGradient",
                  {
                    id: emberGradientId,
                    x1: "0%",
                    y1: "0%",
                    x2: "0%",
                    y2: "100%",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "0%", stopColor: palette.hot }),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "36%", stopColor: palette.warm }),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "100%", stopColor: "rgba(0,0,0,0)" })
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                  "linearGradient",
                  {
                    id: flameGradientId,
                    x1: "0%",
                    y1: "0%",
                    x2: "0%",
                    y2: "100%",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "0%", stopColor: "rgba(255,250,226,0.95)" }),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "18%", stopColor: "rgba(255,221,154,0.92)" }),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "45%", stopColor: "rgba(255,145,54,0.84)" }),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "72%", stopColor: "rgba(217,66,10,0.52)" }),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "100%", stopColor: "rgba(78,20,4,0)" })
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                  "filter",
                  {
                    id: flameFilterId,
                    x: "-40%",
                    y: "-40%",
                    width: "180%",
                    height: "180%",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        "feTurbulence",
                        {
                          type: "fractalNoise",
                          baseFrequency: "0.012 0.09",
                          numOctaves: "2",
                          seed: "31",
                          result: "flameNoise",
                          children: animate && !shouldFreezeMotion && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                            "animate",
                            {
                              attributeName: "baseFrequency",
                              dur: "1.6s",
                              values: "0.012 0.09; 0.02 0.14; 0.012 0.09",
                              repeatCount: "indefinite"
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        "feDisplacementMap",
                        {
                          in: "SourceGraphic",
                          in2: "flameNoise",
                          scale: mode === "burn" ? 26 : 8,
                          xChannelSelector: "R",
                          yChannelSelector: "G"
                        }
                      )
                    ]
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "relative z-10 h-full w-full", style: contentStyle, children }),
          mode === "burn" && burnPath && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "svg",
            {
              className: cn(
                "pointer-events-none absolute inset-0 z-20",
                shouldFreezeMotion && "voynich-cinder-frozen"
              ),
              width: size.width,
              height: size.height,
              viewBox: `0 0 ${size.width} ${size.height}`,
              style: { opacity: burnOpacity },
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "path",
                  {
                    d: burnPath,
                    fill: "none",
                    stroke: "rgba(7,4,3,0.92)",
                    strokeWidth: charWidth * 1.32,
                    strokeLinecap: lineCap,
                    strokeLinejoin: "round",
                    className: "voynich-cinder-soot"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "path",
                  {
                    d: burnPath,
                    fill: "none",
                    stroke: "rgba(10,7,5,0.72)",
                    strokeWidth: charWidth,
                    strokeLinecap: lineCap,
                    strokeLinejoin: "round"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "path",
                  {
                    d: burnPath,
                    fill: "none",
                    stroke: "rgba(0,0,0,0.68)",
                    strokeWidth: outlineWidth,
                    strokeLinecap: lineCap,
                    strokeLinejoin: "round"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "path",
                  {
                    d: burnPath,
                    fill: "none",
                    stroke: `url(#${emberGradientId})`,
                    strokeWidth: glowWidth,
                    strokeLinecap: lineCap,
                    strokeLinejoin: "round",
                    className: "voynich-cinder-glowstroke"
                  }
                ),
                flameVariant === "front" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "path",
                  {
                    d: burnPath,
                    fill: "none",
                    stroke: `url(#${flameGradientId})`,
                    strokeWidth: flameWidth,
                    strokeLinecap: lineCap,
                    strokeLinejoin: "round",
                    className: "voynich-paper-flame",
                    filter: `url(#${flameFilterId})`
                  }
                )
              ]
            }
          ),
          mode === "burn" && hasFrontier && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "div",
            {
              "aria-hidden": "true",
              className: cn(
                "pointer-events-none absolute inset-0 z-30",
                shouldFreezeMotion && "voynich-cinder-frozen"
              ),
              children: [
                smokePlumes.map((smoke, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "span",
                  {
                    className: "voynich-paper-smoke",
                    style: {
                      left: `${smoke.x}px`,
                      top: `${smoke.y}px`,
                      width: `${smoke.size}px`,
                      height: `${smoke.size * 0.72}px`,
                      opacity: smoke.opacity,
                      animationDuration: `${smoke.duration}s`,
                      animationDelay: smoke.delay,
                      ["--voynich-smoke-drift-x"]: `${(index % 2 === 0 ? -1 : 1) * (12 + index % 4 * 4)}px`,
                      ["--voynich-smoke-drift-y"]: `${-40 - index % 3 * 14}px`
                    }
                  },
                  smoke.id
                )),
                ashParticles.map((ash, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "span",
                  {
                    className: "voynich-paper-ash",
                    style: {
                      left: `${ash.x}px`,
                      top: `${ash.y}px`,
                      width: `${ash.size}px`,
                      height: `${ash.size * 0.78}px`,
                      opacity: ash.opacity,
                      borderRadius: `50% 50% 55% 45% / 60% 60% 40% 40%`,
                      transform: `translate(-50%, -50%) rotate(${ash.rotate}deg)`,
                      animationDuration: `${ash.duration}s`,
                      animationDelay: ash.delay,
                      ["--voynich-ash-drift-x"]: `${axisMap[origin].driftX * 0.22 + (index % 2 === 0 ? -10 : 10)}px`,
                      ["--voynich-ash-drift-y"]: `${axisMap[origin].driftY * 1.1 - 34}px`
                    }
                  },
                  ash.id
                )),
                flameVariant === "particles" && flameParticles.map((flame) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "span",
                  {
                    className: "voynich-cinder-flame absolute",
                    style: {
                      left: `${flame.x}px`,
                      top: `${flame.y}px`,
                      width: `${flame.width}px`,
                      height: `${flame.height}px`,
                      opacity: 1,
                      animationDuration: `${flame.duration}s`,
                      animationDelay: `${flame.delay}s`,
                      ["--voynich-flame-drift-x"]: `${flame.driftX}px`,
                      ["--voynich-flame-drift-y"]: `${flame.driftY}px`,
                      ["--voynich-flame-sway"]: `${flame.sway}px`,
                      mixBlendMode: "screen",
                      background: "radial-gradient(ellipse at 50% 90%, rgba(255,250,214,1) 0%, rgba(255,210,124,0.95) 15%, rgba(255,120,40,0.85) 40%, rgba(220,45,11,0.5) 65%, rgba(72,16,2,0) 100%)",
                      filter: "blur(3px) saturate(1.4) contrast(1.2)"
                    }
                  },
                  flame.id
                ))
              ]
            }
          )
        ]
      }
    );
  }
);
CinderDissolve.displayName = "CinderDissolve";

// src/components/Cryptext.tsx
var import_react4 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var DEFAULT_DICT = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];,./";
var Cryptext = (0, import_react4.forwardRef)(
  ({
    text,
    dictionary = DEFAULT_DICT,
    speed = 50,
    delay = 800,
    resolvePerFrame = 1,
    as: Tag = "span",
    className,
    ...props
  }, ref) => {
    const [currentText, setCurrentText] = (0, import_react4.useState)(text);
    const [isAnimating, setIsAnimating] = (0, import_react4.useState)(false);
    const scrambleText = () => {
      setIsAnimating(true);
      let iteration = 0;
      const maxIterations = Math.max(text.length / resolvePerFrame, delay / speed);
      const interval = setInterval(() => {
        setCurrentText((prev) => {
          let newStr = "";
          const effectiveIteration = iteration - delay / speed;
          for (let i = 0; i < text.length; i++) {
            if (i < effectiveIteration * resolvePerFrame || text[i] === " ") {
              newStr += text[i];
            } else {
              newStr += dictionary[Math.floor(Math.random() * dictionary.length)];
            }
          }
          return newStr;
        });
        if (iteration >= text.length / resolvePerFrame + delay / speed) {
          clearInterval(interval);
          setIsAnimating(false);
          setCurrentText(text);
        }
        iteration++;
      }, speed);
    };
    (0, import_react4.useImperativeHandle)(ref, () => ({
      scramble: scrambleText
    }));
    (0, import_react4.useEffect)(() => {
      scrambleText();
    }, [text]);
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Tag, { className: cn("font-mono", className), ...props, children: currentText });
  }
);
Cryptext.displayName = "Cryptext";

// src/components/RadialMenu.tsx
var import_react5 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var ITEM_MARGIN = 40;
var FLOAT_EPSILON = 1e-3;
var AUTO_ARC_STEP = 2;
var normalizeAngle2 = (angle) => {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};
var resolveArcFromAngles = (startAngle, endAngle) => {
  if (endAngle === void 0) {
    return void 0;
  }
  const angleDifference = endAngle - startAngle;
  if (angleDifference > 0) {
    return angleDifference;
  }
  if (angleDifference < 0) {
    return angleDifference + 360;
  }
  return 360;
};
var getDistanceLimit = (direction, negativeSpace, positiveSpace) => {
  if (direction > FLOAT_EPSILON) {
    return positiveSpace / direction;
  }
  if (direction < -FLOAT_EPSILON) {
    return negativeSpace / Math.abs(direction);
  }
  return Infinity;
};
var fitsInsideContainer = (containerWidth, containerHeight, centerX, centerY, angleInDegrees, distance) => {
  const radians = angleInDegrees * (Math.PI / 180);
  const projectedX = centerX + Math.cos(radians) * distance;
  const projectedY = centerY + Math.sin(radians) * distance;
  return projectedX >= ITEM_MARGIN && projectedX <= containerWidth - ITEM_MARGIN && projectedY >= ITEM_MARGIN && projectedY <= containerHeight - ITEM_MARGIN;
};
var RadialMenu = (0, import_react5.forwardRef)(
  ({
    items,
    radius = 100,
    centerNode,
    staggerDelay = 50,
    startAngle = -90,
    endAngle,
    icon = "+",
    className,
    arc,
    buttonClassName,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = (0, import_react5.useState)(false);
    const [layout, setLayout] = (0, import_react5.useState)({
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
      autoArc: 360,
      autoStartAngle: startAngle
    });
    const WrapperRef = (0, import_react5.useRef)(null);
    const CenterNodeRef = (0, import_react5.useRef)(null);
    const explicitArc = arc ?? resolveArcFromAngles(startAngle, endAngle);
    const effectiveArc = explicitArc ?? layout.autoArc;
    const effectiveStartAngle = explicitArc === void 0 ? layout.autoStartAngle : startAngle;
    const angleStep = items.length <= 1 ? 0 : effectiveArc === 360 ? effectiveArc / items.length : effectiveArc / Math.max(1, items.length - 1);
    (0, import_react5.useImperativeHandle)(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev)
    }));
    (0, import_react5.useEffect)(() => {
      const updateSize = () => {
        if (!WrapperRef.current || !CenterNodeRef.current) {
          return;
        }
        const wrapperRect = WrapperRef.current.getBoundingClientRect();
        const parentRect = WrapperRef.current.parentElement?.getBoundingClientRect();
        const centerRect = CenterNodeRef.current.getBoundingClientRect();
        const shouldUseParentRect = !!parentRect && (wrapperRect.width <= centerRect.width + 1 || wrapperRect.height <= centerRect.height + 1);
        const containerRect = shouldUseParentRect ? parentRect : wrapperRect;
        if (!containerRect) {
          return;
        }
        const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
        const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;
        let autoArc = 360;
        let autoStartAngle = startAngle;
        if (explicitArc === void 0 && radius > 0) {
          let backwardSweep = 0;
          let forwardSweep = 0;
          for (let sweep = 0; sweep <= 180; sweep += AUTO_ARC_STEP) {
            const angle = normalizeAngle2(startAngle - sweep);
            if (!fitsInsideContainer(
              containerRect.width,
              containerRect.height,
              centerX,
              centerY,
              angle,
              radius
            )) {
              break;
            }
            backwardSweep = sweep;
          }
          for (let sweep = 0; sweep <= 180; sweep += AUTO_ARC_STEP) {
            const angle = normalizeAngle2(startAngle + sweep);
            if (!fitsInsideContainer(
              containerRect.width,
              containerRect.height,
              centerX,
              centerY,
              angle,
              radius
            )) {
              break;
            }
            forwardSweep = sweep;
          }
          autoArc = backwardSweep + forwardSweep;
          autoStartAngle = startAngle - backwardSweep;
          if (autoArc >= 360 - AUTO_ARC_STEP) {
            autoArc = 360;
            autoStartAngle = startAngle - 180;
          }
        }
        setLayout({
          width: containerRect.width,
          height: containerRect.height,
          centerX,
          centerY,
          autoArc,
          autoStartAngle
        });
      };
      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }, [explicitArc, items.length, radius, startAngle]);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        ref: WrapperRef,
        className: cn("relative flex items-center justify-center", className),
        ...props,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              ref: CenterNodeRef,
              className: "relative z-20 cursor-pointer",
              onClick: () => setIsOpen(!isOpen),
              children: centerNode || /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "div",
                {
                  className: cn(
                    "w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-neutral-700 transition-colors",
                    buttonClassName
                  ),
                  children: icon
                }
              )
            }
          ),
          items.map((item, index) => {
            const currentAngle = effectiveStartAngle + index * angleStep;
            const radians = currentAngle * (Math.PI / 180);
            let dynamicRadius = radius;
            if (layout.width > 0 && layout.height > 0) {
              const cos = Math.cos(radians);
              const sin = Math.sin(radians);
              const leftSpace = Math.max(0, layout.centerX - ITEM_MARGIN);
              const rightSpace = Math.max(
                0,
                layout.width - layout.centerX - ITEM_MARGIN
              );
              const topSpace = Math.max(0, layout.centerY - ITEM_MARGIN);
              const bottomSpace = Math.max(
                0,
                layout.height - layout.centerY - ITEM_MARGIN
              );
              const limitX = getDistanceLimit(cos, leftSpace, rightSpace);
              const limitY = getDistanceLimit(sin, topSpace, bottomSpace);
              dynamicRadius = Math.min(radius, limitX, limitY);
            }
            const tx = Math.cos(radians) * dynamicRadius;
            const ty = Math.sin(radians) * dynamicRadius;
            return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "div",
              {
                onClick: () => {
                  item.onClick?.();
                  setIsOpen(false);
                },
                className: cn(
                  "absolute z-10 origin-center transition-all duration-500 cursor-pointer",
                  isOpen ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
                ),
                style: {
                  transform: isOpen ? `translate(${tx}px, ${ty}px)` : `translate(0px, 0px)`,
                  transitionDelay: isOpen ? `${index * staggerDelay}ms` : "0ms"
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex flex-col items-center justify-center group", children: [
                  item.icon && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "p-2 w-10 h-10 bg-neutral-900 rounded-full border border-neutral-700 flex items-center justify-center shadow-lg hover:border-cyan-500 hover:text-cyan-400 hover:scale-110 transition-all text-neutral-300", children: item.icon }),
                  item.label && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "absolute top-12 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded", children: item.label })
                ] })
              },
              item.id
            );
          })
        ]
      }
    );
  }
);
RadialMenu.displayName = "RadialMenu";

// src/components/ScratchCard.tsx
var import_react6 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var ScratchCard = (0, import_react6.forwardRef)(
  ({
    width = 300,
    height = 200,
    coverImage = "#888",
    brushSize = 20,
    brushHardness = 1,
    clearThreshold = 0.5,
    onComplete,
    children,
    className,
    ...props
  }, ref) => {
    const canvasRef = (0, import_react6.useRef)(null);
    const containerRef = (0, import_react6.useRef)(null);
    const [isScratching, setIsScratching] = (0, import_react6.useState)(false);
    const [isCleared, setIsCleared] = (0, import_react6.useState)(false);
    const pixelsScratched = (0, import_react6.useRef)(/* @__PURE__ */ new Set());
    const initializeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      setIsCleared(false);
      pixelsScratched.current.clear();
      canvas.width = width;
      canvas.height = height;
      ctx.globalCompositeOperation = "source-over";
      if (coverImage.startsWith("url")) {
        const img = new Image();
        const match = coverImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
          img.src = match[1];
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            setupEraseMode(ctx);
          };
        }
      } else {
        ctx.fillStyle = coverImage;
        ctx.fillRect(0, 0, width, height);
        setupEraseMode(ctx);
      }
    };
    const setupEraseMode = (ctx) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = brushSize * 2;
    };
    (0, import_react6.useEffect)(() => {
      initializeCanvas();
    }, [width, height, coverImage]);
    (0, import_react6.useImperativeHandle)(ref, () => ({
      reset: () => {
        initializeCanvas();
      },
      clear: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillRect(0, 0, width, height);
        }
        setIsCleared(true);
        if (onComplete) onComplete();
      }
    }));
    const scratch = (e) => {
      if (!isScratching || isCleared) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      let x, y;
      if ("touches" in e) {
        const touch = e.touches[0];
        if (!touch) return;
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      if (brushHardness < 1) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(brushHardness, "rgba(0,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
      }
      if (clearThreshold !== null && Math.random() > 0.8) {
        checkCompletion(ctx);
      }
    };
    const checkCompletion = (ctx) => {
      if (isCleared) return;
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      const totalPixels = width * height;
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) transparentPixels++;
      }
      const percentCleared = transparentPixels / (totalPixels / 4);
      if (percentCleared >= clearThreshold) {
        setIsCleared(true);
        const animSteps = 20;
        let currentStep = 0;
        const fadeOut = setInterval(() => {
          if (!canvasRef.current) {
            clearInterval(fadeOut);
            return;
          }
          currentStep++;
          ctx.globalAlpha = 0.2;
          ctx.fillRect(0, 0, width, height);
          if (currentStep >= animSteps) {
            clearInterval(fadeOut);
            ctx.globalAlpha = 1;
            ctx.fillRect(0, 0, width, height);
            if (onComplete) onComplete();
          }
        }, 16);
      }
    };
    const handleStart = (e) => {
      setIsScratching(true);
      scratch(e);
    };
    const handleEnd = () => {
      setIsScratching(false);
    };
    (0, import_react6.useEffect)(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const onTouchMove = (e) => {
        if (isScratching) scratch(e);
      };
      canvas.addEventListener("touchmove", onTouchMove, { passive: false });
      return () => {
        canvas.removeEventListener("touchmove", onTouchMove);
      };
    }, [isScratching]);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "div",
      {
        ref: containerRef,
        className: cn(
          "relative overflow-hidden cursor-crosshair select-none touch-none",
          className
        ),
        style: { width, height },
        ...props,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "absolute inset-0 z-0 select-none pointer-events-none", children }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "canvas",
            {
              ref: canvasRef,
              onMouseDown: handleStart,
              onMouseUp: handleEnd,
              onMouseLeave: handleEnd,
              onMouseMove: scratch,
              onTouchStart: handleStart,
              onTouchEnd: handleEnd,
              onTouchCancel: handleEnd,
              className: cn(
                "absolute inset-0 z-10 transition-opacity duration-500",
                isCleared ? "opacity-0 pointer-events-none" : "opacity-100"
              )
            }
          )
        ]
      }
    );
  }
);
ScratchCard.displayName = "ScratchCard";

// src/components/LensMagnifier.tsx
var import_react7 = __toESM(require("react"), 1);
var import_jsx_runtime7 = require("react/jsx-runtime");
var LensMagnifier = (0, import_react7.forwardRef)(
  ({
    src,
    alt = "Magnifiable Content",
    zoomLevel = 2,
    lensSize = 150,
    lensBorder = 4,
    lensShape = "circle",
    lensColor = "border-slate-300/50",
    filter = "none",
    showHandle = false,
    smoothFollowing = true,
    className,
    ...props
  }, ref) => {
    const containerRef = (0, import_react7.useRef)(null);
    const lensRef = (0, import_react7.useRef)(null);
    const zoomedImgRef = (0, import_react7.useRef)(null);
    const [isActive, setIsActive] = (0, import_react7.useState)(false);
    const pos = (0, import_react7.useRef)({ x: 0, y: 0 });
    const targetPos = (0, import_react7.useRef)({ x: 0, y: 0 });
    const containerSize = (0, import_react7.useRef)({ w: 0, h: 0 });
    (0, import_react7.useImperativeHandle)(ref, () => ({
      resetZoom: () => setIsActive(false)
    }));
    import_react7.default.useEffect(() => {
      if (!isActive) return;
      let animationFrameId;
      const updateDOM = (x, y) => {
        if (lensRef.current) {
          lensRef.current.style.transform = `translate(${x - lensSize / 2}px, ${y - lensSize / 2}px)`;
        }
        if (zoomedImgRef.current && containerSize.current.w > 0) {
          const cW = containerSize.current.w;
          const cH = containerSize.current.h;
          zoomedImgRef.current.style.width = `${cW * zoomLevel}px`;
          zoomedImgRef.current.style.height = `${cH * zoomLevel}px`;
          const bgX = x * -zoomLevel + lensSize / 2;
          const bgY = y * -zoomLevel + lensSize / 2;
          zoomedImgRef.current.style.transform = `translate(${bgX}px, ${bgY}px)`;
        }
      };
      const renderLoop = () => {
        if (smoothFollowing) {
          pos.current.x += (targetPos.current.x - pos.current.x) * 0.15;
          pos.current.y += (targetPos.current.y - pos.current.y) * 0.15;
        } else {
          pos.current.x = targetPos.current.x;
          pos.current.y = targetPos.current.y;
        }
        updateDOM(pos.current.x, pos.current.y);
        animationFrameId = requestAnimationFrame(renderLoop);
      };
      if (!smoothFollowing) {
        pos.current.x = targetPos.current.x;
        pos.current.y = targetPos.current.y;
        updateDOM(pos.current.x, pos.current.y);
      }
      animationFrameId = requestAnimationFrame(renderLoop);
      return () => cancelAnimationFrame(animationFrameId);
    }, [isActive, smoothFollowing, zoomLevel, lensSize]);
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      targetPos.current.x = e.clientX - rect.left;
      targetPos.current.y = e.clientY - rect.top;
      if (!isActive) {
        containerSize.current.w = containerRef.current.offsetWidth;
        containerSize.current.h = containerRef.current.offsetHeight;
        setIsActive(true);
      }
    };
    const handleMouseEnter = () => {
      if (containerRef.current) {
        containerSize.current.w = containerRef.current.offsetWidth;
        containerSize.current.h = containerRef.current.offsetHeight;
      }
      setIsActive(true);
    };
    const handleMouseLeave = () => {
      setIsActive(false);
    };
    const getShapeRadius = (shape) => {
      switch (shape) {
        case "square":
          return "0%";
        case "rounded-square":
          return "15%";
        case "circle":
        default:
          return "50%";
      }
    };
    const getFilterStyle = (f) => {
      switch (f) {
        case "sepia":
          return "sepia(80%) contrast(1.2)";
        case "grayscale":
          return "grayscale(100%) contrast(1.2)";
        case "invert":
          return "invert(100%) hue-rotate(180deg)";
        case "vintage":
          return "sepia(50%) contrast(1.5) brightness(0.9) hue-rotate(-15deg)";
        case "x-ray":
          return "invert(100%) grayscale(100%) contrast(2)";
        case "none":
        default:
          return "none";
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        ref: containerRef,
        className: cn(
          "relative overflow-hidden cursor-none select-none group border border-slate-200 bg-slate-50",
          className
        ),
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        onMouseEnter: handleMouseEnter,
        ...props,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "img",
            {
              src,
              alt,
              className: "w-full h-full object-cover pointer-events-none transition-[filter] duration-300",
              style: {
                filter: isActive ? "brightness(0.9) grayscale(20%)" : "none"
              },
              draggable: false
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
            "div",
            {
              ref: lensRef,
              className: cn(
                "absolute top-0 left-0 z-10 shadow-2xl pointer-events-none overflow-visible will-change-transform",
                isActive ? "opacity-100 duration-300 ease-out transition-opacity" : "opacity-0 duration-200 transition-opacity"
              ),
              style: {
                width: lensSize,
                height: lensSize
              },
              children: [
                showHandle && lensShape === "circle" && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
                  "div",
                  {
                    className: "absolute left-1/2 top-[95%] w-[12%] h-[80%] bg-gradient-to-r from-amber-800 via-amber-600 to-amber-900 rounded-b-md rounded-t-sm origin-top -translate-x-1/2 rotate-[35deg] shadow-xl z-0",
                    style: {
                      boxShadow: "inset -2px 0 6px rgba(0,0,0,0.5), inset 2px 0 4px rgba(255,255,255,0.3)"
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "absolute top-[10%] w-full h-[5%] bg-amber-950/50" }),
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "absolute top-[80%] w-full h-[5%] bg-amber-950/50" })
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
                  "div",
                  {
                    className: cn(
                      "absolute inset-0 overflow-hidden bg-white z-10",
                      lensColor
                    ),
                    style: {
                      borderRadius: getShapeRadius(lensShape),
                      borderWidth: lensBorder,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0,0,0,0.3)"
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "absolute inset-0 origin-top-left pointer-events-none blur-[0.3px]", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                        "img",
                        {
                          ref: zoomedImgRef,
                          src,
                          alt: "Zoomed",
                          className: "absolute max-w-none pointer-events-none will-change-transform object-cover",
                          draggable: false,
                          style: {
                            filter: getFilterStyle(filter)
                          }
                        }
                      ) }),
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                        "div",
                        {
                          className: "absolute inset-0 pointer-events-none bg-gradient-to-br from-white/30 via-transparent to-black/10 mix-blend-overlay",
                          style: { borderRadius: getShapeRadius(lensShape) }
                        }
                      ),
                      lensShape === "circle" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "absolute left-[15%] top-[10%] w-[30%] h-[15%] rounded-[100%] bg-white/20 -rotate-12 pointer-events-none blur-sm" })
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    );
  }
);
LensMagnifier.displayName = "LensMagnifier";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CinderDissolve,
  Cryptext,
  LensMagnifier,
  RadialMenu,
  RefractiveFractal,
  RingPuzzle,
  ScratchCard
});
//# sourceMappingURL=index.cjs.map