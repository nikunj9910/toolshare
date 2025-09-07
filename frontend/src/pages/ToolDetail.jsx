import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetToolQuery, useCreateBookingMutation } from '../services/api';
import { MapPin, Star, Calendar, DollarSign, User, MessageCircle, Heart, Share2, Clock, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ToolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const { data, error, isLoading } = useGetToolQuery(id);
  const [createBooking] = useCreateBookingMutation();

  const tool = data?.data;

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    setIsBooking(true);
    try {
      const response = await createBooking({
        toolId: id,
        start: startDate,
        end: endDate
      }).unwrap();
      
      toast.success('Booking request sent successfully!');
      navigate(`/bookings/${response.data._id}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton height={400} className="rounded-lg" />
            </div>
            <div>
              <Skeleton height={200} className="rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tool not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The tool you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Browse Tools
          </button>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?._id === tool.ownerId?._id;
  const days = startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = days * tool.price.daily;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-12">
              <img
                src={tool.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={tool.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            {tool.images && tool.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {tool.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${tool.title} ${index + 2}`}
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {tool.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {tool.category}
                </span>
                <div className="flex items-center text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    {tool.ownerId?.ratingAvg || 0} ({tool.ownerId?.ratingCount || 0} reviews)
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Owner Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Owner Information
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={tool.ownerId?.avatar || 'https://i.pravatar.cc/150?u=default'}
                  alt={tool.ownerId?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {tool.ownerId?.name}
                  </h4>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{tool.ownerId?.ratingAvg || 0} rating</span>
                    <span className="mx-2">•</span>
                    <span>{tool.ownerId?.ratingCount || 0} reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pricing
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Daily rate:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${tool.price.daily}
                  </span>
                </div>
                {tool.price.hourly > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Hourly rate:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${tool.price.hourly}
                    </span>
                  </div>
                )}
                {tool.deposit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Security deposit:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${tool.deposit}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form */}
            {!isOwner && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Request to Rent
                </h3>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  {days > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          {days} day{days > 1 ? 's' : ''} × ${tool.price.daily}
                        </span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${totalPrice}
                        </span>
                      </div>
                      {tool.deposit > 0 && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-400">Security deposit:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ${tool.deposit}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isBooking || !tool.availability?.isAvailable}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    {isBooking ? 'Sending Request...' : 'Request to Rent'}
                  </button>
                </form>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Manage Your Tool
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/tools/${id}/edit`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Edit Tool
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    View Bookings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}