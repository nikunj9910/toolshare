# ToolShare - Community Tool Sharing Platform

A full-stack MERN application that enables neighbors to share and rent household tools & equipment, promoting a circular economy and reducing waste.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure registration, login, and profile management
- **Tool Listings**: Create, edit, and manage tool listings with images
- **Search & Discovery**: Advanced search with filters (category, location, price)
- **Booking System**: Complete booking lifecycle (request → approve → active → completed)
- **Real-time Messaging**: Chat between tool owners and renters
- **Review System**: Rate and review after completed bookings
- **Dashboard**: Comprehensive dashboard for managing tools and bookings

### Technical Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Socket.io for instant messaging
- **Image Upload**: Cloudinary integration for tool photos
- **Payment Integration**: Stripe ready (payment intents created)
- **Location Services**: Geospatial search for nearby tools
- **Security**: JWT authentication, input validation, error handling

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.io** for real-time messaging
- **Cloudinary** for image storage
- **Stripe** for payment processing
- **Helmet** for security headers

### Frontend
- **React 19** with Vite
- **Redux Toolkit** with RTK Query
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Framer Motion** for animations

## 📁 Project Structure

```
toolshare/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and service configurations
│   │   ├── controllers/     # Business logic and validation
│   │   ├── middleware/      # Authentication and error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Utility functions (ApiResponse)
│   │   └── server.js        # Application entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client (RTK Query)
│   │   ├── store/           # Redux store and slices
│   │   └── App.jsx          # Main application component
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)
- Stripe account (for payments)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/toolshare
   
   # JWT Secrets
   JWT_SECRET=your_jwt_secret_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
   
   # Server
   PORT=4000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:4000/api
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📱 Usage

### For Tool Owners
1. **Register/Login** to your account
2. **List Tools** by clicking "List a Tool" in the navigation
3. **Manage Bookings** through your dashboard
4. **Approve/Decline** booking requests
5. **Communicate** with renters via messaging
6. **Mark Tools as Returned** when rentals are complete

### For Tool Renters
1. **Browse Tools** using search and filters
2. **View Tool Details** and check availability
3. **Request Bookings** for desired dates
4. **Track Booking Status** in your dashboard
5. **Message Owners** for questions or updates
6. **Leave Reviews** after completed rentals

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### Tools
- `GET /api/tools` - Get all tools (with search/filters)
- `GET /api/tools/:id` - Get single tool
- `POST /api/tools` - Create new tool (protected)
- `PUT /api/tools/:id` - Update tool (protected)
- `DELETE /api/tools/:id` - Delete tool (protected)
- `GET /api/tools/my` - Get user's tools (protected)
- `GET /api/tools/:id/availability` - Check tool availability

### Bookings
- `POST /api/bookings` - Create booking request (protected)
- `GET /api/bookings/my` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)
- `PUT /api/bookings/:id/approve` - Approve booking (protected)
- `PUT /api/bookings/:id/decline` - Decline booking (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)
- `PUT /api/bookings/:id/return` - Mark as returned (protected)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/reviews/tool/:toolId` - Get tool reviews

### Messages
- `POST /api/messages` - Send message (protected)
- `GET /api/messages/booking/:bookingId` - Get booking messages (protected)
- `GET /api/messages/conversations` - Get user conversations (protected)

## 🎨 UI Components

### Core Components
- **Navbar**: Navigation with authentication state
- **Footer**: Site information and links
- **ProtectedRoute**: Route protection for authenticated users
- **Hero**: Landing page hero section

### Feature Components
- **ToolCard**: Tool listing display
- **BookingForm**: Tool rental request form
- **MessageThread**: Real-time messaging interface
- **ReviewList**: User and tool reviews display

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Input Validation** on all endpoints
- **Password Hashing** with bcryptjs
- **CORS Configuration** for cross-origin requests
- **Helmet** for security headers
- **Rate Limiting** ready for implementation
- **SQL Injection Protection** via Mongoose

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Set up Cloudinary and Stripe production accounts

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Configure environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the sharing economy and circular economy principles
- Designed to promote community building and sustainability

## 📞 Support

For support, email support@toolshare.com or create an issue in the repository.

---

**ToolShare** - Building communities, one tool at a time. 🛠️✨
