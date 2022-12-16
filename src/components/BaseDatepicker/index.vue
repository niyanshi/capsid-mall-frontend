<template>
  <Datepicker
    ref="dpRef"
    v-model="dateRef"
    :enable-time-picker="false"
    :disabled-dates="disabledDates"
  >
    <template #action-select>
      <div
        class="select"
        @click="handleSelect"
      >
        Select
      </div>
    </template>
    <template #trigger>
      <div
        class="base-datepicker"
        :style="{ width: `${props.width}px` }"
      >
        <img
          :src="SvgCalendar"
          alt=""
        />
        <div>
          {{ dayjs(dateRef).format('YYYY/MM/DD') }}
        </div>
      </div>
    </template>
  </Datepicker>
</template>

<script setup lang="ts">
import SvgCalendar from '@/assets/svg/calendar.svg';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
import './var.scss';
import { ref } from 'vue';
import dayjs from 'dayjs';

const props = defineProps<{ width?: number }>();

const dateRef = ref(new Date());
const dpRef = ref();

const handleSelect = () => {
  dpRef.value.selectDate();
};

const disabledDates = (date: Date) => dayjs(date).valueOf() < dayjs().startOf('d').valueOf();

defineExpose({
  currentValue: dateRef,
});
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
