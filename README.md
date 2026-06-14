# Vyro - Seller Dashboard

A powerful mobile seller dashboard application built with React Native and Expo SDK 54. Manage sales, products, clients, and track business performance with an intuitive interface.

## 📱 Features

### Core Functionality

- **Dashboard**: Real-time KPIs, revenue charts, top products, and recent sales
- **Sales Management**: Create, edit, delete, and track sales with status (paid/pending/cancelled)
- **Product Management**: Full CRUD operations with stock tracking and color coding
- **Client Management**: Manage client information with purchase history
- **Multi-language Support**: Portuguese, English, and Spanish (Argentinian)
- **Multi-currency Support**: BRL, USD, and ARS

### Advanced Features

- **Stock Management**: Automatic stock reduction for paid and pending orders (configurable)
- **Pay Later Option**: Reserve stock for pending orders or keep stock available
- **Data Import/Export**: Excel file support for data migration
- **Large Number Formatting**: Automatic K/M/B formatting for large numbers (1.5K, 2.3M, 1.2B)
- **Dark Theme**: Modern dark interface optimized for mobile
- **Responsive Design**: Works on both iOS and Android

## 🚀 Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Storage**: AsyncStorage
- **File Operations**: Expo FileSystem, DocumentPicker, Sharing
- **Excel Processing**: SheetJS (xlsx)
- **Phone Number**: libphonenumber-js
- **Icons**: Lucide React Native
- **Navigation**: Custom tab navigation

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Step 1: Clone the repository

```bash
git clone https://github.com/AlexandreDresch/Vyro.git
cd vyro
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start the app

```bash
npx expo start
```

## 🏗️ Project Structure

```text
vyro/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── button-row.tsx
│   │   │   ├── field.tsx
│   │   │   ├── kpi-card.tsx
│   │   │   ├── list-item.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── phone-input.tsx
│   │   │   └── stock-bar.tsx
│   │   ├── modals/          # Modal components
│   │   │   ├── add-client-modal.tsx
│   │   │   ├── add-product-modal.tsx
│   │   │   ├── add-sale-modal.tsx
│   │   │   ├── client-detail-modal.tsx
│   │   │   ├── edit-client-modal.tsx
│   │   │   ├── edit-product-modal.tsx
│   │   │   ├── edit-sale-modal.tsx
│   │   │   ├── io-modal.tsx
│   │   │   ├── product-detail-modal.tsx
│   │   │   └── sale-detail-modal.tsx
│   │   └── navigation/      # Navigation components
│   │       ├── app-navigator.tsx
│   │       └── tab-bar.tsx
│   ├── screens/             # Main screens
│   │   ├── dashboard-screen.tsx
│   │   ├── sales-screen.tsx
│   │   ├── products-screen.tsx
│   │   ├── clients-screen.tsx
│   │   └── setup-screen.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── use-database.ts
│   │   └── use-translation.ts
│   ├── i18n/               # Internationalization
│   │   └── translations.ts
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── seed-data.ts
│   │   └── storage.ts
│   └── styles/             # Global styles
│       └── global-styles.ts
├── assets/                 # Images and fonts
├── app.json               # Expo configuration
├── package.json
└── tsconfig.json
```

## 🎯 Key Features Explained

### Stock Behavior

When creating a sale, you can choose between two stock management strategies:

- **Reserve Stock**: Pending orders reduce stock (reserve inventory for pay-later customers)
- **Don't Reserve Stock**: Pending orders don't affect stock (manual stock management)

Configure this during app setup.

### Multi-language & Currency

- Select your preferred language during first launch
- Currency formatting automatically adapts to your selection
- All UI text, dates, and numbers are localized

### Data Management

- **Export**: Export all sales, products, and clients to Excel
- **Import**: Import data from previously exported files
- **Reset**: Clear all data and return to setup screen
