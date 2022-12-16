<template>
  <BaseDialog
    :visible="visible"
    width="640"
    height="240"
    :mask-disable="true"
    @close="handleCloseClick"
  >
    <div
      class="tip-content"
    >
      <i
        :class="[
          type === 'success' ? 'icon-success' : 'icon-error',
          'icon'
        ]"
      ></i>
      <div class="info-text">
        <div class="info-title">{{ title }}</div>
        <div class="message">
          <!-- <p>{{ t('viewInMy') }}<a>{{ t('profile') }}</a></p> -->
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
    <template #button>
      <div
        class="dialog-button"
        @click="handleOkClick"
      >
        <span>{{ t('ok') }}</span>
        <i class="icon-ok"></i>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog/index.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps<{
  title: string,
  message: string,
  type: 'success' | 'error'
}>();
const emit = defineEmits(['close', 'ok']);
const visible = ref(false);
const handleOkClick = () => {
  emit('ok');
};
const handleCloseClick = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
