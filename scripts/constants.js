const path = require('path')

const ROOT_DIR = path.dirname(__dirname)
const DIST_FOLDER = 'bundles'
const ICON_FOLDER = 'icons'

module.exports = {

  ROOT_DIR,
  DIST_FOLDER,
  ICON_FOLDER,

  DIST_PATH: `${ROOT_DIR}/${DIST_FOLDER}`,
  ICON_PATH: `${ROOT_DIR}/${ICON_FOLDER}`,
  IONIC_SVG_PATH: `${ROOT_DIR}/node_modules/ionicons/dist/collection/icon/svg`,

  /**
   * Edit this prefix if ionic changes the format
   */
  PREFIX: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">',

  IDX_IOS: 0,
  IDX_MD: 1,

  /**
   * Valid ionicon prefixes. readSvgFiles depends on this order.
   * @type {['ios', 'md', 'logo']}
   */
  ICON_PREFIXES: ['ios', 'md', 'logo'],
}
