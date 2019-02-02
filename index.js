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
var iconTitles = require("./bundles/icon-titles");
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
    dest = dest || {};
    if (src) {
        Object.keys(src).forEach(function (k) {
            dest[k] = isObject(src[k])
                ? assign(isObject(dest[k]) ? dest[k] : {}, src[k])
                : src[k];
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
    titles: iconTitles,
    baseClass: UNDEF,
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
    var defs = assign(_Conf.defs, defaults);
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
/**
 * Add icon titles to the icon-name -> title transtations.
 *
 * @param {Object.<string,?string>} sizes Object with {icon-name: title} props.
 */
exports.setTitles = function (iconTitles) {
    invariant(isObject(iconTitles), 'The icon titles must be an object.');
    pack(assign(_Conf.titles, iconTitles));
};
/**
 * Class or space separated classes to add to the `className` property
 * of all the icons, in addition to the default or specific one.
 *
 * @param {string} class or space separated list of classes.
 */
exports.setBaseClass = function (classes) {
    _Conf.baseClass = classes && classAsStr(classes).trim() || UNDEF;
};
/**
 * Renders a SVG Ionicon
 */
var IonIcon = /** @class */ (function (_super) {
    __extends(IonIcon, _super);
    function IonIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IonIcon.prototype.titleify = function (name) {
        var title = name[0].toUpperCase() +
            name.substr(1).replace(/-+([a-z])/g, function (_, c) { return " " + c.toUpperCase(); });
        return (_Conf.titles[name] = title);
    };
    IonIcon.prototype.expandColor = function (opts, color) {
        if (opts.fill === UNDEF) {
            opts.fill = color;
        }
        if (opts.stroke === UNDEF) {
            opts.stroke = color;
        }
    };
    IonIcon.prototype.expandSize = function (opts, size) {
        if (typeof size === 'string') {
            size = _Conf.sizes[size] || size;
        }
        if (opts.width === UNDEF) {
            opts.width = size;
        }
        if (opts.height === UNDEF) {
            opts.height = size;
        }
    };
    /**
     * Merge the user properties with the defaults, taking care to preserve
     * the classes and styles of both.
     */
    IonIcon.prototype.mergeDefs = function (props) {
        var defs = _Conf.defs;
        var keys = keyArray(defs);
        // Give preference to specific color/size.
        if (props.color !== UNDEF) {
            this.expandColor(props, props.color);
            delete props.color;
        }
        if (props.size !== UNDEF) {
            this.expandSize(props, props.size);
            delete props.size;
        }
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            switch (k) {
                case 'className':
                    if (props.className === UNDEF) {
                        props.className = defs.className;
                    }
                    break;
                case 'style':
                    if (props.style === UNDEF) {
                        props.style = assign({}, defs.style);
                    }
                    break;
                case 'color':
                    this.expandSize(props, defs.color);
                    break;
                case 'size':
                    this.expandSize(props, defs.size);
                    break;
                default:
                    if (!props.hasOwnProperty(k)) {
                        props[k] = defs[k];
                    }
            }
        }
        // Add inconditionally the base class, if any.
        var classes = _Conf.baseClass;
        if (classes) {
            props.className = props.className ? classes + " " + props.className : classes;
        }
        return props;
    };
    IonIcon.prototype.render = function () {
        var opts = assign({}, this.props);
        var name = opts.name;
        delete opts.name;
        var renderIcon = _Conf.map[name];
        invariant(renderIcon, 'The icon "%s" is not registered.', name);
        var iconTitle = opts.title != UNDEF
            ? opts.title
            : (_Conf.titles[name] || this.titleify(name));
        delete opts.title;
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
        return renderIcon(opts, iconTitle, ios);
    };
    IonIcon.propTypes = {
        name: PropTypes.string.isRequired,
        color: PropTypes.string,
        size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        mode: PropTypes.oneOf(['ios', 'md']),
        title: PropTypes.string,
        innerRef: PropTypes.func,
        children: PropTypes.oneOf([undefined])
    };
    return IonIcon;
}(React.PureComponent));
exports.IonIcon = IonIcon;
