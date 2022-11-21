<template>
  <base-overlay
    :visible="props.visible"
    @close="handleClose"
  >
    <div class="wallet-connect-modal">
      <div class="close">
        <img
          :src="IconClose"
          alt=""
          @click="handleClose"
        />
      </div>
      <div class="title">
        <img
          :src="ImageLogo"
          alt=""
        />
        <div class="line"></div>
        <div class="text">
          {{ t('connect-title') }}
        </div>
      </div>

      <div class="btn">
        <div
          class="item"
          @click="handleConnectWallet()"
        >
          <img
            class="icon"
            :src="IconMetamask"
            alt=""
          />
          <div class="name">MetaMask</div>
        </div>
        <div class="item">
          <img
            class="icon"
            :src="IconWalletConnect"
            alt=""
          />
          <div class="name">Wallet Connect</div>
          <div class="tip">{{ t('not-online') }}</div>
        </div>
      </div>
    </div>
  </base-overlay>
</template>

<script setup lang="ts">
import BaseOverlay from '../BaseOverlay/index.vue';
import IconClose from '@/assets/icons/close.png';
import IconMetamask from '@/assets/icons/metamask.png';
import IconWalletConnect from '@/assets/icons/wallet-connect.png';
import ImageLogo from '@/assets/images/logo.png';
import { useI18n } from 'vue-i18n';
import useMetaMask from '@/hooks/useMetaMask';
import { httpGetToken } from '@/api/common';
import storage from '@/utils/storage';
import { useUserInfoStore } from '@/stores/user-info';
import { message } from 'ant-design-vue';

const { t } = useI18n();
const { connectWallet: connectMetaMask } = useMetaMask();
const userInfoStore = useUserInfoStore();
const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ (event: 'close'): void }>();

/** 关闭遮罩 */
const handleClose = () => {
  emit('close');
};

/** 钱包连接逻辑 */
const handleConnectWallet = async () => {
  try {
    // 连接钱包获取签名和公钥
    const resInfo = await connectMetaMask();
    // 获取token
    const resToken = await httpGetToken({
      signature: resInfo.signature,
      address: resInfo.address,
      chain: resInfo.chain,
    });
    storage.setToken(resToken.data.token);
    storage.setPublicKey(resInfo.address);
    storage.setUserId(resToken.data.userId);

    userInfoStore.setCurrentUser({
      token: resToken.data.token,
      publicKey: resInfo.address,
      userId: resToken.data.userId,
    });
    handleClose();
    message.info('Login successfully');
    location.reload();
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
