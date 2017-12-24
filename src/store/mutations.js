/**
 * Created by meathill on 2017/5/20.
 */

import * as types from './mutation-types';

export default {
  [types.SET_ERROR] (state, value) {
    state.error = value;
  },
  [types.SET_TOKEN] (state, token) {
    state._token = token;
  },
  [types.REMOVE_TOKEN] (state) {
    state._token = '';
  }
};