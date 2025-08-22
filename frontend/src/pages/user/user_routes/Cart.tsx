import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingBag,
  X,
  ArrowRight,
} from "lucide-react";
import styles from"../../../styles/user/user_routes/Cart.module.css";
import { Booking, Accommodation, Recovery, Review } from "./Accommodations";

// Interfaces (you can import these from your types file)
export interface User {
  UserId: string;
  FullName: string;
  Email: string;
  Phone: string;
  Password: string;
  Role: string;
  ProfileImage?: string;
  IsWelcome: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  Bookings: Booking[];
  Accommodations: Accommodation[];
  Orders: Order[];
  Carts: Cart[];
  Recoveries: Recovery[];
  Payments: Payment[];
  Reviews: Review[];
  Notifications: Notification[];
}

export interface Delicacy {
  DelicacyId: string;
  Name: string;
  Description: string;
  Price: number;
  DelicacyImage: string;
  Category: string;
  IsAvailable: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  Orders: Order[];
  Carts: Cart[];
  OrderItems: OrderItem[];
  Reviews: Review[];
}

export interface Cart {
  CartId: string;
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  AddedAt: string;
  User: User;
  Delicacy: Delicacy;
}

export interface Order {
  OrderId: string;
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  TotalAmount: number;
  OrderStatus: string;
  OrderedAt: string;
  DeliveredAt?: string;
  PaymentStatus: string;
  User: User;
  Delicacy: Delicacy;
  OrderItems: OrderItem[];
}

export interface OrderItem {
  OrderItemId: string;
  OrderId: string;
  DelicacyId: string;
  Quantity: number;
  Price: number;
  Subtotal: number;
  Order: Order;
  Delicacy: Delicacy;
}

export interface Payment {
  PaymentId: string;
  UserId: string;
  Amount: number;
  PaymentMethod: string;
  PaymentReference: string;
  TransactionId: string;
  Status: string;
  BookingId?: string;
  OrderId?: string;
  PaidAt: string;
  CreatedAt: string;
  User: User;
}

