const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 那些文件自动注入 绝对路径
      // 需要使用path.join拼接路径
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  },
  chainWebpack: config => {
    // 图片懒加载
    config.module
      .rule('images')
      .set('parser', {
        dataUrlCondition: {
          maxSize: 10 * 1024 // 4KiB
        }
      })
    // 这个是给webpack-dev-server开启可IP和域名访问权限,
    // vue-cli不允许->域名:端口访问
    // 域名解析成线上的了
  },
  devServer: {
    allowedHosts: 'all'
  },
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  }
})
