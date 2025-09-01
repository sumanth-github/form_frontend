import { ProductCategory } from '../types/Product';

// Add more categories here
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Food',
  'Vegetable',
  'Fruit',
  'Wellness',
  'Eco',
  'Beauty',
  'Tech',
  'Fashion',
  'Fitness',
  'Home',
  'Education'
];

export const getCategoryColor = (category: ProductCategory): string => {
  switch (category) {
    case 'Food':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Vegetable':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Fruit':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Wellness':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Eco':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Beauty':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'Tech':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Fashion':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Fitness':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Home':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Education':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
