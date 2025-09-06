import { useState, useEffect } from "react";
import { Search, MapPin, Star, Filter, X, Leaf, Heart, CheckCircle, Clock, Zap } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const mock = [
  { id: 1, name: "Power Drill", img: "https://source.unsplash.com/600x400/?power,drill", priceDay: 8, rating: 4.8, distance: 0.5, condition: "Excellent", isVerified: true, instantBook: true, responseTime: "1 hour" },
  { id: 2, name: "Ladder 12 ft", img: "https://source.unsplash.com/600x400/?ladder,construction", priceDay: 12, rating: 4.9, distance: 1.2, condition: "Good", isVerified: false, instantBook: false, responseTime: "4 hours" },
  { id: 3, name: "Pressure Washer", img: "https://source.unsplash.com/600x400/?pressure,washer,cleaning", priceDay: 15, rating: 4.7, distance: 2.0, condition: "Fair", isVerified: true, instantBook: true, responseTime: "30 min" },
];

export default function Browse() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (toolId) => {
    const newWishlist = wishlist.includes(toolId) 
      ? wishlist.filter(id => id !== toolId)
      : [...wishlist, toolId];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setTools(mock);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* top bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Browse Tools</h2>
          <div className="flex items-center gap-3">
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Leaf className="w-4 h-4" /> 92 kg CO₂ saved this week
            </span>
            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100">
              <MapPin className="w-4 h-4" /> Map view
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              <Filter className="w-5 h-5" /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* filters sidebar */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-fit`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="lg:hidden">
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="block mb-2 text-sm font-medium dark:text-white">Category</label>
            <select className="w-full mb-4 rounded-lg border px-3 py-2">
              <option>All categories</option>
              <option>Power tools</option>
              <option>Garden</option>
            </select>

            <label className="block mb-2 text-sm font-medium dark:text-white">Distance</label>
            <input type="range" min="1" max="10" className="w-full mb-4" />
            <div className="text-xs text-gray-500">Within 5 km</div>

            <label className="block mb-2 text-sm font-medium dark:text-white">Price / day</label>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" className="w-full rounded-lg border px-3 py-2" />
              <input type="number" placeholder="Max" className="w-full rounded-lg border px-3 py-2" />
            </div>

            <button className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primaryDark transition">
              Apply
            </button>
          </aside>

          {/* cards grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={240} className="rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {tools.map((t) => (
                  <Link
                    to={`/tool/${t.id}`}
                    key={t.id}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="relative">
                      <img src={t.img} className="h-48 w-full object-cover" alt={t.name} />
                      <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${getConditionColor(t.condition)}`}>
                        {t.condition}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(t.id);
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition"
                      >
                        <Heart 
                          className={`w-4 h-4 ${wishlist.includes(t.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                        />
                      </button>
                      {t.instantBook && (
                        <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Instant book
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition dark:text-white">
                        {t.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-2xl font-bold text-primary">
                          {t.priceDay.toLocaleString('en-US', {style:'currency', currency:'USD'})}
                          <span className="text-sm text-gray-500">/day</span>
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-400" />
                          {t.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {t.distance} km away
                        </div>
                        <div className="flex items-center gap-2">
                          {t.isVerified && (
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <CheckCircle className="w-3 h-3" />
                              <span>Verified</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{t.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
