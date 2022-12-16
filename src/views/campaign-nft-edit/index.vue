<template>
  <div class="edit-wrap">
    <div class="campaign-info">{{ campaignName }}</div>
    <div v-if="!isCreate">
      <div class="nft-edit">
        <div
          class="add item-size"
          @click="handleAddClick"
        >
          <div class="icon radius10">
            <img
              src="../../assets/icons/icon-add.png"
              alt=""
              srcset=""
            />
            <div class="text"></div>
          </div>
        </div>
        <div
          v-for="(item, index) in waitingMintList"
          :key="index"
          :class="['nft-item', 'item-size']"
        >
          <div
            class="delete"
            @click.stop="handleItemDelete(item.id)"
          >
            <img
              src="../../assets/icons/close.png"
              class="delete"
              alt=""
              srcset=""
            />
          </div>
          <img
            :src="item.imageUrl"
            class="img"
            alt=""
          />
          <div class="info">
            <div class="text">
              <div class="name">{{ item.name }}</div>
              <div class="status">{{ item.status }}</div>
            </div>
          </div>
        </div>
        <div
          v-for="(item, index) in waitingListList"
          :key="index"
          :class="['nft-item', 'item-size']"
        >
          <div
            class="delete"
            @click.stop="handleItemDelete(item.id)"
          >
            <img
              src="../../assets/icons/close.png"
              class="delete"
              alt=""
              srcset=""
            />
          </div>
          <img
            :src="item.imageUrl"
            class="img"
            alt=""
          />
          <div class="info">
            <div class="text">
              <div class="name">{{ item.name }}</div>
              <div class="status">{{ item.status }}</div>
            </div>
            <div
              v-if="!item.nftOrderId || !item.nfrOrderId"
              class="button"
              @click="handleNFTList(item)"
            >
              List
            </div>
          </div>
        </div>
        <div
          v-for="(item, index) in listedList"
          :key="index"
          class="nft-item item-size"
        >
          <img
            :src="item.imageUrl"
            alt=""
          />
          <div class="info">
            <div class="text">
              <div class="name">{{ item.name }}</div>
              <div class="status">{{ item.status }}</div>
            </div>
            <div
              v-if="!item.nftOrderId || !item.nfrOrderId"
              class="button"
              @click="handleNFTList(item)"
            >
              List
            </div>
          </div>
        </div>
      </div>
      <div class="operate">
        <div
          class="operate-button ok"
          @click="handleMint"
        >
          <span>{{ t('mintAll') }}</span>
        </div>
      </div>
    </div>
    <div
      v-else
      class="nft-create"
    >
      <form-item
        class="form-item"
        :title="t('newNFT.imageLabel')"
        :width="600"
      >
        <BaseImageSelect
          v-model="newNFT.imageUrl"
          width="300"
          height="300"
          icon-size="50"
          url="/campaign-nft/upload"
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
          :error-tip="nameTip"
          :placeholder="t('newNFT.namePlaceholder')"
        >
        </base-input>
      </form-item>
      <form-item-price
        class="form-item"
        :title="t('create-nfr-form-items[5]')"
      >
        <base-input
          v-model="newNFT.price"
          type="number"
          :error-tip="priceTip"
          style-type="border"
        ></base-input>
      </form-item-price>
      <form-item
        class="form-item"
        :title="t('newNFT.descLabel')"
        :width="600"
      >
        <base-textarea v-model="newNFT.description" :error-tip="descTip"></base-textarea>
      </form-item>
      <div class="operate">
        <div
          class="operate-button back"
          @click="handleBackClick"
        >
          <span>{{ t('campaign-page.back') }}</span>
          <em></em>
        </div>
        <div
          class="operate-button ok"
          @click="handleOkClick"
        >
          <span>{{ t('ok') }}</span>
          <em></em>
        </div>
      </div>
    </div>
    <BaseDialog
      :visible="mintTipDialogVisible"
      width="640"
      height="200"
      :mask-disable="true"
      @close="handleMintDialogClose"
    >
      <div class="tip-content">
        <i class="icon-success icon"></i>
        <div class="info-text">
          <div class="info-title">{{ t('mintSuccessTips') }}</div>
        </div>
      </div>
      <template #button>
        <div
          class="dialog-button"
          @click="handleMintDialogClose"
        >
          <span>{{ t('ok') }}</span>
          <i class="icon-ok"></i>
        </div>
      </template>
    </BaseDialog>
    <PrivateSwitchNetwork
      :dialog-visible="switchNetworkVisible"
      @close="(switchNetworkVisible = false)"
    ></PrivateSwitchNetwork>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ICreateNFT, INFRTypeForRequest } from '@/types/nft';
