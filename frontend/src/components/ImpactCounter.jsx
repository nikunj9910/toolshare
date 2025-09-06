import { useImpact } from '../contexts/ImpactContext';
import { Leaf } from 'lucide-react';

export default function ImpactCounter() {
  const { kg } = useImpact();

  return (
    <div className="fixed top-4 left-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-sm">
        <Leaf className="w-4 h-4 text-green-600" />
        <span className="font-semibold text-gray-800 dark:text-white">
          {kg.toFixed(1)} kg CO₂ saved
        </span>
      </div>
    </div>
  );
}

