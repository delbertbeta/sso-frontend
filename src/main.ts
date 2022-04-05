import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next';

import router from '$router';
import App from './App.vue';
import store, { key } from './store';

import 'tdesign-vue-next/es/style/index.css';
import './index.css';

const app = createApp(App);

app.use(store, key);
app.use(router);
app.use(TDesign);

app.mount('#app');
