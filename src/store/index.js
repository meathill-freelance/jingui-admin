/**
 * Created by Meathill on 2017/5/17.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import user from './user/';
import mutations from './mutations';

Vue.use(Vuex);

export default {
  state: {
    _token: '',
  },
  mutations,
  modules: {
    user
  }
};