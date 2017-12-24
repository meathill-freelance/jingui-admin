/**
 * Created by meathill on 2017/5/31.
 */

import _ from 'underscore';

export function buildParam(obj) {
  let result = [];
  _.each(obj, (value, key) => {
    result.push(`${key}=${value}`);
  });
  return result.join('&');
}