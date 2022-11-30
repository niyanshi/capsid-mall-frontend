<template>
  <div class="wear-wrap">
    <div class="tab">
      <span :class="[tabIndex === 0 ? 'active' : '']" @click="handleTabChange(0)">{{ t('wear-page.tab[0]') }}</span>
      <span :class="[tabIndex === 1 ? 'active' : '']" @click="handleTabChange(1)">{{ t('wear-page.tab[1]') }}</span>
      <span :class="[tabIndex === 2 ? 'active' : '']" @click="handleTabChange(2)">{{ t('wear-page.tab[2]') }}</span>
    </div>
    <div class="content">
      <div class="add item-size" @click="handleWearClick">
        <div class="icon">
          <img src="../../assets/icons/icon-add.png" alt="" srcset="">
          <div class="text">{{t('wear-page.createNew')}}</div>
        </div>
      </div>
      <div v-for="(item, index) in wearList" :key="index" class="wear-item item-size">
        <!-- <img v-if="item.wearMeta?.image" :src="item.wearMeta?.image" alt="" srcset=""> -->
        <BaseNFRImage
          v-if="isCompleteNFR(item)"
          style="width: 244px;height:244px"
          :src="item.wearMeta?.image as string"
        ></BaseNFRImage>
        <PrivateImage v-else-if="item.wearMeta?.image" :src="item.wearMeta?.image"></PrivateImage>
        <PrivateImage v-else :src="item.parentPic1"></PrivateImage>
        <!-- <img v-else :src="item.parentPic1" alt="" srcset=""> -->
        <div class="status text">{{item.status === 3 ? t('wear-page.tab[1]') : t('wear-page.tab[2]')}}</div>
      </div>
    </div>
    <PrivateWearDialog :visible="visible" @close="handleDialogClose" @result="handleWearRes"></PrivateWearDialog>
    <BaseDialog :visible="resultDialogVisible" width="640" height="240"  :mask-disable="true" @close="handleResultDialogClose">
      <div v-if="resultSuccess" class="tip-content">
        <i class="icon-success icon-size"></i>
        <div class="info-text">
          <div class="info-title">{{ t('wearSuccess') }}</div>
          <div class="message">
            <!-- <p>{{ t('viewInMy') }}<a>{{ t('profile') }}</a></p> -->
            <p>{{ t('wearSuccessTips') }}</p>
          </div>
        </div>
      </div>
      <div v-else class="tip-content">
        <i class="icon-error icon-size"></i>
        <div class="info-text">
          <div class="info-title">{{ t('error') }}</div>
          <div class="message">
            <p>{{ t('errorTips') }}</p>
          </div>
        </div>
      </div>
      <template #button>
        <div class="dialog-button" @click="handleResDislogClick">
          <span>{{ t('ok') }}</span>
          <i class="icon-ok"></i>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { httpGetWearList } from '@/api/campaign';
import { useUserInfoStore } from '@/stores/user-info';
import { IWear } from '@/types/campaign';
import BaseDialog from '@/components/BaseDialog/index.vue';
import PrivateWearDialog from '@/components/PrivateWearDialog/index.vue';
import PrivateImage from '@/components/PrivateImage/index.vue';
import BaseNFRImage from '@/components/BaseNFRImage/index.vue';

const { t } = useI18n();
const userInfoStore = useUserInfoStore();

const tabIndex = ref(0);

const isCompleteNFR = (item:IWear) => {
  const completeStatus = 3;
  const nfr = 2;
  return item.resultType === nfr
    && item.status === completeStatus;
};

const wearList = ref<IWear[]>([]);
/**
 * 获取wear的列表
 * @ accountId 用户ID
 * @ type 类型 1 已完成 2 制作中
 */
const getWearList = async () => {
  const res = await httpGetWearList({
    accountId: userInfoStore.currentUser.userId,
    type: tabIndex.value === 0 ? '' : tabIndex.value
  });
  if(res.code === 0) {
    wearList.value = res.data.records;
  }
};
const handleTabChange = (index: number) => {
  tabIndex.value = index;
  getWearList();
};
const visible = ref(false);
const resultDialogVisible = ref(false);
const resultSuccess = ref(false);

const handleWearClick = () => {
  visible.value = true;
};
const handleDialogClose = () => {
  visible.value = false;
};
const handleWearRes = (res: boolean) => {
  resultSuccess.value = res;
  resultDialogVisible.value = true;
  getWearList();
};

const handleResultDialogClose = () => {
  resultDialogVisible.value = false;
};
const handleResDislogClick = () => {
  resultDialogVisible.value = false;
  handleDialogClose();
};
onMounted(() => {
  getWearList();
});
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
