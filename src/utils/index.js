/**
 * 计算矩阵的直方图
 * @param {Array} matrix - 输入矩阵（二维数组）
 * @param {number} bins - 直方图的区间数量
 * @returns {Object} - 直方图数据，包括区间和对应的频数
 */

import {flatten, min, max,subtract,sum,dotDivide,multiply} from 'mathjs';
function calculateHistogram(matrix, bins=150) {
  // 将矩阵展开为一维数组
  const flatArray = flatten(matrix);

  // 找到数据的最小值和最大值
  const minValue = min(flatArray);
  const maxValue = max(flatArray);

  // 计算每个区间的宽度
  const binWidth = (maxValue - minValue) / bins;

  // 初始化直方图数组
  const histogram = Array(bins).fill(0);
  const binEdges = Array.from({ length: bins + 1 }, (_, i) => minValue + i * binWidth);

  // 遍历数据，将值归入相应区间
  flatArray.forEach(value => {
    const binIndex = Math.min(Math.floor((value - minValue) / binWidth), bins - 1);
    histogram[binIndex]++;
  });

  // 返回区间和对应的频数
  return { binEdges, histogram};
}

function calculateNETD(respMatrix, noiseMatrix){
  const diffT = 35 - 20;
  const netdMatrix = multiply(dotDivide(noiseMatrix,respMatrix),diffT);
  const netd = sum(netdMatrix)/(netdMatrix.length*netdMatrix[0].length);
  return {netdMatrix,netd};
}

function calculateResponsive(matrixHigh, matrixLow){
  const respMatrix = subtract(matrixHigh, matrixLow);
  const resp = sum(respMatrix)/(respMatrix.length*respMatrix[0].length);
  return {respMatrix, resp};
}

function calculateNoise(matrixLow){

  const noise = sum(matrixLow) / (matrixLow.length * matrixLow[0].length);
  return noise;
}


  
  // 导出函数
export { calculateHistogram, calculateNETD, calculateResponsive, calculateNoise}
  