/**
 * @file 存储控制状态的一些变量
 */

import { defineStore } from 'pinia';

export const useControllerStore = defineStore('contoller', {
  state: () => ({
    globalLoading: false,
  }),
  actions: {
    setGlobalLoading(payload: boolean) {
      this.globalLoading = payload;
    },
  },
});
