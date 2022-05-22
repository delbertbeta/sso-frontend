import { RouteRecordRaw } from 'vue-router';
import Login from '$pages/auth/Login.vue';
import Register from '$pages/auth/Register.vue';
import Dashboard from '$pages/admin/Dashboard.vue';
import User from '$pages/admin/User.vue';
import LoginLayout from '$layouts/LoginLayout.vue';
import IndexLayout from '$layouts/DefaultLayout.vue';

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
  {
    path: '/',
    name: 'Index',
    component: IndexLayout,
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'user', name: 'User', component: User },
    ]
  },
];
