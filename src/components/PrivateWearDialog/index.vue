<template>
  <BaseDialog :visible="props.visible" width="1280" height="688" @close="handleDialogClose">
    <div v-show="isWear" class="wear">
      <div class="dialog-title">
        <i class="icon-crown icon"></i>
        <span>{{ t('wear') }}</span>
      </div>
      <div class="dialog-main">
        <div class="select-box">
          <div class="select-title"></div>
          <div v-if="leftItem" class="img-box">
            <img :src="leftItem.image" alt="">
          </div>
          <div v-else class="img-box add-border" @click="handleAvatarClick('left')">
            <div class="add-wrap">
              <img src="../../assets/icons/icon-add.png" alt="" srcset="">
              <div class="text">{{t('wear-page.chooseWearable')}}</div>
            </div>
          </div>
        </div>
        <div class="right-arrow split"></div>
        <div class="result-box"></div>
        <div class="left-arrow split"></div>
        <div class="select-box">
          <div class="select-title">{{ t('selectAvatarNFT') }}</div>
          <div v-if="selectedItem?.image" class="img-box">
            <img :src="selectedItem?.image" alt="">
          </div>
          <div v-else class="img-box add-border" @click="handleAvatarClick('right')">
            <div class="add-wrap">
              <img src="../../assets/icons/icon-add.png" alt="" srcset="">
              <div class="text">{{t('selectAvatar')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!isWear" class="select">
      <div class="dialog-title">
        <i class="icon-bag icon"></i>
        <span>{{ t('selectAvatarz') }}</span>
      </div>
      <div class="select-part">
        <div class="tab-wrap">
          <span :class="['tab', isSelectNFT ? 'active' : '']" @click="handleSelectChange(1)">NFT</span>
          <span :class="['tab', isSelectNFT ? '' : 'active']" @click="handleSelectChange(2)">NFR</span>
        </div>
      </div>
      <div class="avatar-to-select">
        <div v-show="isSelectNFT">
          <div
            v-for="(item, index) in NFTList"
            :key="index"
            :class="[currentAvatar === index ? 'select-img' : '']"
            @click="handleAvatarSelect(index)">
            <img :src="item.imageUrl" />
          </div>
        </div>
        <div v-show="!isSelectNFT">
          <div
            v-for="(item, index) in NFRList"
            :key="index"
            :class="[currentAvatar === index ? 'select-img' : '']"
            @click="handleAvatarSelect(index)">
            <img :src="item.image" />
          </div>
        </div>
      </div>
    </div>
    <template #button>
      <div class="dialog-button">
        <span v-show="!isWear" @click="handleOkClick">{{ t('ok') }}</span>
        <span v-show="isWear" @click="handleWearClick">{{ t('wear') }}</span>
        <i v-show="isWear" class="icon-wear"></i>
        <i v-show="!isWear" class="icon-ok"></i>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog/index.vue';
import { ref, watch } from 'vue';
import { INFT,INFR} from '@/types/profile';
import { IWearItem } from '@/types/campaign';
import { httpGetMyNFTs } from '@/api/nft';
import { httpGetNFR } from '@/api/profile';
import { httpCreateWear } from '@/api/campaign';
import { useUserInfoStore } from '@/stores/user-info';
import { useI18n } from 'vue-i18n';

const userInfoStore = useUserInfoStore();
const { t } = useI18n();

interface PropType {
  visible: boolean;
  itemToWear?: IWearItem
}
const props = defineProps<PropType>();
const emit = defineEmits(['close','result']);

const handleDialogClose = () => {
  emit('close');
};
// 判断当前是否是wear界面
const isWear = ref(true);
// 判断当前是否在选择头像-选择nft
const isSelectNFT = ref(true);

const NFTList = ref<INFT[]>([]);
const NFRList = ref<INFR[]>([]);
const currentAvatar = ref(-1);
const selectedItem = ref<IWearItem>();
const leftItem = ref<IWearItem>();
watch(()=> props.itemToWear,(val) => {
  // 如果左侧选择框有值，则固定为父组件传的值
  if(val) leftItem.value = props.itemToWear;
});
// 获取拥有的NFT列表
const getNFTList = async () => {
  const res = await httpGetMyNFTs({
    owner: userInfoStore.currentUser.publicKey
  });
  if(res.code === 0) {
    NFTList.value = res.data;
  }
};
// 获取拥有的NFR列表
const getNFRList = async () => {
  const res = await httpGetNFR({
    accountAdr: userInfoStore.currentUser.publicKey,
    type: 'owned'
  });
  if(res.code === 0) {
    NFRList.value = res.data.records;
  }
};
// 获取拥有的NFT列表
const handleSelectChange = (index: number) => {
  isSelectNFT.value = index === 1 ? true : false;
  if(index === 1) {
    getNFTList();
  } else {
    getNFRList();
  }
};
// 判断选择框触发是由左侧触发还是右侧触发
const triggerType = ref<'left'|'right'>('right');
// 选择头像，切换到nft/nfr选择
const handleAvatarClick = (type: 'left'|'right') => {
  if(type === 'left' && props.itemToWear) {
    // 点击左侧触发框时如prop有值，不允许更改
    return;
  }
  triggerType.value = type;
  isWear.value = false;
  getNFTList();
};
// 点击NFT/NFR
const handleAvatarSelect = (index: number) => {
  currentAvatar.value = index;
  let value: IWearItem;
  if(isSelectNFT.value) {
    // 选择的是NFT
    value = {
      image: NFTList.value[index].imageUrl,
      tokenAddress: NFTList.value[index].contractAddress,
      tokenId: NFTList.value[index].tokenId,
      type: 1
    };
  } else {
    value = {
      image: NFRList.value[index].image,
      tokenAddress: NFRList.value[index].nfrTokenAddress,
      tokenId: NFRList.value[index].nfrTokenId,
      type: 2
    };
  }
  if(triggerType.value === 'left') leftItem.value = value;
  else selectedItem.value = value;
};

// 生成wear
const createWear = async (leftValue: IWearItem, rightValue: IWearItem) => {
  const res = await httpCreateWear({
    accountAddress: userInfoStore.currentUser.publicKey,
    accountId: userInfoStore.currentUser.userId,
    parentPic1: leftValue.image,
    parentPic2: rightValue.image,
    parentTokenId1: leftValue.tokenId,
    parentTokenId2: rightValue.tokenId,
    parentType1: leftValue.type,
    parentType2: rightValue.type,
    tokenAddress1: leftValue.tokenAddress,
    tokenAddress2: rightValue.tokenAddress,
    // tokenType1: '',
    // tokenType2: '',
  });
  if(res.code === 0) {
    emit('result',true);
  } else {
    emit('result',false);
  }
};
// 弹框按钮
const handleOkClick = () => {
  isWear.value = true;
  currentAvatar.value = -1;
};
const handleWearClick = () => {
  createWear(leftItem.value as IWearItem,selectedItem.value as IWearItem);
};
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
