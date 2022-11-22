/**
 * @file 存储用信息的全局state
 */

// import Router from '@/router';
import storage from '@/utils/storage';
import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    // 当前用户信息
    currentUser: {
      isLogin: !!storage.getToken(),
      token: storage.getToken(),
      publicKey: storage.getPublicKey() || '',
      userId: '',
      avatar: '',
    },
    // 登录弹窗显示
    loginModalVisible: false,

    // 当前连接网络
    currentChainId: -1,
  }),
  persist: true,
  actions: {
    setCurrentUser(payload: Record<string, unknown>, isLogin = true) {
      Object.assign(this.currentUser, payload);
      this.currentUser.isLogin = isLogin;
    },
    setLoginModalVisible(payload: boolean) {
      this.loginModalVisible = payload;
    },
    /** 退出登录 */
    logout() {
      Object.assign(this.currentUser, {});
      this.currentUser.isLogin = false;
      storage.removeToken();
      storage.removePublicKey();
    },

    setCurrentChainId(payload: string | number) {
      this.currentChainId = Number(payload);
    },
  },
});
