const fs = require('fs')
const getPackageVersion = require('@jsbits/get-package-version')
const { IONIC_SVG_PATH, ROOT_DIR } = require('./constants')

/**
 * Creates the /index.d.ts file with the package typings.
 *
 * @param {string[]} names
 * @param {[number, number]} count
 */
module.exports = function makeTypings (names, count) {
  const data = {
    'names': names.map((e) => `  | '${e}'`).join('\n'),
    'package-version': getPackageVersion(),
    'ionicon-version': getPackageVersion(IONIC_SVG_PATH),
    'dual-icons': count[0],
    'logo-icons': count[1],
    'date': new Date().toJSON().substr(0, 19) + 'Z',
  }
  const text = fs.readFileSync(`${__dirname}/index.d.ts.template`, 'utf8')
    .replace(/@\{([-a-z]+)\}/g, (match, name) => data[name] || match)

  fs.writeFileSync(`${ROOT_DIR}/index.d.ts`, text, 'utf8')
}
