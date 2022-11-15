<template>
  <div class="create-nfr">
    <div class="title">
      <img
        :src="ImageBallot"
        alt=""
      />
      {{ t('create-nfr') }}
    </div>
    <div class="content">
      <div class="left">
        <div class="layer">
          <form-item
            :title="t('create-nfr-form-items[0]')"
            :width="224"
          >
            <base-select
              v-model="valueObj.type"
              :options="options"
              :placeholder="t('placeholder.type')"
            ></base-select>
          </form-item>
        </div>
        <!-- Expiration date 和 Quantity -->
        <div class="layer one">
          <!-- Expiration date  -->
          <form-item :title="t('create-nfr-form-items[1]')">
            <base-datepicker ref="expireRef"></base-datepicker>
          </form-item>
          <form-item :title="t('create-nfr-form-items[2]')">
            <base-input
              v-model="valueObj.quantity"
              :placeholder="t('placeholder.quantity')"
              type="number"
              style-type="line"
            ></base-input>
          </form-item>
        </div>
        <div class="layer">
          <!-- Describe the NFR Briefly -->
          <form-item
            :title="t('create-nfr-form-items[3]')"
            :width="592"
          >
            <base-textarea v-model="valueObj.desc"></base-textarea>
          </form-item>
        </div>
        <div class="layer bottom">
          <form-item-details :title="t('create-nfr-form-items[4]')">
            <base-input
              v-model="valueObj.details"
              :placeholder="t('placeholder.optional')"
            ></base-input>
          </form-item-details>

          <form-item-price :title="t('create-nfr-form-items[5]')">
            <base-input
              v-model="valueObj.price"
              type="number"
              style-type="border"
            ></base-input>
          </form-item-price>
        </div>
      </div>
      <div class="right">
        <collection-show
          :editable="isEditableRef"
          :data="nftObj"
          @select="handleToSelect"
        ></collection-show>
        <div class="btn-group">
          <div
            class="item vice"
            @click="router.back()"
          >
            {{ t('back') }}
            <img
              :src="SvgBack"
              alt=""
            />
          </div>
          <div
            class="item"
            @click="handleList"
          >
            {{ t('list') }}
            <img
              :src="SvgAddList"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <template v-if="isChooseRef">
      <ChooseNFTModal
        :visible="isChooseRef"
        @close="isChooseRef = false"
        @list="handleGetSelected"
      ></ChooseNFTModal>
    </template>
    <!-- 成功上链提示 -->
    <template v-if="isSuccessful">
      <base-alert
        :visible="isSuccessful"
        :title="t('alert-msg.list-success.title')"
        :icon="IconPartyPopper"
        @close="handleListDone"
      >
        <template #desc>
          {{ t('alert-msg.list-success.desc[0]') }}
          <a>{{ t('alert-msg.list-success.desc[1]') }}</a>
        </template>
      </base-alert>
    </template>

    <div :style="{ height: '89px' }"></div>
  </div>
</template>

<script setup lang="ts">
import IconPartyPopper from '@/assets/icons/party-popper.png';
import SvgBack from '@/assets/svg/back.svg';
import SvgAddList from '@/assets/svg/add-list.svg';
import ImageBallot from '@/assets/images/ballot.png';
import { watch, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseAlert from '@/components/BaseAlert/index.vue';
import BaseSelect from '@/components/BaseSelect/index.vue';
import FormItemPrice from '@/components/BaseForm/FormItemPrice.vue';
import FormItemDetails from '@/components/BaseForm/FormItemDetails.vue';
import FormItem from '@/components/BaseForm/FormItem.vue';
import BaseInput from '@/components/BaseInput/index.vue';
import BaseTextarea from '@/components/BaseTextarea/index.vue';
import BaseDatepicker from '@/components/BaseDatepicker/index.vue';
import CollectionShow from './components/CollectionShow.vue';
import ChooseNFTModal from './components/ChooseNFTModal.vue';
import useSeaport from '@/hooks/useSeaport';
import { useRouter } from 'vue-router';
import { httpGetNFTsDetails } from '@/api/explore';
import { INFRTypeForRequest, INFTsType } from '@/types/nft';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { httpListNFR } from '@/api/nfr';
import { useUserInfoStore } from '@/stores/user-info';

const { t } = useI18n();
const { listNFR } = useSeaport();
const router = useRouter();
const userInfoStore = useUserInfoStore();

const isChooseRef = ref(false);
const expireRef = ref();
const isSuccessful = ref(false);
const isEditableRef = ref(false);
const nftObj = reactive<INFTsType>({
  id: '',
  name: '',
  avatar: '',
});
const valueObj = reactive<{
  type: string;
  details: string;
  price?: number;
  quantity?: number;
  desc: string;
}>({
  type: '',
  details: '',
  desc: '',
});
const options = [
  { key: '0', value: 'type' },
  { key: '1', value: 'type1' },
  { key: '2', value: 'type2' },
  { key: '3', value: 'type3' },
];
const getKey = (val: string) => {
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === val) return options[i].key;
  }
  return '';
};

