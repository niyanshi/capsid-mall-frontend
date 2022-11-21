<template>
  <div class="layouts">
    <header>
      <header-area></header-area>
    </header>
    <div style="height: 96px;"></div>
    <aside>
      <side-bar></side-bar>
    </aside>
    <main>
      <slot></slot>
    </main>
    <footer>
      <footer-area></footer-area>
    </footer>
  </div>
</template>

<script setup lang="ts">
import HeaderArea from './HeaderArea/index.vue';
import SideBar from './SideBar/index.vue';
import FooterArea from './FooterArea/index.vue';
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
