<template>
  <div class="edit-wrap">
    <div class="campaign-info">CLONe X Take</div>
    <div v-if="!isCreate" class="nft-edit">
      <div class="add item-size" @click="handleAddClick">
        <div class="icon radius10">
          <img src="../../assets/icons/icon-add.png" alt="" srcset="">
          <div class="text"></div>
        </div>
      </div>
      <div v-for="(item,index) in list" :key="index" class="nft-item item-size">
        <img :src="item.imageUrl" alt="">
        <div class="name">{{item.name}}</div>
      </div>
    </div>
    <div v-else class="nft-create">
      <form-item
        class="form-item"
        :title="t('newNFT.imageLabel')"
        :width="600"
      >
        <BaseImageSelect
          v-model="newNFT.image"
          width="300"
          height="300"
          icon-size="50"
          :icon-text="t('newNFT.chooseImage')"
        ></BaseImageSelect>
      </form-item>
      <form-item
        class="form-item"
        :title="t('newNFT.nameLabel')"
        :width="600"
      >
        <base-input
          v-model="newNFT.name"
          style-type="line"
          :placeholder="t('newNFT.namePlaceholder')"
        >
        </base-input>
      </form-item>
      <form-item
        class="form-item"
        :title="t('newNFT.descLabel')"
        :width="600"
      >
        <base-textarea v-model="newNFT.desc"></base-textarea>
      </form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { INFT } from '@/types/profile';
import campaignDetail from '@/assets/images/campaignDetail.png';
import BaseImageSelect from '@/components/BaseImageSelect/index.vue';
import FormItem from '@/components/BaseForm/FormItem.vue';
import BaseInput from '@/components/BaseInput/index.vue';
import BaseTextarea from '@/components/BaseTextarea/index.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isCreate = ref(false);
const list = ref<INFT[]>([
  {
    contractAddress: 'string',
    imageUrl: campaignDetail,
    name: 'test1',
    tokenId: '123',
    traits: [],
  },
  {
    contractAddress: 'string',
    imageUrl: campaignDetail,
    name: 'test1',
    tokenId: '123',
    traits: [],
  },
  {
    contractAddress: 'string',
    imageUrl: campaignDetail,
    name: 'test1',
    tokenId: '123',
    traits: [],
  },
  {
    contractAddress: 'string',
    imageUrl: campaignDetail,
    name: 'test1',
    tokenId: '123',
    traits: [],
  },
  {
    contractAddress: 'string',
    imageUrl: campaignDetail,
    name: 'test1',
    tokenId: '123',
    traits: [],
  },
  {
    contractAddress: 'string',
    imageUrl: campaignDetail,
    name: 'test1',
    tokenId: '123',
    traits: [],
  },
  {
    contractAddress: 'string',
    imageUrl: campaignDetail,
    name: 'test1',
    tokenId: '123',
    traits: [],
  },
  {
    contractAddress: 'string',
    imageUrl: campaignDetail,
    name: 'test1',
    tokenId: '123',
    traits: [],
  },
  {
    contractAddress: 'string',
    imageUrl: campaignDetail,
    name: 'test1',
    tokenId: '123',
    traits: [],
  },
  {
    contractAddress: 'string',
    imageUrl: campaignDetail,
    name: 'test1',
    tokenId: '123',
    traits: [],
  },
]);
const newNFT = ref<{
  name: string,
  image: string,
  desc: string
}>({
  name: '',
  image: '',
  desc: ''
});

const handleAddClick = () => {
  isCreate.value = true;
};
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
