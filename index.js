"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var invariant = require("invariant");
var deepClone = require("@jsbits/deep-clone");
var UNDEF = undefined;
/**
 * We are running in a Mac-like OS?
 */
var isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
/**
 * Shorthand to `Object.keys` that returns a more-sense type.
 */
var keyArray = Object.keys;
/**
 * Check if `obj` is a non-falsy object.
 */
var isObject = function (obj) { return !!obj && typeof obj === 'object'; };
/**
 * Simple `Object.assign`-like function
 */
var assign = function (dest, src) {
    if (src) {
        Object.keys(src).forEach(function (k) {
            dest[k] = src[k];
        });
    }
    return dest;
};
/**
 * Deep remotion of `null` and `undefined` values of an object.
 */
var pack = function (obj) {
    keyArray(obj).forEach(function (k) {
        if (obj[k] == null) {
            delete obj[k];
        }
        else if (typeof obj[k] === 'object') {
            obj[k] = pack(obj[k]);
        }
    });
    return obj;
};
/**
 * Ensure to get a non-empty `className` as an string.
 */
var classAsStr = function (klass) {
    if (typeof klass === 'string') {
        return klass;
    }
    invariant(Array.isArray(klass), 'className must be a string or array.');
    return klass.filter(Boolean).join(' ');
};
/**
 * Internal configuration object.
 */
var _Conf = {
    map: {},
    defs: {
        display: 'inline-block',
        fill: 'currentColor',
        stroke: 'currentColor',
        size: '1em',
    },
    sizes: {
        small: '18px',
        large: '32px',
    },
};
/**
 * Merge the given icons with the existent ones.
 *
 * To remove existing icons, set its value to `null` of `undefined`.
 *
 * @param {Object.<string,?Function>} iconMap Object with name-icon translations.
 */
exports.addIcons = function (iconMap) {
    invariant(isObject(iconMap), 'The iconMap must be an object.');
    pack(assign(_Conf.map, iconMap));
};
/**
 * Merge the given values with the current defaults.
 *
 * Values with `null` or `undefined` will remove the existing property.
 *
 * @param {Object.<string,*>} defaults Properties to merge.
 */
exports.setDefaults = function (defaults) {
    invariant(isObject(defaults), 'The defaults must be an object.');
    var defs = assign(_Conf.defs, deepClone(defaults));
    // check and format class names, if any
    if (defs.className) {
        defs.className = classAsStr(defs.className).trim() || UNDEF;
    }
    // cleanup empty properties
    pack(defs);
};
/**
 * Reset the table of named sizes.
 *
 * You can use custom names here, to remove the prdefined names, 'small'
 * and 'large', set them to `null` or `undefined`.
 *
 * @param {Object.<string,?string|number>} sizes Object with a sizes map.
 */
exports.setSizes = function (sizes) {
    invariant(isObject(sizes), 'The sizes must be an object.');
    pack(assign(_Conf.sizes, sizes));
};
var expandFrom = {
    color: ['fill', 'stroke'],
    size: ['width', 'height'],
};
/**
 * Renders a SVG Ionicon
 */
var IonIcon = /** @class */ (function (_super) {
    __extends(IonIcon, _super);
    function IonIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IonIcon.prototype.expandAttr = function (opts, name, value) {
        var _a = expandFrom[name], p1 = _a[0], p2 = _a[1];
        if (opts[p1] !== UNDEF) {
            opts[p1] = value;
        }
        if (opts[p2] !== UNDEF) {
            opts[p2] = value;
        }
    };
    /**
     * Merge the user properties with the defaults, taking care to preserve
     * the classes and styles of both.
     */
    IonIcon.prototype.mergeDefs = function (props) {
        var defs = _Conf.defs;
        var keys = keyArray(defs);
        // Example of precedence [fill, stroke] = troke:
        // fill = user.fill -> defs.fill -> user.color -> defs.color
        // even if any of them is `null`, it will overrite.
        if (props.color !== UNDEF) {
            this.expandAttr(props, 'color', props.color);
        }
        if (props.size !== UNDEF) {
            this.expandAttr(props, 'size', props.size);
        }
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            switch (k) {
                case 'className':
                    props.className = props.className
                        ? classAsStr(props.className) + " " + defs.className
                        : defs.className;
                    break;
                case 'style':
                    props.style = props.style
                        ? assign(assign({}, props.style), defs.style)
                        : defs.style;
                    break;
                case 'color':
                case 'size':
                    this.expandAttr(props, k, defs[k]);
                    break;
                default:
                    if (!props.hasOwnProperty(k)) {
                        props[k] = defs[k];
                    }
            }
        }
        return props;
    };
    IonIcon.prototype.render = function () {
        var opts = deepClone(this.props);
        var name = opts.name;
        delete opts.name;
        var renderIcon = _Conf.map[name];
        invariant(renderIcon, "The icon \"" + name + "\" is not registered.");
        var innerRef = opts.innerRef;
        if (innerRef !== null) {
            delete opts.innerRef;
            opts.ref = innerRef;
        }
        // name & innerRef are out, merge with defaults before color & size
        this.mergeDefs(opts);
        // Guess whether the "iOS" style should be used with double-style icons.
        var ios = isMacLike;
        if (opts.mode) {
            ios = opts.mode === 'ios';
            delete opts.mode;
        }
        return renderIcon(opts, ios);
    };
    IonIcon.propTypes = {
        name: PropTypes.string.isRequired,
        color: PropTypes.string,
        size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        iconType: PropTypes.oneOf(['ios', 'md']),
        innerRef: PropTypes.func,
    };
    return IonIcon;
}(React.PureComponent));
exports.IonIcon = IonIcon;
