import { MockMethod } from 'vite-plugin-mock';
import { mock } from 'mockjs';

const prefix = '/mock/index';

export default [
  // 获取随机字符串
  {
    url: `${prefix}/get-random-string`,
    method: 'get',
    response: () => {
      const res = mock({
        data: '@guid',
      });

      return {
        code: 0,
        data: res.data,
        msg: 'ok',
      };
    },
  },

  // 获取模拟token
  {
    url: `${prefix}/get-token`,
    method: 'get',
    response: () => {
      const res = mock({
        data: '@guid',
      });

      return {
        code: 0,
        data: res.data,
        msg: 'ok',
      };
    },
  },
] as MockMethod[];
