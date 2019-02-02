const makeTypings = require('./make-typings')
const readSvgFiles = require('./read-svg-files')

const { info, count } = readSvgFiles()

makeTypings(Object.keys(info).sort(), count)
