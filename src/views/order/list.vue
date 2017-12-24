<template>
  <div class="animated fadeIn">
    <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
      <form class="form-inline mr-auto mt-2 mt-lg-0">
        <span class="navbar-text mr-2">时间选择</span>
        <datepicker :value="filter.start" format="yyyy-MM-dd" placeholder="开始日期" @input="onDateChange('start', $event)" :disabled="loading"></datepicker>
        <span class="navbar-text mx-2">到</span>
        <datepicker :value="filter.end" format="yyyy-MM-dd" placeholder="结束日期" @input="onDateChange('end', $event)" :disabled="loading"></datepicker>
        <div class="btn-group ml-2">
          <button type="button" class="btn btn-primary" @click="setRange(0)" :disabled="loading">今</button>
          <button type="button" class="btn btn-primary" @click="setRange(-1, -1)" :disabled="loading">昨</button>
          <button type="button" class="btn btn-primary" @click="setRange(-7)" :disabled="loading">周</button>
          <button type="button" class="btn btn-primary" @click="setRange(-30)" :disabled="loading">月</button>
        </div>
      </form>
      <form class="form-inline">
        <select name="status" class="form-control mr-2" @change="changeStatus" :disabled="loading">
          <option value="">全部订单</option>
          <option value="0">未支付</option>
          <option value="10">已完成</option>
          <option value="20">已关闭</option>
        </select>
        <button type="button" class="btn btn-outline-primary" @click="exportCSV">
          <i class="fa fa-download"></i>
          导出
        </button>
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
          <th>订单号</th>
          <th>下单时间</th>
          <th>会员昵称</th>
          <th>货架名称</th>
          <th>金额</th>
          <th>订单状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody v-if="loading">
        <tr>
          <td colspan="7" class="text-center">
            <i class="fa fa-spin fa-spinner fa-3x"></i><br>
            加载数据，请稍候
          </td>
        </tr>
        </tbody>
        <tbody>
        <tr v-for="(item, index) in list">
          <td>{{item.order_id}}</td>
          <td>{{item.created_at}}</td>
          <td>{{item.customer.nickname}}</td>
          <td>{{item.shelf.corp}}</td>
          <td>&yen;{{item.total / 100}}</td>
          <td :class="item.status | toClass">{{item.status | toCaption}}</td>
          <td>
            <a :href="'#/order/' + item.id" class="btn btn-outline-primary"><i class="fa fa-info-circle"></i> 详情</a>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="alert alert-info" v-if="noOrder">
        <i class="fa fa-frown-o"></i> 该范围内没有符合要求的订单。
      </div>
      <pagination :total="total" :per-page="20" @change="turnToPage"></pagination>
    </div>
  </div>
</template>

<script>
  import { API } from 'config';
  import datepicker from '../../components/Datepicker.vue';
  import superList from '../mixin/list';
  import { formatDate } from '../../utils/date';
  import { buildParam } from '../../utils/url';

  const STATUS = {
    0: '未支付',
    10: '已成功',
    20: '已关闭'
  };

  export default {
    name: 'order-list',
    mixins: [superList],
    components: {
      datepicker
    },
    data() {
      let data = superList.data();
      data.filter.start = formatDate();
      data.filter.end = formatDate();
      return data;
    },
    computed: {
      noOrder() {
        return this.list !== null && this.list.length === 0;
      }
    },
    type: 'order',
    filters: {
      toCaption(status) {
        return STATUS[status];
      },
      toClass(status) {
        switch (status) {
          case 10:
            return 'text-success';

          case 20:
            return 'text-danger';

          default:
            return '';
        }
      }
    },
    methods: {
      changeStatus(event) {
        this.filter.status = event.target.value;
        this.fetch();
      },
      exportCSV() {
        let params = buildParam(this.filter);
        window.open(`${API}export/order/?${params}`);
      },
      setRange(start, end = 0) {
        let from = new Date();
        let to = new Date();
        from.setDate(from.getDate() + start);
        to.setDate(to.getDate() + end);
        this.filter.start = formatDate(from);
        this.filter.end = formatDate(to);
        this.fetch();
      },
      onDateChange(key, value) {
        value = value.trim();
        if (!/^201\d-\d{2}-\d{2}$/.test(value)) {
          return;
        }
        if (this.filter[key] === value) {
          return;
        }
        this.filter[key] = value;
        this.fetch();
      }
    }
  }
</script>
