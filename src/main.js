import { createApp } from 'vue'
import App from './App.vue'
import './style/index.scss'
import router from './router';
import i18n from './language';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';
import Echarts from 'vue-echarts'
import * as echarts from 'echarts'
// import 'ant-design-vue/dist/antd.css'
import * as Icons from '@ant-design/icons-vue'



const app = createApp(App)
window.ipcRenderer = window.require('electron').ipcRenderer

for (const i in Icons) {   
  app.component(i, Icons[i])
}

app.component('e-charts',Echarts)
app.config.globalProperties.$echarts = echarts


app
  .use(i18n)
  .use(createPinia())
  .use(router)
  .use(Antd)

//   .use(VueGridLayout)
//   .use(ElementPlus, {locale: zhCn})
//   .component('SvgIcon', SvgIcon)
//   .directive('tooltip', tooltip)
//   .directive('autoSize', autoSize)
//   .directive('infinite-scroll', infiniteScroll)
  .mount('#app')

