<script setup lang="ts">
import FormItemPrice from '@/components/BaseForm/FormItemPrice.vue';
import FormItemDetails from '@/components/BaseForm/FormItemDetails.vue';
import FormItem from '@/components/BaseForm/FormItem.vue';
import BaseInput from '@/components/BaseInput/index.vue';
import BaseSelect from '@/components/BaseSelect/index.vue';
import BaseDatepicker from '@/components/BaseDatepicker/index.vue';
import BaseTextarea from '@/components/BaseTextarea/index.vue';
import SvgAddList from '@/assets/svg/add-list.svg';
import ImageGold from '@/assets/icons/gold.png';
import SvgBack from '@/assets/svg/back.svg';
import ImageBallot from '@/assets/images/ballot.png';
import BaseOverlay from '@/components/BaseOverlay/index.vue';
import IconClose from '@/assets/icons/close.png';
import { useI18n } from 'vue-i18n';
import { reactive, ref } from 'vue';
import { INFRTypeForRequest, INFTsType } from '@/types/nft';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';

const { t } = useI18n();
const props = defineProps<{ visible: boolean; data: INFTsType }>();
const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'request', data: INFRTypeForRequest): void;
}>();
const expireRef = ref();
const valueObj = reactive<{
  type: string;
  details: string;
  price: string;
  quantity: string;
  desc: string;
}>({
  type: '',
  details: '',
  desc: '',
  quantity: '',
  price: '',
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

/** 数据验证 */
const validateData = () => {
  const quantityCof = 10;
  if (!valueObj.quantity) {
    message.error(t('warn-msg.quantity'));
    return false;
  }
  if (Number(valueObj.quantity) > quantityCof) {
    message.error(t('warn-msg.high-quantity'));
    return false;
  }
  if (!valueObj.type) {
    message.error(t('warn-msg.type'));
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

/** request nfr */
const handleRequest = () => {
  const current = dayjs();
  const expire = dayjs(expireRef.value.currentValue).endOf('d');

  if (!validateData()) return;
  const obj = {
    type: Number(getKey(valueObj.type)),
    quantity: valueObj.quantity || 0,
    price: valueObj.price || 0,
    druation: Math.ceil(expire.diff(current, 'd', true)),
    nftId: props.data.id,
    nftContractAddress: props.data.contractAddress,
    desc: valueObj.desc,
  } as INFRTypeForRequest;
  emit('request', obj);
};

/** 关闭遮罩 */
const handleClose = () => {
  emit('close');
};
</script>

<template>
  <base-overlay
    :visible="props.visible"
    :top="156"
    @close="handleClose"
  >
    <div class="request-nfr-modal">
      <div class="layer one">
        <div class="title">
          <img
            :src="ImageBallot"
            alt=""
          />
          {{ t('request-nfr') }}
        </div>
        <div class="close">
          <img
            :src="IconClose"
            alt=""
            @click="handleClose"
          />
        </div>
      </div>

      <!-- 内容 -->
      <div class="layer content">
        <div class="left">
          <div class="form-layer one">
            <!-- Expiration date -->
            <form-item :title="t('create-nfr-form-items[1]')">
              <base-datepicker ref="expireRef"></base-datepicker>
            </form-item>
            <!-- Quantity -->
            <form-item :title="t('create-nfr-form-items[2]')">
              <base-input
                v-model="valueObj.quantity"
                :placeholder="t('placeholder.quantity')"
                type="number"
                style-type="line"
              ></base-input>
            </form-item>
          </div>

          <div class="form-layer">
            <!-- Type -->
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
          <div class="form-layer">
            <!-- Describe the NFR Briefly -->
            <form-item
              :title="t('create-nfr-form-items[3]')"
              :width="592"
            >
              <base-textarea
                v-model="valueObj.desc"
                :max="80"
              ></base-textarea>
            </form-item>
          </div>
          <div class="form-layer">
            <form-item-details :title="t('create-nfr-form-items[4]')">
              <base-input
                v-model="valueObj.details"
                :placeholder="t('placeholder.optional')"
              ></base-input>
            </form-item-details>
          </div>
          <div class="form-layer">
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
          <div class="name">
            <img
              :src="ImageGold"
              alt=""
            />
            <span> {{ props.data.name }}</span>
          </div>
          <div class="image">
            <img
              :src="props.data.avatar"
              alt=""
            />
          </div>
        </div>
      </div>
      <!-- 按钮组 -->
      <div class="btn-group">
        <div
          class="item vice"
          @click="handleClose"
        >
          {{ t('back') }}
          <img
            :src="SvgBack"
            alt=""
          />
        </div>
        <div
          class="item"
          @click="handleRequest"
        >
          {{ t('request') }}
          <img
            :src="SvgAddList"
            alt=""
          />
        </div>
      </div>
    </div>
  </base-overlay>
</template>

<style scoped lang="scss">
.request-nfr-modal {
  position: relative;
  width: 1280px;
  height: 688px;
  padding-top: 1px;
  background-color: #fff;
  border-radius: 32px;
  box-shadow: 2px 2px 20px 10px rgb(163 32 21 / 8%);

  & > .layer {
    display: flex;
    padding-left: 78px;

    &.one {
      align-items: center;
      justify-content: space-between;
      margin-top: 54px;

      & > .title {
        display: flex;
        align-items: center;
        font-family: 'Quiet Sans', sans-serif;
        font-size: 32px;
        font-weight: 800;

        & > img {
          width: 32px;
          height: auto;
          margin-right: 16px;
        }
      }

      & > .close {
        display: flex;

        img {
          width: 18px;
          height: 18px;
          margin-right: 44px;
          cursor: pointer;
        }
      }
    }

    &.content {
      justify-content: space-between;
      padding-right: 90px;

      .left {
        .form-layer {
          display: flex;
          margin-top: 38px;

          &.one {
            display: grid;
            grid-template-columns: 160px 160px;
            column-gap: 54px;
          }
        }
      }

      .right {
        width: 416px;

        .name {
          display: flex;
          align-items: center;
          font-family: 'Quiet Sans', sans-serif;
          font-size: 32px;
          font-weight: 800;

          & > img {
            width: 32px;
            height: auto;
            margin-right: 16px;
          }

          & > span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .image {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 416px;
          height: 416px;
          margin-top: 31px;
          overflow: hidden;
          border: 2px solid $main-color;
          border-radius: 10px;

          img {
            max-width: calc(100% + 4px);
            max-height: calc(100% + 4px);
          }
        }
      }
    }
  }

  & > .btn-group {
    position: absolute;
    right: 64px;
    bottom: 0;
    display: flex;
    margin-top: 129px;
    transform: translateY(50%);

    .item {
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

      &.vice {
        margin-right: 15px;
        color: $main-color;
        background-color: #fff;
        border: 2px solid $main-color;
        border-radius: 32px;
        box-shadow: 0 4px 6px rgb(163 32 21 / 12%);
      }

      & > img {
        width: 24px;
        height: 24px;
        margin-left: 8px;
      }
    }
  }
}
</style>
