# Sweet Shop Management System - Frontend

A modern React frontend application for managing a sweet shop inventory system. Built with Material-UI for beautiful design and responsive user experience.

## 🍬 Features

### User Features
- **Authentication**: Secure login and registration system
- **Sweet Browsing**: Browse and search through available sweets
- **Advanced Filtering**: Filter by category, price range, and search terms
- **Purchase System**: Purchase sweets with quantity selection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### Admin Features (Admin Role Required)
- **Inventory Management**: Add, edit, and delete sweets
- **Stock Management**: Restock items and monitor inventory levels
- **Dashboard Analytics**: View inventory statistics and alerts
- **Stock Alerts**: Get notifications for out-of-stock and low-stock items

## 🚀 Technologies Used

- **React 19** - Frontend framework
- **Material-UI (MUI)** - Component library and design system
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling with validation
- **Yup** - Schema validation
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications
- **Context API** - State management

## 🛠️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API server running on port 5000 (or update the API URL in .env)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_NAME=Sweet Shop Management System
   REACT_APP_VERSION=1.0.0
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The application will open in your browser at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🔐 Authentication System

### Demo Credentials
For testing purposes, you can use these demo accounts:

**Admin Account:**
- Email: `admin@sweetshop.com`
- Password: `password123`

**Regular User:**
- Email: `user@sweetshop.com`
- Password: `password123`

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (SweetCard, LoadingSpinner, etc.)
│   ├── forms/           # Form-specific components
│   └── layout/          # Layout components (Header, Footer, etc.)
├── pages/               # Page components
│   ├── auth/           # Authentication pages (Login, Register)
│   ├── dashboard/      # Dashboard and main pages
│   ├── admin/          # Admin panel pages
│   └── sweets/         # Sweet-specific pages
├── services/           # API services and HTTP clients
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── constants/          # Application constants and config
├── styles/             # Theme and styling configuration
├── utils/              # Utility functions
└── types/              # TypeScript type definitions (if using TS)
```

## 🎨 UI Components

### Material-UI Theme
The application uses a custom Material-UI theme with:
- **Primary Color**: Sweet Pink (#FF6B9D)
- **Secondary Color**: Sky Blue (#4A90E2)
- **Background**: Cream gradient for a warm, inviting feel
- **Typography**: Inter font family for modern readability
- **Custom Components**: Enhanced cards, buttons, and form elements

## 🔄 API Integration

### Endpoints Used
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/sweets` - Fetch sweets with pagination
- `GET /api/sweets/search` - Search sweets
- `POST /api/sweets` - Add new sweet (Admin)
- `PUT /api/sweets/:id` - Update sweet (Admin)
- `DELETE /api/sweets/:id` - Delete sweet (Admin)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin)

## 🚀 Production Build

### Build Optimization
```bash
npm run build
```

This creates an optimized production build with:
- Code splitting and lazy loading
- Asset optimization and compression
- Service worker for caching
- Progressive Web App features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Happy coding! 🍬✨**
