import { RouteRecordRaw } from 'vue-router';
import Index from '$pages/Index.vue';
import Login from '$pages/Login.vue';

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Index',  component: Index },
  { path: '/login', name: 'Login', component: Login },
];
