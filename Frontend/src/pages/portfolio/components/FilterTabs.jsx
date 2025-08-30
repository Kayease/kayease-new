import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FilterTabs = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {filters.map((filter) => (
        <motion.button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeFilter === filter.id
              ? 'text-white bg-primary shadow-lg'
              : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center space-x-2">
            <Icon 
              name={filter.icon} 
              size={16} 
              className={activeFilter === filter.id ? 'text-white' : 'text-gray-500'}
            />
            <span>{filter.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              activeFilter === filter.id 
                ? 'bg-white/20 text-white' :'bg-gray-100 text-gray-500'
            }`}>
              {filter.count}
            </span>
          </div>
          
          {activeFilter === filter.id && (
            <motion.div
              className="absolute inset-0 bg-primary rounded-full -z-10"
              layoutId="activeFilter"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterTabs;