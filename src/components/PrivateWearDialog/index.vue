<template>
  <BaseDialog
    :visible="props.visible"
    width="1280"
    height="688"
    :mask-disable="true"
    @close="handleDialogClose"
  >
    <div class="select">
      <div class="dialog-title">
        <i class="icon-bag icon"></i>
        <span>{{ title }}</span>
      </div>
      <div class="select-part">
        <div class="tab-wrap">
          <span
            :class="['tab', currentKey === 'All' ? 'active' : '']"
            @click="handleSelectChange('All')"
            >All</span
          >
          <span
            v-for="item in collectionList"
            :key="item.slug"
            :class="['tab', currentKey === item.slug ? 'active' : '']"
            @click="handleSelectChange(item.slug)"
            >{{ item.name }}</span
          >
        </div>
      </div>
      <div class="avatar-to-select">
        <BaseScrollList
          v-if="currentKey === 'All'"
          :height="450"
          :disabled="noScroll"
          class="select-list"
          @scroll="handleScroll"
        >
          <div
            v-for="(item, index) in NFTList"
            :key="index"
            :class="[currentAvatar === index ? 'select-img' : '']"
            @click="handleAvatarSelect(index)"
          >
            <PrivateImage v-if="!isNFR(item)" :src="item.imageUrl"></PrivateImage>
            <BaseNFRImage v-else :src="item.imageUrl"></BaseNFRImage>
          </div>
        </BaseScrollList>
        <BaseScrollList
          v-else
          :height="450"
          :disabled="noScroll"
          class="select-list"
          @scroll="handleScroll"
        >
          <div
            v-for="(item, index) in currentCollectionList"
            :key="index"
            :class="[currentAvatar === index ? 'select-img' : '']"
            @click="handleAvatarSelect(index)"
          >
            <PrivateImage :src="item.imageUrl"></PrivateImage>
          </div>
        </BaseScrollList>
        <div v-show="loading" class="loading">
          <BasePageLoading :loading="true" />
        </div>
      </div>
    </div>
    <template #button>
      <div
        class="dialog-button"
        @click="handleOkClick"
      >
        <span>{{ t('ok') }}</span>
        <i class="icon-ok"></i>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseNFRImage from '@/components/BaseNFRImage/index.vue';
import BaseDialog from '@/components/BaseDialog/index.vue';
import BaseScrollList from '@/components/BaseScrollList/index.vue';
import BasePageLoading from '@/components/BasePageLoading/index.vue';
import { ref, watch } from 'vue';
import { INFT } from '@/types/profile';
import { IWearItem } from '@/types/campaign';
import { httpGetMyNFTs } from '@/api/nft';
import { httpGetWearCollection, httpGetWearCollectionNFT } from '@/api/wear';
import { useUserInfoStore } from '@/stores/user-info';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { nfrContractAddress, wearContractAddress } from '@/hooks/var';
import PrivateImage from '@/components/PrivateImage/index.vue';
import { unique } from '@/utils/util';
import { ICollectionsItemDto } from '@/types/collection';
import { IWearCollectionNFT } from '@/types/nft';

const userInfoStore = useUserInfoStore();
const { t } = useI18n();

interface PropType {
  visible: boolean;
  title: string;
}
const props = defineProps<PropType>();
const emit = defineEmits(['close', 'ok']);

const isNFR = (item:INFT) => item.contractAddress.toLowerCase() === nfrContractAddress.toLowerCase();
// 当前tab的key
const currentKey = ref('All');

const NFTList = ref<INFT[]>([]);
const currentAvatar = ref(-1);
const selectedItem = ref<IWearItem | null>();

// 加载时渲染
const loading = ref(false);

const handleDialogClose = () => {
  currentAvatar.value = -1;
  selectedItem.value = null;
  emit('close');
};

