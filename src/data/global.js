import {keyBy, uniq} from 'lodash';

const config = {
  original_price: {
    name: '正价',
    type: 'number',
    placeholder: '请填写分，比如 ￥9.9 对应 990 分',
  },
  original_price_title: {
    name: '正价名称',
    placeholder: '默认"土豪模式"',
  },
  original_price_label: {
    name: '正价描述',
    placeholder: '默认"99元，原价直接购买"',
  },
  discount_price: {
    name: '折后价',
    type: 'number',
    placeholder: '请填写分，比如 ￥9.9 对应 990 分',
  },
  discount_price_title: {
    name: '折扣价名称',
    placeholder: '默认"优惠模式"',
  },
  discount_price_label: {
    name: '折后价描述',
    placeholder: '默认"9.9元，分享至考研微信群后购买"',
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
  share_title: {
    name: '分享标题',
    type: 'text',
    placeholder: '分享标题',
  },
  share_content: {
    name: '分享文案',
    type: 'longtext',
    placeholder: '可以直接回车',
  },
  shared_content: {
    name: '分享后文案',
    type: 'longtext',
    placeholder: '可以直接回车',
  },
  has_cs_discount: {
    name: '禁用分享后是否允许客服改价',
    type: 'select',
    options: [
      {
        id: 0,
        label: '允许',
      },
      {
        id: 1,
        label: '不允许',
      },
    ],
    default: 0,
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