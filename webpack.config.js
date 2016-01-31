module.exports = {
  entry: './src/index.jsx',
  output: {
    path: './dist/js',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.styl$/, loader: 'style-loader!css-loader?-url!stylus-loader' },
      {test: /\.css$/, loader: 'style!css' },
      {test: /\.jsx$/, loader: 'babel?presets[]=react,presets[]=es2015', exclude: /node_modules/}
    ]
  },
  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.styl']
  }
};
