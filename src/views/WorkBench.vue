<template>
    <div class="workspace-container">
      <TitleBar />
      <div class="content-area">
        <SideBar />
        <div class="workspace">
          <WorkSpace />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import TitleBar from '../components/TitleBar.vue';
  import SideBar from '../components/SideBar.vue';
  import WorkSpace from '@/components/WorkSpace.vue';
  
  export default {
    components: {
      TitleBar,
      SideBar,
      WorkSpace
    }
  };
  </script>
  
  <style scoped>
  .workspace-container {
    display: flex;
    flex-direction: column;
    height: 100vh; /* 使整个容器充满视口高度 */
  }
  
  .content-area {
    display: flex;
    flex: 1;
    overflow: hidden; /* 防止子元素超出容器 */
  }
  
  .side-bar {
    width: 70px;
    flex-shrink: 0;
    background-color: #f0f2f5;
    border-right: 1px solid #d3d3d3;
  }
  
  .workspace {
    flex: 1;
    padding: 0;
    border: 0;
    background-color: #fff;
    overflow-y: auto;
  }
  </style>
  