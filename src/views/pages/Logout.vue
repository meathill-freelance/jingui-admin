<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row">
        <div class="col-sm-8 offset-2">
          <div class="alert" :class="'alert-' + status" v-if="message">
            <i class="fa fa-times"></i>
            {{message}}
          </div>
          <div class="alert alert-info" v-else>
            正在为您退出登录，请稍候....
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {API} from 'config';
import * as MutationTypes from '../../store/mutation-types';

export default {
  data() {
    return {
      status: 'danger',
      message: ''
    }
  },
  created() {
    this.$http.post(API + 'logout')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        if (json.code !== 0) {
          throw new Error('退出登录失败，请稍后重试。');
        }
        this.$store.commit(MutationTypes.REMOVE_TOKEN);
        // 登出后要再请求一次 /login 获取到 _token
        return this.$http.get(API + 'login');
      })
      .catch(response => {
        if (response.status === 401) {
          return response.json();
        }
        throw new Error('Fetch token. ' + response.statusText);
      })
      .then(json => {
        this.$store.commit(MutationTypes.SET_TOKEN, json._token);
        this.status = 'success';
        this.message = '退出登录已完成，将于 3 秒后跳回登录页面。';
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);
      })
      .catch(err => {
        this.message = err;
      });
  }
}
</script>