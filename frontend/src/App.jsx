import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Browse from './pages/Browse';
import ToolDetail from './pages/ToolDetail';
import CreateTool from './pages/CreateTool';
import Dashboard from './pages/Dashboard';
import BookingDetail from './pages/BookingDetail';
import ProfileSettings from './pages/ProfileSettings';

// Components
import Navbar from './components/Navbar';
import AuthHeader from './components/AuthHeader';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AuthInitializer from './components/AuthInitializer';

// Component to handle conditional header rendering
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth/');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isAuthPage ? <AuthHeader /> : <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/tools/:id" element={<ToolDetail />} />
          <Route 
            path="/create-tool" 
            element={
              <ProtectedRoute>
                <CreateTool />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings/:id" 
            element={
              <ProtectedRoute>
                <BookingDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile-settings" 
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Router>
          <AppContent />
        </Router>
      </AuthInitializer>
    </Provider>
  );
}

export default App;