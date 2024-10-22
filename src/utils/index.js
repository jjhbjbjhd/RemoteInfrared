/**
 * 计算矩阵的直方图
 * @param {Array} matrix - 输入矩阵（二维数组）
 * @param {number} bins - 直方图的区间数量
 * @returns {Object} - 直方图数据，包括区间和对应的频数
 */

import {flatten, min, max,subtract,sum,dotDivide,multiply} from 'mathjs';
function calculateHistogram(matrix, bins=150,range=[0,1]) {
  // 将矩阵展开为一维数组
  const flatArray = flatten(matrix);

  // 找到数据的最小值和最大值
  const minValue = (range[0]=== 0 && range[1] === 1)? min(flatArray):range[0];
  const maxValue = (range[0]=== 0 && range[1] === 1)? max(flatArray):range[1];

  // 计算每个区间的宽度
  const binWidth = (maxValue - minValue) / bins;

  // 初始化直方图数组
  const histogram = Array(bins).fill(0);
  const binEdges = Array.from({ length: bins + 1 }, (_, i) => minValue + i * binWidth);

  // 遍历数据，将值归入相应区间
  for(let i = 0; i < flatArray.length; i++){
    const value = flatArray[i];
    if(value < minValue || value > maxValue) continue;
    const binIndex = Math.min(Math.floor((value - minValue) / binWidth), bins - 1);
    histogram[binIndex]++;
  }

  // 返回区间和对应的频数
  return { binEdges, histogram};
}

function calculateNETD(respMatrix, noiseMatrix){
  const diffT = 15;
  const netdMatrix = dotDivide(diffT,dotDivide(respMatrix,noiseMatrix));
  const netd = sum(netdMatrix)/(netdMatrix.length*netdMatrix[0].length);
  return {netdMatrix,netd};
}

function calculateResponsive(matrixHigh, matrixLow){
  const respMatrix = multiply(subtract(matrixHigh, matrixLow),-1);
  const resp = sum(respMatrix)/(respMatrix.length*respMatrix[0].length);
  return {respMatrix, resp};
}

function calculateNoise(matrixLow){

  const noise = sum(matrixLow) / (matrixLow.length * matrixLow[0].length);
  return noise;
}

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


  
  // 导出函数
export { calculateHistogram, 
  calculateNETD, 
  calculateResponsive, 
  calculateNoise,readFileAsText,
  parseContentToArray,
  setChartOptions
  }
  