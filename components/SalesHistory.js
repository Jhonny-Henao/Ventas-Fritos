import React from 'react';

const SalesHistory = ({ sales, deleteSale, clearAllData, getTotalSales }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          📋 Historial de Ventas ({sales.length})
        </h2>
        <button
          onClick={clearAllData}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          🗑️ Borrar Todo
        </button>
      </div>

      {/* Resumen Total */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center">
          <div className="text-sm font-semibold text-green-800">Total Ventas</div>
          <div className="text-2xl font-bold text-green-900">
            ${getTotalSales().toLocaleString('es-CO')}
          </div>
        </div>
        <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 text-center">
          <div className="text-sm font-semibold text-blue-800">Número de Ventas</div>
          <div className="text-2xl font-bold text-blue-900">{sales.length}</div>
        </div>
      </div>

      {sales.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay ventas registradas aún</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-3 text-left font-bold text-gray-900 border">Cliente</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 border">Productos</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 border">Fecha</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 border">Total</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900 border">{sale.customerName}</td>
                  <td className="px-4 py-3 border">
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="text-sm font-medium text-gray-800">
                        {item.quantity}x {item.product}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700 border">{sale.date}</td>
                  <td className="px-4 py-3 font-bold text-green-700 text-lg border">
                    ${sale.total.toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-3 border">
                    <button
                      onClick={() => deleteSale(sale.id)}
                      className="text-red-500 hover:text-red-700 font-bold text-lg"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;