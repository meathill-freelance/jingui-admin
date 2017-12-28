<template>
  <div class="bg-white px-3 pt-3 pb-1 shelf-editor">
    <form :action="API + 'shelf/'" method="post" enctype="multipart/form-data" class="form-horizontal" @submit.prevent="save">
      <h3 class="mb-4">基础信息（必填）</h3>
      <div class="form-group row">
        <label class="col-md-2 form-control-label" for="corp">公司名称</label>
        <div class="col-md-6">
          <input id="corp" name="corp" class="form-control" placeholder="公司名称" v-model="shelf.corp" required minlength="1" maxlength="100">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 form-control-label" for="fullname">联系人姓名</label>
        <div class="col-md-6">
          <input id="fullname" name="fullname" class="form-control" placeholder="联系人姓名" v-model="shelf.fullname" required minlength="1" maxlength="100">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 form-control-label" for="mobile">联系人手机</label>
        <div class="col-md-6">
          <input id="mobile" name="mobile" class="form-control" placeholder="联系人手机" v-model="shelf.mobile" required>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 form-control-label" for="address">地址</label>
        <div class="col-md-6">
          <input id="address" name="address" class="form-control" placeholder="地址" v-model="shelf.address" required minlength="1" maxlength="100">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 form-control-label" for="level">货架层数</label>
        <div class="col-md-6">
          <p class="form-control-static" v-if="id">{{shelf.level}}</p>
          <select id="level" name="level" class="form-control" v-model="shelf.level" v-else>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
      <hr>
      <div class="form-group row">
        <label class="col-md-2 form-control-label" for="comment">备注</label>
        <div class="col-md-6">
          <textarea id="comment" name="comment" rows="4" class="form-control" placeholder="备注" v-model="shelf.comment" maxlength="200"></textarea>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 form-control-label" for="visible">是否可用</label>
        <div class="col-md-10">
          <label class="switch switch-3d switch-primary">
            <input type="checkbox" class="switch-input" v-model="shelf.visible" id="visible" name="visible" :true-value="1" :false-value="0">
            <span class="switch-label"></span>
            <span class="switch-handle"></span>
          </label>
        </div>
      </div>
      <div class="alert offset-2" :class="'alert-' + status" v-if="message">
        {{message}}
      </div>
      <div class="form-group row">
        <div class="col-sm-10 offset-2">
          <button class="btn btn-primary" :disabled="preventSubmit">
            <i class="fa fa-spin fa-spinner" v-if="loading"></i>
            <i class="fa fa-check" v-else></i>
            保存
          </button>
          <a href="#/shelf/list" class="btn btn-link">取消</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import _ from 'lodash';

  const DICT = {
    corp: '公司名称',
    fullname: '联系人姓名',
    address: '联系人地址'
  };

  export default {
    data() {
      return {
        id: 0,
        shelf: {
          corp: '',
          fullname: '',
          mobile: '',
          address: '',
          level: 1,
          comment: '',
          visible: 0
        },
        loading: false,
        message: '',
        status: ''
      };
    },
    computed: {
      API() {
        return this.$store.state.API;
      },
      preventSubmit() {
        return this.loading || this.status === 'success';
      }
    },
    created() {
      this.id = this.$route.params.id;
      if (this.id) {
        this.loading = true;
        this.fetch();
      }
    },
    methods: {
      fetch() {
        return this.$http.get(`${this.API}shelf/${this.id}`)
          .then( response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then( json => {
            this.loading = false;
            this.shelf = json.shelf;
          })
          .catch( err => {
            alert('加载商品属性失败。' + err);
          })
      },
      save() {
        this.loading = true;
        let api = this.API + 'shelf';
        let method = this.id ? 'patch' : 'post';
        if (this.id) {
          api += '/' + this.id;
        }
        this.$http[method](api, this.shelf)
          .then( response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then( json => {
            if (json.code === 0) {
              if (!this.id) {
                _.mapObject(this.shelf, value => {
                  return _.isString(value) ? '' : 0;
                });
              }
              this.message = '保存成功';
              this.status = 'success';
              this.loading = false;
              setTimeout(() => {
                this.$router.push({
                  name: '货架管理'
                })
              }, 2500);
            } else {
              this.message = '保存失败。' + json.msg;
              this.status = 'danger';
            }
          })
          .catch( err => {
            if (err.status === 422) { // 提交数据有误，表单验证不通过
              err = '保存失败。' + _.map(err.body, (value, key) => {
                if (value instanceof Array) {
                  value = value.join('');
                }
                return value.replace(key, DICT[key]);
              }).join('; ');
            }
            this.message = err;
            this.status = 'danger';
            this.loading = false;
          });
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