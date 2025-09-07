import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-600 dark:text-green-400 mb-4">
          Share Tools with Neighbors
        </h1>

        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Borrow, lend, and build a greener community—one tool at a time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/browse"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md block"
          >
            Find Tools
          </Link>
          <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition">
            List a Tool
          </button>
        </div>

        {/* Trust counters */}
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div>
            <span className="text-3xl font-bold text-green-600">2,341</span>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tools listed</p>
          </div>
          <div>
            <span className="text-3xl font-bold text-green-600">18,392</span>
            <p className="text-sm text-gray-600 dark:text-gray-400">Happy rentals</p>
          </div>
          <div>
            <span className="text-3xl font-bold text-green-600">9,200</span>
            <p className="text-sm text-gray-600 dark:text-gray-400">CO₂ saved (kg)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
