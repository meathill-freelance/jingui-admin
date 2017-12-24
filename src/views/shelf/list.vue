<template>
<div class="bg-white px-3 py-3">
  <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
    <form class="form-inline mr-auto mt-2 mt-lg-0">
      <a class="btn btn-outline-primary mr-sm-2 my-sm-0" href="#/shelf/new">
        <i class="fa fa-plus"></i>
        新增货架
      </a>
    </form>
    <form class="form-inline my-lg-0" @submit.prevent="search">
      <input type="search" name="query" class="form-control mr-sm-2" placeholder="公司名称">
      <button class="btn btn-outline-success my-2 my-sm-0">搜索</button>
    </form>
  </nav>
  <table class="table table-bordered">
    <thead>
    <tr>
      <th>公司名称</th>
      <th>开业时间</th>
      <th>联系人姓名</th>
      <th>联系人手机</th>
      <th>地址</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item, index) in list">
      <td>{{item.corp}}</td>
      <td>{{item.created_at | formatDate}}</td>
      <td>{{item.fullname}}</td>
      <td>{{item.mobile}}</td>
      <td>{{item.address}}</td>
      <td>
        <a :href="'#/shelf/' + item.id + '/edit'" class="btn btn-outline-primary"><i class="fa fa-edit"></i> 修改</a>
        <a :href="'#/shelf/' + item.id" class="btn btn-info"><i class="fa fa-info-circle"></i> 详情</a>
        <button type="button" class="btn btn-secondary" @click="qrcode(index, item.id)"><i class="fa fa-qrcode"></i> 二维码</button>
      </td>
    </tr>
    </tbody>
  </table>
  <pagination :total="total" :per-page="20" @change="turnToPage"></pagination>

  <modal :title="modalTitle" v-model="modal" @ok="save" @cancel="close" effect="fade/zoom" :footer="false">
    <template v-if="qrcodePath">
      <p class="text-center">
        <img :src="qrcodePath" class="img-thumbnail">
      </p>
      <p class="text-center">
        <a :href="qrcodePath" :download="modalTitle + '.png'" class="btn btn-primary"><i class="fa fa-download"></i> 保存到本地</a>
      </p>
      <p>
        若您的浏览器不支持直接下载，可以使用"右键 -> 图片另存为"来保存图片。
      </p>
    </template>
    <template v-else>
      <p class="text-center" v-if="!modalMessage">
        <i class="fa fa-spin fa-spinner fa-4x"></i>
      </p>
      <p class="alert alert-danger" v-if="modalMessage">
        {{modalMessage}}
      </p>
      <p class="text-center" v-else>
        生成二维码，请稍候。
      </p>
    </template>
  </modal>
</div>
</template>

<script>
import { API } from 'config';
import Pagination from "../../components/Pagination";
import Modal from '../../components/Modal.vue';

export default {
  components: {
    Modal,
    Pagination
  },
  name: 'shelf-list',
  data() {
    return {
      error: '',
      filter: {},
      list: [],
      total: 0,
      modal: false,
      modalTitle: '',
      modalMessage: '',
      qrcodePath: ''
    }
  },
  filters: {
    formatDate(date) {
      let [y, m, d] = date.substr(0, 10).split('-');
      return `${y}年${m}月${d}日`;
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    close() {
      this.modal = false;
    },
    fetch() {
      return this.$http.get(API + 'shelf', {params: this.filter})
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(response => {
          this.list = response.list;
          this.total = response.total;
        });
    },
    qrcode(index, id) {
      this.qrcodePath = this.modalMessage = '';
      this.modalTitle = this.list[index].corp;
      this.modal = true;
      this.$http.get(`${API}shelf/${id}/qrcode`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(response => {
          if (response.code !== 0) {
            throw new Error(response.msg);
          }
          this.qrcodePath = response.path;
        })
        .catch(err => {
          this.modalMessage = err;
        });
    },
    save() {
      window.open(this.qrcodeData);
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