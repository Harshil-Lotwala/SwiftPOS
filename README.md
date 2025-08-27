# SwiftPOS - Modern Point of Sale System

A comprehensive, modern POS system built with React, Node.js, and MySQL. Designed to be hardware-agnostic with support for various POS peripherals.

## 🚀 Features

### Core POS Functionality
- **Product Catalog Management** - Add, edit, and organize products with categories
- **Real-time Transaction Processing** - Fast checkout with multiple payment methods
- **Inventory Management** - Track stock levels with automated alerts
- **Receipt Generation** - Digital and print receipt support
- **Multi-user Support** - Role-based access control (Admin, Cashier, Manager)

### Hardware Support (Default Configurations)
- **Card Readers** - Support for major card reader APIs
- **Receipt Printers** - ESC/POS compatible thermal printers
- **Cash Drawers** - Standard RJ11/RJ45 connected drawers
- **Barcode Scanners** - USB and wireless scanner support
- **Customer Displays** - Pole displays and customer-facing screens

### Advanced Features
- **Real-time Dashboard** - Sales analytics and reporting
- **Customer Management** - Customer profiles and purchase history
- **Discount & Promotions** - Flexible pricing and discount rules
- **Multi-location Support** - Centralized management for multiple stores
- **Cloud Sync** - Real-time data synchronization
- **Offline Mode** - Continue operations during network outages

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL 8.0
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Payment Processing**: Stripe API (configurable for other providers)
- **Hardware Integration**: Node-USB, SerialPort, ESC/POS

## 📁 Project Structure

```
SwiftPOS/
├── frontend/          # React frontend application
├── backend/           # Node.js API server
├── database/          # MySQL schemas and migrations
├── config/            # Hardware and system configurations
├── docs/              # Documentation and API specs
└── README.md
```

## 🚀 Quick Start

1. **Clone and Setup**
   ```bash
   cd ~/Desktop/SwiftPOS
   # Setup backend
   cd backend && npm install
   # Setup frontend
   cd ../frontend && npm install
   ```

2. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p < database/schema.sql
   ```

3. **Environment Configuration**
   ```bash
   # Copy example environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. **Start Development**
   ```bash
   # Start backend (Terminal 1)
   cd backend && npm run dev
   
   # Start frontend (Terminal 2)
   cd frontend && npm start
   ```

## 🎯 Usage

1. **Access the System**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - API: http://localhost:5000/api

2. **Default Login**
   - Username: `admin`
   - Password: `admin123`

## 🔧 Hardware Configuration

The system includes default configurations for popular POS hardware:

- **Card Readers**: Square, PayPal Here, SumUp
- **Printers**: Star Micronics, Epson TM series, Zebra
- **Scanners**: Honeywell, Datalogic, Code CR series
- **Cash Drawers**: APG, M-S Cash Drawer, POS-X

## 📊 Screenshots

Coming soon...

## 🤝 Contributing

This is a personal project, but feel free to suggest improvements!

## 📄 License

MIT License - See LICENSE file for details

---

**Built by Harshil** - A modern POS solution for the digital age
