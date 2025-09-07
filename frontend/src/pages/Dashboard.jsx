import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetMyBookingsQuery, useGetMyToolsQuery } from '../services/api';
import { 
  Calendar, 
  ToolCaseIcon, 
  MessageCircle, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Eye
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  const { data: bookingsData, isLoading: bookingsLoading } = useGetMyBookingsQuery();
  const { data: toolsData, isLoading: toolsLoading } = useGetMyToolsQuery();

  const bookings = bookingsData?.data || { asRenter: [], asOwner: [] };
  const tools = toolsData?.data || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'active': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'my-tools', label: 'My Tools', icon: ToolCaseIcon },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tools, bookings, and messages
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600 dark:text-green-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('my-tools')}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <ToolCaseIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      My Tools
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {toolsLoading ? <Skeleton width={40} /> : tools.length}
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('bookings')}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Bookings
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {bookingsLoading ? (
                        <Skeleton width={40} />
                      ) : (
                        [...bookings.asRenter, ...bookings.asOwner].filter(
                          b => b.status === 'active' || b.status === 'approved'
                        ).length
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('bookings')}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending Requests
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {bookingsLoading ? (
                        <Skeleton width={40} />
                      ) : (
                        bookings.asOwner.filter(b => b.status === 'pending').length
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Earnings
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {bookingsLoading ? (
                        <Skeleton width={60} />
                      ) : (
                        `$${bookings.asOwner
                          .filter(b => b.status === 'completed')
                          .reduce((sum, b) => sum + (b.pricing?.total || 0), 0)
                        }`
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-tools' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  My Tools
                </h2>
                <Link
                  to="/create-tool"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tool
                </Link>
              </div>
              <div className="p-6">
                {toolsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} height={100} />
                    ))}
                  </div>
                ) : tools.length === 0 ? (
                  <div className="text-center py-12">
                    <ToolCaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No tools yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start by listing your first tool to share with the community.
                    </p>
                    <Link
                      to="/create-tool"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      List Your First Tool
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                      <div key={tool._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={tool.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={tool.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {tool.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {tool.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                              ${tool.price.daily}/day
                            </span>
                            <Link
                              to={`/tools/${tool._id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* As Renter */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    My Bookings
                  </h2>
                </div>
                <div className="p-6">
                  {bookingsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} height={80} />
                      ))}
                    </div>
                  ) : bookings.asRenter.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No bookings yet. Start by browsing tools!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.asRenter.map((booking) => (
                        <div 
                          key={booking._id} 
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          onClick={() => navigate(`/bookings/${booking._id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={booking.toolId?.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                                alt={booking.toolId?.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {booking.toolId?.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(booking.start).toLocaleDateString()} - {new Date(booking.end).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Owner: {booking.ownerId?.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1 capitalize">{booking.status}</span>
                              </span>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                ${booking.pricing?.total || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* As Owner */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Booking Requests
                  </h2>
                </div>
                <div className="p-6">
                  {bookingsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} height={80} />
                      ))}
                    </div>
                  ) : bookings.asOwner.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No booking requests yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.asOwner.map((booking) => (
                        <div 
                          key={booking._id} 
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          onClick={() => navigate(`/bookings/${booking._id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={booking.toolId?.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                                alt={booking.toolId?.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {booking.toolId?.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(booking.start).toLocaleDateString()} - {new Date(booking.end).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Renter: {booking.renterId?.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1 capitalize">{booking.status}</span>
                              </span>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                ${booking.pricing?.total || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
