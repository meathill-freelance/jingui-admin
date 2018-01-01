import List from './container/list.vue';
import Edit from './container/edit.vue';

export default [
  {
    path: 'season',
    name: '学期管理',
    redirect: 'season/list',
    component: {
      render(createElement) {
        return createElement('router-view');
      }
    },
    children: [
      {
        path: 'list',
        name: 'season.list',
        meta: {
          label: '全部学期',
        },
        component: List,
      },
      {
        path: 'new',
        name: 'season.new',
        meta:{
          label: '添加新学期'
        },
        component: Edit,
      },
      {
        path: ':id/edit',
        name: 'season.edit',
        meta: {
          label: '编辑学期',
        },
        component: Edit,
      },
    ]
  },
];