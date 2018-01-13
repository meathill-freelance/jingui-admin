import {keyBy, uniq} from 'lodash';

const config = {
  original_price: {
    name: '正价',
    type: 'number',
    placeholder: '请填写分，比如 ￥9.9 对应 990 分',
  },
  discount_price: {
    name: '折后价',
    type: 'number',
    placeholder: '请填写分，比如 ￥9.9 对应 990 分',
  },
  has_discount: {
    name: '是否支持分享折扣',
    type: 'select',
    options: [
      {
        id: 0,
        label: '支持',
      },
      {
        id: 1,
        label: '不支持',
      },
    ],
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