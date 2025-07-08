import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Food & Beverages',
    'Other'
  ]);

  useEffect(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      // Sample data
      const sampleItems = [
        {
          id: 1,
          name: 'Laptop Dell XPS 13',
          category: 'Electronics',
          quantity: 15,
          price: 1299.99,
          minStock: 5,
          supplier: 'Dell Technologies',
          lastUpdated: new Date().toISOString(),
          status: 'In Stock'
        },
        {
          id: 2,
          name: 'Wireless Mouse',
          category: 'Electronics',
          quantity: 3,
          price: 29.99,
          minStock: 10,
          supplier: 'Logitech',
          lastUpdated: new Date().toISOString(),
          status: 'Low Stock'
        },
        {
          id: 3,
          name: 'Office Chair',
          category: 'Home & Garden',
          quantity: 0,
          price: 199.99,
          minStock: 2,
          supplier: 'Herman Miller',
          lastUpdated: new Date().toISOString(),
          status: 'Out of Stock'
        }
      ];
      setItems(sampleItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      lastUpdated: new Date().toISOString(),
      status: item.quantity > item.minStock ? 'In Stock' : 
              item.quantity > 0 ? 'Low Stock' : 'Out of Stock'
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            ...updates, 
            lastUpdated: new Date().toISOString(),
            status: updates.quantity > item.minStock ? 'In Stock' : 
                   updates.quantity > 0 ? 'Low Stock' : 'Out of Stock'
          }
        : item
    ));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getStats = () => {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const lowStockItems = items.filter(item => item.quantity <= item.minStock && item.quantity > 0).length;
    const outOfStockItems = items.filter(item => item.quantity === 0).length;
    
    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems
    };
  };

  const getCategoryStats = () => {
    const categoryData = {};
    items.forEach(item => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = { count: 0, value: 0 };
      }
      categoryData[item.category].count += item.quantity;
      categoryData[item.category].value += item.quantity * item.price;
    });
    return categoryData;
  };

  const value = {
    items,
    categories,
    addItem,
    updateItem,
    deleteItem,
    getStats,
    getCategoryStats
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};