# AuctionHub - Complete React Frontend

A production-ready React frontend for an online auction platform built with the latest technologies including React 18, Tailwind CSS v4, Redux Toolkit, and modern development tools.

## 🚀 Features

### Core Features
- **Complete Authentication System**
  - Login/Register with validation
  - Password reset flow
  - KYC verification system
  - Protected routes with role-based access control

- **Auction Management**
  - Browse active auctions with advanced filters
  - Real-time bidding system
  - Auction countdown timers
  - Bid history and tracking
  - Create and manage your listings

- **User Dashboard**
  - Personal dashboard with statistics
  - Manage your listings
  - Track your bids
  - Watchlist management
  - Real-time messaging system
  - Payment history and invoices

- **Admin Panel**
  - User management and moderation
  - Listing approval system
  - Report management
  - Transaction tracking
  - System configuration and settings

- **Real-Time Features**
  - Socket.io integration for live updates
  - Instant bid notifications
  - Real-time messaging
  - Live auction status updates

### Technical Features
- **Modern Stack**
  - React 18.3.1 with latest hooks
  - Tailwind CSS v4 (zero-config)
  - Redux Toolkit for state management
  - React Router v6 for navigation
  - Axios for API communication
  - Socket.io for real-time features

- **Developer Experience**
  - Vite for ultra-fast development
  - Hot module replacement
  - Optimized production builds
  - ESLint for code quality
  - Prettier for code formatting

- **UI/UX**
  - Fully responsive design (mobile, tablet, desktop)
  - Dark mode ready
  - Reusable component library
  - Smooth animations and transitions
  - Accessibility features

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 16.x or higher
- npm 7.x or higher
- Git

Check your versions:
    node --version
    npm --version

## 💾 Installation

### 1. Clone the Repository
    git clone https://github.com/yourusername/auction-frontend.git
    cd auction-frontend

### 2. Install Dependencies
    npm install

### 3. Configure Environment Variables
    cp .env.example .env

Edit `.env` and configure your API endpoints:
    VITE_API_BASE_URL=http://localhost:5000/api
    VITE_SOCKET_URL=http://localhost:5000
    VITE_APP_NAME=Auction Platform
    VITE_ENVIRONMENT=development

### 4. Verify Installation
    npm run build

## 🏃 Running the Application

### Development Mode (with hot reload)
    npm run dev

This will start the development server at `http://localhost:3000`

### Production Build
    npm run build

Outputs optimized build to `dist/` folder

### Preview Production Build
    npm run preview

## 📁 Project Structure

    auction-frontend/
    ├── src/
    │   ├── pages/                 # Feature pages
    │   │   ├── auth/             # Login, Register, Password Reset, KYC
    │   │   ├── public/           # Home, Listings, ListingDetail, About, Contact
    │   │   ├── dashboard/        # User dashboard pages
    │   │   ├── admin/            # Admin management pages
    │   │   └── errors/           # 404, 401 pages
    │   │
    │   ├── components/            # Reusable UI components
    │   │   ├── Header.jsx         # Navigation header
    │   │   ├── Sidebar.jsx        # Dashboard sidebar
    │   │   ├── Button.jsx         # Customizable button
    │   │   ├── Input.jsx          # Form input with validation
    │   │   ├── Card.jsx           # Content card wrapper
    │   │   ├── Modal.jsx          # Modal dialog
    │   │   ├── Alert.jsx          # Alert/notification
    │   │   ├── Badge.jsx          # Status badge
    │   │   └── ... more components
    │   │
    │   ├── redux/                 # State management
    │   │   ├── store.js          # Redux store configuration
    │   │   └── slices/           # Redux slices for each feature
    │   │       ├── authSlice.js
    │   │       ├── listingsSlice.js
    │   │       ├── bidsSlice.js
    │   │       ├── watchlistSlice.js
    │   │       ├── messagesSlice.js
    │   │       ├── notificationsSlice.js
    │   │       ├── searchSlice.js
    │   │       ├── filtersSlice.js
    │   │       └── uiSlice.js
    │   │
    │   ├── services/              # API and external services
    │   │   ├── api/              # API service functions
    │   │   │   ├── authService.js
    │   │   │   ├── listingsService.js
    │   │   │   ├── bidsService.js
    │   │   │   ├── messagesService.js
    │   │   │   ├── paymentsService.js
    │   │   │   ├── usersService.js
    │   │   │   └── adminService.js
    │   │   └── socket.js         # Socket.io configuration
    │   │
    │   ├── hooks/                 # Custom React hooks
    │   │   ├── useAuth.js         # Authentication hook
    │   │   ├── useListings.js     # Listings management
    │   │   ├── useBids.js         # Bidding system
    │   │   ├── useWatchlist.js    # Watchlist management
    │   │   ├── useMessages.js     # Messaging system
    │   │   ├── useNotifications.js # Notifications
    │   │   ├── useSearch.js       # Search functionality
    │   │   └── useFilters.js      # Filter management
    │   │
    │   ├── utils/                 # Utility functions
    │   │   ├── validators.js      # Zod validation schemas
    │   │   ├── formatters.js      # Date, currency, text formatters
    │   │   └── helpers.js         # General helper functions
    │   │
    │   ├── layouts/               # Page layout wrappers
    │   │   ├── PublicLayout.jsx
    │   │   ├── AuthLayout.jsx
    │   │   ├── DashboardLayout.jsx
    │   │   └── AdminLayout.jsx
    │   │
    │   ├── config/                # Configuration files
    │   ├── assets/                # Images and static files
    │   ├── index.css              # Tailwind CSS with custom layers
    │   ├── App.jsx                # Main app component with routes
    │   └── main.jsx               # React entry point
    │
    ├── .env.example               # Environment variables template
    ├── .gitignore                 # Git ignore patterns
    ├── vite.config.js             # Vite configuration
    ├── package.json               # Dependencies and scripts
    └── README.md                  # This file

## 🎨 Tailwind CSS v4 - Zero Configuration

This project uses **Tailwind CSS v4** which requires **zero configuration**:
- No `tailwind.config.js` needed
- No `postcss.config.js` needed
- Built-in CSS nesting
- Native CSS variables support
- Automatic dark mode
- Container queries support

All styling is defined in `src/index.css` using `@layer` directives.

## 📦 Available Scripts

    npm run dev       # Start development server
    npm run build     # Build for production
    npm run preview   # Preview production build locally
    npm run lint      # Run ESLint
    npm run format    # Format code with Prettier

## 🔗 API Integration

The application is configured to communicate with a backend API. Ensure your backend is running on the configured URL.

### Configure API Endpoints in `.env`:
    VITE_API_BASE_URL=http://localhost:5000/api
    VITE_SOCKET_URL=http://localhost:5000

### API Service Structure
All API calls are centralized in `src/services/api/`:
- `authService.js` - Authentication endpoints
- `listingsService.js` - Listing CRUD operations
- `bidsService.js` - Bidding system endpoints
- `messagesService.js` - Messaging system
- `paymentsService.js` - Payment processing
- `usersService.js` - User profile management
- `adminService.js` - Admin panel operations

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Protected routes with role-based access
- ✅ Input validation with Zod
- ✅ CSRF protection ready
- ✅ Secure cookie handling
- ✅ XSS prevention
- ✅ Environment variable protection
- ✅ Error boundaries

## 📱 Responsive Design

The application is fully responsive:
- **Mobile** - Optimized for small screens (320px+)
- **Tablet** - Perfect display on tablets (768px+)
- **Desktop** - Full feature display (1024px+)
- **Large Screens** - Optimized for large monitors (1280px+)

## 🎯 State Management

