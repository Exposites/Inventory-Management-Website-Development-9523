import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiClock, FiPackage, FiAlertTriangle, FiXCircle } = FiIcons;

const RecentActivity = ({ items }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Stock':
        return FiPackage;
      case 'Low Stock':
        return FiAlertTriangle;
      case 'Out of Stock':
        return FiXCircle;
      default:
        return FiPackage;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'text-green-600 dark:text-green-400';
      case 'Low Stock':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Out of Stock':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const recentItems = items
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <SafeIcon icon={FiClock} className="text-xl text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
      </div>

      {recentItems.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No recent activity to display.
        </p>
      ) : (
        <div className="space-y-4">
          {recentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${getStatusColor(item.status)}`}>
                <SafeIcon icon={getStatusIcon(item.status)} className="text-sm" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.status} • Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(item.lastUpdated), 'MMM dd')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;