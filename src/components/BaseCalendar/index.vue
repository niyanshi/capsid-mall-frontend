<template>
  <div class="calendar-wrap">
    <div class="date" @click="handlePanelShow">
      <span>{{ activeDay }}</span>
      <em class="icon-calendar"></em>
    </div>
    <div v-show="isCalendarShow" class="calendar-panel" @mouseleave="handlePanelHide">
      <div class="panel-title">{{ prop.title }}</div>
      <div class="panel-content">
        <div class="month">
          <img src="@/assets/icons/icon-left-arrow.png" alt="" @click="changeMonth('prev')" />
          <span>{{ dateText }}</span>
          <img src="@/assets/icons/icon-right-arrow.png" alt="" @click="changeMonth('next')" />
        </div>
        <div class="week">
          <span v-for="(item, index) in (prop.lang === 'zh' ? weekMapZh : weekMapEn)" :key="index">{{ item }}</span>
        </div>
        <div class="day">
          <div
v-for="(item, index) in calendarTable" :key="index" class="calendar-item" :class="[
          { light: !item.isCurrentMonth }, { active: isActive(item) }]" @click="handleDateClick(item)">{{ item.day }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { weekMapZh, weekMapEn, generateCalendar, CalendarItem, monthMapZh, monthMapEn } from './calendar';
import { ref, computed } from 'vue';
interface PropType {
  title: string
  lang?: 'zh' | 'en'
}
const prop = withDefaults(defineProps<PropType>(), {
  lang: 'en'
});

const isCalendarShow = ref(false);
const date = ref<Date>(new Date());
const selectDate = ref<Date>(date.value);
const activeDay = computed(() => {
  const year = selectDate.value.getFullYear();
  const month = selectDate.value.getMonth() + 1;
  const day = selectDate.value.getDate();
  return `${year}/${month > Number('9') ? month : 0 + month}/${day > Number('9') ? day : 0 + day}`;
});
const calendarTable = computed(() => generateCalendar(date.value));
const dateText = computed(() => {
  const monthMap = prop.lang === 'zh' ? monthMapZh : monthMapEn;
  return `${monthMap[date.value.getMonth()]} ${date.value.getFullYear()}`;
});
const isActive = (item: CalendarItem) => {
  const isCurrentDay = item.day === selectDate.value.getDate();
  const isCurrentMonth = item.month === selectDate.value.getMonth();
  const isCurrentYear = item.year === selectDate.value.getFullYear();
  return isCurrentDay && item.isCurrentMonth && isCurrentMonth && isCurrentYear;
};
// 切换到今天
const currentDate = () => {
  date.value = new Date();
};
// 切换月份, 上个月 or 下个月
const changeMonth = (type: 'prev' | 'next'): void => {
  let month = 0;
  let year = 1970;
  if (type === 'prev') {
    month = date.value.getMonth() === 0 ? Number('11') : date.value.getMonth() - 1;
    year = month === Number('11') ? date.value.getFullYear() - 1 : date.value.getFullYear();
  } else {
    month = date.value.getMonth() === Number('11') ? 0 : date.value.getMonth() + 1;
    year = month === 0 ? date.value.getFullYear() + 1 : date.value.getFullYear();
  }
  if (month === new Date().getMonth()) {
    currentDate();
    return;
  }
  date.value.setDate(1);
  date.value.setMonth(month);
  date.value.setFullYear(year);
  date.value = new Date(date.value);
};

const handleDateClick = (item: CalendarItem) => {
  selectDate.value = new Date(`${item.year}-${item.month+1}-${item.day}`);
};
const handlePanelShow = () => {
  isCalendarShow.value = true;
};
const handlePanelHide = () => {
  isCalendarShow.value = false;
};

</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
