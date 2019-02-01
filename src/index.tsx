import React = require('react')
import PropTypes = require('prop-types')
import invariant = require('invariant')
import { IconMap, IonIconDefs, IonIconProps, IonIconSizes, Nullable } from '..'

type Dict<T = any> = { [k: string]: T }
type Merge<T> = { [K in keyof T]: T[K] }

type IonConf = {
  map: IconMap,
  defs: IonIconDefs,
  sizes: IonIconSizes,
}

const UNDEF = undefined

/**
 * We are running in a Mac-like OS?
 */
const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)

/**
 * Shorthand to `Object.keys` that returns a more-sense type.
 */
const keyArray = Object.keys as <T>(obj: T) => (keyof T)[]

/**
 * Check if `obj` is a non-falsy object.
 */
const isObject = (obj: any) => !!obj && typeof obj === 'object'

/**
 * Simple `Object.assign`-like function
 */
const assign = function<T extends Dict, U extends Dict> (dest: T, src: U) {
  dest = dest || {}
  if (src) {
    Object.keys(src).forEach((k) => {
      dest[k] = isObject(src[k])
        ? assign(isObject(dest[k]) ? dest[k] : {}, src[k])
        : src[k]
    })
  }
  return dest as Merge<T & U>
}

/**
 * Deep remotion of `null` and `undefined` values of an object.
 */
const pack = <T extends Dict> (obj: T) => {
  keyArray(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k]
    } else if (typeof obj[k] === 'object') {
      obj[k] = pack(obj[k])
    }
  })
  return obj
}

/**
 * Ensure to get a non-empty `className` as an string.
 */
const classAsStr = function (klass: string | string[]) {
  if (typeof klass === 'string') {
    return klass
  }
  invariant(Array.isArray(klass), 'className must be a string or array.')
  return klass.filter(Boolean).join(' ')
}

/**
 * Internal configuration object.
 */
const _Conf: IonConf = {
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
}

/**
 * Merge the given icons with the existent ones.
 *
 * To remove existing icons, set its value to `null` of `undefined`.
 *
 * @param {Object.<string,?Function>} iconMap Object with name-icon translations.
 */
export const addIcons = function (iconMap: Nullable<IconMap>) {
  invariant(isObject(iconMap), 'The iconMap must be an object.')
  pack(assign(_Conf.map, iconMap))
}

/**
 * Merge the given values with the current defaults.
 *
 * Values with `null` or `undefined` will remove the existing property.
 *
 * @param {Object.<string,*>} defaults Properties to merge.
 */
export const setDefaults = function (defaults: Nullable<IonIconDefs>) {
  invariant(isObject(defaults), 'The defaults must be an object.')
  const defs = assign(_Conf.defs, defaults)

  // check and format class names, if any
  if (defs.className) {
    defs.className = classAsStr(defs.className).trim() || UNDEF
  }

  // cleanup empty properties
  pack(defs)
}

/**
 * Reset the table of named sizes.
 *
 * You can use custom names here, to remove the prdefined names, 'small'
 * and 'large', set them to `null` or `undefined`.
 *
 * @param {Object.<string,?string|number>} sizes Object with a sizes map.
 */
export const setSizes = function (sizes: Nullable<IonIconSizes>) {
  invariant(isObject(sizes), 'The sizes must be an object.')
  pack(assign(_Conf.sizes, sizes))
}

const expandFrom = {
  color: ['fill', 'stroke'],
  size: ['width', 'height'],
}

/**
 * Renders a SVG Ionicon
 */
export class IonIcon extends React.PureComponent<IonIconProps> {

  static propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    iconType: PropTypes.oneOf(['ios', 'md']),
    innerRef: PropTypes.func,
  }

  expandAttr(opts: Dict, name: keyof typeof expandFrom, value: any) {
    const [p1, p2] = expandFrom[name]

    if (opts[p1] === UNDEF) {
      opts[p1] = value
    }
    if (opts[p2] === UNDEF) {
      opts[p2] = value
    }
  }

  /**
   * Merge the user properties with the defaults, taking care to preserve
   * the classes and styles of both.
   */
  mergeDefs(props: IonIconProps) {
    const defs = _Conf.defs
    const keys = keyArray(defs)

    // Example of precedence [fill, stroke] = troke:
    // fill = user.fill -> defs.fill -> user.color -> defs.color
    // even if any of them is `null`, it will overrite.
    debugger

    if (props.color !== UNDEF) {
      this.expandAttr(props, 'color', props.color)
    }
    if (props.size !== UNDEF) {
      this.expandAttr(props, 'size', props.size)
    }

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]

      switch (k) {
        case 'className':
          props.className = props.className
            ? `${classAsStr(props.className)} ${defs.className}`
            : defs.className
          break

        case 'style':
          props.style = props.style
            ? assign(assign({}, props.style), defs.style!)
            : defs.style
          break

        case 'color':
        case 'size':
          this.expandAttr(props, k, defs[k])
          break

        default:
          if (!props.hasOwnProperty(k)) {
            props[k] = defs[k]
          }
      }
    }

    return props
  }

  render() {
    const opts = assign({}, this.props) as Merge<IonIconProps>
    const name = opts.name
    delete opts.name

    const renderIcon = _Conf.map[name]!
    invariant(renderIcon, `The icon "${name}" is not registered.`)

    const innerRef = opts.innerRef
    if (innerRef !== null) {
      delete opts.innerRef
      opts.ref = innerRef as any
    }

    // name & innerRef are out, merge with defaults before color & size
    this.mergeDefs(opts)

    // Guess whether the "iOS" style should be used with double-style icons.
    let ios = isMacLike
    if (opts.mode) {
      ios = opts.mode === 'ios'
      delete opts.mode
    }

    return renderIcon(opts, ios)
  }
}
