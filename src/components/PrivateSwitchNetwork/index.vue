<template>
  <BaseDialog
    :visible="dialogVisible"
    width="740"
    height="200"
    :mask-disable="true"
    @close="handleSwitchNetworkDialogClose"
  >
    <div class="tip-content">
      <div class="info-text">
        <div class="info-title">{{ t('ErrorNetwork') }}</div>
      </div>
    </div>
    <template #button>
      <div
        class="dialog-button"
        @click="handleSwitchNetworkConfirm"
      >
        <span>{{ t('ok') }}</span>
        <i class="icon-ok"></i>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog/index.vue';
import { useI18n } from 'vue-i18n';
import useMetaMask from '@/hooks/useMetaMask';

const { t } = useI18n();
const { switchToOtherNetwork } = useMetaMask();

defineProps({
  dialogVisible: Boolean
});
const emit = defineEmits(['close']);
const handleSwitchNetworkDialogClose = () => {
  emit('close');
};
// 确认切换
const handleSwitchNetworkConfirm = () => {
  emit('close');
  switchToOtherNetwork(import.meta.env.VITE_CHAINID);
};
</script>

<style lang="scss" scoped>
.tip-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .icon {
    display: inline-block;
    width: 64px;
    height: 64px;
    margin-right: 24px;
  }

  .info-title {
    margin-bottom: 16px;
    font-family: 'Quiet Sans';
    font-size: 24px;
    font-style: normal;
    font-weight: 800;
    font-feature-settings: 'pnum' on, 'lnum' on;
    line-height: 35px;
    color: #000;
    letter-spacing: 0.02em;
  }

  .message {
    width: 370px;
    font-family: Roboto;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 26px;
    color: #4d4d4d;
    letter-spacing: 0.02em;

    a {
      margin-left: 5px;
      font-style: oblique;
      color: #f1b540;
      cursor: pointer;
    }

    p {
      margin: 0;
    }
  }
}

.icon-success {
  background-image: url('../../assets/icons/party-popper.png');
  background-size: contain;
}

.dialog-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 188px;
  height: 56px;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 23px;
  color: #fcf5c5;
  text-transform: uppercase;
  cursor: pointer;
  background: #a32015;
  border-radius: 32px;
  box-shadow: 2px 2px 20px 10px rgb(163 32 21 / 8%);

  i {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-left: 8px;
    background-size: contain;
  }

  .icon-ok {
    background-image: url('../../assets/icons/icon-ok.png');
  }
}
</style>
