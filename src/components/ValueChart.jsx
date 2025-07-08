import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

const ValueChart = ({ items }) => {
  const categoryValues = {};
  
  items.forEach(item => {
    const value = item.quantity * item.price;
    categoryValues[item.category] = (categoryValues[item.category] || 0) + value;
  });

  const option = {
    title: {
      text: 'Value by Category',
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
      },
      formatter: function(params) {
        return `${params[0].name}: $${params[0].value.toLocaleString()}`;
      }
    },
    xAxis: {
      type: 'category',
      data: Object.keys(categoryValues),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}'
      }
    },
    series: [
      {
        name: 'Value',
        type: 'bar',
        data: Object.values(categoryValues),
        itemStyle: {
          color: '#3B82F6'
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

export default ValueChart;