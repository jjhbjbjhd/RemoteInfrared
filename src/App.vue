<template>
  <WorkBench />
</template>

<script>

import { defineComponent } from 'vue';
import WorkBench from './views/WorkBench.vue';
export default defineComponent({
  components: { 
    WorkBench
  },
  name: 'App',
  props: {},
  setup() {
    return {};
  }
});

</script>

<style lang="less">
@import './assets/font/font.css';

html,
body,
#app,

body {
  overflow: hidden;
  overscroll-behavior: contain;
  font-family: lato, pingfangsc-regular, 'Microsoft YaHei', sans-serif, 'San Francisco';
  // background-color: var(--o-white);
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: var(--o-black);
  font-size: 14px;
  line-height: 1.5;
}

input {
  font-family: lato, pingfangsc-regular, 'Microsoft YaHei', 'San Francisco', sans-serif;
}
</style>
