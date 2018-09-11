<template lang="pug">
  .animated.fadeIn
    .bg-white.px-3.pt-3.pb-1
      .alert.alert-danger(v-if="error")
        i.fa.fa-times
        | {{error}}

      .actions-bar.d-flex.justify-content-end.mb-3
        a.btn.btn-secondary(
          :href="baseURL + '/customer/export'",
          target="_blank",
          download="导出报名记录.csv",
        )
          i.fas.fa-download.mr-2
          | 导出

      table.table.table-bordered.cover-list
        thead
          tr
            th 用户昵称
            th 性别
            th 微信号
            th 联系电话
            th 毕业院校
            th 目标院校
            th 目标专业
            th 考研年份
            th 研友要求
        tbody(v-if="!isLoading")
          tr(v-for="(item, index) in list", :key="item.id")
            td {{item.customer.nickname}}
            td {{getSex(item.customer.sex)}}
            td {{item.weixin}}
            td {{item.phone}}
            td {{item.customer.recruitment && item.customer.recruitment.bachelor}}
            td {{item.customer.recruitment && item.customer.recruitment.target}}
            td {{item.customer.recruitment && item.customer.recruitment.major}}
            td {{item.customer.recruitment && item.customer.recruitment.year}}
            td {{item.customer.recruitment && item.customer.recruitment.excerpt}}

        tfoot(v-else)
          tr
            td(colspan=5)
              i.fa.fa-spin.fa-spinner.fa-2x

      pagination(:total="total", :per-page="20", @change="turnToPage")
</template>

<script>
  import axios from 'axios';

  import pagination from 'src/components/Pagination.vue';
  import SpinButton from 'src/components/form/SpinButton.vue';
  import base from 'src/mixin/base';

  const sexes = ['', '男', '女'];

  /* global API */

  export default {
    components: {
      pagination,
      SpinButton,
    },
    mixins: [
      base,
    ],
    data () {
      return {
        isLoading: true,
        error: '',
        filter: {},
        list: [],
        total: 0,
        baseURL: API,
      };
    },
    methods: {
      fetch () {
        return axios.get('customer', {
          params: this.filter,
        })
          .then(response => {
            this.list = response.data;
            this.total = response.total;
            this.isLoading = false;
          });
      },
      getSex (sex) {
        sex = Number(sex);
        return sexes[sex];
      },
      turnToPage (page) {
        this.filter.page = page;
        this.fetch();
      },
    },

    beforeMount () {
      this.fetch();
    },
  };
</script>
