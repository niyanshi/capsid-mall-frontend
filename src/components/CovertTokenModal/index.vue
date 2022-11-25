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
      <div class="title">
        <img
          :src="ImageBallot"
          alt=""
        />
        Swap Tokens
      </div>
      <div class="ctm-content">
        <div class="text">Swap</div>
        <div class="form-elem">
          <base-input
            v-model="swapValueRef"
            :placeholder="`Integer less than ${ethRef}`"
            type="number"
            style-type="border"
          ></base-input>
          <div class="unit">ETH</div>
        </div>
        <div
          class="balance"
          :class="{ error: Number(swapValueRef) > Number(ethRef) }"
        >
          Balance: {{ ethRef }}
        </div>
        <div :style="{ height: '30px' }"></div>
        <div class="text">For</div>
        <div class="form-elem">
          <base-input
            v-model="swapValueRef"
            :placeholder="`Integer less than ${ethRef}`"
            type="number"
            style-type="border"
          ></base-input>
          <div class="unit">WETH</div>
        </div>
        <div class="balance">Balance: {{ wethRef }}</div>
      </div>

      <div
        class="btn"
        :class="{ disabled: !calcCanClick }"
        @click="handleSwap"
      >
        SWAP
        <img
          :src="SvgDone"
          alt=""
        />
      </div>
    </div>
  </base-overlay>
</template>

<script setup lang="ts">
import ImageBallot from '@/assets/images/ballot.png';
import SvgDone from '@/assets/svg/done.svg';
import BaseOverlay from '../BaseOverlay/index.vue';
import IconClose from '@/assets/icons/close.png';
import BaseInput from '@/components/BaseInput/index.vue';
import { computed, onMounted, ref } from 'vue';
import useSeaport from '@/hooks/useSeaport';
import { useUserInfoStore } from '@/stores/user-info';
const { getWethBalance, getEthBalance } = useSeaport();
const userInfoStore = useUserInfoStore();

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ (event: 'close'): void; (event: 'swap', data: string): void }>();

const wethRef = ref('0');
const ethRef = ref('0');
const swapValueRef = ref('0');

/** 是否可以点击 */
const calcCanClick = computed(() => {
  if (!swapValueRef.value) return false;
  if (Number(swapValueRef.value) > Number(ethRef.value)) return false;
  return !(Number(swapValueRef.value) === 0);
});

/** 关闭遮罩 */
const handleClose = () => {
  emit('close');
};

/** Swap */
const handleSwap = () => {
  if (!calcCanClick.value) return;
  emit('swap', swapValueRef.value);
};
/** 获取eth余额 */
const digitCof = 7;
const getETH = async () => {
  const balance = await getEthBalance(userInfoStore.currentUser.publicKey);
  ethRef.value = Number(balance).toFixed(digitCof).slice(0, -1);
};

/** 获取weth余额 */
const getWETH = async () => {
  const balance = await getWethBalance(userInfoStore.currentUser.publicKey);
  wethRef.value = Number(balance).toFixed(digitCof).slice(0, -1);
};

onMounted(() => {
  getWETH();
  getETH();
});
</script>

<style lang="scss">
@import './index.scss';
</style>
