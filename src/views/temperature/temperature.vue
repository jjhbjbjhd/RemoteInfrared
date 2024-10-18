<template>
  <div class="temperature">
    <a-layout>
      <a-layout-header>
        <a-space direction="horizontal">
          <a-input-number style="display: flex; align-items: center;" v-model:value="value" addon-before="Per-Point:" />
          <a-switch v-model:checked="state.checked1" checked-children="Unlock" un-checked-children="Lock" />
          <a-button type="text"><DownloadOutlined />DownLoad</a-button>
          <a-button type="text"><UploadOutlined />upLoad</a-button>
          <a-button type="text" @click="addComponent"><PlusOutlined />Add Point</a-button>
          <a-button type="text" @click="clearComponents"><DeleteOutlined />Clear</a-button>
          <a-button type="text"><ForwardOutlined />Run All</a-button>
        </a-space>
      </a-layout-header>
      <a-layout-content>
        <div class="content">
          <div v-if="components.length === 0" class="empty-container">
            <a-empty :description="null" />
          </div>
          <transition-group v-else name="fade" tag="div" class="component-container">
            <TemperatureItem
              v-for="(component) in components"
              :key="component.id"
              :component="component"
              :value="value"
              :checked="state.checked1"
            />

          </transition-group>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import { reactive, ref, onMounted, watch } from 'vue';
import TemperatureItem from '@/components/TemperatureItem.vue';

export default {
  name: 'TemperatureView',
  components: {
    TemperatureItem
  },
  setup() {
    const state = reactive({
      checked1: false,
    });
    const value = ref(200);

    const components = ref([]);

    const loadComponents = () => {
      const savedComponents = localStorage.getItem('components');
      if (savedComponents) {
        components.value = JSON.parse(savedComponents);
      }
    };

    const addComponent = () => {
      const newComponent = {
        id: Date.now(),
        text: `Component ${components.value.length + 1}`,
      };
      components.value.unshift(newComponent);
    };

    const clearComponents = () => {
      components.value = [];
      localStorage.removeItem('components');
    };

    watch(
      components,
      (newVal) => {
        localStorage.setItem('components', JSON.stringify(newVal));
      },
      { deep: true }
    );

    onMounted(() => {
      loadComponents();
    });

    return {
      state,
      value,
      components,
      addComponent,
      clearComponents,
    };
  }
};
</script>

<style lang="scss" scoped>
.temperature {
  height: 100%;
  background-size: 100% 100%;

  .ant-layout-header {
    background-color: #f5f5f5;
    align-items: center;
    margin: 0;
    padding: 0;

    .ant-space {
      width: 100%;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      margin: 0;
    }
  }

  .ant-layout-content {
    height: 87vh;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .content {
      width: 95%;
      height: 98%;
      border: 1px solid black;
      border-bottom: 0px;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto; /* 添加垂直滚动条 */
      padding: 10px;

      .empty-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

      .component-container {
        display: flex;
        flex-direction: column-reverse;
        width: 100%;
        align-items: center;
        gap: 10px;
      }

      .fade-enter-active, .fade-leave-active {
        transition: all 0.5s;
      }
      .fade-enter-from {
        opacity: 0;
        transform: translateY(-20px);
      }
      .fade-leave-to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }
  }
}
</style>
