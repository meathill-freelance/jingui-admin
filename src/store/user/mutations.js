/**
 * Created by Meathill on 2017/5/17.
 */

import _ from 'lodash';
import * as types from './mutation-types';

export default {
  [types.SET_USER_INFO] (state, info) {
    _.each(info, (value, key) => {
      state[key] = value;
    });
  }
}