export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'cashier';
  store_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category_id?: number;
  category_name?: string;
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
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
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

export type PaymentMethod = 'cash' | 'card' | 'digital_wallet' | 'check' | 'store_credit';

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
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_reference?: string;
  cash_received: number;
  change_given: number;
  notes?: string;
  receipt_printed: boolean;
  is_refunded: boolean;
  refund_reason?: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

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
