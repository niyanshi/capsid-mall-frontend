<template>
  <div class="drop-down-box">
    <div
      class="item"
      :class="{ disable: !userInfoStore.currentUser.isLogin }"
      @click="skipToProfile"
    >
      <img
        :src="IconProfile"
        alt=""
      />
      {{ t('menu-items[0]') }}
    </div>
    <div
      class="item"
      :class="{ disable: !userInfoStore.currentUser.isLogin }"
      @click="handleLogOut"
    >
      <img
        :src="IconExit"
        alt=""
      />
      {{ t('menu-items[1]') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import IconExit from '@/assets/icons/exit.svg';
import IconProfile from '@/assets/icons/profile.svg';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useUserInfoStore } from '@/stores/user-info';

const { t } = useI18n();
const userInfoStore = useUserInfoStore();
const router = useRouter();

/**
 * 跳转到个人中心页
 */
const skipToProfile = () => {
  if (!userInfoStore.currentUser.isLogin) return;
  console.log('profile:',userInfoStore.currentUser.publicKey);
  router.push(`/profile/${userInfoStore.currentUser.publicKey}`);
};
/**
 * 退出登录
 */
const handleLogOut = () => {
  if (!userInfoStore.currentUser.isLogin) return;
  userInfoStore.logout();
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
