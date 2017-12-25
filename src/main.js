import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './router';
import base  from './store';
import * as UserMutations from './store/user/mutation-types';
import * as MutationTypes from './store/mutation-types';

let store = new Vuex.Store(base);
let _status;

/* global API */
axios.defaults.baseURL = API;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.interceptors.response.use(response => {
  if ((response.status === 401 && store.state._token) || (!response.ok && response.status === 0)) {
    router.push({
      name: 'Login',
      params: {
        fetch: true,
        redirectTo: location.hash.substr(1)
      }
    });
  }
  return response;
});


new Vue({
  el: '#app',
  router,
  store
});
let headers = new Headers();
headers.append('Accept', 'application/json');

fetch(API + 'login', {
  mode: 'cors',
  headers: headers,
  credentials: 'include'
})
  .then( response => {
    if (response.status === 401) {
      _status = response.status;
      return response.json();
    }
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network error');
  })
  .then( json => {
    store.commit(MutationTypes.SET_TOKEN, json._token);
    if (_status === 401) {
      router.push('/login');
      return;
    }
    store.commit(UserMutations.SET_USER_INFO, json.user);
  })
  .catch( err => {
    store.commit(MutationTypes.SET_ERROR, err);
    router.push('/error/500');
  });