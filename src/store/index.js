/**
 * Created by Meathill on 2017/5/17.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import season from './season/';
import user from './user/';
import mutations from './mutations';

Vue.use(Vuex);

export default {
  state: {
    _token: '',
  },
  mutations,
  modules: {
    season,
    user,
  },
};