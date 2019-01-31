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
 * Ensure className as string
 */
const classAsStr = function (klass: string | string[]) {
  if (typeof klass === 'string') {
    return klass
  }
  invariant(Array.isArray(klass), 'className must be a string or array.')
  return klass.filter(Boolean).join(' ')
}

/*
  Internal configuration
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

    if (defs.className) {
      defs.className = classAsStr(defs.className)
    }
    delete (defs as Dict).innerRef
    delete (defs as Dict).name
  }
}

/**
 * Reset the table of named sizes.
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

  mergeProps(props: IonIconProps) {
    const dest = deepClone(_Conf.def)

    let classes = dest.className || ''
    if (props.className) {
      classes += ` ${classAsStr(props.className)}`
    }

    let style = dest.style
    if (props.style) {
      style = assign(style || {}, props.style)
    }

    assign(dest, props)

    if (classes) {
      dest.className = classes.trim()
    }
    if (style) {
      dest.style = style
    }

    return dest as IonIconProps
  }

  render() {
    const opts = this.mergeProps(this.props)
    const name = opts.name
    delete opts.name

    const renderIcon = _Conf.map[name]!
    invariant(renderIcon, `The icon "${name}" is not registered.`)

    const innerRef = opts.innerRef
    if (innerRef !== null) {
      delete opts.innerRef
      opts.ref = innerRef as any
    }

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
