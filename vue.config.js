const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './', 
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "xxxxxx", // 程序的包ID
        "productName": "测试",
        "copyright": "Copyright © 2023dat",
        "directories": {
          "output": "./dist"//输出文件路径
        },
        "win": {//win相关配置s
          // "icon": "./src/assets/logo.png",//图标，这里图标需要至少256*256，否则打包会报错
          "target": [
            {
              "target": "nsis",//利用nsis制作安装程序
              "arch": [
                "x64",//64位
                "ia32"//32位
              ]
            }
          ]
        },
        "nsis": {
          "oneClick": false, // 是否一键安装
          "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          "allowToChangeInstallationDirectory": true, // 允许修改安装目录
          "installerIcon": "./public/logo.ico",// 安装图标
          "uninstallerIcon": "./public/logo.ico",//卸载图标
          "installerHeaderIcon": "./public/logo.ico", // 安装时头部图标
          "createDesktopShortcut": true, // 创建桌面图标
          "createStartMenuShortcut": true,// 创建开始菜单图标
          "shortcutName": "taskmanage", // 图标名称
      },
      },
      preload: "./src/preload.js"
    }
  }
})
