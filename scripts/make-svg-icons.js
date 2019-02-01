const fs = require('fs')
const getPackageVersion = require('@jsbits/get-package-version')
const { camelize, ensurePath, formatDate, ROOT_DIR } = require('./utils')

// Editar este PREFIX si ionic cambia el formato
const PREFIX  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
const REP_TAG = PREFIX.slice(0, -1) + ' {...props}>'
const IDX_IOS = 0
const IDX_MD  = 1

// Valid ionicon prefixes
const ICON_PREFIXES = ['ios', 'md', 'logo']

const IONICONS = `${ROOT_DIR}/node_modules/ionicons/dist/collection/icon/svg`
const DIST_DIR = `${ROOT_DIR}/bundles`
const ICON_DIR = `${ROOT_DIR}/icons`

ensurePath('bundles')
ensurePath('icons')

/**
 * @typedef {{ [k: string]: string | [string, string] }} SvgPathInfo
 * @typedef {(e: string) => boolean} FilterFn
 */

/**
 * Write the content to a file into the "dist" folder
 * @param {string} name
 * @param {string} content
 */
const distWrite = (name, content) =>
  fs.writeFileSync(`${DIST_DIR}/${name}`, content, 'utf8')

/**
 * Write the content to a file into the "icons" folder
 * @param {string} name
 * @param {string} content
 */
const iconWrite = (name, content) =>
  fs.writeFileSync(`${ICON_DIR}/${name}`, content, 'utf8')

/**
 * Take care of icons with multiple paths, must not close the `<svg>` tag
 * @param {string} name
 * @param {string | string[]} item
 */
const makeIcon = (name, item) => {
  const gTag = `<g className="ion-${name}">`

  if (typeof item === 'string') {
    return `\n${REP_TAG}\n${gTag}">\n${item}\n</g>`
  }

  const ios = item[IDX_IOS].replace(/>\s+</g, '')
  const md = item[IDX_MD].replace(/>\s+</g, '')

  if (~ios.indexOf('><') || ~md.indexOf('><')) {
    return `
  ${REP_TAG}{ios
  ? ${gTag}${ios}</g>
  : ${gTag}${md}</g>}`
  }

  return `
  ${REP_TAG}
  ${gTag}{ios
  ? ${ios}
  : ${md}
  }</g>`
}

/**
 * Make a JSX component
 * @param {string} name
 * @param {string | [string, string]} item
 */
const createTSX = (name, item) => {
  const temp = camelize(name)
  const type = `import { SVGIcon } from '..'
declare const ${temp}: SVGIcon
export default ${temp}
`
  iconWrite(`${name}.d.ts`, type)

  const parm = typeof item === 'string' ? '' : ', ios?: boolean'
  const icon = `import React = require('react')
export default (props: object${parm}) =>${makeIcon(name, item)}</svg>
`
  iconWrite(`${name}.tsx`, icon)
}

/**
 * Creates the typings.
 * @param {string[]} names
 * @param {[number, number]} count
 */
const makeTypings = (names, count) => {
  const data = {
    'names': names.map((e) => `  | '${e}'`).join('\n'),
    'package-version': getPackageVersion(),
    'ionicon-version': getPackageVersion(IONICONS),
    'dual-icons': count[0],
    'logo-icons': count[1],
    'date': formatDate(),
  }
  const text = fs.readFileSync(`${__dirname}/index.d.ts.template`, 'utf8')
    .replace(/@\{([-a-z]+)\}/g, (match, name) => data[name] || match)

  fs.writeFileSync(`${ROOT_DIR}/index.d.ts`, text, 'utf8')
}

/**
 * Creates an export of icons
 * @param {string} name
 * @param {string[]} icons
 * @param {FilterFn} filter
 */
const makeBundle = (name, icons, filter) => {
  icons = icons.filter(filter)

  const exp = icons.map((e) => `  '${e}': require('../icons/${e}').default,`).join('\n')
  const dts = icons.map((e) => `  '${e}': SVGIcon`).join('\n')

  const text = `"use strict";
/*eslint-disable*/
/**
 * Bundle of ${name} icons.
 * Date: ${formatDate()}
 */
Object.defineProperty(exports, "__esModule", { value: true })
exports.default = {
${exp}
}
`
  const type = `import { SVGIcon } from '..'
export default ${name}Bundle
declare const ${name}Bundle: {
${dts}
}
`
  distWrite(`${name}.d.ts`, type)
  distWrite(`${name}.js`, text)
}

/**
 * Reads and parses a SVG file from ionicons
 * @param {string} file
 */
const parseSvg = (file) => {
  const text = fs.readFileSync(file, 'utf8').trim()

  if (text.startsWith(PREFIX)) {
    return text.substr(PREFIX.length).replace(/<\/svg>\s*$/, '')
  }

  throw new Error(`The file ${file} does not have the required format.`)
}

/**
 * @param {SvgPathInfo} info
 * @param {[number, number]} count
 */
const writeFiles = (info, count) => {
  const names = Object.keys(info)

  names.sort().forEach((name) => {
    const item = info[name]

    // check if we have both formats
    if (Array.isArray(item) && !(item[0] && item[1])) {
      throw new Error(`"${name}" has no both formats!`)
    }

    // create component for this icon
    createTSX(name, item)
  })

  makeTypings(names, count)
  makeBundle('all', names, () => true)
  makeBundle('logos', names, (e) => e.startsWith('logo-'))
  makeBundle('generic', names, (e) => !e.startsWith('logo-'))
}

/**
 * Read the whole ionicons "svg" folder
 * @param {string} inDir
 */
const buildAll = (inDir) => {
  /** @type {SvgPathInfo} */
  const info  = {}
  const list  = fs.readdirSync(inDir, 'utf8')
  const count = [0, 0]
  inDir += '/'

  list.filter((file) => file.endsWith('.svg')).forEach((file) => {
    let name = file.slice(0, -4) // remove extension

    // First two are the 'ios' and 'md' prefixes
    const idx = ICON_PREFIXES.indexOf(name.split('-').shift())
    if (idx < 0) {
      console.log(`Ignored: ${file}`)
      return
    }

    file = inDir + file

    if (idx >= 2) {
      info[name] = parseSvg(file)
      count[1]++

    } else {
      name = name.substr(name.indexOf('-') + 1)
      // @ts-ignore
      const elem = info[name] || (info[name] = [])

      elem[idx] = parseSvg(file)
      count[0] += idx // 0 or 1
    }
  })

  console.log(`Readed ${count[0]} dual-mode icons, ${count[1]} logo icons.`)

  return writeFiles(info, count)
}

buildAll(IONICONS)
