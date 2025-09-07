import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateToolMutation } from '../services/api';
import { Upload, X, MapPin, DollarSign, Tag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateTool() {
  const navigate = useNavigate();
  const [createTool, { isLoading }] = useCreateToolMutation();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    priceHourly: '',
    priceDaily: '',
    deposit: '',
    images: []
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const categories = [
    'Power Tools',
    'Garden',
    'Cleaning',
    'Automotive',
    'Construction',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles = [];
    const previewUrls = [];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }

      validFiles.push(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrls.push(e.target.result);
        if (previewUrls.length === validFiles.length) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...previewUrls]
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.priceDaily) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.priceDaily <= 0) {
      toast.error('Daily price must be greater than 0');
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('priceHourly', formData.priceHourly || 0);
      submitData.append('priceDaily', formData.priceDaily);
      submitData.append('deposit', formData.deposit || 0);

      // Append image files
      selectedFiles.forEach((file, index) => {
        submitData.append('images', file);
      });

      const response = await createTool(submitData).unwrap();
      toast.success('Tool created successfully!');
      navigate(`/tools/${response.data._id}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create tool');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            List Your Tool
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tool Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Professional Drill Set"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your tool, its condition, and any special features..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pricing
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Daily Rate *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="priceDaily"
                      value={formData.priceDaily}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hourly Rate (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="priceHourly"
                      value={formData.priceHourly}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Security Deposit (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Photos
              </h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Upload photos of your tool (max 5 images)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block"
                  >
                    Choose Images
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Tool image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isLoading ? 'Creating...' : 'List Tool'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
