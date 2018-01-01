import {type} from 'src/data/exercise';

export default {
  filters: {
    toType(key) {
      return type[key];
    },
  },
};