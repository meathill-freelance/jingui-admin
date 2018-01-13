import List from './container/list.vue';
import Edit from './container/edit.vue';

export default [
  {
    path: 'cover',
    name: '封面图管理',
    redirect: 'cover/list',
    component: {
      render(createElement) {
        return createElement('router-view');
      }
    },
    children: [
      {
        path: 'list',
        name: 'cover.list',
        meta: {
          label: '全部封面图',
        },
        component: List,
      },
      {
        path: 'new',
        name: 'cover.new',
        meta:{
          label: '添加新封面图'
        },
        component: Edit,
      },
      {
        path: ':id/edit',
        name: 'cover.edit',
        meta: {
          label: '编辑封面图',
        },
        component: Edit,
      },
    ]
  },
];