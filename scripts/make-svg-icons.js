const fs = require('fs')
const { camelize, ensurePath, formatDate, ROOT_DIR } = require('./utils')

// Editar este PREFIX si ionic cambia el formato
const PREFIX  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
const REP_TAG = PREFIX.slice(0, -1) + ' {...props}>'
const IDX_IOS = 0
const IDX_MD  = 1

const IONICONS = `${ROOT_DIR}/node_modules/ionicons/dist/collection/icon/svg`
const DIST_DIR = `${ROOT_DIR}/bundle`
const ICON_DIR = `${ROOT_DIR}/icon`

ensurePath('bundle')
ensurePath('icon')

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
 * Write the content to a file into the "icon" folder
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
 */
const makeTypings = (names) => {
  const text = fs.readFileSync(`${__dirname}/index.d.ts.tmpl`, 'utf8')
    .replace('@{date}', formatDate())
    .replace('@{names}', names.map((e) => `  | '${e}'`).join('\n'))

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

  const exp = icons.map((e) => `  '${e}': require('../icon/${e}').default,`).join('\n')
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
 * Read the whole ionicons "svg" folder
 * @param {string} inDir
 */
const readTags = (inDir) => {
  /** @type {SvgPathInfo} */
  const info = {}
  const list = fs.readdirSync(inDir, 'utf8')
  let count = 0
  inDir += '/'
  console.log('Reading source files...')

  list.forEach((file) => {
    if (!file.endsWith('.svg')) {
      return
    }

    let name = file.slice(0, -4) // remove extension
    file = inDir + file
    count++

    if (name.startsWith('logo-')) {
      info[name] = parseSvg(file)

    } else {
      const idx = name.startsWith('ios-')
        ? IDX_IOS : name.startsWith('md-') ? IDX_MD : -1

      if (idx === -1) {
        console.log(`Ignored: ${file.split(/[\/\\]/).pop()}`)
        count--

      } else {
        name = name.substr(name.indexOf('-') + 1)
        // @ts-ignore
        const elem = info[name] || (info[name] = [])
        elem[idx] = parseSvg(file)
      }
    }
  })

  console.log(`${count} svg files readed.`)
  return info
}

/**
 * @param {SvgPathInfo} info
 */
const writeFiles = (info) => {
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

  makeTypings(names)
  makeBundle('all', names, () => true)
  makeBundle('logos', names, (e) => e.startsWith('logo-'))
  makeBundle('generic', names, (e) => !e.startsWith('logo-'))
}

const tags = readTags(IONICONS)
writeFiles(tags)
