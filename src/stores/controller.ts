/**
 * @file 存储控制状态的一些变量
 */

import { defineStore } from 'pinia';

interface INFRTypeItem {
  id: string;
  name: string;
}
export const useControllerStore = defineStore('contoller', {
  state: () => ({
    globalLoading: false,
    globalTip: '',
    nfrType: [] as INFRTypeItem[],
    // 购买的订单obj
    orderObjForBuy: {
      id: '',
      order: '',
      amount: '',
    },
    modelVisibleForBuy: false,
  }),
  actions: {
    setGlobalLoading(payload: boolean) {
      this.globalLoading = payload;
      this.globalTip = '';
    },
    setGlobalTip(payload: string) {
      this.globalTip = payload;
    },
    setNFRTypeList(payload: INFRTypeItem[]) {
      this.nfrType = payload;
    },
    setOrderObjForBuy(payload: Partial<Record<'id' | 'order' | 'amount', string>>) {
      const { id, order, amount } = payload;
      if (id) this.orderObjForBuy.id = id;
      if (order) this.orderObjForBuy.order = order;
      if (amount) this.orderObjForBuy.amount = amount;
    },
    setModelVisibleForBuy(payload: boolean) {
      this.modelVisibleForBuy = payload;
      if (!this.modelVisibleForBuy) {
        this.orderObjForBuy.id = '';
        this.orderObjForBuy.order = '';
        this.orderObjForBuy.amount = '';
      }
    },
  },
});
