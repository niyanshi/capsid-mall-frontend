<template>
  <div class="wrap">
    <div class="title">
      <img src="../../assets/icons/gold.png" alt="">
      <span>{{ currentNft?.name }}</span>
    </div>
    <div class="info-wrap">
      <img :src="currentNft?.imageUrl" alt="">
      <div class="text">
        <div class="desc">{{ currentNft?.description }}</div>
        <div class="price">
          <span class="icon-price"></span>
          <span>{{ currentNft?.price }}</span>
        </div>
        <div class="buy-button nft" @click="handleBuyNFTClick(currentNft as INFT)">
          <span>{{ t('buyNft') }}</span>
          <span class="button-icon nft-money"></span>
        </div>
      </div>
    </div>
    <div v-for="(nfr,index) in currentNfr" :key="index" class="info-wrap">
      <img :src="nfr?.image" alt="">
      <div class="text">
        <div class="desc">{{ nfr?.description }}</div>
        <div class="price">
          <span class="icon-price"></span>
          <span>{{ nfr?.unitPrice }}</span>
        </div>
        <div class="expire">
          <div class="expire-date mb41">
            <span class="start-icon calendar-icon"></span>
            <span>{{ dayjs(nfr?.createdAt).add(nfr?.duration,'day').format('DD/MM/YYYY') }}</span>
            <!-- <span class="end-icon"></span> -->
          </div>
          <div class="expire-date">
            <span class="start-icon book-icon"></span>
            <span>{{ available(nfr?.selledAmount as number,nfr?.amount as number) + '/' + nfr?.amount }}</span>
            <!-- <span class="end-icon"></span> -->
          </div>
        </div>
        <div class="buy-button nfr" @click="handleBuyNFRClick(nfr)">
          <span>{{ t('buyNfr') }}</span>
          <span class="button-icon nfr-money"></span>
        </div>
      </div>
    </div>
    <PrivateWearDialog :visible="dialogVisible" :item-to-wear="itemToWear" @close="handleDialogClose" @result="handleWearRes"></PrivateWearDialog>
    <BaseDialog :visible="resultDialogVisible" width="640" height="240" @close="handleResultDialogClose">
      <div v-if="resultSuccess" class="tip-content">
        <i class="icon-success icon"></i>
        <div class="info-text">
          <div class="info-title">{{ t('wearSuccess') }}</div>
          <div class="message">
            <p>{{ t('viewInMy') }}<a>{{ t('profile') }}</a></p>
            <p>{{ t('wearSuccessTips') }}</p>
          </div>
        </div>
      </div>
      <div v-else class="tip-content">
        <i class="icon-error icon"></i>
        <div class="info-text">
          <div class="info-title">{{ t('error') }}</div>
          <div class="message">
            <p>{{ t('errorTips') }}</p>
          </div>
        </div>
      </div>
      <template #button>
        <div class="dialog-button" @click="handleResDislogClick">
          <span>{{ t('ok') }}</span>
          <i class="icon-ok"></i>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import BaseDialog from '@/components/BaseDialog/index.vue';
import { httpGetCampaignDetail } from '@/api/campaign';
import { httpBuyNFRs } from '@/api/nfr';
import { INFT,INFR } from '../../types/campaign';
import dayjs from 'dayjs';
import PrivateWearDialog from '@/components/PrivateWearDialog/index.vue';
import useSeaport from '@/hooks/useSeaport';
import { useUserInfoStore } from '@/stores/user-info';
import { message } from 'ant-design-vue';

const { buyNFR } = useSeaport();
const { t } = useI18n();
const route = useRoute();
const userInfoStore = useUserInfoStore();

// 当前展示的NFT、NFR所属的campaignID
const campaignId = ref();
const nftId = ref<string>();
const currentNft = ref<INFT>();
const currentNfr = ref<INFR[]>([]);
const itemToWear = ref<{
  image: string;
  tokenId: string;
  // eslint-disable-next-line no-magic-numbers
  type: 1| 2;
  tokenAddress: string;
}>();
// 弹窗
const dialogVisible = ref(false);
const resultDialogVisible = ref(false);
const resultSuccess = ref(false);
/**获取相关数据*/
const getCampaignDetail = async () => {
  if(!campaignId.value) return;
  const res = await httpGetCampaignDetail({campaignId: campaignId.value});
  if(res.code === 0) {
    currentNft.value = res.data.nfts.find((nft:INFT) => nft.tokenId === nftId.value);
    // 1个NFT可以对应多个NFR
    currentNfr.value = res.data.nfrs.filter((nfr:INFR) => nfr.nftId === nftId.value);
  }
};
// 可用
const available = (sell:number, amount:number) => amount - sell;

const handleBuyNFTClick = (nft: INFT) => {
  dialogVisible.value = true;
  itemToWear.value = {
    image: nft.imageUrl,
    tokenId: nft.tokenId,
    type: 1,
    tokenAddress: nft.contractAddress
  };
};
/** 购买nfr */
const handleBuyNFRClick = async (item: INFR) => {
  try {
    if (!userInfoStore.currentUser.isLogin) {
      userInfoStore.setLoginModalVisible(true);
      return;
    }
    const { orderOnChain: order, id } = item;
    const amount = 1;
    const res = await httpBuyNFRs(String(id), amount);
    if (res.code !== 0) return;

    const orderId = res.data.nfrTrans.nfrTokenId;
    const ret = await buyNFR({ order, orderId, amount });
    if (!ret) return;
    dialogVisible.value = true;
    itemToWear.value = {
      image: item.image,
      tokenId: item.nfrTokenId,
      type: 2,
      tokenAddress: item.nfrTokenAddress
    };
  } catch (error) {
    message.error((error as Error).message);
  }
};
const handleDialogClose = () => {
  dialogVisible.value = false;
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
  if(route.query.campaignId) {
    campaignId.value = Number(route.query.campaignId);
    getCampaignDetail();
  }
  nftId.value = route.params.id as string;
});
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
