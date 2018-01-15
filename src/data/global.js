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
  share_count: {
    name: '每个群最高可分享次数',
    type: 'number',
    placeholder: '超过这个数字的分享被视作无效',
    default: 3,
  },
  is_all_open: {
    name: '是否将所有课程项所有学院开放',
    type: 'select',
    options: [
      {
        id: 0,
        label: '不要',
      },
      {
        id: 1,
        label: '是的',
      },
    ],
    default: 0,
  },
  intro_link: {
    name: '活动详情的链接',
    type: 'url',
    placeholder: '请输入完整 URL',
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