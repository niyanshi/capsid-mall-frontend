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
      <div class="content">
        <div class="label">{{ t('create-nfr-form-items[2]') }}</div>
        <div class="input">
          <base-input
            v-model="amountRef"
            :placeholder="`Integer less than ${controllerStore.limitForBuy}`"
            type="number"
            style-type="line"
          ></base-input>
        </div>
      </div>

      <div
        class="btn"
        @click="handleBuy"
      >
        {{ t('buy') }}
        <img
          :src="SvgDone"
          alt=""
        />
      </div>
    </div>
  </base-overlay>
</template>

<script setup lang="ts">
import SvgDone from '@/assets/svg/done.svg';
import BaseOverlay from '../BaseOverlay/index.vue';
import IconClose from '@/assets/icons/close.png';
import BaseInput from '@/components/BaseInput/index.vue';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { useControllerStore } from '@/stores/controller';

const { t } = useI18n();
const controllerStore = useControllerStore();

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ (event: 'close'): void; (event: 'buy', data: string): void }>();

const amountRef = ref('');

/** 关闭遮罩 */
const handleClose = () => {
  emit('close');
};

/** 触发购买 */
const handleBuy = () => {
  if (!Number(amountRef.value) || amountRef.value.includes('.')) {
    message.error(t('warn-msg.quantity'));
    return;
  }
  if (Number(amountRef.value) > controllerStore.limitForBuy) {
    message.error(`Quantity should be less than ${controllerStore.limitForBuy}`);
    return;
  }
  emit('buy', amountRef.value);
};
</script>

<style lang="scss">
@import './index.scss';
</style>
