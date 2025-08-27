// User and Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'cashier';
  store_id: number;
  pin?: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
  refreshToken: string;
}

// Store Types
export interface Store {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  tax_rate: number;
  currency: string;
  timezone: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Customer Types
export interface Customer {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  total_purchases: number;
  loyalty_points: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Product Types
export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category_id?: number;
  barcode?: string;
  price: number;
  cost: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  unit: string;
  tax_rate: number;
  is_active: boolean;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductWithCategory extends Product {
  category_name?: string;
}

// Transaction Types
export type PaymentMethod = 'cash' | 'card' | 'digital_wallet' | 'check' | 'store_credit';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Transaction {
  id: number;
  transaction_number: string;
  store_id: number;
  user_id: number;
  customer_id?: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_reference?: string;
  cash_received: number;
  change_given: number;
  notes?: string;
  receipt_printed: boolean;
  is_refunded: boolean;
  refund_reason?: string;
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TransactionItem {
  id: number;
  transaction_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  total_price: number;
  created_at: Date;
}

export interface TransactionWithItems extends Transaction {
  items: TransactionItemWithProduct[];
  customer?: Customer;
  user?: Omit<User, 'password_hash'>;
}

export interface TransactionItemWithProduct extends TransactionItem {
  product: Product;
}

// Cart Types
export interface CartItem {
  product_id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
}

// Inventory Types
export type InventoryChangeType = 'stock_in' | 'stock_out' | 'adjustment' | 'sale' | 'return';

export interface InventoryLog {
  id: number;
  product_id: number;
  user_id?: number;
  change_type: InventoryChangeType;
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  notes?: string;
  reference_id?: number;
  created_at: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Query Types
export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
}

// Dashboard/Analytics Types
export interface SalesSummary {
  today: {
    sales: number;
    transactions: number;
    average_transaction: number;
  };
  this_week: {
    sales: number;
    transactions: number;
    average_transaction: number;
  };
  this_month: {
    sales: number;
    transactions: number;
    average_transaction: number;
  };
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

export interface LowStockProduct {
  id: number;
  sku: string;
  name: string;
  stock_quantity: number;
  min_stock_level: number;
  category_name?: string;
}

// Hardware Types
export interface HardwareStatus {
  printer: {
    connected: boolean;
    status: string;
    model?: string;
  };
  cash_drawer: {
    connected: boolean;
    status: string;
  };
  card_reader: {
    connected: boolean;
    status: string;
    model?: string;
  };
  barcode_scanner: {
    connected: boolean;
    status: string;
    model?: string;
  };
}

// Receipt Types
export interface ReceiptData {
  transaction: TransactionWithItems;
  store: Store;
  receipt_number: string;
  print_timestamp: Date;
  reprint?: boolean;
}

// Error Types
export interface ApiError extends Error {
  statusCode: number;
  code?: string;
}

// Middleware Types
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Validation Schema Types
export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  category_id?: number;
  barcode?: string;
  price: number;
  cost?: number;
  stock_quantity?: number;
  min_stock_level?: number;
  max_stock_level?: number;
  unit?: string;
  tax_rate?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface CreateTransactionRequest {
  customer_id?: number;
  items: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
    discount_amount?: number;
  }>;
  payment_method: PaymentMethod;
  cash_received?: number;
  payment_reference?: string;
  notes?: string;
}

export interface CreateCustomerRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
}