import BaseImageSelect from '@/components/BaseImageSelect/index.vue';
import FormItem from '@/components/BaseForm/FormItem.vue';
import FormItemPrice from '@/components/BaseForm/FormItemPrice.vue';
import BaseInput from '@/components/BaseInput/index.vue';
import BaseTextarea from '@/components/BaseTextarea/index.vue';
import { useI18n } from 'vue-i18n';
import {
  httpSaveNFT,
  httpGetCampaignNFTList,
  httpRemoveCampaignNFT,
  httpRelateOrder,
  httpListNFT,
} from '@/api/campaign';
import { useRoute } from 'vue-router';
import useContract from '@/hooks/useContract';
import { message } from 'ant-design-vue';
import useSeaport from '@/hooks/useSeaport';
import { useControllerStore } from '@/stores/controller';
import { httpListNFR } from '@/api/nfr';
import { ERR } from '@/utils/constant';
import { toNonExponential } from '@/utils/util';
import { httpMintNFT } from '@/api/nft';
import BaseDialog from '@/components/BaseDialog/index.vue';
import _ from 'lodash-es';
import { useUserInfoStore } from '@/stores/user-info';
import PrivateSwitchNetwork from '@/components/PrivateSwitchNetwork/index.vue';

const { t } = useI18n();
const route = useRoute();
const { mintNFt } = useContract();
const { listNFT, listNFR } = useSeaport();
const controllerStore = useControllerStore();
const userInfoStore = useUserInfoStore();

const campaignId = ref<number>();
const campaignName = ref<string>();
const isCreate = ref(false);
const waitingListList = ref<ICreateNFT[]>([]);
const waitingMintList = ref<ICreateNFT[]>([]);
const listedList = ref<ICreateNFT[]>([]);
const nftIds = ref<string[]>([]);
const newNFT = ref<{
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}>({
  name: '',
  imageUrl: '',
  price: 0,
  description: '',
});
const handleAddClick = () => {
  isCreate.value = true;
};

// 切换网络确认弹窗
const switchNetworkVisible = ref(false);

// 修改nft状态
const saveResultToServer = async (ids: string[], type: string, result: boolean) => {
  const nftTokenIds = ids.join(',');
  const res = await httpMintNFT({ nftTokenIds, type, result });
  return res.code === 0;
};

const getMintingList = async () => {
  const res = await httpGetCampaignNFTList(campaignId.value as number);
  if (res.code === 0) {
    listedList.value = res.data.listedList;
    waitingListList.value = res.data.waitingListList;
    waitingMintList.value = res.data.waitingMintList;
    nftIds.value = res.data.nftTokenIds.split(',').filter((item: string) => item !== '');
  } else {
    message.error(res.msg);
  }
};
// 下架
const handleItemDelete = async (nftId: number) => {
  const res = await httpRemoveCampaignNFT(nftId);
  if (res.code === 0) {
    getMintingList();
  }
};
// 选中
// const handleItemSelect = (tokenId: string) => {
//   if(isSelect(tokenId)) {
//     const index = selectList.value.indexOf(tokenId);
//     selectList.value.splice(index,1);
//   } else {
//     selectList.value.push(tokenId);
//   }
// };
const saveNFT = async () => {
  const res = await httpSaveNFT({
    campaignId: Number(campaignId.value),
    ...newNFT.value,
  });
  if (res.code === 0) {
    isCreate.value = false;
    newNFT.value = {
      name: '',
      imageUrl: '',
      price: 0,
      description: '',
    };
    getMintingList();
  } else {
    message.error(res.msg);
  }
};
// NFR list
const handleNFRList = async (nfr: INFRTypeForRequest, id: number, tokenId: string) => {
  if(userInfoStore.currentChainId !== Number(import.meta.env.VITE_CHAINID)) {
    switchNetworkVisible.value = true;
    return;
  }
  console.log('now nfr list');
  nfr.price = toNonExponential(Number(nfr.price)) as number;
  controllerStore.setGlobalLoading(true);
  controllerStore.setGlobalTip(t('wait-msg.listNFR'));
  try {
    const resParams = await listNFR(nfr);
    const res = await httpListNFR(resParams);
    if (res.code !== 0) {
      message.error(res.msg);
      controllerStore.setGlobalLoading(false);
      return;
    } else {
      const resOrder = await httpRelateOrder({
        campaignNftId: id,
        nfrOrderId: res.data,
      });
      if (resOrder.code !== 0) {
        saveResultToServer([tokenId], 'list', false);
        controllerStore.setGlobalLoading(false);
        message.error('err-msg.request-fail');
      } else {
        const resSave = await saveResultToServer([tokenId], 'list', true);
        controllerStore.setGlobalLoading(false);
        // eslint-disable-next-line max-depth
        if (resSave) getMintingList();
      }
    }
  } catch (error) {
    const { code } = error as IOpenseaErrorType;
    if (code === ERR.RejectMessage) {
      message.error(t('err-msg.reject'));
    }
    console.error(error);
    controllerStore.setGlobalLoading(false);
  }
};
// NFT list
const handleNFTList = async (i: ICreateNFT) => {
  if(userInfoStore.currentChainId !== Number(import.meta.env.VITE_CHAINID)) {
    switchNetworkVisible.value = true;
    return;
  }
  const price = toNonExponential(Number(i.price));
  const TEN = 10;
  const duration = 60;
  const nfr = {
    type: 'Trial',
    price: Number(price) / TEN,
    druation: duration,
    quantity: TEN,
    nftId: i.tokenId,
    nftContractAddress: i.contractAddress,
    desc: i.description,
    avatar: i.imageUrl,
    nftName: i.name,
  };
  if (i.nftOrderId && !i.nfrOrderId) {
    console.log('now nfr list');
    handleNFRList(nfr, i.id, i.tokenId);
    return;
  }
  console.log('now nft list');
  controllerStore.setGlobalLoading(true);
  controllerStore.setGlobalTip(t('wait-msg.listNFT'));
  try {
    const listRes = await listNFT(i);
    const res = await httpListNFT(listRes);
    if (res.code !== 0) {
      message.error(res.msg);
      controllerStore.setGlobalLoading(false);
      return;
    } else {
      const resOrder = await httpRelateOrder({
        campaignNftId: i.id,
        nftOrderId: res.data,
      });
      if (resOrder.code === 0) {
        console.log('now nft list success');
        handleNFRList(nfr, i.id, i.tokenId);
      } else {
        message.error('err-msg.request-fail');
      }
    }
  } catch (error) {
    const { code } = error as IOpenseaErrorType;
    if (code === ERR.RejectMessage) {
      message.error(t('err-msg.reject'));
    }
    console.error(error);
    controllerStore.setGlobalLoading(false);
  }
};