const noScroll = ref<boolean>(false);
const currentPageNum = ref(1);
const SIZE = 100;
const currentPageSize = ref(SIZE);
// 获取拥有的NFT列表
const getNFTList = async (isNew = false, length = 0) => {
  if(isNew) loading.value = true;
  if(noScroll.value) return;
  const res = await httpGetMyNFTs({
    owner: userInfoStore.currentUser.publicKey,
    limit: currentPageSize.value,
    offset: currentPageSize.value * (currentPageNum.value - 1 <= 0 ? 0 : currentPageNum.value - 1),
  });
  loading.value = false;
  if (res.code === 0) {
    // 筛选出规定合约的nft
    if (res.data.length === 0) {
      // 没有值说明已经请求完毕
      noScroll.value = true;
      return;
    }
    const filterList = res.data.filter(
      (item: INFT) => item.contractAddress.toLowerCase() !== wearContractAddress.toLowerCase(),
    );
    if (isNew) {
      NFTList.value = filterList;
    } else {
      // 数组去重，避免请求重复数据
      NFTList.value = unique(NFTList.value?.concat(...filterList), 'tokenId');
    }
    // eslint-disable-next-line no-magic-numbers
    if (filterList.length + length < currentPageSize.value / 2) {
      // 如果筛选结果不足规定一半，重新请求一次
      const timeout = 1000;
      setTimeout(() => {
        currentPageNum.value++;
        getNFTList(false, filterList.length);
      }, timeout);
    }
  } else {
    message.error(res.msg);
  }
};
const collectionList = ref<ICollectionsItemDto[]>([]);
// 获取collection列表
const getCollectionList = async () => {
  const res = await httpGetWearCollection();
  if(res.code === 0) {
    collectionList.value = res.data;
  } else {
    message.error(res.msg);
  }
};
const currentCollectionList = ref<IWearCollectionNFT[]>([]);
// 获取每个collection下的nft列表
const getCollectionNFTList = async (slug: string,isNew = false) => {
  if(isNew) loading.value = true;
  const res = await httpGetWearCollectionNFT({
    limit: currentPageSize.value,
    offset: currentPageSize.value * (currentPageNum.value - 1 <= 0 ? 0 : currentPageNum.value - 1),
    slug
  });
  loading.value = false;
  if(res.code === 0) {
    if(isNew) {
      currentCollectionList.value = res.data;
    } else {
      currentCollectionList.value = currentCollectionList.value.concat(...res.data);
    }
  } else {
    message.error(res.msg);
  }
};

watch(()=>props.visible, (v) => {
  if(v) {
    currentPageNum.value = 1;
    getNFTList(true);
    getCollectionList();
  }
});

const handleScroll = () => {
  currentPageNum.value++;
  if (currentKey.value === 'All') {
    getNFTList();
  } else {
    getCollectionNFTList(currentKey.value);
  }
};
// 切换tab
const handleSelectChange = (key: string) => {
  currentKey.value = key;
  currentPageNum.value = 1;
  noScroll.value = false;
  if (key === 'All') {
    getNFTList(true);
  } else {
    currentCollectionList.value = [];
    getCollectionNFTList(key,true);
  }
};

// 点击NFT/NFR
const handleAvatarSelect = (index: number) => {
  currentAvatar.value = index;
};

// 弹框按钮
const handleOkClick = () => {
  let value: IWearItem;
  const NFR_TYPE = 2;
  const NFT_TYPE = 1;
  if (currentKey.value === 'All') {
    // 选择的是All
    value = {
      image: NFTList.value[currentAvatar.value].imageUrl,
      tokenAddress: NFTList.value[currentAvatar.value].contractAddress,
      tokenId: NFTList.value[currentAvatar.value].tokenId,
      type: isNFR(NFTList.value[currentAvatar.value]) ? NFR_TYPE : NFT_TYPE,
    };
  } else {
    value = {
      image: currentCollectionList.value[currentAvatar.value].imageUrl,
      tokenAddress: currentCollectionList.value[currentAvatar.value].contractAddress,
      tokenId: currentCollectionList.value[currentAvatar.value].tokenId,
      type: NFT_TYPE,
    };
  }
  emit('ok',value);
  currentAvatar.value = -1;
};

</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
