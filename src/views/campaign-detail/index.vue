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
    <div v-if="!loading">
      <div v-if="campaignList.length !== 0" class="list-wrap">
        <div v-for="(item,index) in campaignList" :key="index" class="campaign-item" @click="handleDetailClick(item)">
          <img :src="item.imageUrl" alt="">
          <div class="name">{{item.name}}</div>
        </div>
      </div>
      <div v-else class="empty text">
        <span>{{ t('coming-soon') }}</span>
      </div>
    </div>
    <div v-else class="sk-chase">
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
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
const loading = ref(false);

const campaignList = ref<INFT[]>([]);
const campaignName = ref<string>();
const handleDetailClick = (nft: INFT) => {
  // 点击详情，带上nft的id
  router.push({
    path: `/campaign/campaign-nft-details/${nft.id}`,
  });
};
// 获取活动下所有NFT
const getCampaignList = async () => {
  if(!campaignId.value) return;
  loading.value = true;
  const res = await httpGetCampaignDetail({campaignId: campaignId.value});
  if(res.code === 0) {
    campaignName.value = res.data.campaignName;
    campaignList.value = res.data.nfts;
    loading.value = false;
  } else {
    loading.value = false;
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
