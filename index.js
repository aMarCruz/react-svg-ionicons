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
/*
  https://developer.mozilla.org/en-US/docs/Web/API/NavigatorID/platform
*/
var isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
var isObject = function (obj) {
    return !!obj && typeof obj === 'object';
};
/**
 * Simple Object.assign-like function
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
 * Ensure className as string
 */
var classAsStr = function (klass) {
    if (typeof klass === 'string') {
        return klass;
    }
    invariant(Array.isArray(klass), 'className must be a string or array.');
    return klass.filter(Boolean).join(' ');
};
/*
  Internal configuration
*/
var _Conf = {
    map: {},
    def: {
        display: 'inline-block',
        fill: 'currentColor',
        stroke: 'currentColor',
        size: 'regular',
    },
    sz: {
        small: '0.75em',
        regular: '1em',
        large: '1.25em',
        larger: '2em',
        largest: '3em',
    },
};
/**
 * Adds the given icons, without remove the existents.
 */
exports.addIcons = function (iconMap) {
    invariant(isObject(iconMap), 'The iconMap must be an object.');
    assign(_Conf.map, iconMap);
};
/**
 * Merge the given values with the current defaults.
 * Pass `null` to remove the defaults.
 */
exports.setDefaults = function (defaults) {
    if (defaults === null) {
        _Conf.def = {};
    }
    else {
        invariant(isObject(defaults), 'The defaults must be an object.');
        var defs = assign(_Conf.def, deepClone(defaults));
        if (defs.className) {
            defs.className = classAsStr(defs.className);
        }
        delete defs.innerRef;
        delete defs.name;
    }
};
/**
 * Reset the table of named sizes.
 */
exports.setSizes = function (sizes) {
    invariant(isObject(sizes), 'The sizes must be an object.');
    assign(_Conf.sz, sizes);
};
/**
 * Renders a SVG Ionicon
 */
var IonIcon = /** @class */ (function (_super) {
    __extends(IonIcon, _super);
    function IonIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Determina si se debe usar el icono "ios".
     *
     * Si el icono es "logo" devuelve `true`, pero en este caso no importa
     * el valor devuelto, los iconos "logo" lo ignoran.
     */
    IonIcon.prototype.ios = function (name, type) {
        return name.lastIndexOf('logo-', 0) === 0 || type === 'ios' || isMacLike;
    };
    IonIcon.prototype.mergeProps = function (props) {
        var dest = deepClone(_Conf.def);
        var classes = dest.className || '';
        if (props.className) {
            classes += " " + classAsStr(props.className);
        }
        var style = dest.style;
        if (props.style) {
            style = assign(style || {}, props.style);
        }
        assign(dest, props);
        if (classes) {
            dest.className = classes.trim();
        }
        if (style) {
            dest.style = style;
        }
        return dest;
    };
    IonIcon.prototype.render = function () {
        var opts = this.mergeProps(this.props);
        var name = opts.name;
        delete opts.name;
        var renderIcon = _Conf.map[name];
        invariant(renderIcon, "The icon \"" + name + "\" is not registered.");
        var ios = this.ios(name, opts.iconType);
        delete opts.iconType;
        var innerRef = opts.innerRef;
        if (innerRef !== null) {
            delete opts.innerRef;
            opts.ref = innerRef;
        }
        var color = opts.color;
        if (color != null) {
            delete opts.color;
            opts.fill = opts.stroke = color;
        }
        var size = opts.size;
        if (size != null) {
            delete opts.size;
            opts.width = opts.height = typeof size === 'string' && _Conf.sz[size] || size;
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
