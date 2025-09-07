import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Simple test component
function TestHome() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ToolShare
        </h1>
        <p className="text-lg text-gray-600">
          Welcome to ToolShare - Community Tool Sharing Platform
        </p>
        <div className="mt-8">
          <a 
            href="/browse" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Browse Tools
          </a>
        </div>
      </div>
    </div>
  );
}

function TestApp() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<TestHome />} />
          <Route path="/browse" element={<TestHome />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default TestApp;
