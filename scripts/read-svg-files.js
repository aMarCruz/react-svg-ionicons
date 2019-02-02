const fs = require('fs')

// Valid ionicon prefixes
const { ICON_PREFIXES, IONIC_SVG_PATH, PREFIX } = require('./constants')

/**
 * Reads and parses a SVG file from ionicons
 * @param {string} file
 */
const parseSvg = (file) => {
  const text = fs.readFileSync(file, 'utf8').trim()

  if (text.startsWith(PREFIX)) {
    return text.substr(PREFIX.length).replace(/<\/svg>\s*$/, '')
  }

  throw new Error(`${file} does not have the required format.`)
}

/**
 * Read the whole ionicons "svg" folder
 * @param {string} inDir
 */
module.exports = function readSvgFiles () {
  /** @type {Object.<string,string>} */
  const info  = {}
  const list  = fs.readdirSync(IONIC_SVG_PATH, 'utf8')
  const count = [0, 0]
  const inDir = IONIC_SVG_PATH + '/'

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

  return { info, count }
}
