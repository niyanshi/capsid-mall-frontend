import { createApp } from 'vue';
import App from './App.vue';
import Router from './router';
import { pinia } from './stores';
import i18n from './i18n';
import './assets/styles/font-face.css';
import 'ant-design-vue/dist/antd.css';
import { message } from 'ant-design-vue';

message.config({
  top: '128px',
});

const app = createApp(App);
// 国际化配置
app.use(i18n);
// 配置路由
app.use(Router);
// 配置全局状态管组件
app.use(pinia);

app.mount('#app');
