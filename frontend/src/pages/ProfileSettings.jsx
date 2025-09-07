import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateProfilePhotoMutation } from '../services/api';
import { Camera, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const { user } = useSelector((state) => state.auth);
  const [updateProfilePhoto, { isLoading }] = useUpdateProfilePhotoMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      await updateProfilePhoto(formData).unwrap();
      toast.success('Profile photo updated successfully!');
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update profile photo');
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Profile Settings
          </h1>

          {/* Current Profile Photo */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Current Profile Photo
            </h2>
            <div className="flex items-center space-x-6">
              <img
                src={user?.avatar || 'https://i.pravatar.cc/150?u=default'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
              />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This photo will be displayed across the platform
                </p>
              </div>
            </div>
          </div>

          {/* Upload New Photo */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update Profile Photo
            </h2>
            
            <div className="space-y-4">
              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Choose a new profile photo
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="profile-photo-upload"
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block transition-colors"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Choose Photo
                </label>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Preview
                  </h3>
                  <div className="flex items-center space-x-6">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpload}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {isLoading ? 'Uploading...' : 'Upload Photo'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <p className="text-gray-900 dark:text-white">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user?.ratingAvg ? `${user.ratingAvg.toFixed(1)}/5` : 'No ratings yet'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Member Since
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
