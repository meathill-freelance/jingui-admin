<template lang="pug">
  .animated.fadeIn
    .bg-white.px-3.pt-3.pb-1
      .alert.alert-danger(v-if="error")
        i.fa.fa-times
        | {{error}}

      table.table.table-bordered.cover-list
        thead
          tr
            th 用户昵称
            th 微信号
            th 联系电话
        tbody(v-if="!isLoading")
          tr(v-for="(item, index) in list", :key="item.id")
            td {{item.customer.nickname}}
            td {{item.weixin}}
            td {{item.phone}}
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
