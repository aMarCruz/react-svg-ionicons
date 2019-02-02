const { distWrite } = require('./utils')
const { kebabToTitle } = require('./utils')

const fixes = {
  'fastforward': 'Fast fordward',
  'qr-scanner': 'QR Scanner',
  'tv': 'TV',
  'logo-codepen': 'Logo CodePen',
  'logo-css3': 'Logo CSS3',
  'logo-designernews': 'Logo Designer News',
  'logo-freebsd-devil': 'Logo FreeBSD Devil',
  'logo-googleplus': 'Logo Google+',
  'logo-hackernews': 'Logo Hacker News',
  'logo-github': 'Logo GitHub',
  'logo-html5': 'Logo HTML5',
  'logo-javascript': 'Logo JavaScript',
  'logo-linkedin': 'Logo LinkedIn',
  'logo-nodejs': 'Logo NodeJS',
  'logo-npm': 'Logo npm',
  'logo-playstation': 'Logo PlayStation',
  'logo-rss': 'Logo RSS',
  'logo-usd': 'Logo USD',
  'logo-youtube': 'Logo YouTube',
  'wifi': 'WiFi',
}

/**
 * @param {string} name
 */
const toTitle = (name) => `  '${name}': '${fixes[name] || kebabToTitle(name)}',`

/**
 * Creates the /index.d.ts file with the package typings.
 *
 * @param {string[]} names
 * @param {[number, number]} count
 */
module.exports = function makeTitles (names) {

  const text = `/**
 * Default icon-name -> title translations.
 * @type {{[k: string]: string}}
 */
module.exports = {
${names.map(toTitle).join('\n')}
}
`

  distWrite('icon-titles.js', text)
}
