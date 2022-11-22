<template>
  <div class="explore">
    <router-view></router-view>
  </div>

  <!-- 购买输入框 -->
  <template v-if="controllerStore.modelVisibleForBuy">
    <purchasing-box
      :visible="controllerStore.modelVisibleForBuy"
      @buy="handleBuy"
      @close="controllerStore.setModelVisibleForBuy(false)"
    ></purchasing-box>
  </template>
</template>

<script setup lang="ts">
import { httpBuyNFRs, httpNoticeStatus } from '@/api/nfr';
import PurchasingBox from '@/components/PurchasingBox/index.vue';
import useSeaport from '@/hooks/useSeaport';
import { useControllerStore } from '@/stores/controller';
import { useUserInfoStore } from '@/stores/user-info';
import { ERR, EV_RELOAD_NFR_LIST } from '@/utils/constant';
import emitter from '@/utils/event';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const userInfoStore = useUserInfoStore();
const controllerStore = useControllerStore();
const { buyNFR } = useSeaport();
const { t } = useI18n();
const router = useRouter();

/** buy NFR */
const handleBuy = async (amount: string) => {
  if (userInfoStore.currentChainId !== Number(import.meta.env.VITE_CHAINID)) {
    message.error('You are not connected to the correct network environment! ');
    return;
  }
  controllerStore.setGlobalLoading(true);
  const { order, id } = controllerStore.orderObjForBuy;
  const res = await httpBuyNFRs(String(id), amount);
  if (res.code !== 0) {
    message.error(res.msg);
    controllerStore.setGlobalLoading(false);
    return;
  }
  try {
    const orderId = res.data.nfrTrans.nfrTokenId;
    await buyNFR({ order, orderId, amount });
    await httpNoticeStatus(res.data.nfrTrans.id, 'submitted');
    message.info(t('info-msg.success'));
    if (router.currentRoute.value.path.includes('nfr-details')) {
      router.back();
    } else {
      emitter.emit(EV_RELOAD_NFR_LIST);
    }
  } catch (error) {
    await httpNoticeStatus(res.data.nfrTrans.id, 'failed');
    const { code } = error as IOpenseaErrorType;
    console.log({ code });
    if (code === ERR.RejectMessage) {
      message.error(t('err-msg.reject'));
    } else if (
      (error as Error).message.includes('transaction may fail or may require manual gas limit')
    ) {
      message.error('network problem');
    } else {
      message.error((error as Error).message);
    }
    console.error(error);
  } finally {
    controllerStore.setGlobalLoading(false);
    controllerStore.setModelVisibleForBuy(false);
  }
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
