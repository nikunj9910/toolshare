import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthHeader = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Back to Home */}
          <Link
            to="/"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          {/* ToolShare Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
          >
            ToolShare
          </Link>
          
          {/* Empty div for spacing */}
          <div className="w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;
