import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

const CategoryChart = ({ categoryStats }) => {
  const chartData = Object.entries(categoryStats).map(([category, data]) => ({
    name: category,
    value: data.count
  }));

  const option = {
    title: {
      text: 'Items by Category',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: 'Items',
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: false
        }
      }
    ],
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16']
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

export default CategoryChart;