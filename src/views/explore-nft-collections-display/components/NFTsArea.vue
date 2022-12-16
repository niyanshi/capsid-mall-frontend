<template>
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
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { httpGetNFTsByCollection } from '@/api/explore';
import { INFTsType, INFTsDto } from '@/types/nft';
import { useRouter } from 'vue-router';

const router = useRouter();

const nftsListRef = ref<INFTsType[]>([]);
const activeKeyRef = computed<string>(() => router.currentRoute.value.params.slug as string);

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

<style scoped lang="scss">
.nfts-area {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 45px;
  column-gap: 36px;
  margin-bottom: 76px;

  .item {
    width: 100%;

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-width: 255px;
      aspect-ratio: 1/1;
      overflow: hidden;
      border-radius: 10px;

      img {
        max-width: 100%;
        max-height: 100%;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      &:hover {
        img {
          transform: scale(1.07, 1.07);
        }
      }
    }

    .name {
      margin-top: 16px;
      font-family: 'Quiet Sans', serif;
      font-size: 20px;
      font-weight: 800;
    }
  }
}
</style>
