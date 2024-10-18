<template>
    <div class="container">
      <div class="project">
        <!-- 点击按钮触发文件选择器 -->
        <a-button @click="loadProject" style="width: 100%; height: 40px;">
          <PlusCircleOutlined />Add Project
        </a-button>
  
        <!-- 隐藏的文件输入元素 -->
        <input type="file" ref="fileInput" webkitdirectory style="display: none;" @change="selectDirectory" />
  
        <div class="project-container">
          <a-empty v-if="!treeData || treeData.length === 0" />
          <a-directory-tree
            v-else
            v-model:expandedKeys="expandedKeys"
            v-model:selectedKeys="selectedKeys"
            multiple
            :tree-data="treeData"
             @select="handleSelect"
          ></a-directory-tree>
        </div>
      </div>
      <div class="dashboard">
        <div class="responsive" style="height: 33%;margin-bottom: 4px;background-color: #f9f9f9;display: flex; justify-content: center; align-items: center;">
          <a-empty v-if="!responsiveOptions || Object.keys(responsiveOptions).length === 0" />   
          <InfraredCharts v-else :options="responsiveOptions"></InfraredCharts>
        </div>
        <div class="noise" style="height: 33%;margin-bottom: 4px;background-color: #f9f9f9;display: flex; justify-content: center; align-items: center;">
          <a-empty v-if="!noiseOptions || Object.keys(noiseOptions).length === 0"></a-empty>
          <InfraredCharts v-else :options="noiseOptions"></InfraredCharts>
  
        </div> 
        <div class="netd" style="height: 33%;margin-bottom: 4px;background-color: #f9f9f9;display: flex; justify-content: center; align-items: center;">
          <a-empty v-if="!netdOptions || Object.keys(netdOptions).length === 0"></a-empty>
          <InfraredCharts v-else :options="netdOptions"></InfraredCharts>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import {calculateHistogram, calculateNETD, calculateResponsive} from '@/utils/index';
  import InfraredCharts from '@/components/InfraredCharts.vue'
   
  
  export default {
    name: 'DashboardView',
    components:{
          InfraredCharts
      },
    setup() {
      const fileInput = ref(null);
      const expandedKeys = ref([]);
      const selectedKeys = ref([]);
      const treeData = ref([]);
      const tMatrix = ref({
        low:[],
        high:[]
      })
  
      const noiseOptions = ref({});
      const responsiveOptions = ref({});
      const netdOptions = ref({});
  
      const loadProject = () => {
        fileInput.value.click(); // 触发隐藏的文件选择器
      };
  
      const selectDirectory = (event) => {
        const files = event.target.files;
        const tree = {};
        const targetFiles = ["Test-Result", "低温均值_V.txt", "高温均值_V.txt"];
  
        for (const file of files) {
          const parts = file.webkitRelativePath.split('/');
          if (!targetFiles.includes(file.name)) continue;
  
          const findTestResult = parts.findIndex(part => part.startsWith("Test-Result"));
          if (findTestResult <= 0) continue;
          const newParts = parts.filter(item => !targetFiles.includes(item)).slice(findTestResult - 1);
  
          let current = tree;
          newParts.forEach((part, index) => {
            if (!current[part]) {
              current[part] = {
                key: newParts.slice(0, index + 1).join('___'),
                title: part,
                children: {},
              };
            }
            current = current[part].children;
          });
        }
  
        const convertTree = (tree) => {
          return Object.values(tree).map(({ title, key, children }) => ({
            title,
            key,
            children: convertTree(children),
            isLeaf: Object.keys(children).length === 0,
          }));
        };
        treeData.value = convertTree(tree);
        expandedKeys.value = treeData.value.map(item => item.key); // 展开根节点
      };
      const readFileAsText = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });
      };
  
      const parseContentToArray = (content) => {
        return content
          .trim()                    // 去除前后空白字符
          .split(/\n+/)              // 按换行符分割成多行
          .map(line => 
            line.trim()              // 去除每行的前后空白字符
              .split(/\s+/)         // 按空格或制表符分割每行
              .map(Number)          // 将字符串转换为数字
          );
      };
      
      const setChartOptions = (title,data) => {
        const defaultOptions = {
            title: {
              text: title,
              left:20
            },
            toolbox:{
              feature:{
                dataZoom:{yAxisIndex:false},
                saveAsImage:{pixelRatio:2}
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {type: 'shadow'}
            },
            grid: {bottom:90},
            dataZoom:[{type: 'inside'},{type: 'slider'}],
            xAxis: [
              {
                data: data.binEdges,
                silent: false,
                splitLine: { show:false},
                splitArea: {show: false},
                axisLabel: {
                  formatter:function (value){return Number(value).toFixed(4)}
                }
              }
            ],
            yAxis: [{
              splitArea: {show: false}
            }],
            series: [
              {
                type: 'bar',
                barWidth: '60%',
                data: data.histogram
              }
            ]
        };
        return defaultOptions;
        
      };
  
  
      const handleSelect = async  (selectedKeys, info) => {
        if(info.node.dataRef.isLeaf) {
          const keyList = selectedKeys[0].split('___');
          const highKeyList = [...keyList,'高温均值_V.txt'];
          const lowKeyList = [...keyList,'低温均值_V.txt'];
          const fileInputList = [...fileInput.value.files]
          const highTxt = fileInputList.find(f => highKeyList.every(ele=>f.webkitRelativePath.split('/').includes(ele)));
          const lowTxt = fileInputList.find(f => lowKeyList.every(ele=>f.webkitRelativePath.split('/').includes(ele)));
  
          if(!highTxt || !lowTxt) return;
  
          try {
            // 使用封装的readFileAsText函数读取文件
            tMatrix.value.high = parseContentToArray(await readFileAsText(highTxt));
            tMatrix.value.low = parseContentToArray(await readFileAsText(lowTxt));
            console.log('File contents:', tMatrix.value);
          } catch (error) {
            console.error('Error reading files:', error);
          }
          const { respMatrix} = calculateResponsive(tMatrix.value.high,tMatrix.value.low)
          // const noise = calculateNoise(tMatrix.value.low)
          const {netdMatrix} = calculateNETD(respMatrix, tMatrix.value.low)
  
          const noiseHis = calculateHistogram(tMatrix.value.low, 500);
          const respHis = calculateHistogram(respMatrix,500);
          const netdHis = calculateHistogram(netdMatrix,500);
          noiseOptions.value = setChartOptions('噪声直方图',noiseHis);
          netdOptions.value = setChartOptions("NETD直方图",netdHis);
          responsiveOptions.value = setChartOptions("响应直方图",respHis);
        }
      }
      return {
        noiseOptions,
        netdOptions,
        responsiveOptions,
        handleSelect,
        treeData,
        expandedKeys,
        selectedKeys,
        fileInput,
        loadProject,
        selectDirectory,
      };
    }
  };
  </script>
  
  <style>
  .container {
    display: flex;
    justify-content: space-between;
    padding: 15px;
  }
  
  .project {
    width: 30%;
  }
  
  .dashboard {
    width: 70%;
    height: 90vh;
  }
  
  .project {
    height: 90vh;
    padding: 0;
    margin: 6px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
  }
  
  .project-container {
    max-height: 85vh; /* 根据需要设置合适的最大高度 */
    overflow-y: auto; /* 当内容超出时，自动添加垂直滚动条 */
    padding-right: 10px; /* 可选：给滚动条留出空间 */
  }
  
  .project-container .ant-tree-node-content-wrapper {
    display: inline-block;
    max-width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative; /* 使子元素定位相对于这个元素 */
  }
  
  .project-container .ant-tree-node-content-wrapper:hover::after {
    content: attr(data-title); /* 使用 data-title 属性的值 */
    position: absolute;
    left: 0;
    top: 100%; /* 在文件名下方显示 */
    background: rgba(0, 0, 0, 0.7); /* 背景色 */
    color: white; /* 文字颜色 */
    padding: 5px;
    border-radius: 3px; /* 圆角边框 */
    white-space: nowrap; /* 防止换行 */
    z-index: 10; /* 确保悬浮提示在其他元素之上 */
    visibility: visible; /* 悬浮时可见 */
  }
  
  .project-container .ant-tree-node-content-wrapper::after {
    visibility: hidden; /* 默认隐藏悬浮提示 */
    opacity: 0; /* 默认透明 */
    transition: opacity 0.2s; /* 过渡效果 */
  }
  
  
  </style>
  