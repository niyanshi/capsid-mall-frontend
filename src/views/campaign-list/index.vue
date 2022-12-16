<template>
  <div class="list-wrap">
    <div class="campaign-title">
      <div class="campaign-icon"></div>
      <div class="campaign-text">NFT Drops</div>
      <div v-if="isRoleCampaign" class="create-button" @click="handleCreateButtonClick">
        <span>{{ t('campaign-page.create') }}</span>
        <em></em>
      </div>
    </div>
    <BaseScrollList :height="700" :disabled="noScroll" @scroll="handleScroll">
      <div v-for="(item, index) in campaignList" :key="index" class="campaign-list" @click="handleListClick(item.id)">
        <div class="campaign-item" :style="`background-image: url(${item.banner})`">
          <!-- <img :src="item.banner" alt=""> -->
          <!-- <div class="campaign-name"> -->
            <div class="campaign-name">{{ item.campaignName }}</div>
            <div
              v-if="String(item.ownerId) === String(userInfoStore.currentUser.userId)" class="edit r240"
              @click.stop="handleEditClick(item.id)"
            >
              <span>{{ t('campaign-page.edit') }}</span>
              <em class="icon-edit"></em>
            </div>
            <div
              v-if="String(item.ownerId) === String(userInfoStore.currentUser.userId)" class="edit"
              @click.stop="handleEditNFTClick(item.id,item.campaignName)"
            >
              <span>{{t('campaign-page.editNFT')}}</span>
              <em class="icon-edit"></em>
            </div>
          <!-- </div> -->
        </div>
      </div>
      <div v-show="loading && campaignList.length === 0" class="loading">
        <BasePageLoading :loading="true" />
      </div>
    </BaseScrollList>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { httpGetCampaignList } from '@/api/campaign';
import { ICampaign, IcampaignId } from '@/types/campaign';
import { useUserInfoStore } from '@/stores/user-info';
import BaseScrollList from '@/components/BaseScrollList/index.vue';
import BasePageLoading from '@/components/BasePageLoading/index.vue';

const { t } = useI18n();
const router = useRouter();
const userInfoStore = useUserInfoStore();

type CampaignListItem = ICampaign & IcampaignId;
const campaignList = ref<CampaignListItem[]>([]);

// 加载时渲染
const loading = ref(false);

// 是否有权限编辑，新增campaign
const isRoleCampaign = computed(() => userInfoStore.currentUser.auth.indexOf('role_campaign' as never) !== -1);
const noScroll = ref<boolean>(false);
const currentPageNum = ref(1);
const SIZE = 10;
const currentPageSize = ref(SIZE);

const handleCreateButtonClick = () => {
  router.push('/campaign/campaign-create');
};
const handleListClick = (id: number) => {
  router.push({
    path: '/campaign/campaign-detail',
    query: {
      campaignId: id
    }
  });
};
const handleEditClick = (id: number) => {
  router.push({
    path: '/campaign/campaign-create',
    query: {
      campaignId: id
    }
  });
};
const handleEditNFTClick = (id: number,campaignName: string) => {
  router.push({
    path: `/campaign/campaign-nft-edit/${id}`,
    query: {
      campaignName
    }
  });
};

const getCampaignList = async () => {
  loading.value = true;
  const param = {
    // accountId: userInfoStore.currentUser.userId
    accountId: '',
    pageNum: currentPageNum.value,
    pageSize: currentPageSize.value
  };
  const res = await httpGetCampaignList(param);
  loading.value = false;
  if (res.code === 0) {
    // campaignList.value = res.data.records;
    if (res.data.records.length === 0) {
      // 没有值说明已经请求完毕
      noScroll.value = true;
      return;
    }
    campaignList.value = campaignList.value?.concat(...res.data.records);
  }
};

const handleScroll = () => {
  // 若当前list的数量不是size的整数倍，说明已经请求完了
  if (campaignList.value.length % currentPageSize.value > 0) {
    noScroll.value = true;
    return;
  }
  currentPageNum.value++;
  getCampaignList();
};

onMounted(() => {
  getCampaignList();
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
