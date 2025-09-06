import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast, { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";

const stripePromise = loadStripe(
  "pk_test_51S4G02EYyNLuOZ1nymMIFxVrMVgK7mosYMnnpx8XpKq61i7Q93XvhpxIHAMcVjC0HjzUAKDGjXyzBKCbYi6eKFjv00ihe5WOqa"
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    await new Promise((res) => setTimeout(res, 1000)); // fake delay
    
    // Play success sound
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.play().catch(() => {}); // Ignore errors if audio fails
    } catch (err) {
      // Ignore audio errors
    }
    
    toast.success("Booking confirmed! 🎉");
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
    });

    setTimeout(() => (window.location.href = "/"), 2000);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "18px",
        lineHeight: "28px",
        color: "#1f2937",
        "::placeholder": { color: "#9ca3af" },
      },
      invalid: { color: "#ef4444" },
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-200"
    >
      <h2 className="text-3xl font-extrabold text-gray-900">Secure Payment</h2>
      <p className="text-gray-600">
        Total: <span className="font-bold text-green-600 text-lg">$24.00</span>{" "}
        (2 days)
      </p>

      {/* Card Number */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Card Number
        </label>
        <div className="h-14 border border-gray-300 rounded-lg flex items-center px-3 focus-within:ring-2 focus-within:ring-green-500">
          <CardNumberElement options={cardElementOptions} className="w-full" />
        </div>
      </div>

      {/* Expiry & CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Expiry</label>
          <div className="h-14 border border-gray-300 rounded-lg flex items-center px-3 focus-within:ring-2 focus-within:ring-green-500">
            <CardExpiryElement
              options={cardElementOptions}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">CVC</label>
          <div className="h-14 border border-gray-300 rounded-lg flex items-center px-3 focus-within:ring-2 focus-within:ring-green-500">
            <CardCvcElement options={cardElementOptions} className="w-full" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:from-green-700 hover:to-emerald-800 transition disabled:opacity-50"
      >
        Pay now
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        Every rental includes up to $2,000 damage protection
      </p>
    </form>
  );
}

export default function Checkout() {
  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black relative flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="relative z-10 w-full flex justify-center">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </>
  );
}
