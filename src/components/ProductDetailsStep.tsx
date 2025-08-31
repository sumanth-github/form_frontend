import React, { Fragment } from "react";
import { Package, FileText } from "lucide-react";
import { ProductData, ProductCategory } from "../types/Product";
import { PRODUCT_CATEGORIES, getCategoryColor } from "../utils/categories";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

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
        {/* Product Name */}
        <div>
          <label
            htmlFor="productName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
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

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Category *
          </label>
          <Listbox
            value={data.category || ""}
            onChange={(val: ProductCategory) => onUpdate({ category: val })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer bg-white border border-gray-300 rounded-xl py-3 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <span className="block truncate">
                  {data.category || "Select a category"}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-44 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <Listbox.Option
                      key={cat}
                      value={cat}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-4 pr-10 ${
                          active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-semibold" : "font-normal"
                            }`}
                          >
                            {cat}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                              <CheckIcon className="h-5 w-5" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>

          {data.category && (
            <div className="mt-2">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                  data.category
                )}`}
              >
                {data.category}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
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
