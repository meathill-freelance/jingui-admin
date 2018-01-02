import axios from 'axios';
import * as actionTypes from './action-types';
import * as mutationTypes from './mutation-types';

const requests = {};

const state = {
  season: null,
};

const actions = {
  [actionTypes.GET_SEASONS]({state, commit}, {force = false} = {}) {
    if (!force && state.season) {
      return Promise.resolve({
        data: state.season,
      });
    }

    if (requests[actionTypes.GET_SEASONS]) {
      return requests[actionTypes.GET_SEASONS];
    }

    const promise = axios.get('season')
      .then(response => {
        commit(mutationTypes.SET_SEASONS, response.data);
        response[actionTypes.GET_SEASONS] = null;
      });
    requests[actionTypes.GET_SEASONS] = promise;
    return promise;
  }
};

const mutations = {
  [mutationTypes.SET_SEASONS](state, season) {
    state.season = season;
  },
};

export default {
  namespaced: true,

  state,
  mutations,
  actions,
};