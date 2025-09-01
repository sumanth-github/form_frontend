import { ProductCategory } from '../types/Product';

// Add more categories here
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Food',
  'Fruits & Vegetables',
  'Meat, Seafood & Dairy',
  'Wellness',
  'Eco',
  'Beauty',
  'Fashion',
];

export const getCategoryColor = (category: ProductCategory): string => {
  switch (category) {
    case 'Food':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Fruits & Vegetables':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Meat, Seafood & Dairy':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Wellness':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Eco':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Beauty':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'Fashion':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
