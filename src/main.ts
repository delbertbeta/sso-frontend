import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/zh-cn';

import router from '$router';
import App from './App.vue';
import store, { key } from './store';

import 'tdesign-vue-next/es/style/index.css';

import './index.css';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale('zh-cn');

const app = createApp(App);

app.use(store, key);
app.use(router);
app.use(TDesign);

app.mount('#app');
