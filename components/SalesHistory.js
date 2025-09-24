import React, { useState, useEffect } from 'react';

const SalesHistory = ({ sales, deleteSale, clearAllData, getTotalSales }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Resetear a página 1 cuando cambie el número de ventas
  useEffect(() => {
    setCurrentPage(1);
  }, [sales.length]);

  // Calcular totales para paginación
  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = sales.slice(startIndex, endIndex);

  // Funciones de navegación
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Función para generar números de página inteligentes
  const getSmartPageNumbers = (currentPage, totalPages) => {
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
    const range = [];
    const rangeWithDots = [];

    // Siempre incluir la primera página
    range.push(1);

    // Calcular el rango alrededor de la página actual
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Siempre incluir la última página (si no es la primera)
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remover duplicados y ordenar
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Agregar puntos suspensivos donde sea necesario
    let prev = 0;
    for (const page of uniqueRange) {
      if (page - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (page - prev !== 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

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
        <>
          {/* Información de página actual */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Mostrando {startIndex + 1} - {Math.min(endIndex, sales.length)} de {sales.length} ventas
            </div>
            <div className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </div>
          </div>

          {/* Tabla de ventas */}
          <div className="overflow-x-auto mb-6">
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
                {currentSales.map((sale) => (
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

          {/* Controles de paginación mejorados */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 flex-wrap">
              {/* Botón anterior */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg font-semibold ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                ← Anterior
              </button>

              {/* Números de página inteligentes */}
              <div className="flex space-x-1 flex-wrap">
                {getSmartPageNumbers(currentPage, totalPages).map((page, index) => {
                  // Si es puntos suspensivos
                  if (page === '...') {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="px-3 py-2 text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }

                  // Si es un número de página
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-lg font-semibold ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Botón siguiente */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg font-semibold ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SalesHistory;