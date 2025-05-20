import  { useEffect } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { useParams } from 'react-router-dom';
import {motion} from 'framer-motion';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { fetchProductsByCategory, products, loading } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);

  return (
    <div className='min-h-screen'>
      <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-4xl font-bold text-center sm:text-5xl text-emerald-400 mb-8'
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
        >
          {loading && (
            <h2 className='text-xl text-gray-400 col-span-full'>Loading...</h2>
          )}

          {!loading && products?.length === 0 && (
            <h2 className='text-3xl font-semibold text-center text-gray-300 col-span-full'>
              No products found in this category.
            </h2>
          )}

          {!loading &&
            products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage