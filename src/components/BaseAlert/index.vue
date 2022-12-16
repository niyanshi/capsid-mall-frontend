<template>
  <base-overlay :visible="props.visible" @close="handleClose">
    <div class="base-alert">
      <div class="close">
        <img :src="IconClose" alt="" @click="handleClose" />
      </div>
      <div :class="{ layer: !props.layerClassName, [props.layerClassName || '']: props.layerClassName }">
        <img :src="props.icon" alt="" class="icon" />
        <div class="section">
          <div class="title">
            {{ props.title }}
          </div>
          <div class="desc">
            <slot name="desc">
              {{ props.desc }}
            </slot>
          </div>
        </div>
      </div>
      <div class="btn" @click="handleClose">
        {{ t('ok') }}
        <img :src="SvgDone" alt="" />
      </div>
    </div>
  </base-overlay>
</template>

<script setup lang="ts">
import SvgDone from '@/assets/svg/done.svg';
import BaseOverlay from '../BaseOverlay/index.vue';
import IconClose from '@/assets/icons/close.png';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{ visible: boolean; title?: string; desc?: string; icon?: string; layerClassName?: string }>();
const emit = defineEmits<{ (event: 'close'): void }>();

/** 关闭遮罩 */
const handleClose = () => {
  emit('close');
};
</script>

<style lang="scss">
@import './index.scss';
</style>
