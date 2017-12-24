import Vue from 'vue';
import Router from 'vue-router';

import Full from '../containers/Full.vue';
import Dashboard from '../views/Dashboard.vue';
import ProductList from '../views/product/list.vue';
import EditProduct from '../views/product/edit.vue';
import ProductDetail from '../views/product/detail.vue';
import Category from '../views/product/category.vue';
import ShelfList from '../views/shelf/list.vue';
import EditShelf from '../views/shelf/edit.vue';
import ShelfDetail from '../views/shelf/detail.vue';
import AdjustShelf from '../views/shelf/adjust.vue';
import OrderList from '../views/order/list.vue';
import OrderDetail from '../views/order/detail.vue';
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
          path: 'product',
          name: '商品管理',
          redirect: 'product/list',
          component: {
            render(createElement) {
              return createElement('router-view');
            }
          },
          children: [
            {
              path: 'list',
              name: '商品列表',
              component: ProductList
            },
            {
              path: 'new',
              name: '添加新商品',
              component: EditProduct
            },
            {
              path: 'category',
              name: '商品分类',
              component: Category
            },
            {
              path: ':id',
              name: '商品详情',
              component: ProductDetail,
            },
            {
              path: ':id/edit',
              name: '编辑商品',
              component: EditProduct
            }
          ]
        },
        {
          path: 'shelf',
          redirect: 'shelf/list',
          name: '货架管理',
          component: {
            render (createElement) {
              return createElement('router-view');
            }
          },
          children: [
            {
              path: 'list',
              name: '货架列表',
              component: ShelfList
            },
            {
              path: 'new',
              name: '添加货架',
              component: EditShelf
            },
            {
              path: ':id',
              name: '货架详情',
              component: ShelfDetail,
            },
            {
              path: ':id/edit',
              name: '编辑货架',
              component: EditShelf
            },
            {
              path: ':id/adjust',
              name: '商品上架',
              component: AdjustShelf
            }
          ]
        },
        {
          path: 'order',
          name: '订单管理',
          redirect: 'order/list',
          component: {
            render(createElement) {
              return createElement('router-view');
            }
          },
          children: [
            {
              path: 'list',
              name: '全部订单',
              component: OrderList
            },
            {
              path: ':id',
              name: '订单详情',
              component: OrderDetail
            }
          ]
        }
      ]
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
