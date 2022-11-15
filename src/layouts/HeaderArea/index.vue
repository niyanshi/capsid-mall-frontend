<template>
  <div class="header-area">
    <div class="left">
      <img :src="ImageLogo" alt="" @click="skipTo('/')" />
      <div class="line"></div>
      <nav>
        <div
          class="nav-item" :class="{ active: currentRouteName.indexOf('explore') === 0 }"
          @click="skipTo('/explore')">
          {{ t('nav[0]') }}
        </div>
        <div
          class="nav-item" :class="{ active: currentRouteName.indexOf('campaign') === 0 }"
          @click="skipTo('/campaign')">
          {{ t('nav[1]') }}
        </div>
        <div
          class="nav-item" :class="{ active: currentRouteName.indexOf('wear') === 0 }"
          @click="skipTo('/wear')">
          {{ t('nav[2]') }}
        </div>
      </nav>
    </div>

    <div class="right">
      <template v-if="userInfoStore.currentUser.isLogin">
        <div
          class="btn avatar"
          @mouseenter="handleMouseenter"
          @mouseleave="visibleRef = false"
        >
          <Avatar></Avatar>
          <transition v-show="visibleRef">
            <drop-down-box></drop-down-box>
          </transition>
        </div>
      </template>
      <template v-else>
        <div
          class="btn"
          @click="handleConnect"
        >
          <img
            :src="IconWallet"
            alt=""
          />
          {{ t('connect') }}
        </div>
      </template>
    </div>

    <!-- 钱包选择弹窗 -->
    <template v-if="userInfoStore.loginModalVisible">
      <wallet-connect-modal
:visible="userInfoStore.loginModalVisible"
        @close="userInfoStore.setLoginModalVisible(false)"></wallet-connect-modal>
    </template>
  </div>
</template>

<script setup lang="ts">
import ImageLogo from '@/assets//images/logo.png';
import IconWallet from '@/assets/icons/wallet.png';
import DropDownBox from '../DropDownBox/index.vue';
import WalletConnectModal from '@/components/WalletConnectModal/index.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/user-info';
// import { UserOutlined } from '@ant-design/icons-vue';
import { Avatar } from 'ant-design-vue';

const { t } = useI18n();
const router = useRouter();
const userInfoStore = useUserInfoStore();

const visibleRef = ref(false);

/**
 * 连接钱包事件
 */
const handleConnect = () => {
  if (userInfoStore.currentUser.isLogin) return;
  userInfoStore.setLoginModalVisible(true);
};
/**
 * 跳转路由
 * @param to 目标路由
 */
const skipTo = (to: string) => {
  router.push(to);
};

/** 当前路由名 */
const currentRouteName = computed(() => {
  const route = router.currentRoute;
  return String(route.value.name);
});

/** 鼠标进入事件 */
const handleMouseenter = () => {
  if (!userInfoStore.currentUser.isLogin) {
    return;
  }
  visibleRef.value = true;
};
</script>

<style soped lang="scss">
@import './index.scss';

.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
