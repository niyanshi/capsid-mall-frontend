<template>
  <div class="list-wrap">
    <div class="campaign-title">
      <div class="campaign-icon"></div>
      <div class="campaign-text">{{ t('campaign-page.title') }}</div>
      <div class="create-button" @click="handleCreateButtonClick">
        <span>{{ t('campaign-page.create') }}</span>
        <em></em>
      </div>
    </div>
    <div>
      <div v-for="(item, index) in campaignList" :key="index" class="campaign-list" @click="handleListClick(item.id)">
        <div class="campaign-item">
          <img :src="`${basePath}${item.banner}`" alt="">
          <div class="campaign-name">
            <span>{{ item.campaignName }}</span>
            <div
              v-if="String(item.ownerId) === userInfoStore.currentUser.userId" class="edit r240"
              @click.stop="handleEditClick(item.id)"
            >
              <span>{{ t('campaign-page.edit') }}</span>
              <em class="icon-edit"></em>
            </div>
            <div
              v-if="String(item.ownerId) === userInfoStore.currentUser.userId" class="edit"
              @click.stop="handleEditNFTClick(item.id)"
            >
              <span>{{t('campaign-page.editNFT')}}</span>
              <em class="icon-edit"></em>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { httpGetCampaignList } from '@/api/campaign';
import { ICampaign, IcampaignId } from '@/types/campaign';
import { useUserInfoStore } from '@/stores/user-info';

const { t } = useI18n();
const router = useRouter();
const userInfoStore = useUserInfoStore();
const basePath = import.meta.env.VITE_IMAGE_BASE_URL;

type CampaignListItem = ICampaign & IcampaignId;
const campaignList = ref<CampaignListItem[]>([]);

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
const handleEditNFTClick = (id: number) => {
  router.push(`/campaign/campaign-nft-edit/${id}`);
};

const getCampaignList = async () => {
  const param = {
    // accountId: userInfoStore.currentUser.userId
    accountId: ''
  };
  const res = await httpGetCampaignList(param);
  if (res.code === 0) {
    campaignList.value = res.data.records;
  }
};

onMounted(() => {
  getCampaignList();
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
