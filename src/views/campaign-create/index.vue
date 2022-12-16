<template>
  <div class="create-wrap">
    <div class="banner-choose">
      <span>{{ t('campaign-page.chooseBannar') }}</span>
      <!-- <div class="add-banner">
        <span class="icon-add"></span>
      </div> -->
      <BaseImageSelect
        v-model="campaignInfo.banner"
        width="1280"
        height="200"
        icon-size="100"
      ></BaseImageSelect>
      <div class="tips">{{ t('campaign-page.bannerTips') }}</div>
    </div>
    <div class="campaign-info">
      <form-item
        class="form-item"
        :title="t('campaign-page.campaignName')"
        :width="224"
      >
        <base-input
          v-model="campaignInfo.campaignName"
          :error-tip="nameTip"
          style-type="line"
          :placeholder="t('campaign-page.campaignName')"
        >
        </base-input>
      </form-item>
      <form-item
        class="form-item"
        :title="t('campaign-page.expirationDate')"
        :width="160"
      >
        <base-datepicker ref="expireRef"></base-datepicker>
      </form-item>
      <form-item
        class="form-item"
        :title="t('campaign-page.describeBriefly')"
        :width="1080"
      >
        <base-input
          v-model="campaignInfo.content"
          style-type="line"
          :limit="512"
        >
        </base-input>
      </form-item>
      <form-item
        class="form-item"
        :title="t('campaign-page.links')"
        :width="368"
      >
        <base-input
          v-model="campaignInfo.link"
          style-type="line"
          :placeholder="t('campaign-page.pleaseEnter')"
          :limit="512"
        >
        </base-input>
      </form-item>
    </div>
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
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import FormItem from '@/components/BaseForm/FormItem.vue';
import BaseDatepicker from '@/components/BaseDatepicker/index.vue';
import BaseInput from '@/components/BaseInput/index.vue';
import BaseImageSelect from '@/components/BaseImageSelect/index.vue';
import { httpCreateCampaign, httpGetCampaignDetail } from '@/api/campaign';
import { useUserInfoStore } from '@/stores/user-info';
import { ICampaign } from '@/types/campaign';
import _ from 'lodash-es';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const userInfoStore = useUserInfoStore();
const defaultDuration = 7;

const campaignInfo = reactive<ICampaign>({
  campaignName: '',
  startTime: '',
  endTime: '',
  content: '',
  link: '',
  ownerId: Number(userInfoStore.currentUser.userId),
  banner: '',
  ownerEtherAddr: userInfoStore.currentUser.publicKey as string,
});
const nameTip = ref('');
// 原始banner
let originalBanner = '';
const editId = ref<number>();

const expireRef = ref();
const handleBackClick = () => {
  router.push('/campaign');
};
const campaignSubmit = async () => {
  if(!campaignInfo.campaignName) {
    nameTip.value = t('warn-msg.nameEmpty');
    return;
  }
  nameTip.value = '';
  if(!campaignInfo.banner) {
    message.warn(t('warn-msg.imageEmpty'));
    return;
  }
  campaignInfo.startTime = campaignInfo.startTime || new Date().toISOString();
  campaignInfo.endTime = dayjs(expireRef.value.currentValue).endOf('day').toDate().toISOString();
  const { campaignName,startTime,endTime,content,link,ownerId,ownerEtherAddr } = campaignInfo;
  const params = {
    id: editId.value,
    banner: campaignInfo.banner === originalBanner ? null : campaignInfo.banner,
    campaignName,
    startTime,
    endTime,
    content,
    link,
    ownerId,
    ownerEtherAddr};
  if(campaignInfo.banner === originalBanner) {
    // 如果banner没有改变，为了防止图片路径出现问题，banner参数设置为空
    params.banner = null;
  }
  const res = await httpCreateCampaign(params);
  if (res.code === 0) {
    router.push('/campaign');
  }
};
const TIME = 1000;
const handleOkClick = _.debounce(campaignSubmit,TIME);

