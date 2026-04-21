import React from 'react';
import CategoryCard from './CategoryCard';

const CategoryGrid = ({ data, onSelect }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map((cat, index) => (
          <CategoryCard 
            key={cat.id} 
            cat={cat} 
            index={index} 
            onSelect={onSelect} 
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;