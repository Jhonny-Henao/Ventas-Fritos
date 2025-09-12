import React from 'react';
import { DollarSign } from 'lucide-react';

const PriceConfig = ({ products, updateProductPrice }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <DollarSign className="mr-2 text-green-600" />
        Precios de Productos
      </h2>
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.name} className="flex items-center justify-between">
            <span className="font-medium text-gray-800">{product.name}:</span>
            <div className="flex items-center">
              <span className="mr-2 text-gray-800 font-medium">$</span>
              <input
                type="number"
                value={product.price === 0 ? '' : product.price}
                onChange={(e) => updateProductPrice(product.name, e.target.value)}
                className="w-24 px-3 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-semibold bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
                step="500"
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceConfig;