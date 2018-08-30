const tracer = require('tracer')
const colors = require('colors')

module.exports = tracer.colorConsole(
  {
    level: (process.env.LOG_LEVEL === 'info') ? 'info' : 'error',
    format: [
      '({{timestamp}})'.italic.blue + ' <{{title}}>'.bold + ' {{message}}' + ''.white, // default format
      {
        error: '({{timestamp}})'.italic.blue + ' <{{title}}>'.red.bold + ' {{message}}' + ''.white + ' (in {{file}}:{{line}})'.italic + '\nCall Stack:\n{{stack}}', // error format,
      }
    ],
    filters: [
      // the last item can be custom filter. here is "warn" and "error" filter
      {
        info: colors.blue,
        warn: colors.yellow,
        error: colors.red
      }
    ],
    dateformat: 'yyyy-mm-dd HH:MM:ss',
    preprocess: (data) => {
      data.title = data.title.toUpperCase()
    }
  }
)
