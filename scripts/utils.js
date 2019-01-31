const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.dirname(__dirname)

/**
 * Create folders in the current working directory
 * @param {string} dirPath
 * @example ensurePath('dist/icon')
 */
const ensurePath = (dirPath) => {
  const list = dirPath.split(/[\/\\]/)
  let dir = ROOT_DIR

  while (list.length) {
    const folder = list.shift()

    if (folder) {
      dir += '/' + folder

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
    }
  }
}

/**
 * Convert a string to camelCase
 * @param {string} name
 */
const camelize = (name) => {
  return name.toLowerCase().replace(/-+([a-z])/g, (_, c) => c.toUpperCase())
}

/**
 * Format the date & time
 * @param {Date} [date]
 */
const formatDate = (date) =>
  (date || new Date()).toJSON().substr(0, 16).replace('T', ' @ ')

module.exports = {
  ROOT_DIR,
  camelize,
  formatDate,
  ensurePath,
}
