import { RouteRecordRaw } from 'vue-router';
import Login from '$pages/auth/Login.vue';
import Register from '$pages/auth/Register.vue';
import Dashboard from '$pages/admin/Dashboard.vue';
import User from '$pages/admin/User.vue';
import LoginLayout from '$layouts/LoginLayout.vue';
import IndexLayout from '$layouts/DefaultLayout.vue';
import Developer from '$pages/admin/developer/Developer.vue';
import EditApp from '$pages/admin/developer/EditApp.vue';
import ErrorComponent from '$pages/error/Error.vue';
import { RouteName } from '$constants/router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'Auth',
    component: LoginLayout,
    children: [
      { path: 'login', name: RouteName.Login, component: Login },
      { path: 'register', name: RouteName.Register, component: Register },
    ],
  },
  {
    path: '/',
    name: RouteName.Index,
    component: IndexLayout,
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'user', name: RouteName.User, component: User },
      { path: 'developer', name: RouteName.Developer, component: Developer },
      {
        path: 'developer/app/edit/:appId',
        name: RouteName.AppEdit,
        component: EditApp,
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    name: RouteName.Error,
    component: ErrorComponent,
  },
];
