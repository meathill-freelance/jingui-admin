<template>
  <div class="bg-white px-3 py-3">
    <div class="alert alert-danger" v-if="error">
      <i class="fa fa-times"></i>
      {{error}}
    </div>
    <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
      <form class="form-inline mr-auto mt-2 mt-lg-0">
        <div class="btn-group" data-toggle="buttons">
          <template v-for="n in totalLevel">
            <input type="radio" name="level" :id="'level-' + n" autocomplete="off" v-model="currentLevel" :value="n">
            <label class="btn btn-primary" :for="'level-' + n">第{{n}}层</label>
          </template>
        </div>
      </form>
      <form class="form-inline my-lg-0" @submit.prevent="search">
        <span class="navbar-text mr-2">商品分类</span>
        <select name="category" class="form-control" @change="changeCategory">
          <option value="">全部分类</option>
          <option value="0">默认分类</option>
          <option v-for="(name, id) in allCategory" :value="id">{{name}}</option>
        </select>
      </form>
    </nav>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th><input type="checkbox" @change="selectAll"></th>
        <th>商品名称</th>
        <th>分类</th>
        <th>零售价</th>
        <th>数量</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in visibleProducts">
        <td><input type="checkbox" name="product" value="item.id" :checked="item.level === currentLevel" @change="select(item.id, $event)"></td>
        <td>{{item.fullname}}</td>
        <td>{{item.categoryName}}</td>
        <td>&yen;{{item.price / 100}}</td>
        <td>
          <div class="input-group">
            <span class="input-group-btn">
              <button type="button" class="btn btn-secondary" @click="reduce(item.id)">-</button>
            </span>
            <input type="number" class="form-control" placeholder="数量" v-model="item.quantity" min="0">
            <span class="input-group-btn">
              <button type="button" class="btn btn-secondary" @click="add(item.id)">+</button>
            </span>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="text-center">
      <button class="btn btn-lg btn-primary" @click="save" :disabled="loading">
        <i class="fa fa-spin fa-spinner" v-if="loading"></i>
        <i class="fa fa-check" v-else></i>
        上架
      </button>
    </div>
  </div>
</template>

<script>
  import { API } from 'config';
  import _ from 'underscore';

  export default {
    data() {
      return {
        error: '',
        loading: false,
        id: 0,
        products: null,
        totalLevel: 0,
        currentLevel: 1,
        currentCategory: null,
        allCategory: []
      }
    },
    computed: {
      visibleProducts() {
        return _.chain(this.products)
          .filter(this.productFilter, this)
          .values()
          .value();
      }
    },
    created() {
      this.id = this.$route.params.id;
      this.fetch();
    },
    methods: {
      add(id) {
        this.products[id].quantity += 1;
      },
      changeCategory(event) {
        let value = event.target.value;
        this.currentCategory = value === '' ? null : parseInt(value);
      },
      fetch() {
        this.$http.get(API + 'category', { // 先加载商品分类
          params: {
            pair: 1
          }
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('商品分类加载失败: ' + response.statusText);
          })
          .then(json => {
            this.allCategory = json.list;
            return this.$http.get(API + 'product', { // 再加载所有商品
              params: {
                all: 1
              }
            });
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('商品加载失败：' + response.statusText)
          })
          .then(json => {
            this.products = _.mapObject(json.list, product => {
              product.categoryName = this.allCategory[product.category];
              product.quantity = 0;
              product.level = 0;
              return product;
            });
            return this.$http.get(`${API}shelf/${this.id}/product`, { // 最后加载当前货架上的商品
              params: {
                noProduct: 1
              }
            });
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('货架数据加载失败：' + response.statusText);
          })
          .then(response => {
            response.list.forEach( item => {
              if (!(item.product_id in this.products)) { // 如果商品被删除，那么这里就不再显示
                return;
              }

              let product = this.products[item.product_id];
              product.quantity = item.quantity;
              product.level = item.level;
            });
            this.totalLevel = response.shelf.level;
          })
          .catch(err => {
            if (err instanceof Error) {
              err = err.name + ': ' + err.message;
            }
            this.error = err;
          });
      },
      productFilter(product) {
        let notUsed = product.level === 0;
        let inCategory = this.currentCategory === null || product.category === this.currentCategory;
        let inLevel = product.level === this.currentLevel;
        return (notUsed || inLevel) && inCategory;
      },
      reduce(id) {
        this.products[id].quantity -= 1;
      },
      save() {
        let all = this.visibleProducts.filter(product => {
          return product.level > 0;
        });
        if (all.length === 0) {
          alert('请选择要上架的商品');
          return;
        }
        let errorProduct = all.find(product => {
          return product.quantity < 0;
        });
        if (errorProduct) {
          alert(`${errorProduct.fullname} 数量不能为负`);
          return;
        }
        this.loading = true;
        this.$http.post(`${API}shelf/${this.id}/product/${this.currentLevel}`, all)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then(json => {
            if (json.code === 0) {
              this.error = '';
              alert('上架成功');
            } else {
              alert('上架失败');
            }
          })
          .catch(err => {
            if (err.status === 422) {
              err = err.body.msg;
            }
            this.error = err;
          })
          .then(() => {
            this.loading = false;
          });
      },
      select(id, event) {
        this.products[id].level = event.target.checked ? this.currentLevel : 0;
      },
      selectAll(event) {
        let checked = event.target.checked;
        this.visibleProducts.forEach(product => {
          product.level = checked ? this.currentLevel : 0;
        });
      }
    },
    watch: {
      '$route'(to) {
        if (to.params.id === this.id) {
          return;
        }
        this.id = to.params.id;
        this.fetch();
      }
    }
  }
</script>