import {keyBy, uniq, } from 'lodash';

const config = {
  open_groups: {
    name: '是否打开首页的微信群',
    type: 'select',
    options: [
      {
        id: 1,
        label: '打开',
      },
      {
        id: 0,
        label: '不打开',
      },
    ],
    hint: '默认为不打开',
  },
};

export function convertKeyToName (key) {
  return config[key] || key;
}

export function fillKeys (arr) {
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
