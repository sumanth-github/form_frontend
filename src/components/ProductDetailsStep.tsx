import React from 'react';
import { Package, FileText } from 'lucide-react';
import { ProductData, ProductCategory } from '../types/Product';
import { PRODUCT_CATEGORIES, getCategoryColor } from '../utils/categories';

interface ProductDetailsStepProps {
  data: ProductData;
  onUpdate: (updates: Partial<ProductData>) => void;
}

export const ProductDetailsStep: React.FC<ProductDetailsStepProps> = ({
  data,
  onUpdate,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Details</h2>
        <p className="text-gray-600">Tell us about your product to get started</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="productName"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Enter your product name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            value={data.category}
            onChange={(e) => onUpdate({ category: e.target.value as ProductCategory })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="">Select a category</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {data.category && (
            <div className="mt-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(data.category)}`}>
                {data.category}
              </span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description *
            </div>
          </label>
          <textarea
            id="description"
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe your product, its benefits, and key features..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {data.description.length}/500 characters
          </p>
        </div>
      </div>
    </div>
  );
};

