import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromCart, clearCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { purchaseService } from "../services/purchase.service";
import Swal from "sweetalert2";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cartItems = useAppSelector((state) => state.cart.items);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    if (!user) return;

    try {
      await purchaseService.createPurchase(user.uid, cartItems);
      dispatch(clearCart());
      
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: "Your courses have been purchased.",
        confirmButtonColor: "#9333ea",
      }).then(() => {
        navigate("/student/courses");
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed!",
        text: error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/student/browse")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cart Items</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">by {item.instructor}</p>
                    <p className="text-sm text-gray-500">{item.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-purple-600">${item.price}</p>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="mt-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Complete Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
