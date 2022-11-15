<script setup lang="ts">
import IconTrophy from '@/assets/icons/trophy.png';
import IconSearch from '@/assets/icons/search.svg';
import { computed, onMounted, ref, watch } from 'vue';
import BaseRadioGroup from '@/components/BaseRadioGroup/index.vue';
import { httpGetNFTCollectionsList, httpGetNFTsByCollection } from '@/api/explore';
import { ICollectionsItemDto, ICollectionsItemType } from '@/types/collection';
import { INFTsType, INFTsDto } from '@/types/nft';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const collectionsListRef = ref<ICollectionsItemType[]>([]);
const nftsListRef = ref<INFTsType[]>([]);
const activeKeyRef = computed<string>(() => router.currentRoute.value.params.slug as string);
const activeOnlyRef = ref(false);

onMounted(() => {
  const init = async () => {
    const res = await httpGetNFTCollectionsList();
    collectionsListRef.value = res.data.map((item: ICollectionsItemDto) => ({
      title: item.name,
      id: item.slug,
    }));
  };
  init();
});

/** radio select */
const handleSelect = (e: string | number) => {
  router.push(`/explore/nft-collections-display/${e}`);
};
/** 获取collection下的nft列表 */
const getNFTsByCollection = async (id: string) => {
  const res = await httpGetNFTsByCollection(id);
  // console.log(res);
  nftsListRef.value = res?.data?.map((item: INFTsDto) => ({
    name: item.name,
    avatar: item.imageUrl,
    id: item.tokenId,
    contractAddress: item.contractAddress,
  }));
};
watch(
  activeKeyRef,
  (newVal) => {
    if (newVal) getNFTsByCollection(newVal);
  },
  { immediate: true },
);

const skipToDetails = (e: INFTsType) => {
  router.push(`/explore/nft-details/${e.contractAddress}/${e.id}`);
};
</script>

<template>
  <div class="collections-display-view">
    <div class="title">
      <img
        :src="IconTrophy"
        alt=""
      />
      {{ t('explore-page.title') }}
    </div>
    <div class="radio-area">
      <base-radio-group
        :data="collectionsListRef"
        :active-key="activeKeyRef"
        @select="handleSelect"
      ></base-radio-group>
    </div>
    <div class="line"></div>

    <div class="tools-area">
      <div class="search">
        <input type="text" />
        <img
          :src="IconSearch"
          alt=""
        />
      </div>
      <div
        class="btn"
        :class="{ active: activeOnlyRef }"
        @click="activeOnlyRef = !activeOnlyRef"
      >
        {{ t('active-only') }}
      </div>
    </div>

    <div class="nfts-area">
      <div
        v-for="item in nftsListRef"
        :key="item.id"
        class="item"
      >
        <div class="avatar">
          <img
            :src="item.avatar"
            alt=""
            @click="skipToDetails(item)"
          />
        </div>

        <div class="name">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
