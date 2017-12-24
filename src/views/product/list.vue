<template>
  <div class="animated fadeIn">
    <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
      <form class="form-inline mr-auto mt-2 mt-lg-0">
        <a class="btn btn-outline-primary mr-sm-2 my-sm-0" href="#/product/new">
          <i class="fa fa-plus"></i>
          新增商品
        </a>
        <select name="category" class="form-control" @change="changeCategory">
          <option value="">全部分类</option>
          <option value="0">默认分类</option>
          <option v-for="(name, id) in allCategory" :value="id">{{name}}</option>
        </select>
      </form>
      <form class="form-inline my-lg-0" @submit.prevent="search">
        <input type="search" name="query" class="form-control mr-sm-2" placeholder="商品名称">
        <button class="btn btn-outline-success my-2 my-sm-0">搜索</button>
      </form>
    </nav>
    <div class="bg-white px-3 pt-3 pb-1">
      <div class="alert alert-danger" v-if="error">
        <i class="fa fa-times"></i>
        {{error}}
      </div>
      <table class="table table-bordered">
        <thead>
        <tr>
          <th>商品名称</th>
          <th>编码</th>
          <th>分类</th>
          <th>零售价</th>
          <th>成本价</th>
          <th>库存数</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in list">
          <td>{{item.fullname}}</td>
          <td>{{item.pcode}}</td>
          <td v-text="allCategory[item.category]"></td>
          <td>&yen;{{item.price / 100}}</td>
          <td>&yen;{{item.cost / 100}}</td>
          <td>{{item.left}}</td>
          <td>
            <a :href="'#/product/' + item.id + '/edit'" class="btn btn-outline-primary"><i class="fa fa-edit"></i> 修改</a>
            <a :href="'#/product/' + item.id" class="btn btn-info"><i class="fa fa-info-circle"></i> 详情</a>
          </td>
        </tr>
        </tbody>
      </table>
      <pagination :total="total" :per-page="20" @change="turnToPage"></pagination>
    </div>
  </div>
</template>

<script>
  import { API } from 'config';
  import pagination from '../../components/Pagination.vue';

  export default {
    name: 'product-list',
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
    created() {
      this.$http.get(API + 'category')
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then( json => {
          this.allCategory = json.list.reduce( (memo, item) => {
            memo[item.id] = item.name;
            return memo;
          }, {});
        })
        .then( () => {
          return this.fetch()
        })
        .catch( err => {
          this.error = err;
        });
    },
    methods: {
      changeCategory(event) {
        this.filter.category = event.target.value;
        this.fetch();
      },
      fetch() {
        return this.$http.get(API + 'product', {params: this.filter})
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
      }
    }
  }
</script>
