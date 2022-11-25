<template>
  <div class="wrap">
    <div class="title">
      <img
        src="../../assets/icons/gold.png"
        alt=""
      />
      <span>{{ campaignNft?.name }}</span>
    </div>
    <div
      v-if="currentNft"
      class="info-wrap"
    >
      <div class="image" style="display: flex; justify-content: center; align-items: center">
        <PrivateImage class="info-img" :src="(campaignNft?.imageUrl as string)"></PrivateImage>
      </div>
      <div class="text">
        <div class="desc">{{ campaignNft?.description }}</div>
        <div class="price">
          <span class="icon-price"></span>
          <span>{{ currentNft?.unitPrice }}</span>
        </div>
        <div
          v-if="
            currentNfr?.nftOwnerAddress !== userInfoStore.currentUser.publicKey &&
            currentNft.status !== 'complete'
          "
          class="buy-button nft"
          @click="handleBuyNFTClick"
        >
          <span>{{ t('buyNft') }}</span>
          <span class="button-icon nft-money"></span>
        </div>
      </div>
    </div>
    <div
      v-if="currentNfr"
      class="info-wrap"
    >
      <div class="image">
        <BaseNFRImage :src="(campaignNft?.imageUrl as string)" />
      </div>

      <div class="text">
        <div class="desc">{{ currentNfr?.description }}</div>
        <div class="price">
          <span class="icon-price"></span>
          <span>{{ currentNfr?.unitPrice }}</span>
        </div>
        <div class="expire">
          <div class="expire-date mb41">
            <span class="start-icon calendar-icon"></span>
            <span>{{
              dayjs(currentNfr?.createdAt)
                .add(currentNfr?.duration as number, 'day')
                .format('DD/MM/YYYY')
            }}</span>
            <!-- <span class="end-icon"></span> -->
          </div>
          <div class="expire-date">
            <span class="start-icon book-icon"></span>
            <span>{{
              available(currentNfr?.selledAmount as number, currentNfr?.amount as number) +
              '/' +
              currentNfr?.amount
            }}</span>
            <!-- <span class="end-icon"></span> -->
          </div>
        </div>
        <div
          v-if="currentNfr?.nftOwnerAddress !== userInfoStore.currentUser.publicKey"
          class="buy-button nfr"
          @click="handleBuyNFRClick"
        >
          <span>{{ t('buyNfr') }}</span>
          <span class="button-icon nfr-money"></span>
        </div>
      </div>
    </div>
    <PrivateWearDialog
      :visible="dialogVisible"
      :item-to-wear="itemToWear"
      @close="handleDialogClose"
      @result="handleWearRes"
    ></PrivateWearDialog>
    <BaseDialog
      :visible="resultDialogVisible"
      width="640"
      height="240"
      :mask-disable="true"
      @close="handleResultDialogClose"
    >
      <div
        v-if="resultSuccess"
        class="tip-content"
      >
        <i class="icon-success icon"></i>
        <div class="info-text">
          <div class="info-title">{{ t('wearSuccess') }}</div>
          <div class="message">
            <!-- <p>{{ t('viewInMy') }}<a>{{ t('profile') }}</a></p> -->
            <p>{{ t('wearSuccessTips') }}</p>
          </div>
        </div>
      </div>
      <div
        v-else
        class="tip-content"
      >
        <i class="icon-error icon"></i>
        <div class="info-text">
          <div class="info-title">{{ t('error') }}</div>
          <div class="message">
            <p>{{ t('errorTips') }}</p>
          </div>
        </div>
      </div>
      <template #button>
        <div
          class="dialog-button"
          @click="handleResDislogClick"
        >
          <span>{{ t('ok') }}</span>
          <i class="icon-ok"></i>
        </div>
      </template>
    </BaseDialog>
    <template v-if="amountDialogVisible">
      <purchasing-box
        :visible="amountDialogVisible"
        @buy="handleBuy"
        @close="amountDialogVisible = false"
      ></purchasing-box>
    </template>
  </div>
</template>

<script setup lang="ts">
import BaseNFRImage from '@/components/BaseNFRImage/index.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import BaseDialog from '@/components/BaseDialog/index.vue';
import { httpCampaignNFTDetail } from '@/api/campaign';
import { httpBuyNFRs, httpNoticeStatus } from '@/api/nfr';
import { httpBuyNFT } from '@/api/nft';
import { INFT, IRequestV } from '../../types/campaign';
import dayjs from 'dayjs';
import PrivateWearDialog from '@/components/PrivateWearDialog/index.vue';
import useSeaport from '@/hooks/useSeaport';
import { useUserInfoStore } from '@/stores/user-info';
import { message } from 'ant-design-vue';
import PurchasingBox from '@/components/PurchasingBox/index.vue';
import { ERR } from '@/utils/constant';
import { useControllerStore } from '@/stores/controller';
import PrivateImage from '@/components/PrivateImage/index.vue';

