const fs = require('fs')

const { ROOT_DIR, DIST_PATH, ICON_PATH } = require('./constants')

module.exports = {
  /**
   * Create folders in the current working directory
   * @param {string} dirPath
   * @example ensurePath('dist/icon')
   */
  ensurePath (dirPath) {
    const list = dirPath.split(/[/\\]/)
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
  },

  /**
   * Convert a string to camelCase
   * @param {string} name
   */
  camelize (name) {
    return name.toLowerCase().replace(/-+([a-z])/g, (_, c) => c.toUpperCase())
  },

  /**
   * Convert a string from 'kebab-case' to 'Title Case'
   * @param {string} str
   */
  kebabToTitle (str) {
    return str[0].toUpperCase() +
      str.substr(1).replace(/-+([a-z])/g, (_, c) => ` ${c.toUpperCase()}`)
  },

  /**
   * Format the date & time
   * @param {Date} [date]
   */
  formatDate (date) {
    return (date || new Date()).toJSON().substr(0, 16).replace('T', ' @ ')
  },

  /**
   * Write the content to a file into the "dist" folder
   * @param {string} name
   * @param {string} content
   */
  distWrite (name, content) {
    fs.writeFileSync(`${DIST_PATH}/${name}`, content, 'utf8')
  },

  /**
   * Write the content to a file into the "icons" folder
   * @param {string} name
   * @param {string} content
   */
  iconWrite (name, content) {
    fs.writeFileSync(`${ICON_PATH}/${name}`, content, 'utf8')
  },
}
