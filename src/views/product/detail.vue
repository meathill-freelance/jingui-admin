<template>
<div class="bg-white px-3 py-3">
  <div class="row">
    <div class="col-sm-4">
      <img class="img-thumbnail" :src="thumbnail">
    </div>
    <div class="col-sm-8">
      <table class="table table-bordered table-striped">
        <tr>
          <th>商品名称</th>
          <td>{{fullname}}</td>
        </tr>
        <tr>
          <th>商品编码</th>
          <td>{{pcode}}</td>
        </tr>
        <tr>
          <th>商品分类</th>
          <td>{{categoryName}}</td>
        </tr>
        <tr>
          <th>零售价</th>
          <td>&yen;{{price / 100}}</td>
        </tr>
        <tr>
          <th>成本价</th>
          <td>&yen;{{cost / 100}}</td>
        </tr>
      </table>
    </div>
    <div class="col-sm-12">
      <table class="table table-bordered table-striped">
        <tr>
          <th>备注</th>
          <td>{{comment}}</td>
        </tr>
        <tr>
          <th>是否可用</th>
          <td>{{visibility}}</td>
        </tr>
      </table>
    </div>
    <div class="col-sm-12 text-center">
      <button type="button" class="btn btn-danger" @click="remove" :disabled="loading">
        <i class="fa fa-spin fa-spinner" v-if="loading"></i>
        <i class="fa fa-trash" v-else></i> 删除
      </button>
      <a class="btn btn-outline-primary" :href="'#' + path + '/edit'"><i class="fa fa-edit"></i> 编辑</a>
    </div>
  </div>
</div>
</template>

<script>
import { API } from 'config';
import _ from 'underscore';

export default {
  data() {
    return {
      id: 0,
      fullname: '',
      pcode: '',
      category: '',
      price: 0,
      cost: 0,
      thumbnail: '',
      comment: '',
      visible: 0,
      loading: false
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.fetch();
  },
  computed: {
    path() {
      return this.$route.path;
    },
    visibility() {
      return this.visible ? '可用' : '不可用'
    }
  },
  methods: {
    fetch() {
      this.loading = true;
      this.$http.get(`${API}product/${this.id}`)
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then( json => {
          _.each(json.product, (value, key) => {
            this[key] = value;
          });
          this.loading = false;
        })
    },
    remove() {
      this.loading = true;
      this.$http.delete(`${API}product/${this.id}`)
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then( json => {
          if (json.code === 0) {
            alert('删除成功');
            this.visible = 0;
            this.$router.push({
              name: '商品管理'
            });
          } else {
            this.loading = false;
            alert('删除失败');
          }
        })
        .catch( err => {
          if (err.status === 423) {
            err = err.body.msg;
          }
          alert(err || '网络故障，删除失败');
          this.loading = false;
        });
    }
  },
  watch: {
    '$route' (to) {
      this.id = to.params.id;
    }
  }
}
</script>