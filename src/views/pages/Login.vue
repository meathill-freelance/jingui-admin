<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <form @submit.prevent="login" class="col-md-8">
          <div class="card p-4">
            <div class="card-block">
              <h1>熊领巾管理系统</h1>
              <p class="text-muted">欢迎使用，祝您一天好心情。</p>
              <p class="alert alert-danger" v-if="errorMessage" v-text="errorMessage"></p>
              <div class="input-group mb-3">
                <span class="input-group-addon"><i class="icon-user"></i></span>
                <input class="form-control" placeholder="用户名" name="name" required>
              </div>
              <div class="input-group mb-4">
                <span class="input-group-addon"><i class="icon-lock"></i></span>
                <input type="password" class="form-control" placeholder="密码" name="password" required>
              </div>
              <button class="btn btn-primary px-4" :disabled="loading">
                <i class="fa fa-spin fa-spinner" v-if="loading"></i> 登录
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {API} from 'config';
import _ from 'underscore';
import * as MutationTypes from '../../store/user/mutation-types';
import * as StoreMutationsTypes from '../../store/mutation-types';
import * as ActionTypes from '../../store/action-types';

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      waiting: false,
      errorMessage: null,
      redirectTo: null
    }
  },
  created() {
    if (this.$route.params.fetch) {
      alert('登录已失效，请重新登录。');
      this.loading = true;
      this.redirectTo = this.$route.params.redirectTo;
      this.$http.get(API + 'login')
        .then(response => {
          if (response.ok) {
            alert('您已处于登录状态');
            return;
          }
          throw new Error(response.statusText);
        })
        .catch(err => {
          this.$store.commit(StoreMutationsTypes.SET_TOKEN, err.body._token);
          this.loading = false;
        });
    }
  },
  methods: {
    login(event) {
      this.loading = true;
      let data = new FormData();
      let elements = event.target.elements;
      data.append('name', elements.name.value);
      data.append('password', elements.password.value);
      this.$http.post(API + 'login', data)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(json => {
          this.$store.commit(MutationTypes.SET_USER_INFO, json.user);
          this.$router.push({
            path: this.redirectTo || '/'
          });
        })
        .catch(err => {
          if ('status' in err && 'body' in err) {
            err = err.body.msg;
          }
          if (err instanceof Error) {
            err = err.name + ': ' + err.message;
          }
          this.errorMessage = '登录失败。' + err;
          this.loading = false;
        });
    }
  }
}
</script>
