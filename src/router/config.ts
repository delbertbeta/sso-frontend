import { RouteRecordRaw } from 'vue-router';
import Login from '$pages/auth/Login.vue';
import Register from '$pages/auth/Register.vue';
import LoginLayout from '$layouts/LoginLayout.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'Auth',
    component: LoginLayout,
    children: [
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register },
    ],
  },
];
