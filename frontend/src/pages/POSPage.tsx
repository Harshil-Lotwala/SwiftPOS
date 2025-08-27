import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  price: string;
  stock_quantity: number;
  sku: string;
  category_name: string;
  barcode?: string;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Transaction {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  timestamp: string;
  payment_method: string;
}

const POSPage: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'pos' | 'history'>('pos');

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    document.title = '🏪 Point of Sale - SwiftPOS';
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock_quantity) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        toast.success(`Added ${product.name} to cart`);
      } else {
        toast.error('Not enough stock available');
      }
    } else {
      if (product.stock_quantity > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
        toast.success(`Added ${product.name} to cart`);
      } else {
        toast.error('Product is out of stock');
      }
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && quantity <= product.stock_quantity) {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    } else {
      toast.error('Not enough stock available');
    }
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.0875; // 8.75% tax
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const processPayment = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call for transaction processing
      const transactionData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: parseFloat(item.price),
          total_price: parseFloat(item.price) * item.quantity
        })),
        subtotal: getSubtotal(),
        tax_amount: getTax(),
        total_amount: getTotal(),
        payment_method: 'cash' // For demo purposes
      };

      // Create transaction record
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: parseFloat(item.price),
          total: parseFloat(item.price) * item.quantity
        })),
        subtotal: getSubtotal(),
        tax: getTax(),
        total: getTotal(),
        timestamp: new Date().toISOString(),
        payment_method: 'cash'
      };
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to transaction history
      setTransactions(prev => [newTransaction, ...prev]);
      
      // In a real app, you would send this to your API:
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(transactionData)
      // });

      toast.success('🎉 Payment processed successfully!', { duration: 3000 });
      setCart([]);
      
      // Refresh products to update stock quantities
      fetchProducts();
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.barcode && product.barcode.includes(searchTerm));
    
    const matchesCategory = selectedCategory === 'all' || 
                           product.category_name.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category_name)))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading SwiftPOS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg">
              <h1 className="text-2xl font-bold">⚡ SwiftPOS</h1>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">Welcome back, {user?.first_name}!</p>
              <p className="text-xs">Store ID: {user?.store_id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right text-sm">
              <p className="font-semibold text-gray-900">Current Time</p>
              <p className="text-gray-600">{new Date().toLocaleTimeString()}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('pos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏪 Point of Sale
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>📋 Transaction History</span>
              {transactions.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {transactions.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'pos' ? (
          <>
            {/* Products Section */}
            <div className="flex-1 flex flex-col p-6">
              {/* Search and Filters */}
              <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search products by name, SKU, or barcode..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? '📦 All Categories' : `📂 ${category}`}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-200 group"
                onClick={() => addToCart(product)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{product.category_name}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-green-600">${product.price}</span>
                    <span className="text-xs text-gray-400">SKU: {product.sku}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock_quantity > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.stock_quantity > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Stock: {product.stock_quantity}
                    </span>
                    <span className="text-xs text-blue-600 group-hover:text-blue-800 font-medium">
                      Click to add
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">🛒 Current Order</h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{cart.length} items</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500 text-lg font-medium">Cart is empty</p>
                <p className="text-gray-400 text-sm mt-1">Click on products to add them</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">${item.price} each</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-lg text-gray-900">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (8.75%):</span>
                  <span className="font-semibold">${getTax().toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-green-600">${getTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={processPayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    <span>Process Payment</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
          </>
        ) : (
          /* Transaction History Section */
          <div className="flex-1 flex flex-col p-6">
            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 Transaction History</h2>
              <p className="text-gray-600">
                {transactions.length === 0 
                  ? "No transactions yet. Complete a sale to see history here."
                  : `Total ${transactions.length} transaction${transactions.length === 1 ? '' : 's'}`
                }
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-500 text-lg font-medium mb-2">No transactions yet</p>
                  <p className="text-gray-400 text-sm mb-6">Process your first sale to see transaction history here</p>
                  <button
                    onClick={() => setActiveTab('pos')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Go to Point of Sale
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            Transaction #{transaction.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ${transaction.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {transaction.payment_method}
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Items Purchased:</h4>
                        <div className="space-y-2">
                          {transaction.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  ${item.price.toFixed(2)} × {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                ${item.total.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t mt-4 pt-4 space-y-2">
                          <div className="flex justify-between text-gray-700">
                            <span>Subtotal:</span>
                            <span>${transaction.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Tax:</span>
                            <span>${transaction.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>Total:</span>
                            <span className="text-green-600">${transaction.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSPage;
