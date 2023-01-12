<!-- eslint-disable complexity -->
<script setup lang="ts">
import FormItemPrice from '@/components/BaseForm/FormItemPrice.vue';
import FormItemDetails from '@/components/BaseForm/FormItemDetails.vue';
import FormItem from '@/components/BaseForm/FormItem.vue';
import BaseInput from '@/components/BaseInput/index.vue';
import BaseSelect from '@/components/BaseSelect/index.vue';
import BaseAutoComplete from '@/components/BaseAutoComplete/index.vue';
import BaseTextarea from '@/components/BaseTextarea/index.vue';
import SvgAddList from '@/assets/svg/add-list.svg';
import ImageGold from '@/assets/icons/gold.png';
import SvgBack from '@/assets/svg/back.svg';
import ImageBallot from '@/assets/images/ballot.png';
import BaseOverlay from '@/components/BaseOverlay/index.vue';
import IconClose from '@/assets/icons/close.png';
import { useI18n } from 'vue-i18n';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { INFRTypeForRequest, INFTsType } from '@/types/nft';
import { useControllerStore } from '@/stores/controller';
import { useUserInfoStore } from '@/stores/user-info';
import useSeaport from '@/hooks/useSeaport';
import Decimal from 'decimal.js';
import emitter from '@/utils/event';
import { EV_RELOAD_WETH } from '@/utils/constant';

const { t } = useI18n();
const controllerStore = useControllerStore();
const userInfoStore = useUserInfoStore();
const { getWethBalance } = useSeaport();

const props = defineProps<{ visible: boolean; data: INFTsType }>();
const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'request', data: INFRTypeForRequest): void;
}>();

const valueObj = reactive<{
  type: string;
  details: string;
  price: string;
  quantity: string;
  desc: string;
  duration: string;
}>({
  type: '',
  details: '',
  desc: '',
  quantity: '',
  price: '',
  duration: '',
});
const wethBalanceRef = ref();
const addVisibleRef = ref<boolean>(false);
const priceTipRef = ref('');

const options = controllerStore.nfrType.map((item) => ({ key: item.id, value: item.name }));

const errorMsgTip = reactive({
  duration: '',
  quantity: '',
  type: '',
  desc: '',
  price: '',
});
/** 清空错误消息 */
const clearErrorMsgTip = () => {
  errorMsgTip.duration = '';
  errorMsgTip.quantity = '';
  errorMsgTip.desc = '';
  errorMsgTip.type = '';
  errorMsgTip.price = '';
};
/** 数据验证 */
const validateData = async () => {
  wethBalanceRef.value = await getWethBalance(userInfoStore.currentUser.publicKey);
  clearErrorMsgTip();
  const quantityCof = 10;
  if (!valueObj.duration) {
    errorMsgTip.duration = t('warn-msg.duration');
    return false;
  }
  if (Number(valueObj.duration) < 1 || Number(valueObj.duration) % 1 !== 0) {
    errorMsgTip.duration = 'Duration needs to enter a positive integer';
    return false;
  }
  if (!Number(valueObj.quantity) || valueObj.quantity.includes('.')) {
    errorMsgTip.quantity = t('warn-msg.quantity');
    return false;
  }
  if (Number(valueObj.quantity) > quantityCof) {
    errorMsgTip.quantity = t('warn-msg.high-quantity');
    return false;
  }
  if (!valueObj.type) {
    errorMsgTip.type = t('warn-msg.type');
    return false;
  }
  if (!valueObj.desc) {
    errorMsgTip.desc = t('warn-msg.desc');
    return false;
  }
  if (!valueObj.price) {
    errorMsgTip.price = t('warn-msg.price');
    return false;
  }
  if (Number(valueObj.price) < import.meta.env.VITE_MIN_PRICE) {
    errorMsgTip.price = `${t('warn-msg.minPrice')} ${import.meta.env.VITE_MIN_PRICE}`;
    return false;
  }
  if (
    new Decimal(wethBalanceRef.value).lessThan(new Decimal(valueObj.price).times(valueObj.quantity))
  ) {
    // eslint-disable-next-line quotes
    errorMsgTip.price = "you don't have enough WETH";
    addVisibleRef.value = true;
    return false;
  }
  return true;
};

