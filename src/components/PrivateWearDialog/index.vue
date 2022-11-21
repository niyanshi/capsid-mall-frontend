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
          <div v-if="leftItem" class="img-box" @click="handleAvatarClick('left')">
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
            <img :src="selectedItem?.image" alt="" @click="handleAvatarClick('right')">
          </div>
          <div v-else class="img-box add-border" @click="handleAvatarClick('right')">
            <div class="add-wrap">
              <img src="../../assets/icons/icon-add.png" alt="" srcset="">
              <div class="text">{{t('selectAvatar')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="form">
        <div class="form-item">
          <span class="label">{{ t('wear-page.name') }}</span>
          <base-input
            v-model="name"
            style-type="line"
            :placeholder="t('wear-page.inputName')"
          >
          </base-input>
        </div>
        <div class="form-item">
          <span class="label">{{ t('newNFT.descLabel') }}</span>
          <base-textarea v-model="desc"></base-textarea>
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
        <div v-if="isSelectNFT" ref="scrollListRef" class="select-list">
          <div
            v-for="(item, index) in NFTList"
            :key="index"
            :class="[currentAvatar === index ? 'select-img' : '']"
            @click="handleAvatarSelect(index)">
            <img :src="item.imageUrl" />
          </div>
        </div>
        <div v-else ref="scrollListRef" class="select-list">
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
      <div v-show="!isWear" style="margin-right: 10px" class="dialog-button" @click="handleBackClick">
        <span>{{ t('back') }}</span>
        <i class="icon-back"></i>
      </div>
      <div v-show="!isWear" class="dialog-button" @click="handleOkClick">
        <span>{{ t('ok') }}</span>
        <i class="icon-ok"></i>
      </div>
      <div v-show="isWear" class="dialog-button" @click="handleWearClick">
        <span>{{ t('wear') }}</span>
        <i class="icon-wear"></i>
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
import BaseInput from '@/components/BaseInput/index.vue';
import BaseTextarea from '@/components/BaseTextarea/index.vue';
import { message } from 'ant-design-vue';
import {nfrContractAddress} from '@/hooks/var';

const userInfoStore = useUserInfoStore();
const { t } = useI18n();

interface PropType {
  visible: boolean;
  itemToWear?: IWearItem
}
const props = defineProps<PropType>();
const emit = defineEmits(['close','result']);

// 判断当前是否是wear界面
const isWear = ref(true);
// 判断当前是否在选择头像-选择nft
const isSelectNFT = ref(true);

const NFTList = ref<INFT[]>([
]);
const NFRList = ref<INFR[]>([]);
const currentAvatar = ref(-1);
const selectedItem = ref<IWearItem|null>();
const leftItem = ref<IWearItem|null>();
const name = ref<string>();
const desc = ref<string>();

const handleDialogClose = () => {
  isWear.value = true;
  currentAvatar.value = -1;
  selectedItem.value = null;
  leftItem.value = null;
  name.value = '';
  desc.value = '';
  emit('close');
};
watch(()=> props.itemToWear,(val) => {
  // 如果左侧选择框有值，则固定为父组件传的值
  if(val) leftItem.value = props.itemToWear;
});
watch(() => props.visible, (val) => {
  if(!val) {
    isWear.value = true;
    currentAvatar.value = -1;
    selectedItem.value = null;
    leftItem.value = null;
    name.value = '';
    desc.value = '';
  }
});

const noScroll = ref<boolean>(false);
const scrollListRef = ref();
const currentPageNum = ref(1);
const SIZE = 20;
const currentPageSize = ref(SIZE);
// 获取拥有的NFT列表
const getNFTList = async (isNew=false,length = 0) => {
  const res = await httpGetMyNFTs({
    owner: userInfoStore.currentUser.publicKey,
    limit: currentPageSize.value,
    offset: currentPageSize.value * (currentPageNum.value - 1 <= 0 ? 0 : currentPageNum.value - 1)
  });
  if(res.code === 0) {
    // 筛选出规定合约的nft
    if (res.data.length === 0) {
      // 没有值说明已经请求完毕
      noScroll.value = true;
      return;
    }
    const filterList = res.data.filter((item: INFT) => item.contractAddress.toLowerCase() !== nfrContractAddress.toLowerCase());
    if(isNew) {
      NFTList.value = filterList;
    } else {
      NFTList.value = NFTList.value?.concat(...filterList);
    }
    // eslint-disable-next-line no-magic-numbers
    if(filterList.length + length < currentPageSize.value / 2) {
      // 如果筛选结果不足规定一半，重新请求一次
      const timeout = 1000;
      currentPageNum.value++;
      setTimeout(() => {
        getNFTList(false, filterList.length);
      }, timeout);
    }
  } else {
    message.error(res.msg);
  }
};
// 获取拥有的NFR列表
const getNFRList = async (isNew=false) => {
  const res = await httpGetNFR({
    accountAdr: userInfoStore.currentUser.publicKey,
    type: 'owned',
    pageSize: currentPageSize.value,
    pageNum: currentPageNum.value
  });
  if (res.code === 0) {
    if (res.data.length === 0) {
      // 没有值说明已经请求完毕
      noScroll.value = true;
    }
    // const list = res.data?.records.map((item: INFR) => ({
    //   name: 'NFR:',
    //   imageUrl: item.image
    // }));
    if(isNew) {
      NFRList.value = res.data?.records;
    } else {
      NFRList.value = NFRList.value?.concat(...res.data.records);
    }
  } else {
    message.error(res.msg);
  }
};

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.scrollTop + target.clientHeight === target.scrollHeight) {
    // 若当前list的数量不是size的整数倍，说明已经请求完了
    // if (isSelectNFT.value && NFTList.value.length % currentPageSize.value > 0) return;
    // if (!isSelectNFT.value && NFRList.value.length % currentPageSize.value > 0) return;
    currentPageNum.value++;
    if(isSelectNFT.value) {
      getNFTList();
    } else {
      getNFRList();
    }
  }
};
// 监听滚动区域，加载出来后挂载滚动方法
watch(scrollListRef, (val) => {
  if(val) {
    scrollListRef.value?.addEventListener('scroll', handleScroll);
  }
});
watch(() => noScroll.value, () => {
  // 根据条件添加删除滚动函数
  if (!noScroll.value) {
    window.console.log('add listen');
    scrollListRef.value?.addEventListener('scroll', handleScroll);
  } else {
    window.console.log('remove listen');
    scrollListRef.value?.removeEventListener('scroll', handleScroll);
  }
},{immediate: true});
// 获取拥有的NFT列表
const handleSelectChange = (index: number) => {
  isSelectNFT.value = index === 1 ? true : false;
  if(index === 1) {
    getNFTList(true);
  } else {
    getNFRList(true);
  }
  currentPageNum.value = 1;
  noScroll.value = false;
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
    tokenType1: '',
    tokenType2: '',
    wearMeta: {
      description: desc.value,
      expirationDate: '',
      image: '',
      name: name.value,
      properties: []
    }
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
  let value: IWearItem;
  if(isSelectNFT.value) {
    // 选择的是NFT
    value = {
      image: NFTList.value[currentAvatar.value].imageUrl,
      tokenAddress: NFTList.value[currentAvatar.value].contractAddress,
      tokenId: NFTList.value[currentAvatar.value].tokenId,
      type: 1
    };
  } else {
    value = {
      image: NFRList.value[currentAvatar.value].image,
      tokenAddress: NFRList.value[currentAvatar.value].nfrTokenAddress,
      tokenId: NFRList.value[currentAvatar.value].nfrTokenId,
      type: 2
    };
  }
  if(triggerType.value === 'left') leftItem.value = value;
  else selectedItem.value = value;
  currentAvatar.value = -1;
};
// 返回
const handleBackClick = () => {
  currentAvatar.value = -1;
  isWear.value = true;
};
const handleWearClick = () => {
  if(!name.value) {
    message.error(t('wear-page.inputName'));
    return;
  }
  if(!desc.value) {
    message.error(t('wear-page.desc'));
    return;
  }
  if(!leftItem.value || !selectedItem.value) {
    message.error(t('wear-page.selectTip'));
    return;
  }
  createWear(leftItem.value as IWearItem,selectedItem.value as IWearItem);
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
