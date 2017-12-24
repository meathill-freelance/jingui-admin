<template>
  <div class="bg-white px-3 py-3">
    <div class="alert alert-danger" v-if="error">
      <i class="fa fa-times"></i>
      {{error}}
    </div>
    <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
      <div class="form-inline mr-auto mt-2 mt-lg-0">
        <a class="btn btn-outline-primary mr-sm-2 my-sm-0" :href="'#/shelf/' + id + '/adjust'">
          <i class="fa fa-plus"></i>
          商品上架
        </a>
        <select name="level" class="form-control" v-model="level">
          <option value="">所有层</option>
          <option v-for="n in totalLevel" :value="n" v-text="'第' + n + '层'"></option>
        </select>
      </div>
      <form class="form-inline my-lg-0" @submit.prevent="search">
        <input type="search" name="query" class="form-control mr-sm-2" placeholder="商品名称">
        <button class="btn btn-outline-success my-2 my-sm-0">搜索</button>
      </form>
    </nav>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th>商品名称</th>
        <th>分类</th>
        <th>零售价</th>
        <th>层数</th>
        <th>剩余</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in visibleList">
        <td>{{item.product.fullname}}</td>
        <td>{{item.product.category.name}}</td>
        <td>&yen;{{item.product.price / 100}}</td>
        <td>{{item.level}}</td>
        <td>
          <form class="input-group" :id="'form-' + index" v-if="item.editing" @submit.prevent="save(item.id)">
            <span class="input-group-btn">
              <button type="button" class="btn btn-secondary" @click="reduce(item.id)">-</button>
            </span>
            <input type="number" class="form-control" v-model="item.quantity">
            <span class="input-group-btn">
              <button type="button" class="btn btn-secondary" @click="add(item.id)">+</button>
            </span>
          </form>
          <span v-else>{{item.quantity}}</span>
        </td>
        <td>
          <template v-if="item.editing">
            <button class="btn btn-primary" :form="'form-' + index" :disabled="item.loading">
              <i class="fa fa-spin fa-spinner" v-if="item.loading"></i>
              <i class="fa fa-check" v-else></i>
              保存
            </button>
            <button type="button" class="btn btn-link" @click="cancel(item.id)"><i class="fa fa-times"></i> 取消</button>
          </template>
          <button type="button" class="btn btn-outline-primary" @click="edit(item.id)" v-else><i class="fa fa-edit"></i> 修改</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { API } from 'config';

  export default {
    data() {
      return {
        error: '',
        keyword: '',
        list: [],
        level: '',
        totalLevel: 0
      }
    },
    computed: {
      visibleList() {
        return this.list.filter( item => {
          let inLevel = !this.level || item.level === this.level;
          let inSearch = !this.keyword || item.product.fullname.indexOf(this.keyword) !== -1;
          return inLevel && inSearch;
        });
      }
    },
    created() {
      this.id = this.$route.params.id;
      this.fetch();
    },
    methods: {
      add(id) {
        this.find(id).quantity += 1;
      },
      cancel(id) {
        this.find(id).editing = false;
      },
      edit(id) {
        let item = this.find(id);
        setTimeout( () => {
          item.before = item.quantity;
          item.editing = true;
        }, 10);
      },
      find: function (id) {
        return this.list.find(item => {
          return item.id === id;
        });
      },
      reduce(id) {
        this.find(id).quantity -= 1;
      },
      save(id) {
        let item = this.find(id);
        if (!confirm(`确认修改 ${item.product.fullname} 的剩余数量为 ${item.quantity}？此操作不可逆，请谨慎操作。`)) {
          return;
        }
        item.loading = true;
        this.$http.patch(`${API}shelf_product/${id}`, {
          quantity: item.quantity
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then(json => {
            if (json.code === 0) {
              alert('保存成功');
              item.editing = false;
            } else {
              alert('保存失败');
            }
          })
          .catch(err => {
            this.error = err;
          })
          .then(() => {
            item.loading = false;
          });
      },
      fetch() {
        return this.$http.get(`${API}shelf/${this.id}/product`)
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then(response => {
            this.list = response.list.map( item => {
              item.product.category = item.product.category || {name: ''};
              item.editing = false;
              item.loading = false;
              return item;
            });
            this.totalLevel = response.shelf.level;
          })
          .catch(err => {
            if (err instanceof Error) {
              err = err.name + ':' + err.message;
            }
            this.error = err;
          });
      },
      search(event) {
        this.keyword = event.target.elements.query.value;
      }
    },
    watch: {
      '$route'(to) {
        this.id = to.params.id;
        this.fetch();
      }
    }
  }
</script>