var path = require('path');
var fs = require('fs');

var dist   = path.join(__dirname, 'dist'),
    src = path.join(__dirname, 'src');

var nodeModules = {
  './config': 'require("./config")'
};

fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod
  });

module.exports = {
  context: src,
  entry: './index.js',
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: nodeModules,
  output: {
    path:     dist,
    filename: 'server.js'
  },

  resolve: {
    extensions: ['.js']
  }
};
