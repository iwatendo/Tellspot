module.exports = {
  entry: {
    boot: './src/Page/Boot/Script.ts',
    errorpage: './src/Page/ErrorPage/Script.ts',
    homeinstance: './src/Page/HomeInstance/Script.ts',
    castinstance: './src/Page/CastInstance/Script.ts',
    castvisitor: './src/Page/CastVisitor/Script.ts',
    qrcode: './src/Page/QrCode/Script.ts',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name]/bundle.js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'ts-loader', }
        ]
      }
    ]
  },
  performance: {
    hints: false
  }
};
