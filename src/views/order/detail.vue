<template>
<div class="animated fadeIn bg-white px-3 py-3" id="order-detail">
  <header>
    <div class="row mb-5">
      <div class="col-sm-6">订单号：<strong>{{order_id}}</strong></div>
      <div class="col-sm-6 text-right">成交日期：<strong>{{payed_at}}</strong> 货架名：<strong>{{shelf.corp}}</strong></div>
    </div>
  </header>
  <table class="table table-bordered table-striped">
    <thead>
    <tr>
      <th>商品名称</th>
      <th>商品编码</th>
      <th>数量</th>
      <th>零售价</th>
      <th>实收金额</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in list">
      <td>{{item.product.fullname}}</td>
      <td>{{item.product.pcode}}</td>
      <td>{{item.quantity}}</td>
      <td>{{item.price / 100}}</td>
      <td>{{(item.price - item.coupon) / 100}}</td>
    </tr>
    </tbody>
  </table>
  <footer>
    <template v-if="status === 10">
      <i class="fa fa-check-circle text-success"></i>
      <span class="text-success">已支付</span>
    </template>
    <template v-else-if="status === 20">
      <i class="fa fa-times-circle-o text-danger"></i>
      <span class="text-danger">已关闭</span>
    </template>
    <article class="col-2 ml-auto">
      <p>总计金额：<strong>&yen;{{total / 100}}</strong></p>
      <p>优惠方式：无</p>
      <p>优惠金额：无</p>
      <p>支付方式：<strong>微信</strong></p>
      <p>支付金额：<strong>&yen;{{total / 100}}</strong></p>
    </article>
  </footer>
</div>
</template>

<script>
import { API } from 'config';
import _ from 'underscore';

export default {
  data() {
    return {
      id: 0,
      order_id: '',
      payed_at: '',
      corp: '',
      shelf: {},
      list: null,
      total: 0,
      status: 0,
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
      this.$http.get(`${API}order/${this.id}`)
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then( json => {
          _.each(json.order, (value, key) => {
            this[key] = value;
          });
          this.list = json.list;
        })
    },
    remove() {
      this.loading = true;
      this.$http.delete(`${API}order/${this.id}`)
        .then( response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then( json => {
          if (json.code === 0) {
            alert('删除成功');
            this.$router.push({
              name: '商品管理'
            });
          } else {
            this.loading = false;
            alert('删除失败');
          }
        })
        .catch( () => {
          this.loading = false;
          alert('网络故障，删除失败');
        });
    }
  },
  watch: {
    '$route' (to) {
      this.id = to.params.id;
      this.fetch();
    }
  }
}
</script>