<template>
  <div class="page">
    <!-- <span class="page-block page-text" style="width: 70px"> -->
    <!-- <BaseDropDown
      v-if="pageSize.length > 1"
      style="display: inline-block"
      :list="pageCountList"
      :height="27"
      :width="80"
      :defaultIndex="0"
      @select="handleDropdownSelect"
    ></BaseDropDown> -->
    <!-- </span> -->
    <span class="page-block page-text" @click="handlePreClick">{{ '<' }}</span>
        <span v-show="currentPage - 1 > 2" class="page-block ellipsis">...</span>
        <span
          v-for="pageNum in pageList" :key="pageNum"
          :class="['page-block', 'page-text', currentPage === pageNum && 'current']"
          @click="handlePageClick(pageNum)">{{ pageNum }}</span>
        <span v-show="pageAmount - currentPage > 2" class="page-block ellipsis">...</span>
        <span class="page-block page-text" @click="handleNextClick">{{ '>' }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
// import BaseDropDown from '@/components/BaseDropDown/index.vue';

/**
 * @props {number} total - 总条数
 * @props {number} pagerCount - 页码按钮的数量
 * @props {Array<number>} pageSize - 每页显示的条数
 */
interface Prop {
  total: number | string,
  pagerCount: number | string,
  pageSize: Array<number>,
}
const props = defineProps<Prop>();
// const pageCountList: {
//   label: string;
//   value: number;
// }[] = props.pageSize.map((item: number) => ({ label: `${item}条/页`, value: item }));
// 分页器显示的页码按钮数量
const maxSize = ref<number>(Number(props.pagerCount));
// 每页显示的条数
const eachPageAmount = ref<number>(props.pageSize[0]);
// 总页数
const pageAmount = computed(() => Math.ceil(Number(props.total) / eachPageAmount.value));
const currentPage = ref<number>(1);
const base = 2;
// currentPage前、后应该显示的按钮数，如果maxSize是偶数则preCount比nextCount少1
const preCount = maxSize.value % base === 0 ? maxSize.value / base - 1 : (maxSize.value - 1) / base;
const nextCount = maxSize.value % base === 0 ? maxSize.value / base : (maxSize.value - 1) / base;
// currentPage后应该显示的按钮数
const pageList = computed(() => {
  const list = [];
  if (pageAmount.value < maxSize.value) {
    // 即使没有数据也渲染1个按钮
    if (pageAmount.value === 0) return [1];
    // 如果当前总页数少于最大按钮数,页码从1开始全部渲染
    for (let i = 1; i <= pageAmount.value; i++) {
      list.push(i);
    }
    return list;
  }
  if (currentPage.value <= preCount) {
    // 当前页数小于preCount，则从1开始显示
    for (let i = 1; i <= maxSize.value; i++) {
      list.push(i);
    }
  } else if (currentPage.value >= pageAmount.value - nextCount) {
    // 当前页数到最后的页数小于nextCount，则之后的页数全部显示
    for (let i = pageAmount.value - maxSize.value + 1; i <= pageAmount.value; i++) {
      list.push(i);
    }
  } else {
    // 类似 ... x,x,x...的情况
    for (let i = currentPage.value - preCount; i <= currentPage.value + nextCount; i++) {
      list.push(i);
    }
  }

  return list;
});

const emit = defineEmits(['changePage', 'changePageSize']);
// 点击页码
const handlePageClick: (page: number) => void = (page: number) => {
  currentPage.value = page;
  emit('changePage', currentPage.value);
};
// 点击<
const handlePreClick: () => void = () => {
  if (currentPage.value - maxSize.value > 0) {
    currentPage.value -= maxSize.value;
  } else if (currentPage.value - 1 > 0) {
    currentPage.value -= 1;
  }
  emit('changePage', currentPage.value);
};
// 点击>
const handleNextClick: () => void = () => {
  if (currentPage.value + maxSize.value < pageAmount.value) {
    currentPage.value += maxSize.value;
  } else if (currentPage.value + 1 < pageAmount.value) {
    currentPage.value += 1;
  }
  emit('changePage', currentPage.value);
};
// 切换每页显示条数
// const handleDropdownSelect = (item: { label: string; value: number }) => {
//   emit('changePageSize', item.value);
// };
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
