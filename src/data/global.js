import {defaults, keyBy, map, uniq} from 'lodash';

const config = {
  original_price: {
    name: '正价',
    type: 'number',
    placeholder: '请填写分，比如 ￥9.9 对应 990 分'
  },
  discount_price: {
    name: '折后价',
    type: 'number',
  },
};

export function convertKeyToName(key) {
  return config[key] || key;
}

export function fillKeys(arr) {
  let obj = keyBy(arr, 'key');
  let keys = Object.keys(obj);
  keys = uniq(keys.concat(Object.keys(config)));
  return keys.map(key => {
    return {
      ...config[key],
      ...obj[key],
      key,
    };
  });
}