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
  import {calculateHistogram, calculateNETD, calculateResponsive,parseContentToArray, readFileAsText,setChartOptions} from '@/utils/index';
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
  
      const noiseOptions = ref({});
      const responsiveOptions = ref({});
      const netdOptions = ref({});
  
      const loadProject = () => {
        fileInput.value.click(); // 触发隐藏的文件选择器
      };
  
      const selectDirectory = (event) => {
        const files = event.target.files;
        const tree = {};
        const targetFiles = ["Test-Result", "低温均值_V.txt", "高温均值_V.txt", "像元噪声均值_V.txt"];

        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const parts = file.webkitRelativePath.split('/');
            if (!targetFiles.includes(file.name)) continue;
            const findTestResult = parts.findIndex(part => part.startsWith("Test-Result"));
            if (findTestResult <= 0) continue;          
            const newParts = parts.slice(findTestResult - 1,4).filter(item => !targetFiles.includes(item));
  
            let current = tree;
            
            newParts.forEach((part, idx) => {
                if (!current[part]) {
                    current[part] = {
                        key: newParts.slice(0, idx + 1).join('___'),
                        title: part,
                        fileInputIdxList:[index],
                        children: {}
                    };
                }else{
                    current[part].fileInputIdxList = Array.from(new Set([...current[part].fileInputIdxList, index]));
                }
                current = current[part].children;
            });
        }

        const convertTree = (tree) => {
          return Object.values(tree).map(({ title, key,fileInputIdxList, children }) => ({
            title,
            key,
            fileInputIdxList,
            children: convertTree(children),
            isLeaf: Object.keys(children).length === 0,
          }));
        };
        treeData.value = convertTree(tree);
        expandedKeys.value = treeData.value.map(item => item.key); // 展开根节点
      };
 
    

      const handleSelect = async  (selectedKeys, info) => {

        if(info.node.dataRef.isLeaf) {

            const readTxtList = info.node.dataRef.fileInputIdxList;
            if(readTxtList.length < 3) return;
            const highMatrix = [];
            const lowMatrix = [];
            let noiseMatrix = [];
            
            try {
                for (const idx of readTxtList) {
                    const file = fileInput.value.files[idx];
                    const fileName = file.name;
                    if(fileName === '高温均值_V.txt'&& !highMatrix.length){
                        highMatrix.push(parseContentToArray(await readFileAsText(file)));
                    }else if(fileName === '低温均值_V.txt'&& !lowMatrix.length){
                        lowMatrix.push(parseContentToArray(await readFileAsText(file)));
                    }else if(fileName === '像元噪声均值_V.txt'&& !noiseMatrix.length){
                        noiseMatrix.push(parseContentToArray(await readFileAsText(file)));
                    }
                }
                
            } catch (error) {
                return
            }

            if(!highMatrix.length || !lowMatrix.length || !noiseMatrix.length) return;

          const { respMatrix} = calculateResponsive(highMatrix,lowMatrix)
          // const noise = calculateNoise(tMatrix.value.low)
          const {netdMatrix} = calculateNETD(respMatrix, noiseMatrix)
          const respHis = calculateHistogram(respMatrix,500,[0.200,0.5]);
          const noiseHis = calculateHistogram(noiseMatrix, 500,[0.0001,0.001]);
          const netdHis = calculateHistogram(netdMatrix,500,[0,0.05]);
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
  