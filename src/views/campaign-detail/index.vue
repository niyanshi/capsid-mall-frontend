<template>
  <div class="campaign-wrap">
    <div class="tab-bar">
      <img src="../../assets/icons/shoppingBags.png" alt="" />
      <span class="text">{{ campaignName }}</span>
      <div class="tab">
        <span :class="[{active: activeKey === 1}]">{{ t('campaign-page.tab[0]') }}</span>
        <!-- <span :class="[{active: activeKey === 2}]">wear</span> -->
        <!-- <span :class="[{active: activeKey === 3}]">REQUESTS</span> -->
      </div>
    </div>
    <div class="list-wrap">
      <div v-for="(item,index) in campaignList" :key="index" class="campaign-item" @click="handleDetailClick(item)">
        <img :src="item.imageUrl" alt="">
        <div class="name">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { INFT } from '../../types/campaign';
import { useRouter,useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { httpGetCampaignDetail } from '@/api/campaign';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const activeKey = ref(1);
const campaignId = ref<number>();

const campaignList = ref<INFT[]>([]);
const campaignName = ref<string>();
const handleDetailClick = (nft: INFT) => {
  // 点击详情，带上campaignID和nft的tokenId
  router.push({
    path: `/campaign/campaign-nft-details/${nft.tokenId}`,
    query: {
      campaignId: campaignId.value
    }
  });
};
// 获取活动下所有NFT
const getCampaignList = async () => {
  if(!campaignId.value) return;
  const res = await httpGetCampaignDetail({campaignId: campaignId.value});
  if(res.code === 0) {
    campaignName.value = res.data.campaignName;
    campaignList.value = res.data.nfts;
  }
};
onMounted(() => {
  if(route.query.campaignId) {
    campaignId.value = Number(route.query.campaignId);
    getCampaignList();
  }
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
