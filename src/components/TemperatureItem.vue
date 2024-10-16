<template>
    <div class="component-item">
  
        <div class="component-item__chart">
            <template v-if="Object.keys(chartOptions).length">
                <InfraredCharts :options="chartOptions"></InfraredCharts>
            </template>
            <template v-else>
                <a-empty :description="null" />
            </template>
            <!-- <InfraredCharts :options="chartOptions"></InfraredCharts> -->

        </div>
        <div class="component-item__setting">
            <a-flex vertical>
                <a-input-number   :step="1"  addon-after="&deg;C" style="margin-bottom: 10px;" placeholder="20"/>
                <a-input-number   :step="1"  addon-after="ms/us" style="margin-bottom: 10px;" placeholder="44"/>
                <a-progress :percent="50" size="small" status="active" />
            </a-flex>    
        </div>
        <div class="component-item__icon">
            <a-flex vertical>
                <a-button type="text"><PlayCircleFilled style="font-size: 18px;" /> </a-button>
                <a-button type="text"><DeleteFilled style="font-size: 18px;" /> </a-button>
            </a-flex>
        </div>
      
    </div>
  </template>
  
  <script>
    import InfraredCharts from '@/components/InfraredCharts.vue';

  export default {
    name: 'ComponentItem',
    components: {
        InfraredCharts
    },
    props: {
      temperature: {
        type: Number,
        required: true,
        default: 20,
      },
      time: {
        type: Number,
        required: true,
        default: 44,
      },
      chartOptions:{
        type: Object,
        required: true,
        default: () => ({
            legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['product', '2015', '2016', '2017'],
                    ['Matcha Latte', 43.3, 58.5, 93.7],
                    ['Milk Tea', 83.1, 78.3, 55.1],
                    ['Cheese Cocoa', 86.4, 111.4, 82.5],
                    ['Walnut Brownie', 72.4, 98, 39.1]
                ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]}
        )
      }
    },
  };
  </script>
  
  <style scoped>
  .component-item {
    width: 100%;
    height: 300px;
    /* background-color: #b28181; */
    color: #fff;
    display: flex;
    flex-direction: row; /* 改为水平排列 */
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 4px;


  }
  
  .component-item__icon,
  .component-item__setting,
  .component-item__chart {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  
    .component-item__icon {
        width: 4%;
        margin-left: 20px;
        margin-bottom: 10px;
        align-self: flex-start; /* 容器内部在上方对齐 */
        text-align: left; /* 内容在右侧对齐 */
        display: flex;
        justify-content: flex-end; /* 水平方向上对齐到右侧 */
        align-items: flex-start; /* 垂直方向上对齐到顶部 */
    }



  .component-item__chart {
    width: 60%;
    margin-right: 4px;
    border: 1px solid black
  }
  
  .component-item__setting {
    width: 30%;
    background-color: #e6e6e6;
    border: 1px solid black
  }
  
  </style>
  