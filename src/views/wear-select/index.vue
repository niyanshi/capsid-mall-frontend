<template>
  <div class="wear-select-wrap">
    <div class="dialog-main">
      <div class="select-box">
        <div class="select-title">{{ t('selectWearable') }}</div>
        <div
          v-if="leftItem"
          class="img-box"
          @click="handleAvatarClick('left')"
        >
          <BaseNFRImage
            v-if="leftItem.tokenAddress === nfrContractAddress"
            :src="leftItem.image"
          ></BaseNFRImage>
          <img
            v-else
            ref="leftRef"
            :src="leftItem.image"
            alt=""
            @error="onError('0')"
          />
        </div>
        <div
          v-else
          class="img-box add-border"
          @click="handleAvatarClick('left')"
        >
          <div class="add-wrap">
            <img
              src="../../assets/icons/icon-add.png"
              alt=""
              srcset=""
            />
            <div class="text">{{ t('wear-page.chooseWearable') }}</div>
          </div>
        </div>
      </div>
      <div class="right-arrow split"></div>
      <div class="result-box"></div>
      <div class="left-arrow split"></div>
      <input
        ref="imageInputRef"
        type="file"
        accept="image/*"
        style="display:none"
        @change="handleFileSelect"
      >
      <div class="select-box">
        <div class="select-title">
          <Select
            v-model:value="currentWay"
            :bordered="false"
            dropdown-class-name="wear-drop"
            :dropdown-style="dropStyle"
          >
            <SelectOption
              v-for="item in dropOption"
              :key="item.value"
              :value="item.value"
              class="wear-drop-option"
            >{{item.label}}</SelectOption>
            <template #suffixIcon>
              <caret-down-outlined class="ant-select-suffix" style="color: #1f263b" />
            </template>
          </Select>
        </div>
        <div
          v-if="(currentWay === 1 && rightItem?.image)"
          class="img-box"
        >
          <BaseNFRImage
            v-if="currentWay === 1 && rightItem.tokenAddress === nfrContractAddress"
            :src="rightItem.image">
          </BaseNFRImage>
          <img
            v-else
            ref="rightRef"
            :src="currentWay === 1 ? rightItem?.image : avatarImage"
            alt=""
            @click="handleAvatarClick('right')"
            @error="onError('1')"
          />
        </div>
        <div
          v-else-if="(currentWay === 2 && avatarImage)"
          class="img-box"
        >
          <img
            ref="rightRef"
            :src="avatarImage"
            alt=""
            @click="handleAvatarClick('right')"
            @error="onError('1')"
          />
        </div>
        <div
          v-else
          class="img-box add-border"
          @click="handleAvatarClick('right')"
        >
          <div class="add-wrap">
            <img
              src="../../assets/icons/icon-add.png"
              alt=""
              srcset=""
            />
            <div class="text">{{ t('selectAvatar') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="form">
      <div class="form-item">
        <span class="label">{{ t('newNFT.nameLabel') }}</span>
        <base-input
          v-model="name"
          style-type="line"
          :placeholder="t('wear-page.inputName')"
          :error-tip="nameTip"
          style="flex:1"
        >
        </base-input>
      </div>
      <div class="form-item" style="width: 100%">
        <span class="label">{{ t('newNFT.descLabel') }}</span>
        <!-- <base-textarea v-model="desc"></base-textarea> -->
        <base-input
          v-model="desc"
          style-type="line"
          placeholder="please input description"
          :limit="512"
          style="flex:1"
          :error-tip="descTip"
        >
        </base-input>
      </div>
      <div
        class="dialog-button"
        @click="handleWearClick"
      >
        <span>{{ t('wear') }}</span>
        <i class="icon-wear"></i>
      </div>
    </div>
    <div v-show="currentWay===1" class="guide">
      <img src="../../assets/images/nft-guide.png" alt="" srcset="">
      <div class="text">
        <div class="title">{{ t('avatarGuidence.title') }}</div>
        <ul>
          <li>{{t('avatarGuidence.desc[0]')}}</li>
          <li>{{t('avatarGuidence.desc[1]')}}</li>
        </ul>
      </div>
    </div>
    <div v-show="currentWay===2" class="guide">
      <img src="../../assets/images/image-guide.png" alt="" srcset="">
      <div class="text">
        <div class="title">{{ t('uploadImageGuidence.title') }}</div>
        <ul>
          <li>{{t('uploadImageGuidence.desc[0]')}}</li>
          <li>{{t('uploadImageGuidence.desc[1]')}}</li>
          <li>{{t('uploadImageGuidence.desc[2]')}}</li>
        </ul>
      </div>
    </div>
    <PrivateWearDialog
      :visible="wearDialogVisible"
      @close="handleDialogClose"
      @ok="handleWearSelect"
    ></PrivateWearDialog>
    <!-- <BaseMessageBox
      :visible="resultDialogVisible"
      :title="resultTitle"
      :message="resultMsg"
      :type="resultType"
      @ok="resultDialogVisible = false"
      @close="resultDialogVisible = false"
    ></BaseMessageBox> -->
    <base-alert
      :visible="resultDialogVisible"
      :title="t('wearSuccess')"
      :icon="ImagePostbox"
      layer-class-name="wear-dialog"
      @close="resultDialogVisible = false"
    >
      <template #desc>
        View in <a @click="goLook">look</a>
        <div>The artist is working on the final. It might take a few days.</div>
        <!-- <div></div> -->
      </template>
    </base-alert>
    <base-alert
      :visible="resultError"
      title="ERROR"
      :icon="Bag"
      :h="270"
      layer-class-name="wear-dialog error"
      @close="resultError = false"
    >
      <template #desc>
        <div>An error occurred in saving order: <span style="color: #ee8b49">{{resultHash}}</span></div>
        <div>Please contact the website administrator</div>
      </template>
    </base-alert>
    <base-alert
      :visible="resultPending"
      title="Time out"
      :icon="Bag"
      :h="300"
      layer-class-name="wear-dialog"
      @close="resultPending = false"
    >
      <template #desc>
        <div>Your transaction is still in the queue,please go to your wallet to check the transaction result.Your transaction hash: </div>
        <div style="color: #ee8b49">{{resultHash}}</div>
      </template>
    </base-alert>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ImageAlt from '@/assets/images/image-alt.png';
import { onMounted, ref } from 'vue';
import { nfrContractAddress } from '@/hooks/var';
import { IWearItem } from '@/types/campaign';
import BaseNFRImage from '@/components/BaseNFRImage/index.vue';
import BaseAlert from '@/components/BaseAlert/index.vue';
import BaseInput from '@/components/BaseInput/index.vue';
import PrivateWearDialog from '@/components/PrivateWearDialog/index.vue';
import { CaretDownOutlined } from '@ant-design/icons-vue';
import { Select, SelectOption, message } from 'ant-design-vue';
import _ from 'lodash-es';
import { useControllerStore } from '@/stores/controller';
import { useUserInfoStore } from '@/stores/user-info';
import useContract from '@/hooks/useContract';
import { httpUploadload } from '@/api/campaign';
import { httpCreateWear, httpCreateWearOrder } from '@/api/wear';
import { useRoute,useRouter } from 'vue-router';
import ImagePostbox from '@/assets/icons/party-popper.png';
import Bag from '@/assets/icons/bag.png';

const { t } = useI18n();
const userInfoStore = useUserInfoStore();
const controllerStore = useControllerStore();
const { mintAndPay } = useContract();
const route = useRoute();
const router = useRouter();

const rightItem = ref<IWearItem | null>();
const leftItem = ref<IWearItem | null>();
const name = ref<string>();
const desc = ref<string>();
const leftRef = ref();
const rightRef = ref();
const imageInputRef = ref();
const onError = function (index: string) {
  if (index === '0') {
    if (!leftRef.value) return;
    leftRef.value.src = ImageAlt;
  } else if (index === '1') {
    if (!rightRef.value) return;
    rightRef.value.src = ImageAlt;
  }
};

/** 下拉菜单 */
const dropStyle = {
  'width': '144px',
  'background': '#fff',
  'border': '1px solid #efefef',
  'border-radius': '8px',
  'font-family': 'Roboto',
  'font-style': 'normal',
  'font-weight': 600,
  'font-size': '14px',
  'line-height': '20px',
  'letter-spacing': '0.02em',
  'font-feature-settings': '\'pnum\' on, \'lnum\' on',
  'color': '#1f263b',
};
const dropOption = [
  { value: 1, label: 'Select avatar NFT' },
  { value: 2, label: 'Upload an image' },
];
const currentWay = ref(1);
// 当前选择的左边的值还是右边的值
const currentTrigger = ref('left');
const wearDialogVisible = ref(false);
const resultDialogVisible = ref(false);
const resultError = ref(false);
const resultPending = ref(false);
const resultHash = ref('');
const handleDialogClose = () => {
  wearDialogVisible.value = false;
};
const handleWearSelect = (value: IWearItem) => {
  wearDialogVisible.value = false;
  if(currentTrigger.value === 'left') {
    leftItem.value = value;
  } else {
    rightItem.value = value;
  }
};

const handleAvatarClick = (direction: string) => {
  currentTrigger.value = direction;
  if(direction === 'right' && currentWay.value !== 1) {
    imageInputRef.value.click();
    return;
  }
  wearDialogVisible.value = true;
};

const avatarImage = ref<string>();
const handleFileSelect = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files ? input?.files[0] : null;
  if(file) {
    if(['image/gif','image/jpeg','image/jpg','image/png','image/svg+xml'].indexOf(file.type) === -1) {
      message.error('You can only upload images!');
      return;
    }
    controllerStore.setGlobalLoading(true);
    controllerStore.setGlobalTip('uploading...');
    const formData = new FormData();
    formData.append('file', file);
    const res = await httpUploadload('/wear/upload',formData);
    controllerStore.setGlobalLoading(false);
    if (res.code === 0) {
      avatarImage.value = res.data.fullPath;
    } else {
      message.error(res.msg);
    }
  }
};

/** wear相关操作 */
// 清空信息操作
const clearWearInfo = () => {
  leftItem.value = null;
  rightItem.value = null;
  name.value = '';
  desc.value = '';
  avatarImage.value = '';
  currentWay.value = 1;
};
// 生成订单
const createWearOrder = async (fee: string,wearId: number,nftId: string) => {
  window.console.log('now create order');
  const res = await httpCreateWearOrder(wearId);
  if(res.code === 0) {
    const mintRes = await mintAndPay(fee,nftId,wearId,res.data);
    if(mintRes.message === 'success') {
      clearWearInfo();
      resultDialogVisible.value = true;
    } else if(mintRes.message === 'hashFail') {
      // 保存hash失败
      resultError.value = true;
      resultHash.value = mintRes.value;
    } else if(mintRes.message === 'pending') {
      // 前端轮询超时
      resultPending.value = true;
      resultHash.value = mintRes.value;
    }
    // else {
    // resultTitle.value = t('error');
    // resultMsg.value = t('errorTips');
    // resultType.value = 'error';
    // resultDialogVisible.value = true;
    // }
    controllerStore.setGlobalLoading(false);
  } else {
    controllerStore.setGlobalLoading(false);
  }
};
// 生成wear
const createWear = async (leftValue: IWearItem, rightValue: IWearItem) => {
  if (userInfoStore.currentChainId !== Number(import.meta.env.VITE_CHAINID)) {
    controllerStore.setSwitchNetworkVisible(true);
    return;
  }
  controllerStore.setGlobalLoading(true);
  controllerStore.setGlobalTip(t('wait-msg.wear'));
  const res = await httpCreateWear({
    accountAddress: userInfoStore.currentUser.publicKey,
    accountId: userInfoStore.currentUser.userId,
    // 左侧选择的信息
    parentPic1: leftValue.image,
    parentTokenId1: leftValue.tokenId,
    parentType1: leftValue.type,
    tokenAddress1: leftValue.tokenAddress,
    // 右侧选择信息，parent2Type判断： 1选择的是nft/nfr，2直接上传图片
    parent2Type: currentWay.value,
    parentPic2: currentWay.value === 1 ? rightValue.image : '',
    parentTokenId2: currentWay.value === 1 ? rightValue.tokenId : '',
    parentType2: currentWay.value === 1 ? rightValue.type : 0,
    tokenAddress2: currentWay.value === 1 ? rightValue.tokenAddress : '',
    avatarPic: currentWay.value === 1 ? '' : avatarImage.value,
    tokenType1: '',
    tokenType2: '',
    wearMeta: {
      description: desc.value,
      expirationDate: '',
      image: '',
      name: name.value,
      properties: [],
    },
  });
  if (res.code === 0) {
    createWearOrder(res.data.fee,res.data.id,res.data.tokenId);
  } else {
    message.error(res.msg);
    controllerStore.setGlobalLoading(false);
  }
};
const nameTip = ref('');
const descTip = ref('');
const wear = () => {
  if (!name.value) {
    nameTip.value = t('wear-page.inputName');
    return;
  }
  nameTip.value = '';
  if (!desc.value) {
    descTip.value = t('wear-page.desc');
    return;
  }
  descTip.value = '';
  if (!leftItem.value || !rightItem.value && !avatarImage.value) {
    message.error(t('wear-page.selectTip'));
    return;
  }
  createWear(leftItem.value as IWearItem, rightItem.value as IWearItem);
};
// 防抖间隔时间
const TIME = 500;
const handleWearClick = _.debounce(wear, TIME);
const goLook = () => {
  resultDialogVisible.value = false;
  router.push('/wear/list');
};
onMounted(() => {
  if(String(route.query.fromBuy) === '1') {
    leftItem.value = controllerStore.itemToWear as IWearItem;
  }
});
</script>

<style lang="scss" scoped>
@import './index.scss';


</style>
<style lang="scss">
.wear-drop {
  .ant-select-item {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.02em;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #1f263b;
  }
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    // background-color: #a32015;
    color: #1f263b;
    font-weight: 600;
    background-color: #f3f3f3;
  }
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    color: #fff;
    background-color: #a32015;
  }
  .ant-select-selection-item {
    color: #1f263b;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
  }
}
.select-title .ant-select-selection-item {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #1f263b;
}
.wear-dialog {
    display: flex;
    align-items: center;
    width: 80%;
    margin: 0 auto;

    & > .icon {
      width: 64px;
      height: 64px;
    }

    & > .section {
      margin-left: 24px;

      .title {
        font-family: 'Quiet Sans', serif;
        font-size: 32px;
        font-weight: 800;
      }

      .desc {
        margin-top: 10px;
        font-family: Roboto, serif;
        font-size: 20px;
        font-weight: 700;
        color: $main-font-color;
        overflow-wrap: anywhere;
        a {
          font-size: 20px;
          font-style: italic;
          font-weight: 700;
          color: #ee8b49;
          text-decoration: none;
          cursor: pointer;
        }
      }
    }
  }
</style>
