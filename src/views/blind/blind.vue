<template>
    <a-flex>
        <a-space style="width: 70%;background-color:#f0f0f0">
            <div class="chart-group">
                <div id="chart1">
                    <InfraredCharts :options="chartOptions"></InfraredCharts>
                </div>
                <div id="chart2">
                    <InfraredCharts :options="chartOptions"></InfraredCharts>
                </div>
                <div id="chart3">
                    <InfraredCharts :options="chartOptions"></InfraredCharts>

                </div>
                <div id="chart4">
                    <span>Result</span>

                </div>
            </div>

        </a-space>


        <a-space style="width: 30%">
            <a-space direction="vertical">
                <a-space>
                    <a-button>Load</a-button>
                    <a-button>Save</a-button>
                    <a-button>Detect</a-button>
                </a-space>

                <a-divider  style="height: 0.5px; background-color: black; margin-top: 4px;margin-bottom: 4px;" />
                <a-input-number step='0.1'  addon-before="Integration Time:" addon-after="ms/us" />

                <span style="font-weight: bold;">Temperature Point</span>
                <a-input-group style="width: 100%;">
                    <a-input-number  step='0.1'  addon-before="Reference:" addon-after="&deg;C" />
                    <a-input-number  step='0.1'  addon-before="Target:" addon-after="&deg;C" />
                </a-input-group>

                <span style="font-weight: bold;">Level Blind Bound</span>
                <a-input-group style="width: 100%;">
                    <a-input-number  step='0.1'  addon-before="Upper:" addon-after="%(>100)" />
                    <a-input-number  step='0.1'  addon-before="Lower:" addon-after="%(<100)" />
                </a-input-group>

                <span style="font-weight: bold;">Noise Bound</span>
                <a-input-group style="width: 100%;">
                    <a-input-number  step='0.1'  addon-before="Upper:" addon-after="%(>100)" />
                    <a-input-number  step='0.1'  addon-before="Lower:" addon-after="%(<100)" />
                </a-input-group>

                <a-space>
                    <a-switch>
                        <check-outlined />
                        <close-outlined />
                    </a-switch>
                    <span style="font-weight: bold;">Responsivity Blind Bound</span>
                </a-space>

                <a-input-group style="width: 100%;">
                    <a-input-number  step='0.1'  addon-before="Upper:" addon-after="%(>100)" />
                    <a-input-number  step='0.1'  addon-before="Lower:" addon-after="%(<100)" />
                </a-input-group>

                <a-space>
                    <a-switch>
                        <check-outlined />
                        <close-outlined />
                    </a-switch>
                    <span style="font-weight: bold;">NETD Range</span>
                </a-space>

                <a-input-group style="width: 100%;">
                    <a-input-number  step='0.1'  addon-before="Min:" addon-after="mK" />
                    <a-input-number  step='0.1'  addon-before="Max:" addon-after="mK" />
                </a-input-group>

                <a-divider style="height: 1px; background-color: black; margin-top: 4px;margin-bottom: 4px;" />

                <span  style="font-weight: bold;">H5 (Very Import)</span>
                <a-button>Bad Pixel Correct</a-button>
                <a-button>Save</a-button>
                <span style="font-weight: bold; font-size: 12px;">Notice:correct value is used for NUC</span>

                <a-divider style="height: 1px; background-color: black; margin-top: 4px;margin-bottom: 4px;" />
                <span  style="font-weight: bold;">Image</span>
                <a-button>Save Blind Placement Image</a-button>
                <a-button>Save Image</a-button>
            </a-space>
        </a-space>
    </a-flex>
</template>

<script>
import { computed } from 'vue';
import InfraredCharts from '@/components/InfraredCharts.vue';
export default {
    name: 'BlindView',
    components: {
        InfraredCharts
    },
    setup(){

        const chartOptions = computed(() => ({
        legend: {},
        tooltip: {},
        dataset: {
            source: [
                ['product', '2015', '2016', '2017'],
                ['Matcha Latte', 43.3, 43, 93.7],
                ['Milk Tea', 83.1, 45, 55.1],
                ['Cheese Cocoa', 86.4, 57, 82.5],
                ['Walnut Brownie', 72.4, 89, 39.1]
            ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    }));

        return {
            msg: 'blind',
            chartOptions
        }
    }
}
</script>

<style lang="scss" scoped>
.chart-group {
    width: 65vw;
    margin: 6px;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
    height: 93vh; /* 父容器的高度，以便计算50%的高度 */
}

.chart-group div {
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
}

</style>