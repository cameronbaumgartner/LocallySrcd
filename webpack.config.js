const path = require('path');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  mode: process.env.NODE_ENV,
  devServer: {
    publicPath: '/dist/',
    proxy: {
      '/': 'http://localhost:3000',
      '/signup/**': 'http://localhost:3000',
      '/login/**': 'http://localhost:3000',
      '/favorites/**': 'http://localhost:3000',
    },
    hot: true,
    headers: { 
      'Access-Control-Allow-Origin': '*' 
    },
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        enforce: 'pre',
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
        'source-map-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};
