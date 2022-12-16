<template>
  <div class="loading-wrap">
    <div class="loading-pic loading"></div>
    <div class="loading-text w128 mb8 loading"></div>
    <div class="loading-text w79 loading"></div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.loading-wrap {
  width: 176px;
  height: 216px;
  margin: 30px 21px 0 11px;
  .loading-pic {
    width: 176px;
    height: 176px;
    border-radius: 10px;
    margin-bottom: 16px;
  }
  .loading-text {
    height: 16px;
    border-radius: 12px;
  }
  .w128 {
    width: 128px;
  }
  .w79 {
    width: 79px;
  }
  .mb8 {
    margin-bottom: 8px;
  }
}
.loading {
  border-radius: inherit;
  background: linear-gradient(to right,rgba(229,232,235,0.5) 8%,#E5E8EB 36%,rgba(229,232,235,0.5) 66%);
  -webkit-animation-duration: 2.5s;
  animation-duration: 2.5s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-name: shimmer;
  animation-name: shimmer;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  background-size: 1200px;
}
@keyframes shimmer {
  0% {
    background-position: -1200px 0;
  }

  100% {
    background-position: 1200px 0;
  }
}
</style>
