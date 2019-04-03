const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const address = require('address') //获取主机地址
// 转换为绝对路径
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: './src/index.js', //入口文件，若不配置webpack4将自动查找src目录下的index.js文件
  output: {
    filename: '[name].bundle.js', //输出文件名，[name]表示入口文件js名
    path: resolve('dist'), //输出文件路径
    // publicPath: './' //这里要放的是静态资源CDN的地址(一般只在生产环境下配置)
  },
  module: {
    // 处理对应模块
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
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'env'],
          },
        },
        include: resolve('src'),
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                // 如果没有options这个选项将会报错 No PostCSS Config found
                plugins: loader => [
                  require('autoprefixer')(), //CSS浏览器兼容
                ],
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        }),
        include: resolve('src'),
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'img/', //输出到img文件夹
              limit: 10000, // 10KB以下使用 base64
              name: '[name].[hash:8].[ext]',
            },
          },
        ],
        include: [resolve('src'), /\.html$/], //这里要加上html文件
        exclude: /node_modules/,
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'img/', //输出到img文件夹
              limit: 10000, // 10KB以下使用 base64
              name: '[name].[hash:8].[ext]',
            },
          },
        ],
        include: [resolve('src'), /\.html$/], //这里要加上html文件
        exclude: /node_modules/,
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'img/', //输出到img文件夹
              limit: 10000, // 10KB以下使用 base64
              name: '[name].[hash:8].[ext]',
            },
          },
        ],
        include: [resolve('src'), /\.html$/], //这里要加上html文件
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'img:data-src', 'audio:src', 'video:src'],
              minimize: true,
            },
          },
        ],
        include: /\.html$/, // 所有的html文件
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    //配置此静态文件服务器，可以用来预览打包后项目
    inline: true, //打包后加入一个websocket客户端
    hot: true, //热加载
    contentBase: resolve('dist'), //开发服务运行时的文件根目录
    host: address.ip(), //主机地址，默认为'localhost'
    port: 9527, //端口号
    open: true, //自动打开浏览器
    compress: true, //开发服务器是否启动gzip等压缩
  },
  plugins: [
    // 对应的插件
    new HtmlWebpackPlugin({
      //配置
      template: './index.html', //以当前目录下的index.html文件为模板
      filename: 'index.html', //输出到dist里面的文件名
    }),
    new CleanWebpackPlugin(['dist']), //传入数组,指定要删除的目录
    // 热更新，热更新不是刷新
    new webpack.HotModuleReplacementPlugin(),
    //打包css生成另外的文件夹
    new ExtractTextPlugin({
      filename: '[name].[hash:8].css',
      disable: false,
      allChunks: false,
    }),
  ],
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
      },
    },
  },
  watch: true, //是否开启文件监听，默认false
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: ['dist', 'node_modules'],
  },
}
