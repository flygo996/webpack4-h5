# 作者
auth: laifeipeng
date: 2018.12.05

# 依赖
```bash
npm i -D
webpack webpack-cli #最基本的webpack4
html-webpack-plugin #自动生成html页面
clean-webpack-plugin #删除dist文件夹
webpack-dev-server #开发服务器-自动刷新、热更新、本地服务器等功能
style-loader css-loader #style、css的loader
url-loader file-loader #file-loader解析地址，url-loader把图片地址解析成base64
mini-css-extract-plugin  #把css抽离插件适用于webpack4.3以上，低版本使用extract-text-webpack-plugin
node-sass sass-loader postcss-loader autoprefixer #使用postcss和sass
babel-loader babel-core babel-preset-env babel-polyfill #es6+转es5相关
# html-loader #html文件直接引用img等资源，打包后路径不对，用该插件就可以解决！
address #获取本机的ip地址

# 写一起如下：
npm i -D webpack webpack-cli html-webpack-plugin clean-webpack-plugin webpack-dev-server style-loader css-loader url-loader file-loader mini-css-extract-plugin  node-sass sass-loader postcss-loader autoprefixer babel-loader babel-core babel-preset-env babel-polyfill address
```

# 报错解决
报错：DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
原因：extract-text-webpack-plugin 不支持webpack4
解决：使用extract-text-webpack-plugin@next版本。
`yarn add extract-text-webpack-plugin@next -D`
```
可以发现版本号由"^3.0.2"变成了"^4.0.0-beta.0"


# 报错解决
报错：No PostCSS Config found in: C:\Users\Administrator\Desktop\我的项目\webpack4demo\scss
解决：在/\.css$/的loader配置中的postscc-loader中使用如下：
{
  loader: "postcss-loader",
  options: {// 如果没有options这个选项将会报错 No PostCSS Cfound
    plugins: (loader) => [
      require('autoprefixer')(), //CSS浏览器兼容
    ]
  }
}

# bug处理
index.html文件里img直接引用的文件，运行后不能直接显示，
<img src="./src/img/girl.jpg" alt="girl">
在浏览器里改成下面的就可以显示
<img src="./img/girl.a4ac2b97.jpg" alt="girl">
差别在：
1、路径不同了，不再有src了
2、文件名不同了，多了hash
解决：html-loader
```javascript
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'img:data-src', 'audio:src', 'video:src'],
            minimize: true
          }
        }],
        include: /\.html$/,// 所有的html文件
        exclude: /node_modules/
      }
```

# 后续优化，参考《webpack》
