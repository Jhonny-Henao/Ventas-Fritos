import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Importar los componentes
import PriceConfig from '../components/PriceConfig';
import SaleForm from '../components/SaleForm';
import SalesHistory from '../components/SalesHistory';

// Componente Principal
const FritosSalesApp = () => {
  const [products, setProducts] = useState([
    { name: 'Arepas', price: 0 },
    { name: 'Empanadas', price: 0 },
    { name: 'Papas', price: 0 },
    { name: 'Pasteles', price: 0 }
  ]);
  
  const [sales, setSales] = useState([]);
  const [currentSale, setCurrentSale] = useState({
    customerName: '',
    items: [
      { product: 'Arepas', quantity: 0, price: 0 },
      { product: 'Empanadas', quantity: 0, price: 0 },
      { product: 'Papas', quantity: 0, price: 0 },
      { product: 'Pasteles', quantity: 0, price: 0 }
    ]
  });

  const [loadedTemplate, setLoadedTemplate] = useState(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem('fritos-products');
    const savedSales = localStorage.getItem('fritos-sales');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fritos-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('fritos-sales', JSON.stringify(sales));
  }, [sales]);

  const updateProductPrice = (productName, price) => {
    const updatedProducts = products.map(product => 
      product.name === productName 
        ? { ...product, price: parseFloat(price) || 0 }
        : product
    );
    setProducts(updatedProducts);
    
    const updatedItems = currentSale.items.map(item =>
      item.product === productName
        ? { ...item, price: parseFloat(price) || 0 }
        : item
    );
    setCurrentSale({ ...currentSale, items: updatedItems });
  };

  const getCurrentSaleTotal = () => {
    return currentSale.items.reduce((total, item) => 
      total + (item.quantity * item.price), 0
    );
  };

  const getTotalSales = () => {
    if (loadedTemplate) {
      return loadedTemplate.totalAmount;
    }
    return sales.reduce((total, sale) => total + sale.total, 0);
  };

  const getProductsSold = () => {
    const productTotals = { Arepas: 0, Empanadas: 0, Papas: 0, Pasteles: 0 };

    if (loadedTemplate) {
      loadedTemplate.consolidatedItems.forEach(item => {
        if (productTotals.hasOwnProperty(item.product)) {
          productTotals[item.product] = item.quantity;
        }
      });
    } else {
      sales.forEach(sale => {
        sale.items.forEach(item => {
          if (productTotals.hasOwnProperty(item.product)) {
            productTotals[item.product] += item.quantity;
          }
        });
      });
    }

    return productTotals;
  };

  const handleLoadTemplate = (template) => {
    setLoadedTemplate(template);
  };

  const clearLoadedTemplate = () => {
    setLoadedTemplate(null);
  };

  const getSalesCount = () => {
    if (loadedTemplate) {
      return loadedTemplate.totalSales;
    }
    return sales.length;
  };

  // 🚀 MODIFICADO con SweetAlert2
  const addSale = () => {
    if (!currentSale.customerName.trim()) {
      Swal.fire('⚠️ Atención', 'Por favor ingresa el nombre del cliente', 'warning');
      return;
    }

    const hasItems = currentSale.items.some(item => item.quantity > 0);
    if (!hasItems) {
      Swal.fire('⚠️ Atención', 'Por favor ingresa al menos un producto', 'warning');
      return;
    }

    const newSale = {
      id: Date.now(),
      customerName: currentSale.customerName,
      items: currentSale.items.filter(item => item.quantity > 0),
      total: getCurrentSaleTotal(),
      date: new Date().toLocaleString('es-CO')
    };

    setSales([...sales, newSale]);

    setCurrentSale({
      customerName: '',
      items: [
        { product: 'Arepas', quantity: 0, price: products[0].price },
        { product: 'Empanadas', quantity: 0, price: products[1].price },
        { product: 'Papas', quantity: 0, price: products[2].price },
        { product: 'Pasteles', quantity: 0, price: products[3].price }
      ]
    });

    if (loadedTemplate) {
      setLoadedTemplate(null);
    }

    Swal.fire('✅ Venta guardada', 'La venta se registró correctamente', 'success');
  };

  // 🚀 MODIFICADO con SweetAlert2
  const deleteSale = (saleId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta venta será eliminada permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        setSales(sales.filter(sale => sale.id !== saleId));
        Swal.fire('Eliminada', 'La venta fue eliminada con éxito', 'success');
      }
    });
  };

  // 🚀 MODIFICADO con SweetAlert2
  const clearAllData = () => {
    Swal.fire({
      title: '¿Borrar todos los datos?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        setSales([]);
        setProducts([
          { name: 'Arepas', price: 0 },
          { name: 'Empanadas', price: 0 },
          { name: 'Papas', price: 0 },
          { name: 'Pasteles', price: 0 }
        ]);
        localStorage.removeItem('fritos-products');
        localStorage.removeItem('fritos-sales');
        setLoadedTemplate(null);
        Swal.fire('Datos borrados', 'Toda la información ha sido eliminada', 'success');
      }
    });
  };

  const productsSold = getProductsSold();

  const productCosts = {
  Arepas: 3000,
  Empanadas: 2300,
  Papas: 2300,
  Pasteles: 2500
};


