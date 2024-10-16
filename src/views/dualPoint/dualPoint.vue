<template>
    <div class = "dualPoint_container">
        <div class = "chart">
            <InfraredCharts :options="chartOptions"></InfraredCharts>
        </div>
        <div class = "setting">
            <a-space direction="vertical">
                <a-input-number step='0.1' v-model:value="chartDataSet.integrationTime" addon-before="Integration Time:" addon-after="ms/us" />
                <span style="font-weight: bold;">Temperature Point</span>
                <a-input-group style="width: 100%;">
                    <a-input-number  step='0.1' v-model:value="chartDataSet.reference" addon-before="Reference:" addon-after="&deg;C" />
                    <a-input-number  step='0.1' v-model:value="chartDataSet.target" addon-before="Target:" addon-after="&deg;C" />
                </a-input-group>
                <span style="font-weight: bold;">Parameter</span>
                <a-input-group>
                    <a-input-number  step='0.1'  v-model:value="chartDataSet.fRatio" addon-before="F Ratio(L/D)" placeholder="2.0"/>
                    <a-input-number  step='0.1'  v-model:value="chartDataSet.fpaPixelArea" addon-before="FPA Pixel Area (Ad)" addon-after="μm²" placeholder="900"/>
                </a-input-group>

                <span style="font-weight: bold;">Plot Type</span>

                <a-select
                    v-model:value="value"
                    show-search
                    placeholder="please choose plot type"
                    style="width: 100%"
                    :options="plotType"
                    :filter-option="filterPlotType"
                ></a-select>
                
                <span style="font-weight: bold;">term L:</span>
                <span>Area Array: Cold screen round aperture</span>
                <span>Line Array: Blackbody output aperture</span>
                <span style="font-weight: bold;">term D:</span>
                <span>Lens to Array Distance</span>

            </a-space>
        </div>
          
    </div>
  </template>
  
<script setup lang="js">
    import { ref } from 'vue';
    import { computed } from 'vue';
    import InfraredCharts from '@/components/InfraredCharts.vue';

    const plotType = ref([
        {
            value: 'Mean(Image)',
            label: 'Mean(Image)',
        },
        {
            value: 'Noise(Pixel)',
            label: 'Noise(Pixel)',
        },
        {
            value: 'Noise(Histogram)',
            label: 'Noise(Histogram)',
        },
        {
            value: 'NETD(Pixel)',
            label: 'NETD(Pixel)',
        },
        {
            value: 'NETD(Histogram)',
            label: 'NETD(Histogram)',
        }
    ]);

    const filterPlotType = (input, option) => {
        return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    const value = ref(undefined);

    const chartDataSet = ref({
        integrationTime:73.4,
        reference:85.8,
        target:null,
        fRatio:65.2,
        fpaPixelArea:53.9,
        plotType:null,
    })
    // 创建一个动态的 chartOptions
    const chartOptions = computed(() => ({
        legend: {},
        tooltip: {},
        dataset: {
            source: [
                ['product', '2015', '2016', '2017'],
                ['Matcha Latte', 43.3, chartDataSet.value.reference ?? 0, 93.7],
                ['Milk Tea', 83.1, chartDataSet.value.integrationTime?? 0, 55.1],
                ['Cheese Cocoa', 86.4, chartDataSet.value.fRatio ?? 0, 82.5],
                ['Walnut Brownie', 72.4, chartDataSet.value.fpaPixelArea ?? 0, 39.1]
            ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    }));


</script>
  
<style lang="scss" scoped>
  /* 你的样式在这里写 */
  .dualPoint_container {
      width: 100%;
      height: 100%;
      display: flex;
 

      & .chart {
        width: 80%;
        height: 100%;
        background-color: #f0f0f0;
      }

      & .setting {
        width: 50%;
        height: 100%;
        // background-color: #aa6161;

        & span {
          margin-top: 10px;
        }

        & .ant-space {
          margin-top: 10px;
        }

        & .ant-input-number-group-wrapper {
          width: 100%;
          padding: 0;
        }

        & .ant-select {
          margin: 10px;

        }
        & span{
          margin-top: 10px;
        }
      }
  }
</style>
  