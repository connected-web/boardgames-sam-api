const { log, info, warn, error } = console
let logs = []

function capture () {
  console.log = (...args) => logs.push(['log', ...args])
  console.info = (...args) => logs.push(['info', ...args])
  console.warn = (...args) => logs.push(['warn', ...args])
  console.error = (...args) => logs.push(['error', ...args])
}

function reset () {
  console.log = log
  console.info = info
  console.warn = warn
  console.error = error
  logs = []
}

function get () {
  return logs
}

module.exports = {
  capture,
  reset,
  get
}
