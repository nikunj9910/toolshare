import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full shadow-lg"
      />
    </div>
  );
}
