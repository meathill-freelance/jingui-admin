import {type} from '@/data/exercise';

export const mixin = {
  filters: {
    toDate(time) {
      return time.substr(0, 10);
    },
    toType(key) {
      return type[key];
    },
  },
};