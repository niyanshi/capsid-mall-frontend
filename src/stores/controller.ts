/**
 * @file 存储控制状态的一些变量
 */

import { defineStore } from 'pinia';
import { IWearItem } from '@/types/campaign';

interface INFRTypeItem {
  id: string;
  name: string;
}

interface ICurrentInteractToken {
  id?: string | number;
  title?: string;
  tip?: string;
  image?: string;
  name?: string;
  itemPrice?: string | number;
  quantity?: string | number;
  chain?: string;
  nft?: boolean;
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
    limitForBuy: 10,

    swapVisible: false,

    switchNetworkVisible: false,
    // 当前进行交互的nfr
    currentInteractNFR: {
      id: '',
      title: '',
      tip: '',
      image: '',
      name: '',
      itemPrice: '',
      quantity: '',
      chain: '',
    } as ICurrentInteractToken,

    // wear的服饰信息
    itemToWear: {
      image: '',
      tokenId: '',
      type: -1,
      tokenAddress: '',
    },
  }),
  actions: {
    setCurrentInteractNFR(payload: ICurrentInteractToken) {
      this.currentInteractNFR = payload;
    },
    setSwitchNetworkVisible(payload: boolean) {
      this.switchNetworkVisible = payload;
    },
    setSwapVisible(payload: boolean) {
      this.swapVisible = payload;
    },
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
    setLimitForBuy(payload: number) {
      this.limitForBuy = payload;
    },
    setModelVisibleForBuy(payload: boolean) {
      this.modelVisibleForBuy = payload;
      if (!this.modelVisibleForBuy) {
        this.orderObjForBuy.id = '';
        this.orderObjForBuy.order = '';
        this.orderObjForBuy.amount = '';
      }
    },
    setItemToWear(payload: IWearItem) {
      const { image, tokenId, type, tokenAddress } = payload;
      if (image) this.itemToWear.image = image;
      if (tokenId) this.itemToWear.tokenId = tokenId;
      if (type) this.itemToWear.type = type;
      if (tokenAddress) this.itemToWear.tokenAddress = tokenAddress;
    },
  },
});
