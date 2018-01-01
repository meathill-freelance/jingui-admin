<template lang="pug">
  .animated.fadeIn
    nav.navbar.navbar-toggleable-md.navbar-light.bg-faded
      form.form-inline.mr-auto.mt-2.mt-lg-0
        a.btn.btn-outline-primary.mr-sm-2.my-sm-0(href="#/season/new")
          i.fa.fa-plus
          | 新增学期

    .bg-white.px-3.pt-3.pb-1
      <div class="alert alert-danger" v-if="error">
        <i class="fa fa-times"></i>
        | {{error}}
      </div>
      table.table.table-bordered
        thead
          tr
            th 学习名称
            th 开始时间
            th 结束时间
            th 持续时间
            th 操作
        tbody
          tr(v-for="item in list", :key="item.id")
            td {{item.title}}
            td {{item.start_at | toDate}}
            td {{item.end_at | toDate}}
            td {{item.duration}}天
            td
              .btn-group(role="group")
                router-link.btn.btn-outline-primary(:to="{name: 'season.edit', params: {id: item.id}}", )
                  i.fa.fa-edit
                  | 修改
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
  import moment from 'moment';

  import pagination from 'src/components/Pagination.vue';
  import SpinButton from 'src/components/form/SpinButton.vue';
  import base from 'src/mixin/base';
  import * as format from 'src/data/format';

  export default {
    components: {
      pagination,
      SpinButton,
    },
    mixins: [base],
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
        return axios.get('season', {params: this.filter})
          .then(response => {
            this.list = (response.list || []).map(item => {
              item.end_at = moment(item.start_at).add(item.duration, 'days').format(format.DATE);
              return item;
            });
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
        axios.delete('season/' + item.id)
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
