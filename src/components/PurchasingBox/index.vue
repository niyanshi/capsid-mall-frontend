<template>
  <base-overlay
    :visible="props.visible"
    @close="handleClose"
  >
    <div class="purchasing-box">
      <div class="close">
        <img
          :src="IconClose"
          alt=""
          @click="handleClose"
        />
      </div>
      <div class="purchasing-box-main-area">
        <div class="title">
          {{ props.title }}
        </div>
        <base-page-loading
          :loading="isLoadingRef"
          top="100"
        >
          <div class="image-text">
            <div class="image"><BaseNFRImage :src="infoObj.image" /></div>
            <div class="text">
              <div
                class="name"
                :title="infoObj.name"
              >
                {{ infoObj.name }}
              </div>
              <div class="nfr-item">
                <div class="key">Chain:</div>
                <div class="val">{{ infoObj.chain }}</div>
              </div>
              <div class="nfr-item">
                <div class="key">Item price:</div>
                <div class="val">{{ infoObj.itemPrice }}&nbsp; ETH</div>
              </div>
              <div class="nfr-item">
                <div class="key">Quantity:</div>
                <div class="val">
                  <input
                    v-model="amountRef"
                    type="number"
                    :placeholder="`Integer less than ${controllerStore.limitForBuy}`"
                  />
                </div>
              </div>
              <div class="nfr-item">
                <div class="key">Total price:</div>
                <div class="val red">{{ calcTotalPrice }}&nbsp; ETH</div>
              </div>

              <div class="tip">
                {{ props.tips }}
              </div>
            </div>
          </div>
        </base-page-loading>
      </div>
      <!-- <div class="content">
        <div class="label">{{ t('create-nfr-form-items[2]') }}</div>
        <div class="input">
          <base-input
            v-model="amountRef"
            :placeholder="`Integer less than ${controllerStore.limitForBuy}`"
            type="number"
            style-type="line"
          ></base-input>
        </div>
      </div> -->
      <div
        class="btn"
        @click="handleBuy"
      >
        {{ t('buy') }}
        <!-- <img
          :src="SvgDone"
          alt=""
        /> -->
      </div>
    </div>
  </base-overlay>
</template>

<script setup lang="ts">
import BaseOverlay from '../BaseOverlay/index.vue';
import IconClose from '@/assets/icons/close.png';
import BaseNFRImage from '@/components/BaseNFRImage/index.vue';
import BasePageLoading from '@/components/BasePageLoading/index.vue';
import { useI18n } from 'vue-i18n';
import { computed, onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useControllerStore } from '@/stores/controller';
import { httpGetNFRsDetails } from '@/api/nfr';
import Decimal from 'decimal.js';

const { t } = useI18n();
const controllerStore = useControllerStore();

const props = defineProps<{ visible: boolean; title?: string; tips?: string }>();
const emit = defineEmits<{ (event: 'close'): void; (event: 'buy', data: string): void }>();

const amountRef = ref('');
const isLoadingRef = ref<boolean>(true);
const infoObj = reactive({
  name: '',
  image: '',
  itemPrice: '',
  chain: '',
});
const calcTotalPrice = computed(() => {
  if (!amountRef.value) return 0;
  return new Decimal(infoObj.itemPrice).times(amountRef.value || 0).toFixed();
});

/** 关闭遮罩 */
const handleClose = () => {
  emit('close');
};

/** 触发购买 */
const handleBuy = () => {
  if (!Number(amountRef.value) || String(amountRef.value).includes('.')) {
    message.error(t('warn-msg.quantity'));
    return;
  }
  if (Number(amountRef.value) > controllerStore.limitForBuy) {
    message.error(`Quantity should be less than ${controllerStore.limitForBuy}`);
    return;
  }

  controllerStore.setCurrentInteractNFR({
    id: '',
    image: infoObj.image,
    itemPrice: infoObj.itemPrice,
    chain: infoObj.chain,
    name: infoObj.name,
    quantity: amountRef.value,
  });
  emit('buy', amountRef.value);
};

onMounted(() => {
  const init = async () => {
    const { id } = controllerStore.orderObjForBuy;
    const res = await httpGetNFRsDetails(id);
    if (res.code !== 0) return;
    infoObj.image = res.data.image;
    infoObj.itemPrice = res.data.unitPrice;
    infoObj.chain = res.data.chain;
    infoObj.name = JSON.parse(res.data.nftMeta).name;
    isLoadingRef.value = false;
  };
  init();
});
</script>

<style lang="scss">
@import './index.scss';
</style>
