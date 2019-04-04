const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const address = require('address') //获取主机地址

// 转换为绝对路径
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: resolve('dist'),
    filename: 'js/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack4',
      template: './public/index.html', //以当前目录下的public/index.html文件为模板
      filename: 'index.html', //输出到dist里面的文件名
      minify: {
        removeComments: false, // 删除注释
        collapseWhitespace: false, // 删除空格
      },
    }),

    new CleanWebpackPlugin(),

    // 热更新，热更新不是刷新
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/index.css',
    }),
  ],
  devServer: {
    inline: true, //打包后加入一个websocket客户端
    contentBase: resolve('dist'), //开发服务运行时的文件根目录
    host: address.ip(), // 默认是'localhost',
    port: 1234,
    open: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          // 抽离自己写的公共代码
          chunks: 'initial',
          name: 'common', // 打包后的文件名，任意命名
          minChunks: 2, //最小引用2次
          minSize: 0, // 只要超出0字节就生成一个新包
        },
        vendor: {
          // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10,
        },
        styles: {
          name: 'styles',
          test: /\.scss|css$/,
          chunks: 'all', // merge all the css chunk to one file
          enforce: true,
        },
      },
    },
  },
  watch: true, //是否开启文件监听，默认false
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: ['dist', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
        },
        include: resolve('src'),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          //把scss编译到css文件里
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader', //注意顺序
          {
            loader: 'postcss-loader',
            options: {
              // 如果没有options这个选项将会报错 No PostCSS Config found
              plugins: loader => [
                require('autoprefixer')(), //CSS浏览器兼容
              ],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5 * 1024,
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
            },
          },
        ],
        //exclude: /node_modules/,  //不去检查node_modules里的内容，那里的js太多了，会非常慢
        include: resolve('src'), //直接规定查找的范围
      },
    ],
  },
}
