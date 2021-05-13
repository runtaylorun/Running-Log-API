const fs = require('fs')
const util = require('util')
const { parseTcxFile } = require('../Lib/tcx')
const { parseGpxFile } = require('../Lib/gpx')
const { parseFitFile } = require('../Lib/fit')

const readFile = util.promisify(fs.readFile)

const getActivityFromTcx = async (file) => {
  const tcxString = await readFile(file.path, 'utf-8')

  const activity = await parseTcxFile(tcxString)

  return activity
}

const getActivityFromGpx = async (file) => {
  const gpxString = await readFile(file.path, 'utf-8')

  const activity = await parseGpxFile(gpxString)

  return activity
}

const getActivityFromFit = async (file) => {
  const fitBuffer = await readFile(file.path)

  const activity = await parseFitFile(fitBuffer)

  return activity
}

module.exports = {
  getActivityFromTcx,
  getActivityFromGpx,
  getActivityFromFit
}