const getCostsAndProfits = () => {
  let totalCost = 0;
  let totalProfit = 0;

  Object.keys(productsSold).forEach(product => {
    const soldQty = productsSold[product];
    const salePrice = products.find(p => p.name === product)?.price || 0;
    const costPrice = productCosts[product] || 0;

    totalCost += soldQty * costPrice;
    totalProfit += soldQty * (salePrice - costPrice);
  });

  return { totalCost, totalProfit };
};

const { totalCost, totalProfit } = getCostsAndProfits();


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Profesional */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            <span> 🥟 </span>
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Fritos
            </span>
            <span> 🥔</span>
          </h1>

          {/* Card Principal con Animaciones */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
            {/* Header del Card */}
            <div className={`${loadedTemplate ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gradient-to-r from-sky-300 to-sky-500'} text-white p-8 relative`}>
              {/* NUEVO: Indicador de plantilla cargada */}
              {loadedTemplate && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    📋 Plantilla: {loadedTemplate.name}
                  </span>
                  <button
                    onClick={clearLoadedTemplate}
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors"
                    title="Volver a datos actuales"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="text-5xl font-bold mb-4 transform transition-transform duration-300 hover:scale-110">
                💰 ${getTotalSales().toLocaleString('es-CO')}
              </div>
              <div className="text-xl opacity-90 mb-2">
                {loadedTemplate ? `Total de la Plantilla "${loadedTemplate.name}"` : 'Total de Ventas del Día'}
              </div>
              <div className="text-lg opacity-75 flex items-center justify-center gap-2">
                <span className={`inline-block w-2 h-2 ${loadedTemplate ? 'bg-purple-200' : 'bg-green-400'} rounded-full animate-pulse`}></span>
                {getSalesCount()} {loadedTemplate ? 'ventas en plantilla' : 'ventas realizadas'}
              </div>
              
              {/* NUEVO: Información adicional para plantillas */}
              {loadedTemplate && (
                <div className="text-sm opacity-70 mt-2">
                  Creada el: {loadedTemplate.createdDate}
                </div>
              )}
            </div>

            {/* Sección de Totales y Ganancias */}
            <div className="p-8 bg-gradient-to-br from-white to-slate-50 mt-8">
              <div className="text-2xl font-bold text-slate-700 mb-6 text-center">
                💵 Resumen Financiero
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total a Pagar */}
                <div className="group bg-white rounded-xl border-2 border-red-100 hover:border-red-300 hover:bg-red-50 p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="text-center">
                    <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
                      💸
                    </div>
                    <div className="text-slate-600 font-semibold mb-2">Total a Pagar</div>
                    <div className="text-3xl font-bold text-red-600 transform transition-all duration-300 group-hover:scale-110">
                      ${totalCost.toLocaleString('es-CO')}
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transform transition-all duration-1000 group-hover:translate-x-full"></div>
                  </div>
                </div>

                  {/* Ganancias */}
                  <div className="group bg-white rounded-xl border-2 border-green-100 hover:border-green-300 hover:bg-green-50 p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    <div className="text-center">
                      <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
                        📈
                      </div>
                      <div className="text-slate-600 font-semibold mb-2">Ganancias</div>
                      <div className="text-3xl font-bold text-green-600 transform transition-all duration-300 group-hover:scale-110">
                        ${totalProfit.toLocaleString('es-CO')}
                      </div>
                    </div>
                    <div className="mt-4 h-1 bg-green-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transform transition-all duration-1000 group-hover:translate-x-full"></div>
                    </div>
                  </div>
                </div>
              </div>


            {/* Sección de Productos Vendidos */}
            <div className="p-8 bg-gradient-to-br from-white to-slate-50">
              <div className="text-2xl font-bold text-slate-700 mb-6 text-center">
                📈 {loadedTemplate ? 'Resumen de la Plantilla' : 'Resumen de Productos'}
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Arepas */}
                <div className={`group bg-white rounded-xl border-2 ${loadedTemplate ? 'border-purple-100 hover:border-purple-300 hover:bg-purple-50' : 'border-blue-100 hover:border-blue-300 hover:bg-blue-50'} p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}>
                  <div className="text-center">
                    <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                      🫓
                    </div>
                    <div className="text-slate-600 font-semibold mb-2">Arepas</div>
                    <div className={`text-3xl font-bold ${loadedTemplate ? 'text-purple-600' : 'text-blue-600'} transform transition-all duration-300 group-hover:scale-110`}>
                      {productsSold.Arepas}
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className={`h-full ${loadedTemplate ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'} rounded-full transform transition-all duration-1000 group-hover:translate-x-full`}></div>
                  </div>
                </div>

                {/* Empanadas */}
                <div className={`group bg-white rounded-xl border-2 ${loadedTemplate ? 'border-purple-100 hover:border-purple-300 hover:bg-purple-50' : 'border-amber-100 hover:border-amber-300 hover:bg-amber-50'} p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}>
                  <div className="text-center">
                    <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                      🥟
                    </div>
                    <div className="text-slate-600 font-semibold mb-2">Empanadas</div>
                    <div className={`text-3xl font-bold ${loadedTemplate ? 'text-purple-600' : 'text-amber-600'} transform transition-all duration-300 group-hover:scale-110`}>
                      {productsSold.Empanadas}
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-amber-100 rounded-full overflow-hidden">
                    <div className={`h-full ${loadedTemplate ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gradient-to-r from-amber-400 to-amber-600'} rounded-full transform transition-all duration-1000 group-hover:translate-x-full`}></div>
                  </div>
                </div>

                {/* Papas */}
                <div className={`group bg-white rounded-xl border-2 ${loadedTemplate ? 'border-purple-100 hover:border-purple-300 hover:bg-purple-50' : 'border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50'} p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}>
                  <div className="text-center">
                    <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                      🥔
                    </div>
                    <div className="text-slate-600 font-semibold mb-2">Papas</div>
                    <div className={`text-3xl font-bold ${loadedTemplate ? 'text-purple-600' : 'text-emerald-600'} transform transition-all duration-300 group-hover:scale-110`}>
                      {productsSold.Papas}
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-emerald-100 rounded-full overflow-hidden">
                    <div className={`h-full ${loadedTemplate ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'} rounded-full transform transition-all duration-1000 group-hover:translate-x-full`}></div>
                  </div>
                </div>

                {/* Pasteles */}
                <div className={`group bg-white rounded-xl border-2 ${loadedTemplate ? 'border-purple-100 hover:border-purple-300 hover:bg-purple-50' : 'border-rose-100 hover:border-purple-300 hover:bg-rose-50'} p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}>
                  <div className="text-center">
                    <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                      🍗
                    </div>
                    <div className="text-slate-600 font-semibold mb-2">Pasteles</div>
                    <div className={`text-3xl font-bold ${loadedTemplate ? 'text-purple-600' : 'text-purple-600'} transform transition-all duration-300 group-hover:scale-110`}>
                      {productsSold.Pasteles}
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-purple-100 rounded-full overflow-hidden">
                    <div className={`h-full ${loadedTemplate ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gradient-to-r from-purple-400 to-purple-600'} rounded-full transform transition-all duration-1000 group-hover:translate-x-full`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <PriceConfig 
            products={products}
            updateProductPrice={updateProductPrice}
          />
          
          <SaleForm
            currentSale={currentSale}
            setCurrentSale={setCurrentSale}
            products={products}
            addSale={addSale}
            getCurrentSaleTotal={getCurrentSaleTotal}
            onLoadTemplate={handleLoadTemplate}
          />
        </div>

        <SalesHistory
          sales={sales}
          deleteSale={deleteSale}
          clearAllData={clearAllData}
          getTotalSales={getTotalSales}
        />
      </div>
    </div>
  );
};

export default FritosSalesApp;