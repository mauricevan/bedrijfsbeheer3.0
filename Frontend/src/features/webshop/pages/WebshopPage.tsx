import React, { useState, useMemo, useRef } from 'react';
import { Plus, Package, ShoppingBag, TrendingUp, Edit, Trash2, RefreshCw, Search } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { ExtendedSearchFilters } from '@/components/ExtendedSearchFilters';
import { useWebshop } from '../hooks/useWebshop';
import { ProductForm } from '../components/ProductForm';
import { CategoryForm } from '../components/CategoryForm';
import { applyExtendedFiltersToProducts } from '../utils/filters';
import type { WebshopProduct, WebshopCategory } from '../types/webshop.types';

export const WebshopPage: React.FC = () => {
  const {
    products,
    categories,
    orders,
    isLoading,
    createProduct,
    updateProduct,
    syncFromInventory,
    createCategory,
    updateCategory,
  } = useWebshop();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<WebshopProduct | null>(null);
  const [editingCategory, setEditingCategory] = useState<WebshopCategory | null>(null);
  const [showExtendedFilters, setShowExtendedFilters] = useState(false);
  const [extendedFilterValues, setExtendedFilterValues] = useState<Record<string, any>>({});
  const [selectedExtendedCategory, setSelectedExtendedCategory] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => {
        // Search in name
        if (p.name.toLowerCase().includes(query)) return true;
        // Search in SKU
        if (p.sku.toLowerCase().includes(query)) return true;
        // Search in description
        if (p.description?.toLowerCase().includes(query)) return true;
        // Search in category name
        if (p.categoryName?.toLowerCase().includes(query)) return true;
        // Search in price (as string)
        if (p.price.toString().includes(query)) return true;
        // Search in stock (as string)
        if (p.stock.toString().includes(query)) return true;
        // Search in tags
        if (p.tags?.some(tag => tag.toLowerCase().includes(query))) return true;
        return false;
      });
    }
    
    // Apply extended filters if any are set
    if (extendedFilterValues && Object.keys(extendedFilterValues).length > 0) {
      result = applyExtendedFiltersToProducts(result, extendedFilterValues, selectedExtendedCategory);
    }
    
    return result;
  }, [products, searchQuery, extendedFilterValues, selectedExtendedCategory]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.slug.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    const query = searchQuery.toLowerCase();
    return orders.filter(o =>
      o.orderNumber.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.customerEmail.toLowerCase().includes(query)
    );
  }, [orders, searchQuery]);

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrders = orders.filter(o =>
    o.status === 'pending' || o.status === 'processing' || o.status === 'shipped'
  ).length;

  const handleCreateProduct = async (data: any) => {
    await createProduct(data);
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleUpdateProduct = async (data: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
      setShowProductModal(false);
      setEditingProduct(null);
    }
  };

  const handleEditProduct = (product: WebshopProduct) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (_id: string) => {
    // TODO: Implement delete functionality when deleteProduct is available
  };

  const handleCreateCategory = async (data: any) => {
    await createCategory(data);
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleUpdateCategory = async (data: any) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
      setShowCategoryModal(false);
      setEditingCategory(null);
    }
  };

  const handleEditCategory = (category: WebshopCategory) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (_id: string) => {
    // TODO: Implement delete functionality when deleteCategory is available
  };

  const handleSyncFromInventory = async (inventoryItemId: string) => {
    await syncFromInventory(inventoryItemId);
  };

  const handleExtendedSearch = () => {
    setShowExtendedFilters(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Webshop Beheer</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Producten, categorieën en bestellingen</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleExtendedSearch}
            leftIcon={<Search className="h-4 w-4" />}
          >
            🔍 Uitgebreid zoeken
          </Button>
          {activeTab === 'products' && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => {
              setEditingProduct(null);
              setShowProductModal(true);
            }}>
              Nieuw Product
            </Button>
          )}
          {activeTab === 'categories' && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => {
              setEditingCategory(null);
              setShowCategoryModal(true);
            }}>
              Nieuwe Categorie
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Totaal Producten</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{products.length}</p>
            </div>
            <Package className="h-10 w-10 text-indigo-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Actieve Bestellingen</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeOrders}</p>
            </div>
            <ShoppingBag className="h-10 w-10 text-emerald-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Webshop Omzet</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">€{totalRevenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-emerald-500" />
          </div>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'products'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Producten ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Categorieën ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Bestellingen ({orders.length})
            </button>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
            <Input
              ref={searchInputRef}
              placeholder="Zoek producten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleExtendedSearch}
              leftIcon={<Search className="h-4 w-4" />}
              className="whitespace-nowrap bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600"
            >
              🔍 Uitgebreid zoeken
            </Button>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Alle Statussen</option>
              <option value="active">Actief</option>
              <option value="draft">Concept</option>
              <option value="archived">Gearchiveerd</option>
            </select>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg bg-primary text-white">▦</button>
              <button className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700">☰</button>
            </div>
          </div>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-3">
            {filteredProducts.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                Geen producten gevonden. Klik op "Nieuw Product" om te beginnen.
              </p>
            ) : (
              filteredProducts.map(product => (
                <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{product.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                          product.status === 'inactive' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                        }`}>
                          {product.status === 'active' ? 'Actief' : product.status === 'inactive' ? 'Inactief' : 'Concept'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">SKU: {product.sku}</p>
                      {product.categoryName && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Categorie: {product.categoryName}</p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Prijs: <span className="font-medium text-slate-900 dark:text-white">€{product.price.toFixed(2)}</span></span>
                        <span className="text-slate-600 dark:text-slate-400">Voorraad: <span className="font-medium text-slate-900 dark:text-white">{product.stock}</span></span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      {product.inventoryItemId && (
                        <button
                          onClick={() => handleSyncFromInventory(product.inventoryItemId!)}
                          className="p-2 text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400"
                          title="Synchroniseren"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                        title="Bewerken"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                        title="Verwijderen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-3">
            {filteredCategories.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                Geen categorieën gevonden. Klik op "Nieuwe Categorie" om te beginnen.
              </p>
            ) : (
              filteredCategories.map(category => (
                <Card key={category.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{category.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {category.status === 'active' ? 'Actief' : 'Inactief'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Slug: {category.slug}</p>
                      {category.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1 ml-4">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                        title="Bewerken"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                        title="Verwijderen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                Geen bestellingen gevonden.
              </p>
            ) : (
              filteredOrders.map(order => (
                <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{order.orderNumber}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                          order.status === 'processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                          order.status === 'cancelled' || order.status === 'refunded' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {order.status === 'pending' ? 'In Afwachting' :
                           order.status === 'processing' ? 'In Verwerking' :
                           order.status === 'shipped' ? 'Verzonden' :
                           order.status === 'delivered' ? 'Afgeleverd' :
                           order.status === 'cancelled' ? 'Geannuleerd' :
                           'Terugbetaald'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{order.customerName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('nl-NL')} - {order.items.length} artikelen
                      </p>
                      {order.trackingNumber && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Tracking: {order.trackingNumber}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">€{order.total.toFixed(2)}</p>
                      <p className={`text-xs ${
                        order.paymentStatus === 'paid' ? 'text-emerald-600 dark:text-emerald-400' :
                        order.paymentStatus === 'failed' ? 'text-red-600 dark:text-red-400' :
                        'text-amber-600 dark:text-amber-400'
                      }`}>
                        {order.paymentStatus === 'paid' ? 'Betaald' :
                         order.paymentStatus === 'failed' ? 'Mislukt' :
                         order.paymentStatus === 'refunded' ? 'Terugbetaald' :
                         'In Afwachting'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Product Bewerken' : 'Nieuw Product'}
        className="max-w-3xl"
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Categorie Bewerken' : 'Nieuwe Categorie'}
        className="max-w-2xl"
      >
        <CategoryForm
          category={editingCategory}
          categories={categories}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          onCancel={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
        />
      </Modal>

      {/* Extended Search Filters */}
      <ExtendedSearchFilters
        isOpen={showExtendedFilters}
        onClose={() => {
          setShowExtendedFilters(false);
          // Optionally clear filters when closing
          // setExtendedFilterValues({});
          // setSelectedExtendedCategory(null);
        }}
        onApplyFilters={(filters, categoryId) => {
          setExtendedFilterValues(filters);
          setSelectedExtendedCategory(categoryId);
          setShowExtendedFilters(false);
        }}
      />
    </div>
  );
};
