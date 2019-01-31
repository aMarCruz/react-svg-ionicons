import React = require('react')
import PropTypes = require('prop-types')
import invariant = require('invariant')
import deepClone = require('@jsbits/deep-clone')
import { IconMap, IonIconDefs, IonIconSizes, IonIconProps } from '..'

type Dict<T = any> = { [k: string]: T }
type Merge<T> = { [K in keyof T]: T[K] }

type IonConf = {
  map: IconMap,
  def: IonIconDefs,
  sz: Dict<string>,
}

/*
  https://developer.mozilla.org/en-US/docs/Web/API/NavigatorID/platform
*/
const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)

const keyArray = Object.keys as <T>(obj: T) => (keyof T)[]

const isObject = function (obj: any) {
  return !!obj && typeof obj === 'object'
}

/**
 * Simple Object.assign-like function
 */
const assign = function<T extends Dict, U extends Dict> (dest: T, src: U) {
  if (src) {
    Object.keys(src).forEach((k) => {
      dest[k] = src[k]
    })
  }
  return dest as Merge<T & U>
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
}

/**
 * Adds the given icons, without remove the existents.
 */
export const addIcons = function (iconMap: IconMap) {
  invariant(isObject(iconMap), 'The iconMap must be an object.')
  assign(_Conf.map, iconMap)
}

/**
 * Merge the given values with the current defaults.
 * Pass `null` to remove the defaults.
 */
export const setDefaults = function (defaults: IonIconDefs) {
  if (defaults === null) {
    _Conf.def = {}
  } else {
    invariant(isObject(defaults), 'The defaults must be an object.')
    const defs = assign(_Conf.def, deepClone(defaults))

    // check and format class names, if any
    if (defs.className) {
      defs.className = classAsStr(defs.className).trim()
    }

    // cleanup empty properties
    if (!defs.className) {
      delete defs.className
    }
    keyArray(defs).forEach((k) => {
      if (defs[k] == null) {
        delete defs[k]
      }
    })
  }
}

/**
 * Reset the table of named sizes. You can extend this.
 */
export const setSizes = function (sizes: Partial<IonIconSizes>) {
  invariant(isObject(sizes), 'The sizes must be an object.')
  assign(_Conf.sz, sizes)
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

  /**
   * Merge the user properties with the defaults, taking care to preserve
   * the classes and styles of both.
   */
  mergeDefs(props: IonIconProps) {
    const defs = _Conf.def
    const keys = keyArray(defs)

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

        default:
          if (!props.hasOwnProperty(k)) {
            props[k] = defs[k]
          }
      }
    }

    return props
  }

  render() {
    const opts = deepClone(this.props) as Merge<IonIconProps>
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

    const color = opts.color
    if (color != null) {
      delete opts.color
      opts.fill = opts.stroke = color
    }

    const size = opts.size
    if (size != null) {
      delete opts.size
      opts.width = opts.height = typeof size === 'string' && _Conf.sz[size] || size
    }

    // Guess whether the "iOS" style should be used with double-style icons.
    let ios = isMacLike
    if (opts.iconType) {
      ios = opts.iconType === 'ios'
      delete opts.iconType
    }

    return renderIcon(opts, ios)
  }
}
