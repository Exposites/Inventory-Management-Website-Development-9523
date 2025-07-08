import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiDownload, FiBarChart3, FiSettings } = FiIcons;

const QuickActions = () => {
  const actions = [
    {
      title: 'Add New Item',
      description: 'Quickly add a new item to your inventory',
      icon: FiPlus,
      color: 'blue',
      path: '/inventory'
    },
    {
      title: 'Export Data',
      description: 'Download your inventory data',
      icon: FiDownload,
      color: 'green',
      path: '/inventory'
    },
    {
      title: 'View Reports',
      description: 'Check detailed analytics and reports',
      icon: FiBarChart3,
      color: 'purple',
      path: '/reports'
    },
    {
      title: 'Settings',
      description: 'Configure your preferences',
      icon: FiSettings,
      color: 'gray',
      path: '/settings'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    gray: 'bg-gray-600 hover:bg-gray-700'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Quick Actions
      </h2>
      
      <div className="space-y-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={action.path}
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg text-white ${colorClasses[action.color]} group-hover:scale-110 transition-transform duration-200`}>
                  <SafeIcon icon={action.icon} className="text-lg" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;