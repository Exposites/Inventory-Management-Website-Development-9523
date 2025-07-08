import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useInventory } from '../context/InventoryContext';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';

const { FiPackage, FiDollarSign, FiAlertTriangle, FiXCircle } = FiIcons;

const Dashboard = () => {
  const { getStats, items } = useInventory();
  const stats = getStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

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
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your inventory.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <StatCard
              title="Total Items"
              value={stats.totalItems}
              icon={FiPackage}
              color="blue"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Total Value"
              value={`$${stats.totalValue.toLocaleString()}`}
              icon={FiDollarSign}
              color="green"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Low Stock"
              value={stats.lowStockItems}
              icon={FiAlertTriangle}
              color="yellow"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Out of Stock"
              value={stats.outOfStockItems}
              icon={FiXCircle}
              color="red"
            />
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <RecentActivity items={items} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <QuickActions />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;