// 获取campaign详情
const getCampaignDetail = async (campaignId: number) => {
  const res = await httpGetCampaignDetail({ campaignId });
  if (res.code === 0) {
    editId.value = res.data.id;
    campaignInfo.banner = res.data.banner;
    campaignInfo.campaignName = res.data.campaignName;
    campaignInfo.startTime = res.data.startTime;
    campaignInfo.endTime = res.data.endTime;
    expireRef.value.currentValue = res.data.endTime;
    campaignInfo.ownerId = res.data.ownerId;
    campaignInfo.link = res.data.link;
    campaignInfo.content = res.data.content;
    originalBanner = res.data.banner;
  }
};

onMounted(() => {
  expireRef.value.currentValue = dayjs().add(defaultDuration,'day');
  if (route.query.campaignId) {
    getCampaignDetail(Number(route.query.campaignId));
  }
});
</script>

<style lang="scss" scoped>
.create-wrap {
  width: 1280px;
  margin: 0 auto;
}

.banner-choose {
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;

  span {
    margin: 0 0 12px 16px;
  }
}

.add-banner {
  width: 1280px;
  height: 200px;
  text-align: center;
  border: 2px dashed #000;
  border-radius: 0;

  .icon-add {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin: 50px;
    background-image: url('../../assets/icons/icon-add.png');
  }
}

.tips {
  width: 1280px;
  margin-top: 12px;
  text-align: right;
}

.campaign-info {
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;

  .info-item {
    margin-bottom: 48px;
  }

  .label {
    margin-bottom: 16px;
  }

  input {
    width: 224px;
    height: 20px;
    padding: 2px 1px;
    line-height: 20px;
    color: #4d4d4d;
    border: none;
    border-bottom: 2px solid #a32015;
  }

  input:focus {
    outline: none;
  }

  .name {
    input {
      width: 224px;
    }

    input:focus {
      outline: none;
    }
  }

  .expiration-date {
    width: 160px;
    border-bottom: 2px solid #a32015;
  }

  .briefly {
    input {
      width: 1080px;
    }
  }

  .user-link {
    input {
      width: 368px;
    }
  }
}

.form-item {
  margin-bottom: 48px;
}

.operate {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 56px;
  margin: 87px auto 83px;

  .operate-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 188px;
    height: 56px;
    margin-right: 15px;
    font-family: Roboto;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    border: 1.6px solid #a32015;
    border-radius: 32px;

    em {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-left: 12px;
    }
  }

  .back {
    color: #a32015;
    background-color: #fff;

    em {
      background-image: url('../../assets/icons/icon-back.png');
      background-size: contain;
    }
  }

  .ok {
    color: #fcf5c5;
    background: #a32015;

    em {
      background-image: url('../../assets/icons/icon-ok.png');
      background-size: contain;
    }
  }
}

.choose-nft-modal {
  position: relative;
  box-sizing: border-box;
  width: 1100px;
  height: 100%;
  padding-top: 1px;
  background-color: #fff;

  & > .close {
    display: flex;
    flex-direction: row-reverse;

    img {
      width: 18px;
      height: 18px;
      margin-top: 34px;
      margin-right: 50px;
      cursor: pointer;
    }
  }

  & > .title {
    display: flex;
    align-items: center;
    margin-left: 55px;
    font-family: 'Quiet Sans', sans-serif;
    font-size: 32px;
    font-weight: 800;

    & > img {
      width: 32px;
      height: auto;
      margin-right: 16px;
    }
  }

  & > .radio-area {
    padding: 0 75px;
    margin-top: 48px;
  }

  & > .main-area {
    display: grid;
    grid-template-columns: repeat(4, 1fr) auto;
    row-gap: 16px;
    height: 300px;
    padding: 0 75px;
    overflow-y: scroll;
  }

  & > .btn-area {
    position: absolute;
    right: 64px;
    bottom: 0;
    margin-top: 129px;
    transform: translateY(50%);

    .item {
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 188px;
      height: 56px;
      font-size: 20px;
      font-weight: 700;
      color: $vice-color;
      cursor: pointer;
      background-color: $main-color;
      border-radius: 32px;

      & > img {
        width: 24px;
        height: 24px;
        margin-left: 8px;
      }

      & > .tip {
        position: absolute;
        top: 0;
        left: 16px;
        font-size: 16px;
        font-weight: 500;
        color: #1f263b;
        transform: translateY(-150%);
      }
    }
  }
}
</style>
