import _ from 'lodash';
import { byOS, OS } from './util';

_.functions
const testFunc = () => {
  console.log('testFunc');
};

let tmp = byOS<Function>(
  {
    [OS.Windows]: testFunc
  },
  _.noop
)();
