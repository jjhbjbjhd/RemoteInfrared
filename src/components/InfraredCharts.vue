<template>
  <div ref="chartDom" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, defineProps } from 'vue';
import * as echarts from 'echarts';


// 定义props，以便从外部传递图表的配置项
const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
});

// 创建一个响应式引用来保存DOM元素
const chartDom = ref(null);
let chartInstance = null;
let resizeObserver = null;


// 初始化ECharts实例并设置配置项
onMounted(async () => {
  await nextTick(); // 确保DOM已经渲染完成
  chartInstance = echarts.init(chartDom.value);
  chartInstance.setOption(props.options); // 使用传入的options初始化图表

  // // 初始化 ResizeObserver
  if (chartInstance) {
      chartInstance.resize();
    }
});

// 监听props.options的变化，并实时更新图表配置
watch(
  () => props.options,
  (newOptions) => {
    if (chartInstance) {
      chartInstance.clear(); // 清除之前的图表数据
      chartInstance.setOption(newOptions);
    }
  },
  { deep: true }
);

// 销毁ECharts实例和 ResizeObserver
onUnmounted(() => {
  if (chartInstance != null && chartInstance.dispose) {
    chartInstance.dispose();
  }
  if (resizeObserver) {
    resizeObserver.disconnect(); // 停止监听
    resizeObserver = null;
  }
});
</script>

<style scoped>
/* 添加一些CSS样式来美化图表容器（可选） */
</style>
