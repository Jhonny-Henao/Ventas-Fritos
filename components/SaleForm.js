import React from 'react';
import { Trash2 } from 'lucide-react';

const SaleForm = ({ currentSale, setCurrentSale, products, addSale, getCurrentSaleTotal }) => {
  const updateQuantity = (productName, quantity) => {
    const product = products.find(p => p.name === productName);
    const updatedItems = currentSale.items.map(item =>
      item.product === productName
        ? { ...item, quantity: parseInt(quantity) || 0, price: product.price }
        : item
    );
    setCurrentSale({ ...currentSale, items: updatedItems });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        ➕ Nueva Venta
      </h2>
      
      {/* Nombre del Cliente */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          👤 Nombre del Cliente
        </label>
        <input
          type="text"
          value={currentSale.customerName}
          onChange={(e) => setCurrentSale({...currentSale, customerName: e.target.value})}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium bg-white placeholder-gray-500"
          placeholder="Ingresa el nombre del cliente"
        />
      </div>

      {/* Productos */}
      <div className="space-y-3 mb-4">
        <label className="block text-sm font-semibold text-gray-800">
          📦 Productos
        </label>
        {currentSale.items.map((item, index) => (
          <div key={item.product} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border">
            <span className="font-semibold text-gray-800">{item.product}</span>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-green-700">${item.price.toLocaleString('es-CO')}</span>
              <input
                type="number"
                value={item.quantity === 0 ? '' : item.quantity}
                onChange={(e) => updateQuantity(item.product, e.target.value)}
                className="w-20 px-3 py-2 border-2 border-gray-300 rounded-md text-center font-bold text-gray-900 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total de la Venta Actual */}
      <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-4">
        <div className="text-xl font-bold text-blue-900 text-center">
          Total Venta: ${getCurrentSaleTotal().toLocaleString('es-CO')}
        </div>
      </div>

      <button
        onClick={addSale}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-lg"
      >
        Registrar Venta
      </button>
    </div>
  );
};

export default SaleForm;