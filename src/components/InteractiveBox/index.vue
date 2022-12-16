<template>
  <base-overlay :visible="props.visible">
    <div class="interactive-box">
      <div class="interactive-box-main-area">
        <div class="title">
          {{ controllerStore.currentInteractNFR.title }}
        </div>
        <div class="image-text">
          <div class="image">
            <BaseNFRImage
              :src="controllerStore.currentInteractNFR.image!"
              :nft="controllerStore.currentInteractNFR.nft"
            />
          </div>
          <div class="text">
            <div
              class="name"
              :title="infoObj.name"
            >
              {{ controllerStore.currentInteractNFR.name }}
            </div>
            <div class="nfr-item">
              <div class="key">Chain:</div>
              <div class="val">{{ controllerStore.currentInteractNFR.chain }}</div>
            </div>
            <div class="nfr-item">
              <div class="key">Item price:</div>
              <div class="val">{{ controllerStore.currentInteractNFR.itemPrice }} &nbsp; ETH</div>
            </div>
            <div class="nfr-item">
              <div class="key">Quantity:</div>
              <div class="val">
                {{ controllerStore.currentInteractNFR.quantity }}
              </div>
            </div>
            <div class="nfr-item">
              <div class="key">Total price:</div>
              <div class="val red">{{ calcTotalPrice }}&nbsp; ETH</div>
            </div>

            <div class="tip">
              {{ controllerStore.currentInteractNFR.tip }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </base-overlay>
</template>

<script setup lang="ts">
import BaseOverlay from '../BaseOverlay/index.vue';
import BaseNFRImage from '@/components/BaseNFRImage/index.vue';
import { computed, reactive } from 'vue';
import { useControllerStore } from '@/stores/controller';
import Decimal from 'decimal.js';

const controllerStore = useControllerStore();

const props = defineProps<{ visible: boolean; nft?: boolean }>();

const infoObj = reactive({
  name: '',
  image: '',
  itemPrice: '',
  chain: '',
});
const calcTotalPrice = computed(() => {
  const { itemPrice, quantity } = controllerStore.currentInteractNFR;
  if (!itemPrice || !quantity) return 0;
  return new Decimal(itemPrice).times(quantity || 0).toFixed();
});
</script>
<style lang="scss" scoped>
.interactive-box {
  position: relative;
  box-sizing: border-box;
  width: 640px;
  height: 341px;
  background-color: #fff;
  border-radius: 32px;
  box-shadow: 2px 2px 20px 10px rgb(163 32 21 / 8%);

  & > .interactive-box-main-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px;

    .title {
      margin-top: 24px;
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: 36px;
      color: #1f263b;
      text-transform: uppercase;
    }

    .image-text {
      display: flex;
      width: 100%;
      margin-top: 24px;

      & > .image {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 212px;
        height: 212px;
        overflow: hidden;
        background-color: #d9d9d9;
        border-radius: 16px;
      }

      & > .text {
        width: 364px;
        margin-left: 16px;

        .name {
          margin-bottom: 8px;
          overflow: hidden;
          font-size: 22px;
          font-style: normal;
          font-weight: 600;
          line-height: 36px;
          color: #1f263b;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .nfr-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;

          .key {
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: 30px;
            color: rgb(31 38 59 / 60%);
          }

          .val {
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            line-height: 30px;
            color: #1f263b;

            &.red {
              color: $main-color;
            }
          }
        }

        .tip {
          margin-top: 8px;
          font-size: 14px;
          font-style: 500;
          font-weight: 400;
          line-height: 20px;
          color: #797d89;
        }
      }
    }
  }
}
</style>
