<template lang="pug">
  .animated.fadeIn
    nav.navbar.navbar-toggleable-md.navbar-light.bg-faded
      <form class="form-inline mr-auto mt-2 mt-lg-0">
        <a class="btn btn-outline-primary mr-sm-2 my-sm-0" href="#/exercise/new">
          <i class="fa fa-plus"></i>
          | 新增作业
        </a>
      </form>
      <form class="form-inline my-lg-0" @submit.prevent="search">
        input.form-control.mr-sm-2(type="search", name="query", placeholder="作业名称")
        button.btn.btn-outline-success.my-2.my-sm-0 搜索
      </form>

    .bg-white.px-3.pt-3.pb-1
      <div class="alert alert-danger" v-if="error">
        <i class="fa fa-times"></i>
        | {{error}}
      </div>
      table.table.table-bordered
        thead
          tr
            th 作业标题
            th 作业类型
            th 完成日期
            th 操作
        tbody
          tr(v-for="(item, index) in list", :key="item.id")
            td {{item.fullname}}
            td {{item.pcode}}
            td {{item.left}}
            td
              a.btn.btn-outline-primary(:href="'#/product/' + item.id + '/edit'")
                i.fa.fa-edit 修改
              a.btn.btn-info(:href="'#/product/' + item.id")
                i.fa.fa-info-circle 详情

      pagination(:total="total", :per-page="20", @change="turnToPage")
</template>

<script>
  import axios from 'axios';
  import pagination from '@/components/Pagination.vue';

  export default {
    name: 'exercise-list',
    components: {
      pagination
    },
    data() {
      return {
        error: '',
        filter: {},
        list: [],
        allCategory: [],
        total: 0
      }
    },
    methods: {
      changeCategory(event) {
        this.filter.category = event.target.value;
        this.fetch();
      },
      fetch() {
        return axios.get('exercise', {params: this.filter})
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then(response => {
            this.list = response.list;
            this.total = response.total;
          });
      },
      search(event) {
        this.filter.keyword = event.target.elements.query.value;
        this.fetch();
      },
      turnToPage(page) {
        this.filter.page = page;
        this.fetch();
      },
    },

    beforeMount() {
      this.fetch();
    },
  }
</script>
