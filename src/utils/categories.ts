import { ProductCategory } from '../types/Product';

export const PRODUCT_CATEGORIES: ProductCategory[] = ['Food', 'Wellness', 'Eco'];

export const getCategoryColor = (category: ProductCategory): string => {
  switch (category) {
    case 'Food':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Wellness':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Eco':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};