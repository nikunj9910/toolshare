import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  useGetBookingQuery, 
  useApproveBookingMutation, 
  useDeclineBookingMutation, 
  useCancelBookingMutation,
  useMarkReturnedMutation,
  useGetMessagesQuery,
  useSendMessageMutation
} from '../services/api';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [message, setMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const { data, error, isLoading } = useGetBookingQuery(id);
  const { data: messagesData } = useGetMessagesQuery({ bookingId: id });
  
  const [approveBooking] = useApproveBookingMutation();
  const [declineBooking] = useDeclineBookingMutation();
  const [cancelBooking] = useCancelBookingMutation();
  const [markReturned] = useMarkReturnedMutation();
  const [sendMessage] = useSendMessageMutation();

  const booking = data?.data;
  const messages = messagesData?.data?.messages || [];

  const isOwner = user?._id === booking?.ownerId?._id;
  const isRenter = user?._id === booking?.renterId?._id;

  const handleApprove = async () => {
    try {
      await approveBooking(id).unwrap();
      toast.success('Booking approved successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to approve booking');
    }
  };

  const handleDecline = async () => {
    try {
      await declineBooking(id).unwrap();
      toast.success('Booking declined');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to decline booking');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelBooking(id).unwrap();
      toast.success('Booking cancelled');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleMarkReturned = async () => {
    try {
      await markReturned(id).unwrap();
      toast.success('Tool marked as returned');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to mark as returned');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSendingMessage(true);
    try {
      await sendMessage({
        bookingId: id,
        body: message
      }).unwrap();
      setMessage('');
      toast.success('Message sent');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton height={200} className="rounded-lg mb-6" />
          <Skeleton height={300} className="rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Booking not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The booking you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Booking Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tool Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tool Information
              </h2>
              <div className="flex items-start space-x-4">
                <img
                  src={booking.toolId?.images?.[0] || 'https://via.placeholder.com/150x150?text=No+Image'}
                  alt={booking.toolId?.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {booking.toolId?.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {booking.toolId?.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {booking.toolId?.category}
                    </span>
                    <span>${booking.toolId?.price?.daily}/day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Booking Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Rental Period
                  </h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(booking.start).toLocaleDateString()} - {new Date(booking.end).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Status
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status}</span>
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Total Cost
                  </h3>
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="text-lg font-semibold">
                      ${booking.pricing?.total || 0}
                    </span>
                  </div>
                </div>
                {booking.deposit > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Security Deposit
                    </h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>${booking.deposit}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Messages
              </h2>
              
              {/* Messages List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                    No messages yet
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.fromUserId._id === user?._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.fromUserId._id === user?._id
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{msg.body}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isSendingMessage || !message.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {isOwner ? 'Renter' : 'Owner'} Information
              </h2>
              <div className="flex items-center space-x-4">
                <img
                  src={isOwner ? booking.renterId?.avatar : booking.ownerId?.avatar}
                  alt={isOwner ? booking.renterId?.name : booking.ownerId?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {isOwner ? booking.renterId?.name : booking.ownerId?.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{isOwner ? booking.renterId?.ratingAvg : booking.ownerId?.ratingAvg || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h2>
              <div className="space-y-3">
                {isOwner && booking.status === 'pending' && (
                  <>
                    <button
                      onClick={handleApprove}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Approve Booking
                    </button>
                    <button
                      onClick={handleDecline}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Decline Booking
                    </button>
                  </>
                )}
                
                {isOwner && booking.status === 'active' && (
                  <button
                    onClick={handleMarkReturned}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Mark as Returned
                  </button>
                )}

                {(isRenter || isOwner) && ['pending', 'approved'].includes(booking.status) && (
                  <button
                    onClick={handleCancel}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
