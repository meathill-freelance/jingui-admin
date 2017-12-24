/**
 * Created by Meathill on 2017/5/17.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import { API } from 'config';
import user from './user/';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

export default {
  state: {
    API: API,
    _token: '',
  },
  mutations,
  modules: {
    user
  }
};