/** 获取nft详情 */
const getNFTsDetails = async (address: string, id: string) => {
  const res = await httpGetNFTsDetails(String(address), String(id));
  const d = res.data;
  nftObj.avatar = d.imageUrl;
  nftObj.id = d.tokenId;
  nftObj.name = d.name;
  nftObj.contractAddress = d.contractAddress;
  nftObj.props = d.traits?.map((item: { traitType: string; value: string }) => {
    const { traitType, value } = item;
    return `${traitType} ${value}`;
  });
  nftObj.owner = d.ownerAddressList;
};

/** 点击选择NFT */
const handleToSelect = () => {
  if (!userInfoStore.currentUser.isLogin) {
    userInfoStore.setLoginModalVisible(true);
    return;
  }
  isChooseRef.value = true;
};

/** 选择NFT  */
const handleGetSelected = (e?: INFTsType) => {
  if (!e) return;
  nftObj.id = e.id;
  nftObj.avatar = e.avatar;
  nftObj.contractAddress = e.contractAddress;
  isChooseRef.value = false;
};

/** 数据验证 */
const validateData = () => {
  const quantityCof = 10;

  if (!nftObj.contractAddress || !nftObj.id) {
    message.error(t('warn-msg.nft'));
    return false;
  }
  if (!valueObj.type) {
    message.error(t('warn-msg.type'));
    return false;
  }
  if (!valueObj.quantity || Number(valueObj.quantity) < quantityCof) {
    message.error(t('warn-msg.quantity'));
    return false;
  }
  if (!valueObj.desc) {
    message.error(t('warn-msg.desc'));
    return false;
  }
  if (!valueObj.price) {
    message.error(t('warn-msg.price'));
    return false;
  }
  return true;
};

/** list NFR */
const handleList = async () => {
  const current = dayjs();
  const expire = dayjs(expireRef.value.currentValue).endOf('d');

  if (!validateData()) return;
  const obj = {
    type: Number(getKey(valueObj.type)),
    quantity: valueObj.quantity || 0,
    price: valueObj.price || 0,
    druation: Math.ceil(expire.diff(current, 'd', true)),
    nftId: String(nftObj.id),
    nftContractAddress: String(nftObj.contractAddress),
    desc: valueObj.desc,
  } as INFRTypeForRequest;
  const resParams = await listNFR(obj);
  const res = await httpListNFR(resParams);
  if (res.code === 0) {
    isSuccessful.value = true;
    return;
  }
  message.error(res.msg);
};

/** 完成上链后的回调 */
const handleListDone = () => {
  isSuccessful.value = false;
  router.push(`/explore/nft-details/${nftObj.contractAddress}/${nftObj.id}`);
};

onMounted(() => {
  const { address, id } = router.currentRoute.value.params;
  if (address && id) getNFTsDetails(String(address), String(id));
  isEditableRef.value = !(address && id);
});

/** 监听路由变化 */
watch(
  () => router.currentRoute.value.params,
  (newVal) => {
    const { address, id } = newVal;
    isEditableRef.value = !(address && id);
  },
);
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
