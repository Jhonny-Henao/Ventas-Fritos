import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
// Importar los componentes (cuando los separas en archivos)
import PriceConfig from './components/PriceConfig';
import SaleForm from './components/SaleForm';
import SalesHistory from './components/SalesHistory';

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

  // Cargar datos del localStorage al iniciar
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

  // Guardar productos cuando cambien
  useEffect(() => {
    localStorage.setItem('fritos-products', JSON.stringify(products));
  }, [products]);

  // Guardar ventas cuando cambien
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
    
    // Actualizar precio en la venta actual
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
    return sales.reduce((total, sale) => total + sale.total, 0);
  };

  const addSale = () => {
    if (!currentSale.customerName.trim()) {
      alert('Por favor ingresa el nombre del cliente');
      return;
    }

    const hasItems = currentSale.items.some(item => item.quantity > 0);
    if (!hasItems) {
      alert('Por favor ingresa al menos un producto');
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
    
    // Resetear venta actual
    setCurrentSale({
      customerName: '',
      items: [
        { product: 'Arepas', quantity: 0, price: products[0].price },
        { product: 'Empanadas', quantity: 0, price: products[1].price },
        { product: 'Papas', quantity: 0, price: products[2].price },
        { product: 'Pasteles', quantity: 0, price: products[3].price }
      ]
    });
  };

  const deleteSale = (saleId) => {
    if (confirm('¿Estás segura de eliminar esta venta?')) {
      setSales(sales.filter(sale => sale.id !== saleId));
    }
  };

  const clearAllData = () => {
    if (confirm('¿Estás segura de borrar todos los datos? Esta acción no se puede deshacer.')) {
      setSales([]);
      setProducts([
        { name: 'Arepas', price: 0 },
        { name: 'Empanadas', price: 0 },
        { name: 'Papas', price: 0 },
        { name: 'Pasteles', price: 0 }
      ]);
      localStorage.removeItem('fritos-products');
      localStorage.removeItem('fritos-sales');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Mejorado */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-orange-800 mb-4">🍟 Ventas de Fritos</h1>
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-4xl font-bold mb-2">
              💰 Total del Día: ${getTotalSales().toLocaleString('es-CO')}
            </div>
            <div className="text-lg">
              📊 {sales.length} ventas realizadas
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