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
            th 上线日期
            th 操作
        tbody
          tr(v-for="item in list", :key="item.id")
            td {{item.title}}
            td {{item.type | toType}}
            td {{item.published_at | toDate}}
            td
              .btn-group(role="group")
                a.btn.btn-outline-primary(:href="'#/exercise/' + item.id + '/edit'")
                  i.fa.fa-edit
                  | 修改
                button.btn.btn-info(
                  type="button",
                  disabled,
                  :href="'#/exercise/' + item.id",
                )
                  i.fa.fa-info-circle
                  | 详情
                spin-button(
                  type="button",
                  icon="fa-trash",
                  buttonClass="btn-danger",
                  :saving="item.saving",
                  @click.native="remove(item)",
                ) 删除

      pagination(:total="total", :per-page="20", @change="turnToPage")
</template>

<script>
  import axios from 'axios';
  import pagination from '@/components/Pagination.vue';
  import SpinButton from '@/components/form/SpinButton.vue';
  import {mixin} from '@/mixin/exercise';

  export default {
    name: 'exercise-list',
    components: {
      pagination,
      SpinButton,
    },
    mixins: [mixin],
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
        this.filter.type = event.target.value;
        this.fetch();
      },
      fetch() {
        return axios.get('exercise', {params: this.filter})
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
      remove(item) {
        item.saving = true;
        axios.delete('exercise/' + item.id)
          .then(response => {
            if (response.code !== 0) {
              throw new Error(response.msg);
            }
          })
          .catch(err => {
            err.message && alert(err.message);
          })
          .then(() => {
            item.saving = false;
          });
      },
    },

    beforeMount() {
      this.fetch();
    },
  }
</script>
