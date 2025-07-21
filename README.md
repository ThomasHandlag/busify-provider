![GitHub contributors](https://img.shields.io/github/contributors/ThomasHandlag/busify-provider)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/ThomasHandlag/busify-provider)
![GitHub License](https://img.shields.io/github/license/ThomasHandlag/busify-provider)
# Busify Provider

A comprehensive bus service provider management platform built with modern web technologies. This application provides powerful tools for bus service providers to manage, monitor, and optimize their bus transportation operations with an intuitive and feature-rich interface.

## 🚌 About

Busify Provider is the core management platform designed specifically for bus service providers, fleet operators, and transportation companies. It offers a complete suite of tools to streamline operations, improve efficiency, and deliver better passenger experiences through data-driven insights and comprehensive management capabilities.

## ✨ Key Features

- **Fleet Management**: Complete vehicle tracking, maintenance scheduling, and fleet optimization
- **Route Planning**: Intelligent route optimization and real-time schedule management
- **Driver Management**: Driver assignment, performance tracking, and workforce optimization
- **Passenger Services**: Booking management, passenger communication, and service analytics
- **Financial Tracking**: Revenue management, expense tracking, and financial reporting
- **Real-time Monitoring**: Live vehicle tracking, status updates, and operational insights
- **Analytics Dashboard**: Comprehensive reporting and business intelligence tools
- **Mobile-First Design**: Responsive interface optimized for all devices

## 🛠️ Tech Stack

- **Framework**: React 19 with Vite 7
- **Language**: TypeScript
- **UI Library**: Ant Design v5
- **Styling**: Tailwind CSS v4
- **State Management**: 
  - Redux Toolkit for global state
  - Recoil for component-level state
- **Routing**: React Router v7
- **HTTP Client**: Axios for API communication
- **Build Tool**: Vite with SWC compiler
- **Development**: Fast HMR with hot module replacement
- **Type Safety**: Full TypeScript support with strict mode

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun package manager
- Git for version control

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd bus-manage-system/busify-provider
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Busify Provider Platform

# Database Configuration
VITE_DB_HOST=localhost
VITE_DB_PORT=5432

# Authentication
VITE_JWT_SECRET=your-jwt-secret
VITE_SESSION_TIMEOUT=3600

# Third-party Services
VITE_MAPS_API_KEY=your-google-maps-api-key
VITE_PAYMENT_GATEWAY_URL=your-payment-gateway-url

# Other configurations will be documented as they are added
```

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to access the provider platform.

## 📁 Project Structure

```
busify-provider/
├── src/
│   ├── app/
│   │   ├── hooks/            # Custom React hooks
│   │   └── store.ts          # Redux store configuration
│   ├── assets/               # Static assets (images, icons, etc.)
│   ├── components/           # Reusable UI components
│   │   ├── common/           # Common UI components
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   ├── features/             # Feature-based modules
│   │   ├── auth/             # Authentication
│   │   ├── fleet/            # Fleet management
│   │   ├── routes/           # Route management
│   │   ├── drivers/          # Driver management
│   │   ├── bookings/         # Booking management
│   │   ├── analytics/        # Analytics and reporting
│   │   └── settings/         # System settings
│   ├── routes/               # Application routing
│   ├── api-client.ts         # Axios configuration and API setup
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── public/                   # Public static files
├── .env.example              # Environment variables template
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies and scripts
```

## 🎨 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint for code linting and quality checks
- `npm run preview` - Preview the production build locally

### Architecture & Design Patterns

#### Feature-Based Architecture
Each feature module contains:
- **API Layer**: HTTP requests and backend integration
- **State Management**: Redux slices and Recoil atoms
- **UI Components**: Feature-specific React components
- **Types**: TypeScript interfaces and type definitions
- **Utils**: Feature-specific utility functions

#### State Management Strategy
- **Redux Toolkit**: Global application state (auth, fleet data, routes)
- **Recoil**: Component-level state and complex state dependencies
- **React Hooks**: Local component state and side effects
- **API State**: Cached API responses and optimistic updates

### Code Quality & Standards

- **TypeScript**: Strict type checking with comprehensive type coverage
- **ESLint**: Advanced linting rules for code quality and consistency
- **Ant Design**: Consistent design system and component library
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliance and keyboard navigation support

## 🔧 Configuration

### Environment Variables

The application supports extensive configuration through environment variables:

### Environment Variables

The application supports extensive configuration through environment variables:

```bash
# Core Application
VITE_API_BASE_URL=          # Backend API endpoint
VITE_APP_TITLE=             # Application title
VITE_APP_VERSION=           # Application version

# Database & Backend
VITE_DB_HOST=               # Database host
VITE_DB_PORT=               # Database port
VITE_API_TIMEOUT=           # API request timeout

# Authentication & Security
VITE_JWT_SECRET=            # JWT signing secret
VITE_SESSION_TIMEOUT=       # Session timeout duration
VITE_REFRESH_TOKEN_EXPIRE=  # Refresh token expiration

# External Services
VITE_MAPS_API_KEY=          # Google Maps API key
VITE_PAYMENT_GATEWAY_URL=   # Payment processing URL
VITE_SMS_SERVICE_KEY=       # SMS notification service
VITE_EMAIL_SERVICE_KEY=     # Email notification service

# Feature Flags
VITE_ENABLE_ANALYTICS=      # Enable/disable analytics
VITE_ENABLE_NOTIFICATIONS=  # Enable/disable notifications
VITE_DEBUG_MODE=            # Development debugging
```

### ESLint Configuration

For production applications, enhance the ESLint configuration with type-aware rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

The application can be deployed to various platforms:
- **Vercel**: Automatic deployments with Git integration
- **Netlify**: Static hosting with form handling
- **AWS S3 + CloudFront**: Scalable cloud hosting
- **Docker**: Containerized deployment
- **Traditional Hosting**: Any static file hosting service

## 🧪 Testing

Testing strategy for comprehensive quality assurance:

```bash
# Unit Tests (to be implemented)
npm run test

# Integration Tests (to be implemented)
npm run test:integration

# E2E Tests (to be implemented)  
npm run test:e2e

# Test Coverage (to be implemented)
npm run test:coverage
```

Recommended testing tools:
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for tests
- **Playwright**: End-to-end testing
- **Storybook**: Component documentation and testing

## 🔐 Security & Authentication

### Security Features
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- API rate limiting and request validation
- Secure data transmission with HTTPS
- Input sanitization and XSS protection
- CSRF protection for forms

### User Roles & Permissions
- **Super Admin**: Full system access and configuration
- **Fleet Manager**: Fleet and route management
- **Operations Manager**: Daily operations and monitoring
- **Driver Coordinator**: Driver assignment and scheduling
- **Financial Manager**: Financial data and reporting
- **Support Agent**: Customer service and support

## 📊 Core Modules

### 1. Fleet Management
- Vehicle registration and documentation
- Maintenance scheduling and tracking
- Fuel consumption monitoring
- Vehicle performance analytics
- Insurance and compliance management

### 2. Route & Schedule Management
- Route planning and optimization
- Schedule creation and management
- Real-time schedule adjustments
- Route performance analytics
- Traffic and weather integration

### 3. Driver Management
- Driver onboarding and documentation
- Performance tracking and evaluation
- Shift scheduling and management
- Training and certification tracking
- Payroll and compensation management

### 4. Booking & Passenger Services
- Online booking system integration
- Passenger communication tools
- Seat allocation and management
- Payment processing and refunds
- Customer feedback and ratings

### 5. Analytics & Reporting
- Business intelligence dashboard
- Financial reporting and analysis
- Operational performance metrics
- Predictive analytics for demand
- Custom report generation

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the established coding standards
4. Write comprehensive tests for new features
5. Ensure all linting and tests pass
6. Write clear commit messages
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Standards
- **Code Style**: Follow TypeScript and React best practices
- **Component Design**: Create reusable, well-documented components
- **State Management**: Use appropriate state management patterns
- **API Integration**: Follow RESTful conventions and error handling
- **Testing**: Write unit tests for business logic and components
- **Documentation**: Document complex functions and components

### Code Review Process
- All changes require peer review
- Automated testing must pass
- Code coverage should not decrease
- Performance impact assessment for significant changes

## 📖 Related Projects

This project is part of the comprehensive Busify ecosystem:

- **busify-provider**: Bus service provider management platform (this repository)
- **busify-admin**: System administration dashboard
- **busify-next**: Customer-facing web application
- **busify-mobile**: Mobile application for passengers and drivers
- **busify-api**: Backend services and API

## 📚 Learn More

Expand your knowledge with these resources:

### Core Technologies
- [React 19 Documentation](https://react.dev) - Modern React features and patterns
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Advanced TypeScript usage
- [Vite Guide](https://vitejs.dev/guide/) - Build tool configuration and optimization

### UI & Styling
- [Ant Design Components](https://ant.design/docs/react/introduce) - Professional UI components
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework

### State Management
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/) - Modern Redux patterns
- [Recoil Documentation](https://recoiljs.org/) - Flexible state management

### Additional Tools
- [React Router Guide](https://reactrouter.com/) - Client-side routing
- [Axios Documentation](https://axios-http.com/docs/intro) - HTTP client library

## 🆘 Support & Help

### Getting Help
- **Documentation**: Check this README and inline code documentation
- **Issues**: Create detailed GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Community**: Join our developer community channels

### Troubleshooting
- Ensure Node.js version compatibility (18+)
- Check environment variable configuration
- Verify network connectivity for API calls
- Review browser console for client-side errors
- Check server logs for backend issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for complete details.

## 🎯 Roadmap

### Current Development
- [x] Core platform architecture
- [x] Authentication and user management
- [x] Basic fleet management features
- [ ] Advanced analytics dashboard
- [ ] Real-time tracking integration
- [ ] Mobile application companion

### Future Enhancements
- [ ] AI-powered route optimization
- [ ] Predictive maintenance algorithms
- [ ] Advanced passenger analytics
- [ ] Integration with IoT sensors
- [ ] Multi-language support
- [ ] White-label solutions
- [ ] API marketplace for third-party integrations

### Performance Goals
- [ ] Sub-second page load times
- [ ] 99.9% uptime reliability
- [ ] Real-time data processing
- [ ] Scalability to 10,000+ concurrent users
- [ ] Mobile-first performance optimization

---

🚌 **Built with passion by the Busify team** - Transforming bus transportation through technology
