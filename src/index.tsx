import React = require('react')
import PropTypes = require('prop-types')
import invariant = require('invariant')
import iconTitles = require('./bundles/icon-titles')
import { IconMap, IonIconDefs, IonIconProps, IonIconSizes, IconNames } from '..'

type Dict<T = any> = { [k: string]: T }

type IconProps = IonIconProps<IconNames>
type IonConf = {
  map: IconMap,
  defs: IonIconDefs,
  sizes: IonIconSizes,
  titles: Dict<string>,
  baseClass: string | undefined,
}

const UNDEF = undefined

/**
 * We are running in a Mac-like OS?
 */
const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator && navigator.platform)

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
const assign = function<T extends Dict, U extends Dict> (dest: T, src?: U) {
  dest = dest || {}
  if (src) {
    Object.keys(src).forEach((k) => {
      dest[k] = isObject(src[k])
        ? assign(isObject(dest[k]) ? dest[k] : {}, src[k])
        : src[k]
    })
  }
  return dest as (T & U)
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
  return obj as T
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
  titles: iconTitles,
  baseClass: UNDEF,
}

/**
 * Merge the given icons with the existent ones.
 *
 * To remove existing icons, set its value to `null` of `undefined`.
 *
 * @param {Object.<string,?Function>} iconMap Object with name-icon translations.
 */
export const addIcons = function (iconMap: IconMap) {
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
export const setDefaults = function (defaults: IonIconDefs) {
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
export const setSizes = function (sizes: IonIconSizes) {
  invariant(isObject(sizes), 'The sizes must be an object.')
  pack(assign(_Conf.sizes, sizes))
}

/**
 * Add icon titles to the icon-name -> title transtations.
 *
 * @param {Object.<string,?string>} sizes Object with {icon-name: title} props.
 */
export const setTitles = function (iconTitles: Dict<string | null>) {
  invariant(isObject(iconTitles), 'The icon titles must be an object.')
  pack(assign(_Conf.titles, iconTitles))
}

/**
 * Class or space separated classes to add to the `className` property
 * of all the icons, in addition to the default or specific one.
 *
 * @param {string} class or space separated list of classes.
 */
export const setBaseClass = function (classes: string) {
  _Conf.baseClass = classes && classAsStr(classes).trim() || UNDEF
}

/**
 * Renders a SVG Ionicon
 */
export class IonIcon extends React.PureComponent<IconProps> {

  static propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mode: PropTypes.oneOf(['ios', 'md']),
    title: PropTypes.string,
    innerRef: PropTypes.func,
    children: PropTypes.oneOf([undefined])
  }

  titleify(name: string) {
    const title = name[0].toUpperCase() +
      name.substr(1).replace(/-+([a-z])/g, (_, c) => ` ${c.toUpperCase()}`)

    return (_Conf.titles[name] = title)
  }

  expandColor(opts: Dict, color?: string) {
    if (opts.fill === UNDEF) {
      opts.fill = color
    }
    if (opts.stroke === UNDEF) {
      opts.stroke = color
    }
  }

  expandSize(opts: Dict, size?: string | number) {
    if (typeof size === 'string') {
      size = _Conf.sizes[size] || size
    }
    if (opts.width === UNDEF) {
      opts.width = size
    }
    if (opts.height === UNDEF) {
      opts.height = size
    }
  }

  /**
   * Merge the user properties with the defaults, taking care to preserve
   * the classes and styles of both.
   */
  mergeDefs(props: IconProps) {
    const defs = _Conf.defs
    const keys = keyArray(defs)

    // Give preference to specific color/size.
    if (props.color !== UNDEF) {
      this.expandColor(props, props.color)
      delete props.color
    }
    if (props.size !== UNDEF) {
      this.expandSize(props, props.size)
      delete props.size
    }

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]

      switch (k) {
        case 'className':
          if (props.className === UNDEF) {
            props.className = defs.className
          }
          break

        case 'style':
          if (props.style === UNDEF) {
            props.style = assign({}, defs.style)
          }
          break

        case 'color':
          this.expandSize(props, defs.color)
          break

        case 'size':
          this.expandSize(props, defs.size)
          break

        default:
          if (props[k] === UNDEF) {
            props[k] = defs[k]
          }
      }
    }

    // Add inconditionally the base class, if any.
    const classes = _Conf.baseClass
    if (classes) {
      props.className = props.className ? `${classes} ${props.className}` : classes
    }

    return props
  }

  render() {
    const opts = assign({}, this.props) as IconProps
    const name = opts.name
    delete opts.name

    const renderIcon = _Conf.map[name]!
    invariant(renderIcon, 'The icon "%s" is not registered.', name)

    const iconTitle = opts.title != UNDEF
      ? opts.title
      : (_Conf.titles[name] || this.titleify(name))
    delete opts.title

    const innerRef = opts.innerRef
    if (innerRef !== null) {
      delete opts.innerRef
      ;(opts as any).ref = innerRef
    }

    // name & innerRef are out, merge with defaults before color & size
    this.mergeDefs(opts)

    // Guess whether the "iOS" style should be used with double-style icons.
    let ios = isMacLike
    if (opts.mode) {
      ios = opts.mode === 'ios'
      delete opts.mode
    }

    return renderIcon(opts, iconTitle, ios)
  }
}
