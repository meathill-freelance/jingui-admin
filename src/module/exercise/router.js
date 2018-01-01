import ExerciseList from './container/list.vue';
import EditExercise from './container/edit.vue';
import ExerciseDetail from './container/detail.vue';

export default [
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
];