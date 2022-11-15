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
          <a>{{ t('alert-msg.request-success.desc[1]') }}</a>
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
import { EV_RELOAD_NFR_LIST } from '@/utils/constant';
import { useControllerStore } from '@/stores/controller';

const { t } = useI18n();
const router = useRouter();
const userInfoStore = useUserInfoStore();
const { requestNFR } = useSeaport();
const controllerStore = useControllerStore();

const nftDetalsRef = ref<INFTsType>();
const isSuccessful = ref(false);
const requestVisibleRef = ref(false);
const myAddressRef = ref('');

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
  const res = await httpGetNFTsDetails(String(address), String(id));
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
  controllerStore.setGlobalLoading(true);

  try {
    const resParams = await requestNFR(e);
    const res = await httpRequestNFR(resParams);
    if (res.code !== 0) {
      message.error(res.msg);
      controllerStore.setGlobalLoading(false);
      return;
    }
    requestVisibleRef.value = false;
    isSuccessful.value = true;
    emitter.emit(EV_RELOAD_NFR_LIST);
  } catch (error) {
    console.error(error);
  }
  controllerStore.setGlobalLoading(false);
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
