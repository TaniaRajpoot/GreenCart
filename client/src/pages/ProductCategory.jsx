import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  if (!category) return <p>Invalid category</p>;

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  );

  const filterProducts = products.filter(
    (product) =>
      product.category?.toLowerCase().trim() === category.toLowerCase().trim()
  );

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end  w-max">
          <p className="text-2xl font-medium">
            {searchCategory.text.toLowerCase()}
          </p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}
      {filterProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
          {filterProducts.map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-primary">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