// Mock data for demonstration
const mockCartItems: Cart[] = [
  {
    CartId: "1",
    UserId: "user1",
    DelicacyId: "del1",
    Quantity: 2,
    AddedAt: "2024-01-15T10:30:00Z",
    User: {} as User,
    Delicacy: {
      DelicacyId: "del1",
      Name: "Grilled Salmon",
      Description: "Fresh Atlantic salmon with herbs and lemon",
      Price: 28.99,
      DelicacyImage:
        "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=300",
      Category: "Main Course",
      IsAvailable: true,
      CreatedAt: "2024-01-01T00:00:00Z",
      UpdatedAt: "2024-01-01T00:00:00Z",
      Orders: [],
      Carts: [],
      OrderItems: [],
      Reviews: [],
    },
  },
  {
    CartId: "2",
    UserId: "user1",
    DelicacyId: "del2",
    Quantity: 1,
    AddedAt: "2024-01-15T11:00:00Z",
    User: {} as User,
    Delicacy: {
      DelicacyId: "del2",
      Name: "Truffle Pasta",
      Description: "Homemade pasta with black truffle and parmesan",
      Price: 35.5,
      DelicacyImage:
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300",
      Category: "Main Course",
      IsAvailable: true,
      CreatedAt: "2024-01-01T00:00:00Z",
      UpdatedAt: "2024-01-01T00:00:00Z",
      Orders: [],
      Carts: [],
      OrderItems: [],
      Reviews: [],
    },
  },
  {
    CartId: "3",
    UserId: "user1",
    DelicacyId: "del3",
    Quantity: 3,
    AddedAt: "2024-01-15T12:00:00Z",
    User: {} as User,
    Delicacy: {
      DelicacyId: "del3",
      Name: "Chocolate Soufflé",
      Description: "Rich dark chocolate soufflé with vanilla ice cream",
      Price: 12.99,
      DelicacyImage:
        "https://images.unsplash.com/photo-1541783245831-57d6fb0d6742?w=300",
      Category: "Dessert",
      IsAvailable: true,
      CreatedAt: "2024-01-01T00:00:00Z",
      UpdatedAt: "2024-01-01T00:00:00Z",
      Orders: [],
      Carts: [],
      OrderItems: [],
      Reviews: [],
    },
  },
];

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<Cart[]>(mockCartItems);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "completed" | "failed"
  >("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.Delicacy.Price * item.Quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = cartItems.length > 0 ? 5.99 : 0;
  const grandTotal = subtotal + tax + deliveryFee;

  // Handle quantity changes
  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(cartId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.CartId === cartId ? { ...item, Quantity: newQuantity } : item
      )
    );
  };

  // Remove single item
  const removeItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.CartId !== cartId));
  };

  // Clear all cart items
  const clearCart = () => {
    setCartItems([]);
  };

  // Handle payment
  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus("processing");
    setShowPaymentModal(true);

    // Simulate payment process
    setTimeout(() => {
      setPaymentStatus("completed");
      setIsLoading(false);
      // Clear cart after successful payment
      setTimeout(() => {
        setCartItems([]);
        setShowPaymentModal(false);
        setPaymentStatus("pending");
      }, 3000);
    }, 2000);
  };

  // Handle make order (without payment)
  const handleMakeOrder = () => {
    // Simulate creating order
    console.log("Creating order with items:", cartItems);
    alert("Order created successfully! You can complete payment later.");
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "processing":
        return <Clock className={styles["status-icon"]} />;
      case "completed":
        return <CheckCircle className={styles["status-icon"]} />;
      case "failed":
        return <AlertCircle className={styles["status-icon"]} />;
      default:
        return <CreditCard className={styles["status-icon"]} />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case "processing":
        return "Processing Payment...";
      case "completed":
        return "Payment Completed!";
      case "failed":
        return "Payment Failed";
      default:
        return "Ready to Pay";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          <ShoppingCart className={styles["header-icon"]} />
          <div>
            <h1 className={styles["header-title"]}>Your Cart</h1>
            <p className={styles["header-subtitle"]}>
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
        </div>
        {cartItems.length > 0 && (
          <button
            className={styles["clear-cart-btn"]}
            onClick={clearCart}
            title="Clear all items"
          >
            <Trash2 size={18} />
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className={styles["empty-cart"]}>
          <ShoppingBag className={styles["empty-icon"]} />
          <h2>Your cart is empty</h2>
          <p>Add some delicious items to get started!</p>
        </div>
      ) : (
        <>
          <div className={styles["cart-items"]}>
            {cartItems.map((item) => (
              <div key={item.CartId} className={styles["cart-item"]}>
                <div className={styles["item-image"]}>
                  <img
                    src={item.Delicacy.DelicacyImage}
                    alt={item.Delicacy.Name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300";
                    }}
                  />
                  {!item.Delicacy.IsAvailable && (
                    <div className={styles["unavailable-overlay"]}>
                      <span>Unavailable</span>
                    </div>
                  )}
                </div>

                <div className={styles["item-details"]}>
                  <div className={styles["item-header"]}>
                    <h3 className={styles["item-name"]}>
                      {item.Delicacy.Name}
                    </h3>
                    <button
                      className={styles["remove-btn"]}
                      onClick={() => removeItem(item.CartId)}
                      title="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className={styles["item-description"]}>
                    {item.Delicacy.Description}
                  </p>
                  <div className={styles["item-category"]}>
                    <span className={styles.category}>
                      {item.Delicacy.Category}
                    </span>
                  </div>
                </div>

                <div className={styles["item-actions"]}>
                  <div className={styles["quantity-controls"]}>
                    <button
                      className={styles["quantity-btn"]}
                      onClick={() =>
                        updateQuantity(item.CartId, item.Quantity - 1)
                      }
                      disabled={item.Quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className={styles.quantity}>{item.Quantity}</span>
                    <button
                      className={styles["quantity-btn"]}
                      onClick={() =>
                        updateQuantity(item.CartId, item.Quantity + 1)
                      }
                      disabled={!item.Delicacy.IsAvailable}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className={styles["item-price"]}>
                    <span className={styles["unit-price"]}>
                      ${item.Delicacy.Price.toFixed(2)} each
                    </span>
                    <span className={styles["total-price"]}>
                      ${(item.Delicacy.Price * item.Quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles["summary-content"]}>
              <h2 className={styles["summary-title"]}>Order Summary</h2>

              <div className={styles["summary-lines"]}>
                <div className={styles["summary-line"]}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles["summary-line"]}>
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className={styles["summary-line"]}>
                  <span>Delivery Fee:</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className={styles["summary-line-total"]}>
                  <span>Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles["action-buttons"]}>
                <button
                  className={styles["order-btn"]}
                  onClick={handleMakeOrder}
                >
                  <ShoppingBag size={18} />
                  Make Order
                </button>
                <button
                  className={styles["payment-btn"]}
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Clock size={18} className={styles.spinning} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Complete Payment
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Payment Status Modal */}
      {showPaymentModal && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <div className={styles["status-container"]}>
              {getStatusIcon()}
              <h3 className={styles["status-text"]}>{getStatusText()}</h3>
              {paymentStatus === "processing" && (
                <p>Please wait while we process your payment...</p>
              )}
              {paymentStatus === "completed" && (
                <p>
                  Your order has been confirmed and will be prepared shortly!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};