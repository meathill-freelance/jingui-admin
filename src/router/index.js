import Vue from 'vue';
import Router from 'vue-router';

import Full from '../containers/Full.vue';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/pages/Login.vue';
import Logout from '../views/pages/Logout.vue';
import Page404 from '../views/pages/Page404.vue';
import Page500 from '../views/pages/Page500.vue';

import exercise from 'src/module/exercise/router';
import global from 'src/module/global/router';

Vue.use(Router);

export default new Router({
  mode: 'hash', // Demo is living in GitHub.io, so required!
  linkActiveClass: 'open active',
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: '首页',
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: '欢迎面板',
          component: Dashboard
        },
        ...exercise,
        ...global,
      ],
    },
    {
      path: '/error',
      name: '错误信息',
      component: {
        render (createElement) {
          return createElement('router-view');
        }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    }
  ]
})
