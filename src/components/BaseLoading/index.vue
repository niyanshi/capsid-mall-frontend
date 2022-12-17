<template>
  <base-overlay
    :visible="props.visible"
    :z-index="999"
  >
    <div class="base-loading-frame">
      <img
        src="@/assets/svg/loading.svg"
        alt=""
        class="base-loading-image"
      />
      <div class="tip">{{ controllerStore.globalTip || t('wait-msg.loading') }}</div>
    </div>

    <!-- <div class="sk-chase">
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
    </div> -->
  </base-overlay>
</template>

<script setup lang="ts">
import BaseOverlay from '../BaseOverlay/index.vue';
import { useControllerStore } from '@/stores/controller';
import { useI18n } from 'vue-i18n';

const controllerStore = useControllerStore();
const { t } = useI18n();

const props = defineProps<{ visible: boolean }>();
</script>

<style lang="scss" scoped>
.base-loading-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.base-loading-image {
  width: 40px;
  height: 40px;
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.sk-chase {
  position: relative;
  width: 60px;
  height: 60px;
  animation: sk-chase 2.5s infinite linear both;
}

.tip {
  margin-top: 26px;
  font-size: 20px;
  color: #fff;
  letter-spacing: 0.05em;
}

.sk-chase-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: sk-chase-dot 2s infinite ease-in-out both;
}

.sk-chase-dot::before {
  display: block;
  width: 25%;
  height: 25%;
  content: '';
  background-color: #fff;
  border-radius: 100%;
  animation: sk-chase-dot-before 2s infinite ease-in-out both;
}

.sk-chase-dot:nth-child(1) {
  animation-delay: -1.1s;
}

.sk-chase-dot:nth-child(2) {
  animation-delay: -1s;
}

.sk-chase-dot:nth-child(3) {
  animation-delay: -0.9s;
}

.sk-chase-dot:nth-child(4) {
  animation-delay: -0.8s;
}

.sk-chase-dot:nth-child(5) {
  animation-delay: -0.7s;
}

.sk-chase-dot:nth-child(6) {
  animation-delay: -0.6s;
}

.sk-chase-dot:nth-child(1)::before {
  animation-delay: -1.1s;
}

.sk-chase-dot:nth-child(2)::before {
  animation-delay: -1s;
}

.sk-chase-dot:nth-child(3)::before {
  animation-delay: -0.9s;
}

.sk-chase-dot:nth-child(4)::before {
  animation-delay: -0.8s;
}

.sk-chase-dot:nth-child(5)::before {
  animation-delay: -0.7s;
}

.sk-chase-dot:nth-child(6)::before {
  animation-delay: -0.6s;
}

@keyframes sk-chase {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot {
  80%,
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot-before {
  50% {
    transform: scale(0.4);
  }

  100%,
  0% {
    transform: scale(1);
  }
}
</style>
