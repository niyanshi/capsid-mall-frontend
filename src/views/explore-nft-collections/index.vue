<template>
  <div class="explore-nft-collections-list">
    <div class="title">
      <img
        :src="IconTrophy"
        alt=""
      />
      {{ t('explore-page.title') }}
    </div>
    <base-page-loading
      :loading="isLoadingRef"
      :top="100"
    >
      <div class="display">
        <collections-card
          v-for="item in collectionsListRef"
          :key="item.id"
          :data="item"
        ></collections-card>
      </div>
    </base-page-loading>
  </div>
</template>

<script setup lang="ts">
import IconTrophy from '@/assets/icons/trophy.png';
import CollectionsCard from './components/CollectionsCard.vue';
import BasePageLoading from '@/components/BasePageLoading/index.vue';
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { httpGetNFTCollectionsList } from '@/api/explore';
import { ICollectionsItemDto, ICollectionsItemType } from '@/types/collection';

const { t } = useI18n();
const collectionsListRef = ref<ICollectionsItemType[]>();
const isLoadingRef = ref<boolean>(true);

onMounted(() => {
  const init = async () => {
    const res = await httpGetNFTCollectionsList();
    collectionsListRef.value = res.data.map((item: ICollectionsItemDto) => ({
      title: item.name,
      avatar: item.imageUrl,
      nfrs: item.nfrCount || 0,
      floorPrice: item.floorPrice || 0,
      id: item.slug,
    }));
    isLoadingRef.value = false;
  };
  init();
});
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
