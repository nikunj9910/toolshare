import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

export default function Hero() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  const counters = [
    { label: "Tools listed", end: 2341 },
    { label: "Happy rentals", end: 18392 },
    { label: "CO₂ saved (kg)", end: 9200 },
  ];

  const Counter = ({ end }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!inView) return;
      let start = 0;
      const duration = 2000;
      const step = Math.ceil(end / (duration / 16));
      const timer = setInterval(() => {
        start += step;
        if (start >= end) { start = end; clearInterval(timer); }
        setCount(start);
      }, 16);
    }, [inView, end]);
    return <span className="text-3xl font-bold text-primary">{count.toLocaleString()}</span>;
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold text-primary mb-4"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,.25)' }}
        >
          Share Tools with Neighbors
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-gray-700 dark:text-gray-300 mb-8"
        >
          Borrow, lend, and build a greener community—one tool at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/browse"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primaryDark transition shadow-md block"
            >
              Find Tools
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition">
              List a Tool
            </button>
          </motion.div>
        </motion.div>

        {/* Trust counters */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 grid grid-cols-3 gap-6 text-center"
        >
          {counters.map((c) => (
            <div key={c.label}>
              <Counter end={c.end} />
              <p className="text-sm text-gray-600 dark:text-gray-400">{c.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}