The application uses **Redux Toolkit** for state management with the following slices:

    redux/slices/
    ├── authSlice.js          # User authentication state
    ├── listingsSlice.js      # Listings management
    ├── bidsSlice.js          # Bidding state
    ├── watchlistSlice.js     # User watchlist
    ├── messagesSlice.js      # Messaging system
    ├── notificationsSlice.js # User notifications
    ├── searchSlice.js        # Search functionality
    ├── filtersSlice.js       # Filter state
    └── uiSlice.js            # UI state (theme, modals, etc)

## 🔄 Real-Time Features

Socket.io integration provides real-time functionality:
- Live bid updates
- New message notifications
- Auction status changes
- User online/offline status
- System alerts

Configure Socket.io connection in `src/services/socket.js`

## 📦 Component Library

### Form Components
- `Button` - Customizable button with variants (primary, secondary, danger, success)
- `Input` - Text input with validation
- `TextArea` - Multi-line text input
- `Select` - Dropdown select

### Container Components
- `Card` - Content card wrapper
- `Modal` - Modal dialog
- `Alert` - Alert/notification banner
- `Badge` - Status indicator

### Navigation Components
- `Header` - Top navigation bar
- `Sidebar` - Dashboard sidebar
- `Pagination` - Page navigation

### Utility Components
- `Loading` - Loading spinner
- `Error` - Error display
- `PrivateRoute` - Protected route wrapper
- `AdminRoute` - Admin-only route wrapper

## 🎓 Usage Examples

### Using Redux Hooks
    import { useAuth } from './hooks/useAuth'

    const { user, login, logout, isAuthenticated } = useAuth()

### Using Custom Hooks
    import { useListings } from './hooks/useListings'
    import { useBids } from './hooks/useBids'
    import { useWatchlist } from './hooks/useWatchlist'

### Form Validation
    import { validateForm, loginSchema } from './utils/validators'

    const validation = await validateForm(loginSchema, formData)
    if (validation.valid) {
      // Process form
    } else {
      // Handle errors: validation.errors
    }

### API Calls
    import { listingsService } from './services/api/listingsService'

    const listings = await listingsService.getListings(page, limit, filters)

### Real-Time Events
    import { socketOn, socketEmit, socketEvents } from './services/socket'

    socketOn(socketEvents.NEW_BID, (bid) => {
      console.log('New bid received:', bid)
    })

    socketEmit(socketEvents.PLACE_BID, { listingId, amount })

## 🐛 Troubleshooting

### Port 3000 Already in Use
    npm run dev -- --port 3001

### Clear Cache and Reinstall
    rm -rf node_modules package-lock.json
    npm install

### Build Errors
    npm run build -- --force

### API Connection Issues
1. Verify backend is running on configured URL
2. Check CORS settings on backend
3. Verify `.env` file has correct API URL

### Socket.io Connection Issues
1. Verify Socket.io is enabled on backend
2. Check WebSocket support in your network
3. Verify Socket.io version compatibility

## 📝 Environment Variables

Required environment variables in `.env`:

    # API Configuration
    VITE_API_BASE_URL=http://localhost:5000/api
    VITE_SOCKET_URL=http://localhost:5000

    # Application Settings
    VITE_APP_NAME=Auction Platform
    VITE_APP_LOGO=https://via.placeholder.com/50?text=AP

    # Storage Keys
    VITE_JWT_STORAGE_KEY=auth_token
    VITE_USER_STORAGE_KEY=user_data

    # Environment
    VITE_ENVIRONMENT=development

## 🚀 Deployment

### Build for Production
    npm run build

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables
4. Deploy

### Deploy to Netlify
    npm run build
    # Upload dist/ folder to Netlify

### Deploy to Docker
    docker build -t auction-frontend .
    docker run -p 3000:3000 auction-frontend

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@auctionhub.com or open an issue on GitHub.

## 📞 Contact

- **Email**: support@auctionhub.com
- **Website**: https://auctionhub.com
- **GitHub**: https://github.com/auctionhub/frontend

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
