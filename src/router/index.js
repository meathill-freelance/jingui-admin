import Vue from 'vue';
import Router from 'vue-router';

import Full from '../containers/Full.vue';
import Dashboard from '../views/Dashboard.vue';
import ExerciseList from '@/module/exercise/container/list.vue';
import EditExercise from '@/module/exercise/container/edit.vue';
import ExerciseDetail from '@/module/exercise/container/detail.vue';
import Login from '../views/pages/Login.vue';
import Logout from '../views/pages/Logout.vue';
import Page404 from '../views/pages/Page404.vue';
import Page500 from '../views/pages/Page500.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash', // Demo is living in GitHub.io, so required!
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
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
        {
          path: 'exercise',
          name: '作业管理',
          redirect: 'exercise/list',
          component: {
            render(createElement) {
              return createElement('router-view');
            }
          },
          children: [
            {
              path: 'list',
              name: '作业列表',
              component: ExerciseList,
            },
            {
              path: 'new',
              name: '添加新作业',
              component: EditExercise,
            },
            {
              path: ':id',
              name: '作业详情',
              component: ExerciseDetail,
            },
            {
              path: ':id/edit',
              name: '编辑作业',
              component: EditExercise,
            },
          ],
        },
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
