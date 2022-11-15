<template>
  <div class="collections-list-card">
    <div class="title">
      <img
        :src="ImageCollectionTitle"
        alt=""
      />

      {{ t('collection-desc') }}
    </div>

    <div class="show-list">
      <collections-list-item
        v-for="item in collectionsListRef?.slice(0, 6)"
        :key="item.id"
        :data="item"
        item
      ></collections-list-item>
    </div>

    <div
      class="btn"
      @click="router.push('/explore')"
    >
      {{ t('more') }}
      <img
        :src="IconSort"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { httpGetNFTCollectionsList } from '@/api/explore';
import IconSort from '@/assets/icons/sort.png';
import ImageCollectionTitle from '@/assets/images/collection-title.png';
import { ICollectionsItemDto, ICollectionsItemType } from '@/types/collection';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import CollectionsListItem from '../CollectionsListItem/index.vue';

const { t } = useI18n();
const router = useRouter();

const collectionsListRef = ref<ICollectionsItemType[]>();

onMounted(() => {
  const init = async () => {
    const res = await httpGetNFTCollectionsList();
    collectionsListRef.value = res.data.map((item: ICollectionsItemDto) => ({
      title: item.name,
      avatar: item.imageUrl,
      listings: item.listings,
      floorPrice: item.floorPrice || 0,
      id: item.slug,
    }));
  };
  init();
});
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
