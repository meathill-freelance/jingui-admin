<template lang="pug">
  .animated.fadeIn
    nav.navbar.navbar-toggleable-md.navbar-light.bg-faded
      form.form-inline.mr-auto.mt-2.mt-lg-0
        a.btn.btn-outline-primary.mr-sm-2.my-sm-0(href="#/shop/new")
          i.fa.fa-plus
          | 新建商品

    .bg-white.px-3.pt-3.pb-1
      <div class="alert alert-danger" v-if="error">
        <i class="fa fa-times"></i>
        | {{error}}
      </div>
      table.table.table-bordered.cover-list
        thead
          tr
            th 商品名称
            th 商品类型
            th 商品价格
            th 商品缩略图
            th 操作
        tbody(v-if="!isLoading")
          tr(v-for="(item, index) in list", :key="item.id")
            td {{item.name}}
            td {{item.type === 1 ? '精品课程' : '考研书籍'}}
            td {{item.price}}
            td
              img.img-thumbnail(:src="item.thumbnail")
            td
              .btn-group(role="group")
                router-link.btn.btn-outline-primary(:to="{name: 'shop.edit', params: {id: item.id}}", )
                  i.fa.fa-edit.mr-2
                  | 修改
                spin-button(
                  type="button",
                  icon="fa-trash",
                  buttonClass="btn-danger",
                  :saving="item.saving",
                  @click.native="remove(index, item)",
                ) 删除
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
    mixins: [base],
    data() {
      return {
        isLoading: true,
        error: '',
        filter: {},
        list: [],
        allCategory: [],
        total: 0,
      };
    },
    methods: {
      changeCategory(event) {
        this.filter.type = event.target.value;
        this.fetch();
      },
      fetch() {
        return axios.get('product', {params: this.filter})
          .then(response => {
            this.list = response.data;
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
      remove(index, item) {
        if (!confirm('您确定要删除这个商品么')) {
          return;
        }
        item.saving = true;
        axios.delete('product/' + item.id)
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

<style lang="stylus">
  .cover-list .img-thumbnail
    max-width 200px
</style>
