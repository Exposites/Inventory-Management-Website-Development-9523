import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

const StockLevelChart = ({ items }) => {
  const statusCounts = {
    'In Stock': 0,
    'Low Stock': 0,
    'Out of Stock': 0
  };

  items.forEach(item => {
    statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
  });

  const option = {
    title: {
      text: 'Stock Level Distribution',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: Object.keys(statusCounts),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Items',
        type: 'bar',
        data: Object.values(statusCounts),
        itemStyle: {
          color: function(params) {
            const colors = ['#10B981', '#F59E0B', '#EF4444'];
            return colors[params.dataIndex];
          }
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
    >
      <ReactECharts
        option={option}
        style={{ height: '400px' }}
        theme="light"
      />
    </motion.div>
  );
};

export default StockLevelChart;