/** request nfr */
const handleRequest = async () => {
  if (!(await validateData())) return;
  const obj = {
    type: valueObj.type,
    quantity: valueObj.quantity || 0,
    price: valueObj.price || 0,
    druation: valueObj.duration || 0,
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
/** 监听weth */
// watch(
//   () => valueObj.price,
//   (nv) => {
//     if (!valueObj.quantity || !nv) return;
//     if (new Decimal(wethBalanceRef.value).lessThan(new Decimal(nv).times(valueObj.quantity))) {
//       // eslint-disable-next-line quotes
//       errorMsgTip.price = "you don't have enough WETH";
//       addVisibleRef.value = true;
//       return;
//     }
//     errorMsgTip.price = '';
//     addVisibleRef.value = false;
//   },
// );

watch(
  () => [valueObj.price, valueObj.quantity, wethBalanceRef.value],
  (nv) => {
    const [price, quantity, weth] = nv;
    console.log(weth);
    priceTipRef.value = '';
    errorMsgTip.price = '';
    addVisibleRef.value = false;
    if (!price || !quantity) return;
    if (Number(price) === 0 || Number(quantity) === 0) return;
    console.log(new Decimal(price).times(quantity).toFixed());

    if (
      new Decimal(wethBalanceRef.value).greaterThanOrEqualTo(new Decimal(price).times(quantity))
    ) {
      // eslint-disable-next-line quotes
      const cof = 5;
      priceTipRef.value = `total amount ${new Decimal(price).times(quantity).toFixed(cof)}  WETH`;
      return;
    }
    if (new Decimal(wethBalanceRef.value).lessThan(new Decimal(price).times(quantity))) {
      // eslint-disable-next-line quotes
      errorMsgTip.price = "you don't have enough WETH";
      addVisibleRef.value = true;
    }
  },
);

onMounted(() => {
  const init = async () => {
    wethBalanceRef.value = await getWethBalance(userInfoStore.currentUser.publicKey);
  };
  init();
  emitter.on(EV_RELOAD_WETH, init);
});

onUnmounted(() => {
  emitter.off(EV_RELOAD_WETH);
});
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
            <form-item :title="t('create-nfr-form-items[1]') + ' (day)'">
              <!-- <base-input
                v-model="valueObj.duration"
                type="number"
                style-type="line"
                :error-tip="errorMsgTip.duration"
              ></base-input> -->
              <!-- <base-datepicker ref="expireRef"></base-datepicker> -->
              <BaseAutoComplete
                v-model="valueObj.duration"
                :options="[{ value: '7' }, { value: '14' }, { value: '30' }]"
                :error-tip="errorMsgTip.duration"
              ></BaseAutoComplete>
            </form-item>
            <!-- Quantity -->
            <form-item :title="t('create-nfr-form-items[2]')">
              <!-- <base-input
                v-model="valueObj.quantity"
                :placeholder="t('placeholder.quantity')"
                type="number"
                style-type="line"
                :error-tip="errorMsgTip.quantity"
              ></base-input> -->
              <BaseAutoComplete
                v-model="valueObj.quantity"
                :options="[
                  { value: '1' },
                  { value: '2' },
                  { value: '5' },
                  { value: '8' },
                  { value: '10' },
                ]"
                :error-tip="errorMsgTip.quantity"
              ></BaseAutoComplete>
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
                :error-tip="errorMsgTip.type"
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
                :error-tip="errorMsgTip.desc"
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
          <div class="form-layer suffix">
            <form-item-price
              :title="t('create-nfr-form-items[5]')"
              currency="WETH"
            >
              <base-input
                v-model="valueObj.price"
                type="number"
                style-type="border"
                :error-tip="errorMsgTip.price"
                :tip="priceTipRef"
              ></base-input>
            </form-item-price>
            <template v-if="addVisibleRef">
              <div
                class="add-weth"
                @click="controllerStore.setSwapVisible(true)"
              >
                Add WETH
              </div>
            </template>
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

          &.suffix {
            display: flex;
            align-items: flex-end;

            .add-weth {
              margin-left: 10px;
              color: $main-color;
              cursor: pointer;
              border-bottom: 2px solid $main-color;
              transition: all 0.3s ease;

              &:hover {
                color: $hover-color;
                border-bottom: 2px solid $hover-color;
              }
            }
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
