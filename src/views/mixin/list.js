/**
 * Created by meathill on 2017/5/26.
 */

import { API } from 'config';
import pagination from '../../components/Pagination.vue';

export default {
  type: 'base',
  components: {
    pagination
  },
  data() {
    return {
      error: '',
      filter: {},
      list: null,
      total: 0,
      loading: false
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      this.loading = true;
      return this.$http.get(API + this.$options.type, {
        params: this.filter
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(response => {
          this.list = response.list;
          this.total = response.total;
          this.loading = false;
        });
    },
    turnToPage(page) {
      this.filter.page = page;
      this.fetch();
    }
  }
};