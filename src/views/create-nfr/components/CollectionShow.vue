<template>
  <div class="collection-show">
    <!-- 可编辑 -->
    <template v-if="props.editable">
      <div
        class="area"
        :class="{ image: props.data?.avatar }"
        @click="emit('select')"
      >
        <!-- 不存在选中图片时 -->
        <template v-if="!props.data?.avatar">
          <img
            :src="SvgCross"
            alt=""
            class="cross"
          />
          <div class="tip">
            {{ t('nft-action-tips[0]') }}
          </div>
        </template>
        <!-- 存在选中图片时 -->
        <template v-else>
          <img
            ref="imgRef"
            :src="props.data?.avatar"
            alt=""
            @error="onError"
          />
        </template>
      </div>
      <div class="title">
        {{ t('nft-action-tips[1]') }}
      </div>
    </template>
    <template v-else>
      <div class="image">
        <img
          ref="imgRef"
          :src="props.data?.avatar"
          alt=""
          @error="onError"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import SvgCross from '@/assets/svg/cross.svg';
import { INFTsType } from '@/types/nft';
import { useI18n } from 'vue-i18n';
import ImageAlt from '@/assets/images/image-alt.png';
import { ref } from 'vue';

const { t } = useI18n();

const props = defineProps<{ editable?: boolean; data?: INFTsType }>();

const emit = defineEmits<{ (event: 'select'): void }>();

const imgRef = ref();
const onError = function () {
  if (!imgRef.value) return;
  imgRef.value.src = ImageAlt;
};
</script>

<style scoped lang="scss">
.collection-show {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 480px;
  height: 480px;
  border: 2px dashed #000;
  border-radius: 10px;

  .area {
    cursor: pointer;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    .cross {
      width: 98px;
      height: 98px;
    }

    .tip {
      margin-top: 43px;
      font-size: 18px;
      color: #1f263b;
      letter-spacing: 0.02em;
    }
  }

  .image {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 16px;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 16px;
    font-weight: 500;
    color: $main-font-color;
    transform: translateY(-130%);
  }
}
</style>
