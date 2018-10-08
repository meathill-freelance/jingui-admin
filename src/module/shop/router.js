import List from './container/list.vue';
import Edit from './container/edit.vue';

export default [
  {
    path: 'shop',
    name: '商品管理',
    redirect: 'shop/list',
    component: {
      render (createElement) {
        return createElement('router-view');
      },
    },
    children: [
      {
        path: 'list',
        name: 'shop.list',
        meta: {
          label: '全部商品',
        },
        component: List,
      },
      {
        path: 'new',
        name: 'shop.new',
        meta:{
          label: '新建商品',
        },
        component: Edit,
      },
      {
        path: ':id/edit',
        name: 'shop.edit',
        meta: {
          label: '编辑商品',
        },
        component: Edit,
      },
    ],
  },
];
