/**
 * Created by Meathill on 2017/5/17.
 */

import * as types from './action-types';
import * as MutationTypes from './mutation-types';
import { API } from 'config';

export default {
  [types.FETCH_TOKEN] ({commit}) {
    Vue.http.get(API + 'login')
      .then( response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then( json => {
        if (json._token) {
          commit(MutationTypes.SET_TOKEN, json._token);
        } else {
          alert('获取 token 失败');
        }
      })
      .catch( err => {
        alert(err);
      });
  }
}