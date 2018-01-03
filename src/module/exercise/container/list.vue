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
        tbody(v-if="!isLoading")
          tr(v-for="(item, index) in list", :key="item.id")
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
                  @click.native="remove(item, index)",
                ) 删除
        tfoot(v-else)
          tr
            td(colspan="4")
              i.fa.fa-spin.fa-spinner.fa-2x

      pagination(:total="total", :per-page="20", @change="turnToPage")
</template>

<script>
  import axios from 'axios';
  import pagination from 'src/components/Pagination.vue';
  import SpinButton from 'src/components/form/SpinButton.vue';
  import baseMixin from 'src/mixin/base';
  import exerciseMixin from 'src/mixin/exercise';

  export default {
    components: {
      pagination,
      SpinButton,
    },
    mixins: [baseMixin, exerciseMixin
    ],
    data() {
      return {
        isLoading: true,
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
            this.list = response.list.map(item => {
              item.saving = false;
              return item;
            });
            this.total = response.total;
            this.isLoading = false;
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
      remove(item, index) {
        if (!confirm('您确定要删除这个作业么？')) {
          return;
        }
        item.saving = true;
        axios.delete('exercise/' + item.id)
          .then(response => {
            if (response.code !== 0) {
              throw new Error(response.msg);
            }
            this.list.splice(index, 1);
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