const { buyNFR, buyNFT, poll } = useSeaport();
const { t } = useI18n();
const route = useRoute();
const userInfoStore = useUserInfoStore();
const controllerStore = useControllerStore();

const nftId = ref<string>();
const campaignNft = ref<INFT>();
const currentNft = ref<IRequestV>();
const currentNfr = ref<IRequestV>();
const itemToWear = ref<{
  image: string;
  tokenId: string;
  // eslint-disable-next-line no-magic-numbers
  type: 1 | 2;
  tokenAddress: string;
}>();
// 弹窗
const dialogVisible = ref(false);
const amountDialogVisible = ref(false);
const resultDialogVisible = ref(false);
const resultSuccess = ref(false);

/**获取相关数据*/
const getNFTDetail = async () => {
  const res = await httpCampaignNFTDetail(Number(nftId.value));
  campaignNft.value = res.data.campaignNft;
  currentNft.value = res.data.nftRequestVO;
  currentNfr.value = res.data.nfrRequestVO;
};
// 可用
const available = (sell: number, amount: number) => amount - sell;

const handleBuyNFTClick = async () => {
  if (!userInfoStore.currentUser.isLogin) {
    userInfoStore.setLoginModalVisible(true);
    message.warn(t('warn-msg.needLogin'));
    return;
  }
  const { orderOnChain } = currentNft.value as IRequestV;
  const order = JSON.parse(orderOnChain);
  controllerStore.setGlobalLoading(true);
  try {
    const res1 = await buyNFT(order, userInfoStore.currentUser.publicKey);
    const pollRes = await poll(res1.hash);
    if (pollRes) {
      const res2 = await httpBuyNFT({ nftOrderId: currentNft.value?.id, status: 'complete' });
      if (res2.code === 0) {
        message.success('You have purchased successfully');
        controllerStore.setGlobalLoading(false);
        dialogVisible.value = true;
        itemToWear.value = {
          image: (currentNft.value as IRequestV).image,
          tokenId: (currentNft.value as IRequestV).nfrTokenAddress,
          type: 1,
          tokenAddress: (currentNft.value as IRequestV).nftTokenAddress,
        };
      }
    } else {
      controllerStore.setGlobalLoading(false);
      message.warning(t('warn-msg.viewSoon'));
    }
  } catch (error) {
    controllerStore.setGlobalLoading(false);
    const completeReason = 'The order you are trying to fulfill is already filled';
    message.error((error as Error).message);
    if ((error as Error).message === completeReason) {
      await httpBuyNFT({ nftOrderId: currentNft.value?.id, status: 'complete' });
    }
  }
};
/** 购买nfr */
const handleBuyNFRClick = async () => {
  if (!userInfoStore.currentUser.isLogin) {
    userInfoStore.setLoginModalVisible(true);
    message.warn(t('warn-msg.needLogin'));
    return;
  }
  controllerStore.setLimitForBuy(
    Number(currentNfr.value?.amount) - Number(currentNfr.value?.selledAmount),
  );
  amountDialogVisible.value = true;
};
const handleBuy = async (amount: string) => {
  controllerStore.setGlobalLoading(true);
  const { orderOnChain: order, id } = currentNfr.value as IRequestV;
  const res = await httpBuyNFRs(String(id), amount);
  if (res.code !== 0) {
    message.error(res.msg);
    controllerStore.setGlobalLoading(false);
    return;
  }
  try {
    const orderId = res.data.nfrTrans.nfrTokenId;
    const res1 = await buyNFR({ order, orderId, amount });
    const pollRes = await poll(res1.hash);
    if (pollRes) {
      const res2 = await httpNoticeStatus(res.data.nfrTrans.id, 'submitted', res1.hash);
      if (res2.code === 0) {
        controllerStore.setGlobalLoading(false);
        dialogVisible.value = true;
        amountDialogVisible.value = false;
        itemToWear.value = {
          image: (currentNfr.value as IRequestV).image,
          tokenId: orderId,
          type: 2,
          tokenAddress: (currentNfr.value as IRequestV).nfrTokenAddress,
        };
      }
    } else {
      controllerStore.setGlobalLoading(false);
      message.warning(t('warn-msg.viewSoon'));
    }
  } catch (error) {
    controllerStore.setGlobalLoading(false);
    await httpNoticeStatus(res.data.nfrTrans.id, 'failed');
    const { code } = error as IOpenseaErrorType;
    if (code === ERR.RejectMessage) {
      message.error(t('err-msg.reject'));
    } else {
      message.error((error as Error).message);
    }
    console.error(error);
  }
};
const handleDialogClose = () => {
  dialogVisible.value = false;
  getNFTDetail();
};
const handleWearRes = (res: boolean) => {
  resultSuccess.value = res;
  resultDialogVisible.value = true;
};

const handleResultDialogClose = () => {
  resultDialogVisible.value = false;
};
const handleResDislogClick = () => {
  resultDialogVisible.value = false;
  handleDialogClose();
};
onMounted(() => {
  nftId.value = route.params.id as string;
  getNFTDetail();
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
