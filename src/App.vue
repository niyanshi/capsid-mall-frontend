<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Router from './router';
import layouts from '@/layouts/index.vue';
import { onMounted, onUnmounted } from 'vue';
import { useUserInfoStore } from '@/stores/user-info';
import { useControllerStore } from '@/stores/controller';
import { message } from 'ant-design-vue';
import BaseLoading from '@/components/BaseLoading/index.vue';
import { httpGetType } from './api/nfr';
import { httpGetAccount } from './api/profile';

const { t } = useI18n();
const route = useRoute();
const userInfoStore = useUserInfoStore();
const controllerStore = useControllerStore();
const { ethereum } = window;

/** 账户切换时执行事件 */
const execAccountCahngedEvent = (account: unknown) => {
  if (!userInfoStore.currentUser.isLogin) return;
  const [address] = account as string[];
  if (userInfoStore.currentUser.publicKey.toLowerCase() === address.toLowerCase()) return;
  userInfoStore.logout();
  userInfoStore.setLoginModalVisible(true);
  message.warn(t('warn-msg.relogin'));
};

/** 获取type类型 */
const getNFRType = async () => {
  const res = await httpGetType();
  const arr = res.data.map((item: Record<string, string>) => ({ id: item.id, name: item.name }));
  controllerStore.setNFRTypeList(arr);
};

/** 获取用户账户信息 */
const fetchUserInfo = async () => {
  if (!userInfoStore.currentUser.isLogin) return;
  const accountAdr = userInfoStore.currentUser.publicKey;
  const res = await httpGetAccount({ accountAdr });
  if (res.code !== 0) {
    message.error(res.msg);
    return;
  }
  const { avartar: avatar, id: userId } = res.data;
  userInfoStore.setCurrentUser({
    avatar,
    userId,
  });
};

onMounted(() => {
  fetchUserInfo();
  getNFRType();
  // 导航后置钩子
  Router.afterEach((to) => {
    if (to.meta.title) {
      document.title = t(String(to.meta.title));
    }
  });
  // 监听账号切换
  if (ethereum) ethereum.on('accountsChanged', execAccountCahngedEvent);
});

onUnmounted(() => {
  // 移除账号切换监听
  if (ethereum) ethereum.removeListener('accountsChanged', execAccountCahngedEvent);
});
</script>

<template>
  <layouts>
    <router-view :key="route.fullPath"></router-view>
  </layouts>

  <!-- 全局loading -->
  <template v-if="controllerStore.globalLoading">
    <base-loading :visible="true"></base-loading>
  </template>
</template>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  font-family: Roboto, sans-serif;
  font-style: normal;
  background-color: #fff;

  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  ::-webkit-resizer {
    background-color: transparent;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background-color: $main-color;
    border-radius: 8px;
  }
}
</style>
