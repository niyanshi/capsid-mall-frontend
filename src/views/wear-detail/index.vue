<template>
  <div class="wear-detail-wrap">
    <div class="left">
      <div class="image" @click="handleImagePreview(wear?.wearMeta?.image)">
        <template v-if="isAtNFR">
          <BaseNFRImage
            :src="(wear?.wearMeta?.image as string)"
            alt=""
          />
        </template>
        <template v-else>
          <img
            :src="wear?.wearMeta?.image"
            alt=""
          />
        </template>
      </div>
    </div>
    <div class="right">
      <div class="right-top">
        <div class="title">
          <img
            :src="IconMedal"
            alt=""
          />
          {{ wear?.wearMeta?.name }}
        </div>
        <img
          :src="OpenSeaLogo"
          alt=""
          style="cursor: pointer"
          @click="goOpenSea"
        />
      </div>
      <div class="desc">{{wear?.wearMeta?.description}}</div>
    </div>
    <Image
      :style="{ display: 'none' }"
      :preview="{
        visible,
        onVisibleChange: setPreviewVisible,
      }"
      :src="previewUrl"
    />
  </div>
</template>

<script setup lang="ts">
import BaseNFRImage from '@/components/BaseNFRImage/index.vue';
import IconMedal from '@/assets/icons/medal.png';
import OpenSeaLogo from '@/assets/icons/OpenSeaLogo.png';
import { computed, onMounted, ref } from 'vue';
import { IWear } from '@/types/campaign';
import { nfrContractAddress, wearContractAddress } from '@/hooks/var';
import { httpGetWearDetail } from '@/api/wear';
import { useRoute } from 'vue-router';
import { message, Image } from 'ant-design-vue';

const route = useRoute();

const currentId = ref('');
const wear = ref<IWear>();
const isAtNFR = computed(() => wear.value?.tokenAddress1.toLowerCase() === nfrContractAddress.toLowerCase() ||
      wear.value?.tokenAddress2.toLowerCase() === nfrContractAddress.toLowerCase());
const goOpenSea = () => {
  window.location.href = `${import.meta.env.VITE_OPENSEA_ADDRESS}${wearContractAddress}/${wear.value?.tokenId}`;
};
const getWearDetail = async () => {
  const res = await httpGetWearDetail({
    id: Number(currentId.value)
  });
  if(res.code === 0) {
    wear.value = res.data;
  } else {
    message.error(res.msg);
  }
};

// 图片预览
const visible = ref(false);
const previewUrl = ref('');
const setPreviewVisible = (value:boolean): void => {
  visible.value = value;
};
const handleImagePreview = (url: string) => {
  if(url) {
    previewUrl.value = url;
    setPreviewVisible(true);
  }
};

onMounted(() => {
  currentId.value = route.params.id as string;
  getWearDetail();
});
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