// mint完成之后的提示弹框
const mintTipDialogVisible = ref(false);
const handleMintDialogClose = () => {
  getMintingList();
  mintTipDialogVisible.value = false;
};

// mint
const handleMint = async () => {
  console.log('mint');
  if (nftIds.value.length === 0) {
    message.warn(t('warn-msg.mintEmpty'));
    return;
  }
  if(userInfoStore.currentChainId !== Number(import.meta.env.VITE_CHAINID)) {
    switchNetworkVisible.value = true;
    return;
  }
  // 将待mint的nft数据筛选出来
  // const mintList = waitingMintList.value.filter((item:ICreateNFT) => nftIds.value.indexOf(item.tokenId) !== -1);

  // eslint-disable-next-line no-undef
  const arr = nftIds.value.map((item) => BigInt(item));
  if (arr.length === 0) return;
  controllerStore.setGlobalLoading(true);
  controllerStore.setGlobalTip(t('wait-msg.mint'));
  const mintRes = await mintNFt(arr);
  // mint完成后
  if (mintRes === 'success') {
    console.log('mint success');
    mintTipDialogVisible.value = true;
    // 延迟一秒查询结果
    const timeout = 1000;
    setTimeout(() => {
      getMintingList();
    }, timeout);
  } else if (mintRes === 'waiting') {
    message.warn(t('warn-msg.busy'));
  } else {
    message.error(t('err-msg.request-fail'));
  }

  controllerStore.setGlobalLoading(false);
};

const handleBackClick = () => {
  isCreate.value = false;
  newNFT.value = {
    name: '',
    imageUrl: '',
    price: 0,
    description: '',
  };
};
const checkPrice = (price: string) => {
  if(!price) return false;
  if(Number(price) === 0) return false;
  const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,10}|[1-9][0-9]*\.\d{1,10})))$/;
  return reg.test(String(newNFT.value.price));
};

const nameTip = ref('');
const priceTip = ref('');
const descTip = ref('');
const TIME = 1000;
const checkNFT = () => {
  if(!newNFT.value.name) {
    nameTip.value = t('warn-msg.nameEmpty');
    return;
  }
  nameTip.value = '';
  if(!checkPrice(String(newNFT.value.price))) {
    priceTip.value = t('warn-msg.priceEmpty');
    return;
  }
  if(Number(newNFT.value.price) < import.meta.env.VITE_MIN_PRICE) {
    priceTip.value = `${t('warn-msg.minPrice')} ${import.meta.env.VITE_MIN_PRICE}`;
    return;
  }
  priceTip.value = '';
  if(!newNFT.value.description) {
    descTip.value = t('warn-msg.descEmpty');
    return;
  }
  descTip.value = '';
  if(!newNFT.value.imageUrl) {
    message.warn(t('warn-msg.imageEmpty'));
    return;
  }
  saveNFT();
};
const handleOkClick = _.debounce(checkNFT, TIME);

onMounted(() => {
  campaignId.value = Number(route.params.id as string);
  campaignName.value = route.query.campaignName as string;
  getMintingList();
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
