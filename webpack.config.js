const path = require('path')

module.exports = {
  entry: {
    client: path.join(process.cwd(), 'src', 'client', 'index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(process.cwd(), 'public')
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'babel-loader'
      }
    ]
  }
}
