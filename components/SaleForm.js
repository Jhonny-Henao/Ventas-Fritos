import React, { useState, useEffect } from 'react';
import { Trash2, Save, FileText, Plus, Download } from 'lucide-react';
import Swal from 'sweetalert2';

const SaleForm = ({ currentSale, setCurrentSale, products, addSale, getCurrentSaleTotal, onLoadTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showTemplatesList, setShowTemplatesList] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateSales, setTemplateSales] = useState([]); // Para acumular ventas de la plantilla

  // Cargar plantillas del localStorage al iniciar
  useEffect(() => {
    const savedTemplates = localStorage.getItem('fritos-templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  // Guardar plantillas cuando cambien
  useEffect(() => {
    localStorage.setItem('fritos-templates', JSON.stringify(templates));
  }, [templates]);

  const updateQuantity = (productName, quantity) => {
    const product = products.find(p => p.name === productName);
    const updatedItems = currentSale.items.map(item =>
      item.product === productName
        ? { ...item, quantity: parseInt(quantity) || 0, price: product.price }
        : item
    );
    setCurrentSale({ ...currentSale, items: updatedItems });
  };

  // Función para agregar venta a la plantilla en construcción
  const addSaleToTemplate = () => {
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

    setTemplateSales([...templateSales, newSale]);
    addSale();
  };

  // Función para guardar la plantilla final
  const saveTemplate = () => {
    if (!templateName.trim()) {
      Swal.fire('⚠️ Atención', 'Por favor ingresa un nombre para la plantilla', 'warning');
      return;
    }

    if (templateSales.length === 0) {
      Swal.fire('⚠️ Atención', 'Por favor agrega al menos una venta a la plantilla', 'warning');
      return;
    }

    const consolidatedItems = {};
    let totalAmount = 0;

    templateSales.forEach(sale => {
      sale.items.forEach(item => {
        if (consolidatedItems[item.product]) {
          consolidatedItems[item.product].quantity += item.quantity;
          consolidatedItems[item.product].totalValue += (item.quantity * item.price);
        } else {
          consolidatedItems[item.product] = {
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            totalValue: item.quantity * item.price
          };
        }
      });
      totalAmount += sale.total;
    });

    const newTemplate = {
      id: Date.now(),
      name: templateName.trim(),
      sales: templateSales,
      consolidatedItems: Object.values(consolidatedItems),
      totalSales: templateSales.length,
      totalAmount: totalAmount,
      createdDate: new Date().toLocaleString('es-CO')
    };

    setTemplates([...templates, newTemplate]);

    setTemplateName('');
    setTemplateSales([]);
    setShowCreateTemplate(false);

    Swal.fire('✅ Éxito', `Plantilla "${newTemplate.name}" guardada exitosamente con ${newTemplate.totalSales} ventas!`, 'success');
  };

  // Cargar plantilla
  const loadTemplate = (template) => {
    const resetItems = currentSale.items.map(item => ({
      ...item,
      quantity: 0
    }));

    const updatedItems = resetItems.map(item => {
      const templateItem = template.consolidatedItems.find(tItem => tItem.product === item.product);
      return templateItem
        ? { ...item, quantity: templateItem.quantity, price: item.price }
        : item;
    });

    setCurrentSale({
      ...currentSale,
      items: updatedItems
    });

    if (onLoadTemplate) {
      onLoadTemplate(template);
    }

    setShowTemplatesList(false);
  };

  // Eliminar plantilla con confirmación SweetAlert
  const deleteTemplate = (templateId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la plantilla permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setTemplates(templates.filter(template => template.id !== templateId));
        Swal.fire('Eliminada', 'La plantilla ha sido eliminada correctamente', 'success');
      }
    });
  };

  const getTemplateTotalAmount = () => {
    return templateSales.reduce((total, sale) => total + sale.total, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          ➕ Nueva Venta
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateTemplate(!showCreateTemplate)}
            className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold py-2 px-3 rounded transition duration-200"
          >
            <Plus size={16} />
            Plantilla
          </button>
          <button
            onClick={() => setShowTemplatesList(!showTemplatesList)}
            className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-2 px-3 rounded transition duration-200"
          >
            <FileText size={16} />
            Ver
          </button>
        </div>
      </div>

      {/* Sección de creación de plantilla */}
      {showCreateTemplate && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
            <Save size={18} />
            Crear Plantilla de Múltiples Ventas
          </h3>
          
          <div className="mb-3">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white placeholder-gray-500"
              placeholder="Nombre de la plantilla (Ej: Pedidos del Día)"
              maxLength={50}
            />
          </div>

          {/* Estado actual de la plantilla */}
          <div className="bg-white rounded-md p-3 border border-purple-200 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-purple-700">
                📊 Plantilla en construcción:
              </span>
              <span className="text-sm text-gray-600">
                {templateSales.length} ventas
              </span>
            </div>
            
            {templateSales.length > 0 ? (
              <div className="space-y-1">
                <div className="text-sm font-bold text-purple-600">
                  Total acumulado: ${getTemplateTotalAmount().toLocaleString('es-CO')}
                </div>
                <div className="text-xs text-gray-600">
                  Última venta: {templateSales[templateSales.length - 1]?.customerName}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Realiza ventas y agrégalas a la plantilla
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveTemplate}
              disabled={templateSales.length === 0 || !templateName.trim()}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Guardar Plantilla
            </button>
            <button
              onClick={() => {
                setShowCreateTemplate(false);
                setTemplateName('');
                setTemplateSales([]);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de plantillas */}
      {showTemplatesList && (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
          <h3 className="font-bold text-indigo-800 mb-3 flex items-center gap-2">
            <FileText size={18} />
            Plantillas Guardadas ({templates.length})
          </h3>
          
          {templates.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No hay plantillas guardadas
            </p>
          ) : (
            <div className="space-y-2">
              {templates.map(template => (
                <div key={template.id} className="bg-white rounded-md p-3 border border-indigo-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-indigo-800 mb-1">{template.name}</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{template.totalSales} ventas • ${template.totalAmount.toLocaleString('es-CO')}</div>
                        <div>Creada: {template.createdDate}</div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => loadTemplate(template)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-2 rounded transition duration-200 flex items-center gap-1"
                        title="Cargar plantilla en el header"
                      >
                        <Download size={12} />
                        Cargar
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="text-red-500 hover:text-red-700 text-xs transition-colors"
                        title="Eliminar plantilla"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Nombre del Cliente */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          👤 Nombre del Cliente
        </label>
        <input
          type="text"
          value={currentSale.customerName}
          onChange={(e) => setCurrentSale({...currentSale, customerName: e.target.value})}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium bg-white placeholder-gray-500"
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
                className="w-20 px-3 py-2 border-2 border-gray-300 rounded-md text-center font-bold text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

      {/* Botones de acción */}
      {showCreateTemplate ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={addSaleToTemplate}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Agregar a Plantilla
          </button>
          <button
            onClick={addSale}
            className="bg-green-400 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-lg"
          >
            Registrar Venta
          </button>
        </div>
      ) : (
        <button
          onClick={addSale}
          className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-lg"
        >
          Registrar Venta
        </button>
      )}
    </div>
  );
};

export default SaleForm;