<template>
  <div>
    <BaseNFTsDetailsLayout
      v-if="nftDetalsRef"
      :data="nftDetalsRef"
    >
      <div class="explore-nft-details">
        <!-- 不是所有者 -->
        <template v-if="!isOwner">
          <div
            class="btn"
            @click="emitRequestNFR"
          >
            {{ t('nfr-actions[0]') }}
            <img
              :src="IconFileAdd"
              alt=""
            />
          </div>
        </template>
        <!-- 是所有者 -->
        <template v-else>
          <div
            class="btn"
            @click="router.push(`/create-nfr/${nftDetalsRef?.contractAddress}/${nftDetalsRef?.id}`)"
          >
            {{ t('nfr-actions[1]') }}
            <img
              :src="IconFolder"
              alt=""
            />
          </div>
        </template>
        <div class="nfrs">
          <NFRsPannel
            v-if="nftDetalsRef"
            :data="nftDetalsRef"
            :is-owner="isOwner"
          ></NFRsPannel>
        </div>
        <div class="request">
          <request-pannel
            v-if="nftDetalsRef"
            :data="nftDetalsRef"
            :is-owner="isOwner"
          ></request-pannel>
        </div>
      </div>
    </BaseNFTsDetailsLayout>

    <!-- tip -->
    <template v-if="isValidAddressRef">
      <div class="invalid">Invalid address</div>
    </template>
    <div :style="{ height: '89px' }"></div>
    <!-- 请求nfr -->
    <template v-if="requestVisibleRef">
      <RequestNFRModal
        :visible="requestVisibleRef"
        :data="nftDetalsRef!"
        @close="requestVisibleRef = false"
        @request="handleRequest"
      ></RequestNFRModal>
    </template>

    <!-- 消息框 -->
    <template v-if="isSuccessful">
      <base-alert
        :visible="isSuccessful"
        :title="t('alert-msg.request-success.title')"
        :icon="ImagePostbox"
        @close="isSuccessful = false"
      >
        <template #desc>
          {{ t('alert-msg.request-success.desc[0]') }}
          <a @click="skip">{{ t('alert-msg.request-success.desc[1]') }}</a>
        </template>
      </base-alert>
    </template>
  </div>
</template>

<script setup lang="ts">
import IconFolder from '@/assets/icons/folder.png';
import IconFileAdd from '@/assets/icons/file-add.png';
import ImagePostbox from '@/assets/images/postbox.png';
import { httpGetNFTsDetails } from '@/api/explore';
import BaseNFTsDetailsLayout from '@/components/BaseNFTsDetailsLayout/index.vue';
import BaseAlert from '@/components/BaseAlert/index.vue';
import RequestPannel from './components/RequestPannel.vue';
import NFRsPannel from './components/NFRsPannel.vue';
import RequestNFRModal from './components//RequestNFRModal.vue';
import { INFRTypeForRequest, INFTsType } from '@/types/nft';
import { onMounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/user-info';
import useSeaport from '@/hooks/useSeaport';
import { httpRequestNFR } from '@/api/nfr';
import { message } from 'ant-design-vue';
import emitter from '@/utils/event';
import { EV_RELOAD_NFR_LIST, ERR } from '@/utils/constant';
import { useControllerStore } from '@/stores/controller';
import _ from 'lodash-es';
import { nfrContractAddress } from '@/hooks/var';

const { t } = useI18n();
const router = useRouter();
const userInfoStore = useUserInfoStore();
const { requestNFR, getWethBalance } = useSeaport();
const controllerStore = useControllerStore();

const nftDetalsRef = ref<INFTsType>();
const isSuccessful = ref(false);
const requestVisibleRef = ref(false);
const myAddressRef = ref('');
const isValidAddressRef = ref(false);
const skip = () => {
  sessionStorage.setItem('profile-tab', '1');
  router.push(`/profile/${userInfoStore.currentUser.publicKey}`);
};

/** 触发请求nfr按钮 */
const emitRequestNFR = () => {
  if (!userInfoStore.currentUser.isLogin) {
    userInfoStore.setLoginModalVisible(true);
    return;
  }
  requestVisibleRef.value = true;
};

/** 获取nft详情 */
const getNFTsDetails = async () => {
  const { address, id } = router.currentRoute.value.params;
  if (String(address).toLowerCase() === nfrContractAddress.toLowerCase()) {
    isValidAddressRef.value = true;
    return;
  }
  const res = await httpGetNFTsDetails(String(address), String(id));
  if (!res.data) {
    message.error(res.msg);
    return;
  }
  const d = res.data;
  nftDetalsRef.value = {
    avatar: d.imageUrl,
    id: d.tokenId,
    contractAddress: d.contractAddress,
    name: d.name,
    props: d.traits?.map((item: { traitType: string; value: string }) => {
      const { traitType, value } = item;
      return `${traitType} ${value}`;
    }),
    attributes: _.fromPairs(
      d.traits?.map((item: { traitType: string; value: string }) => {
        const { traitType, value } = item;
        return [traitType, value];
      }),
    ),
    owner: d.ownerAddressList,
  } as INFTsType;
};

/** 判断当前nft owner */
const isOwner = computed(() => {
  const address = myAddressRef.value;
  return !nftDetalsRef.value?.owner?.every((item) => item.toLowerCase() !== address.toLowerCase());
});

const init = async () => {
  getNFTsDetails();
  myAddressRef.value = userInfoStore.currentUser.publicKey;
};

onMounted(() => {
  init();
});

/** 请求nfr */
const handleRequest = async (e: INFRTypeForRequest) => {
  if (userInfoStore.currentChainId !== Number(import.meta.env.VITE_CHAINID)) {
    message.error('You are not connected to the correct network environment! ');
    return;
  }
  controllerStore.setGlobalLoading(true);
  controllerStore.setGlobalTip(t('wait-msg.request'));
  const obj = {
    ...e,
    avatar: nftDetalsRef.value?.avatar,
    attributes: nftDetalsRef.value?.attributes,
  };
  const balance = await getWethBalance(userInfoStore.currentUser.publicKey);
  if (Number(balance) < Number(e.price)) {
    message.warn(t('warn-msg.weth-not-enough'));
    controllerStore.setGlobalLoading(false);
    return;
  }
  try {
    const resParams = await requestNFR(obj);
    const res = await httpRequestNFR(resParams);
    if (res.code !== 0) {
      message.error(res.msg);
      controllerStore.setGlobalLoading(false);
      return;
    }
    requestVisibleRef.value = false;
    isSuccessful.value = true;
    emitter.emit(EV_RELOAD_NFR_LIST);
  } catch (error: unknown) {
    const { code } = error as IOpenseaErrorType;
    if (code === ERR.RejectMessage) {
      message.error(t('err-msg.reject'));
    }
    console.error(error);
  }
  controllerStore.setGlobalLoading(false);
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
