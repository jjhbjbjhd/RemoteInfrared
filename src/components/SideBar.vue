<template>
  <div class="side-bar">
    <ul>
      <li
        v-for="item in workspaceList"
        :key="item.path" 
        :class="{ 'active-item': activeMenuitem === item.path }" 
        @click="clickSidebar(item.path)"
        :title="item.title">
        <!-- <DotChartOutlined /> -->
        <i :class="['iconfont', item.icon]"></i>
        <span class="menu-title">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
      setup() {
      const router = useRouter();
      const activeMenuitem = ref('/temperature');

      const workspaceList = ref([
          { title: 'Temperature', path: '/temperature', icon: 'icon-shezhi' },
          { title: 'Dual Point', path: '/dualPoint', icon: 'icon-shezhi' },
          { title: 'Blind', path: '/blind', icon: 'icon-shezhi' },
          {title: 'GB', path: '/dashboard', icon: 'icon-shezhi' },
      ]);
      
      const clickSidebar = (path) => {
        activeMenuitem.value = path;        
        router.push(path);
      };

  
  
      return {
          workspaceList,
          activeMenuitem,
          clickSidebar
      };
    }
  };
</script>

<style lang="scss" scoped>
.side-bar {
  box-sizing: border-box;
  height: 100%;
  background-color: #333333;
  border-right: 1px solid #D3D3D3;
  .iconfont {
    font-size: 30px;
    color: #37373c;
    cursor: pointer;
  }
}

ul, li {
  padding: 0;
  margin: 0;
}

li {
  list-style-type: none;
  padding: 10px 25px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 2px solid #f0f2f5;
  cursor: pointer;
  
  i {
    color: #1C1C1C;
    margin-right: 6px;
  }

  .menu-title {
    display: none;
    font-size: 12px;
    letter-spacing: 1px;
    color: #1C1C1C;
  }
  
  &:hover {
    background-color: #e6e6e6;
    font-weight: bold;
    border-left: 2px solid #40b883;
  }
  
  &:hover .iconfont {
    display: none;
  }
  
  &:hover .menu-title {
    display: inline-block;
  }
}

.active-item {
  background-color: #e6e6e6;
  font-weight: bold;
  border-left: 2px solid #40b883;
}
</style>

