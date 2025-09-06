import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Star, MapPin, Calendar, User, Share2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useImpact } from "../contexts/ImpactContext";
import toast from "react-hot-toast";

const mock = {
  id: 1,
  name: "Power Drill 18V",
  img: ["https://source.unsplash.com/600x400/?power,drill", "https://source.unsplash.com/600x400/?drill,tool"],
  priceDay: 8,
  rating: 4.8,
  reviews: 27,
  owner: "Sarah K.",
  distance: 0.5,
  desc: "Cordless, 2 batteries, charger & carrying case. Perfect for DIY projects.",
};

export default function ToolDetail() {
  const { id } = useParams();
  const [imgIndex, setImgIndex] = useState(0);
  const { addImpact } = useImpact();

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleRent = () => {
    addImpact(2.3);
    toast.success('+2.3 kg CO₂ saved! 🌱');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-gray-900 dark:to-gray-800 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-textile.png')] opacity-10"></div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <Link to="/browse" className="flex items-center gap-2 text-primary mb-4">
          <ChevronLeft className="w-5 h-5" /> Back to results
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={mock.img[imgIndex]}
              alt={mock.name}
              className="rounded-xl shadow-xl w-full h-96 object-cover"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {mock.img.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-3 h-3 rounded-full ${i === imgIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white"
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{mock.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400" />
                {mock.rating} ({mock.reviews} reviews)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                {mock.distance} km away
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{mock.desc}</p>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <User />
              </div>
              <div>
                <p className="font-semibold dark:text-white">{mock.owner}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tool owner</p>
              </div>
            </div>

            <div className="text-3xl font-bold text-primary">
              ${mock.priceDay}
              <span className="text-base text-gray-500"> / day</span>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <label className="flex items-center gap-2 mb-2 font-medium dark:text-white">
                <Calendar />
                Pick-up date
              </label>
              <input type="date" className="w-full rounded-lg border px-3 py-2" />
            </div>

            <Link
              to="/checkout"
              onClick={handleRent}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primaryDark transition shadow-md block text-center"
            >
              Request to Rent
            </Link>
          </motion.div>
        </div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow p-6"
        >
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Reviews</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-gray-200" />
                  <div>
                    <p className="font-semibold dark:text-white">Alex P.</p>
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400" />5
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Great condition, owner was super helpful!
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
