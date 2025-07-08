import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useInventory } from '../context/InventoryContext';
import CategoryChart from '../components/CategoryChart';
import StockLevelChart from '../components/StockLevelChart';
import ValueChart from '../components/ValueChart';

const { FiBarChart3, FiPieChart, FiTrendingUp } = FiIcons;

const Reports = () => {
  const { items, getCategoryStats } = useInventory();
  const [activeTab, setActiveTab] = useState('overview');

  const categoryStats = getCategoryStats();
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'categories', label: 'Categories', icon: FiPieChart },
    { id: 'trends', label: 'Trends', icon: FiTrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze your inventory data and track performance metrics.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <SafeIcon icon={tab.icon} className="text-sm" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <StockLevelChart items={items} />
              <ValueChart items={items} />
            </div>
          )}
          
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CategoryChart categoryStats={categoryStats} />
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Category Breakdown
                </h3>
                <div className="space-y-4">
                  {Object.entries(categoryStats).map(([category, data]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">{category}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {data.count} items
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ${data.value.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'trends' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Inventory Trends
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Trend analysis features coming soon. This will include stock movement patterns,
                seasonal trends, and predictive analytics.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;