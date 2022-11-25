<template>
  <div class="table-wrap">
    <table>
      <thead>
        <th v-if="showIndex" style="width: 70px">序号</th>
        <th v-for="(item, index) in columns" :key="index">
          <div class="td" :style="`width: ${item.width}px;`">
            <span v-if="!item.render">{{ item.label }}</span>
            <BaseTableCell v-else :render="item.render"></BaseTableCell>
          </div>
        </th>
      </thead>
      <tbody>
        <tr v-for="(tr, index) in data" :key="index">
          <!-- 是否显示序号 -->
          <td v-if="showIndex" style="width: 70; text-align: center">{{ index + 1 }}</td>
          <td v-for="(td, key) in columns" :key="key">
            <div class="td" :style="`width: ${td.width}px;`">
              <span v-if="!td.cellRender">
                {{ tr[td.prop] }}
              </span>
              <BaseTableCell v-else-if="td.type !== 'image'" :render="td.cellRender" :val="{value: tr[td.prop]}"></BaseTableCell>
              <BaseTableCell v-else :render="td.cellRender" :val="tr"></BaseTableCell>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!(data as []).length" class="no-message">{{ emptyText }}</div>
  </div>
</template>

<script setup lang="ts">
import BaseTableCell from './BaseTableCell';
type columnType = {
  label: string;
  prop: string;
  width?: number | string;
  height?: number | string;
  type?: string;
  render?: () => void;
  cellRender?: (val: {value: string}) => void;
};
const showIndex = false;
defineProps<{
  columns: Array<columnType>;
  emptyText?: string;
  data: unknown;
}>();
</script>

<style lang="scss" scoped>
.table-wrap {
  width: 100%;
  height: 100%;
  overflow: auto;
  font-family: 'Roboto';
  font-style: normal;
  color: #4d4d4d;
  display: flex;
  flex-direction: column;

  table {
    border-spacing: 0;
    font-size: 16px;
    font-weight: 500;
    // height: 19px;
    line-height: 20px;
    table-layout: fixed;
    border-collapse: collapse;
  }

  thead,
  tbody {
    width: 100%;
  }

  th {
    box-sizing: border-box;
    color: #000;
    text-align: left;
  }

  tbody {
    tr {
      border-bottom: 2px solid #e1e1e1;
      box-sizing: border-box;
    }

    .td {
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 5px 0;
      // word-wrap: break-word;
    }
  }
}

/*滚动条样式*/
// .table-wrap::-webkit-scrollbar {
//   /*滚动条整体样式*/
//   width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
//   height: 4px;
// }
// .table-wrap::-webkit-scrollbar-thumb {
//   /*滚动条里面小方块*/
//   border-radius: 5px;
//   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//   -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//   background: rgba(0, 0, 0, 0.2);
// }
// .table-wrap::-webkit-scrollbar-track {
//   /*滚动条里面轨道*/
//   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//   -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//   border-radius: 0;
//   background: rgba(0, 0, 0, 0.1);
// }
.no-message {
  width: 100%;
  height: 400px;
  // flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
