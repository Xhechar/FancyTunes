import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Calendar,
  DollarSign,
  Search,
  TrendingUp,
  Package,
  CreditCard,
  ShoppingBag,
  Loader2,
  Check,
  X,
} from "lucide-react";
import styles from "../../../styles/user/user_routes/Cart.module.css";
import { User, Cart as UserCart } from "../../../interfaces/interfaces";
import { UsersService } from "../../../services/user.service";
import Toast, { ToastProps } from "../../../components/Toast";
import { socket } from "../../../socket.io";
import { CartService } from "../../../services/cart.service";

type PaymentMethod = "mpesa" | "stripe";

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<UserCart[]>([]);
  const [filteredItems, setFilteredItems] = useState<UserCart[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    title: string;
    message: string;
    type: "processing" | "success" | "error";
  } | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on("cart-created", (newCart: UserCart) => {
      setCartItems((prev) => [newCart, ...prev]);
    });

    socket.on("cart-updated", (updatedCart: UserCart) => {
      setCartItems((prev) => {
        const index = prev.findIndex(
          (item) => item.CartId === updatedCart.CartId
        );
        if (index !== -1) {
          const newCart = [...prev];
          newCart[index] = updatedCart;
          return newCart;
        } else {
          return [updatedCart, ...prev];
        }
      });
    });

    socket.on("cart-deleted", (deletedCart: UserCart) => {
      setCartItems((prev) =>
        prev.filter((item) => item.CartId !== deletedCart.CartId)
      );
    });

    socket.on("cart-cleared", (deletedCarts: UserCart[]) => {
      setCartItems((prev) =>
        prev.filter((item) => !deletedCarts.some((d) => d.CartId === item.CartId))
      );
      setFilteredItems((prev) =>
        prev.filter((item) => !deletedCarts.some((d) => d.CartId === item.CartId))
      );
    });

    return () => {
      socket.off("cart-created");
      socket.off("cart-updated");
      socket.off("cart-deleted");
      socket.off("cart-cleared");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    try {
      const getUser = async () => {
        let result = await UsersService.GetUserByUserId();

        if (result.success) {
          setCartItems(
            () => (result.data as unknown as User).Carts as UserCart[]
          );
          setFilteredItems(
            () => (result.data as unknown as User).Carts as UserCart[]
          );
          setLoading(false);
        } else {
          const toast: ToastProps = {
            isVisible: true,
            type: "warning",
            title: (result.error as string) || "Warning",
            message:
              (result.message as string) || "Unable to fetch cart items.",
            onClose: () => setToast(null),
          };
          setToast(toast);
          setLoading(false);
        }
      };

      const getUserCarts = async () => {
        const result = await CartService.GetUserCarts();

        if (result.success) setCartItems(result.dataList as UserCart[]);
      };

      getUserCarts();
      getUser();
    } catch (error: any) {
      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: (error?.response?.data?.error as string) || "Error",
        message:
          (error?.response?.data?.message as string) ||
          "An error occurred while fetching cart items.",
        onClose: () => setToast(null),
      };
      setToast(toast);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const filtered = cartItems.filter(
      (item) =>
        item.Delicacy?.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Delicacy?.Category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [cartItems, searchTerm]);

  const IncrementCartQuantity = async (CartId: string) => {
    try {
      const result = await CartService.IncrementCartItem(CartId);

      if (result.success) {
        setToast({
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message: (result.message as string) || "Item quantity increased.",
          onClose: () => setToast(null),
        });
      } else {
        setToast({
          isVisible: true,
          type: "error",
          title: (result.error as string) || "Error",
          message: (result.message as string) || "Unable to update cart item.",
          onClose: () => setToast(null),
        });
      }
    } catch (error: any) {
      setToast({
        isVisible: true,
        type: "error",
        title: (error?.response?.data?.error as string) || "Error",
        message:
          (error?.response?.data?.message as string) ||
          error?.message ||
          "An unexpected error occurred while updating the cart item.",
        onClose: () => setToast(null),
      });
    }
  };

  const DecrementCartQuantity = async (CartId: string) => {
    try {
      const result = await CartService.DecrementCartItem(CartId);

      if (result.success) {
        setToast({
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message: (result.message as string) || "Item quantity decreased.",
          onClose: () => setToast(null),
        });
      } else {
        setToast({
          isVisible: true,
          type: "error",
          title: (result.error as string) || "Warning",
          message: (result.message as string) || "Unable to update cart item.",
          onClose: () => setToast(null),
        });
      }
    } catch (error: any) {
      setToast({
        isVisible: true,
        type: "error",
        title: (error?.response?.data?.error as string) || "Error",
        message:
          (error?.response?.data?.message as string) ||
          error?.message ||
          "An unexpected error occurred while updating the cart item.",
        onClose: () => setToast(null),
      });
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      const result = await CartService.DeleteCart(cartId);

      if (result.success) {
        setCartItems((prev) => prev.filter((item) => item.CartId !== cartId));
        setFilteredItems((prev) => prev.filter((item) => item.CartId !== cartId));

        setToast({
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message: (result.message as string) || "Item removed from cart.",
          onClose: () => setToast(null),
        });
      } else {
        setToast({
          isVisible: true,
          type: "error",
          title: (result.error as string) || "Error",
          message: (result.message as string) || "Unable to remove item from cart.",
          onClose: () => setToast(null),
        });
      }
    } catch (error: any) {
      setToast({
        isVisible: true,
        type: "error",
        title: (error?.response?.data?.error as string) || "Error",
        message:
          (error?.response?.data?.message as string) ||
          "An error occurred while removing the item from the cart.",
        onClose: () => setToast(null),
      });
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.Delicacy?.Price ?? 0);
      return sum + price * item.Quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.Quantity, 0);
  };

  const getItemSubtotal = (item: UserCart) => {
    const price = Number(item.Delicacy?.Price ?? 0);
    return price * item.Quantity;
  };

  const processPayment = async (amount: number) => {
    setIsProcessingPayment(true);

    if (paymentMethod === "mpesa") {
      setPaymentStatus({
        title: "STK Push Sent",
        message:
          "Please check your phone and enter your M-PESA PIN to complete the payment.",
        type: "processing",
      });

      // Simulated M-PESA STK Push
      setTimeout(() => {
        // Simulated success
        setPaymentStatus({
          title: "Payment Successful!",
          message:
            "Your order has been processed successfully. You will receive a confirmation shortly.",
          type: "success",
        });
        setIsProcessingPayment(false);

        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentStatus(null);

          const toast: ToastProps = {
            isVisible: true,
            type: "success",
            title: "SUCCESS",
            message: "Order completed successfully!",
            onClose: () => setToast(null),
          };
          setToast(toast);
        }, 2000);
      }, 5000);
    } else {
      // Stripe payment
      setPaymentStatus({
        title: "Processing Stripe Payment",
        message: "Please wait while we redirect you to Stripe...",
        type: "processing",
      });

      setTimeout(() => {
        setPaymentStatus({
          title: "Payment Successful!",
          message: "Your payment has been processed successfully via Stripe.",
          type: "success",
        });
        setIsProcessingPayment(false);

        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentStatus(null);

          const toast: ToastProps = {
            isVisible: true,
            type: "success",
            title: "SUCCESS",
            message: "Order completed successfully!",
            onClose: () => setToast(null),
          };
          setToast(toast);
        }, 2000);
      }, 3000);
    }
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handleProceedToPayment = () => {
    const totalAmount = getTotalAmount() + 5.0;
    processPayment(totalAmount);
  };

  const clearCart = async() => {
    let result = await CartService.ClearUserCarts();

    const clearCart = async () => {
      try {
        const result = await CartService.ClearUserCarts();

        if (result.success) {
          setToast({
            isVisible: true,
            type: "success",
            title: "SUCCESS",
            message: (result.message as string) || "Cart cleared successfully.",
            onClose: () => setToast(null),
          });
        } else {
          setToast({
            isVisible: true,
            type: "error",
            title: (result.error as string) || "Error",
            message: (result.message as string) || "Unable to clear cart.",
            onClose: () => setToast(null),
          });
        }
      } catch (error: any) {
        setToast({
          isVisible: true,
          type: "error",
          title: (error?.response?.data?.error as string) || "Error",
          message:
            (error?.response?.data?.message as string) ||
            error?.message ||
            "An error occurred while clearing the cart.",
          onClose: () => setToast(null),
        });
      }
    };
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {toast && <Toast {...toast} />}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              <ShoppingCart className={styles.titleIcon} />
              My Cart
            </h1>
            <p className={styles.subtitle}>
              Review and manage your selected items
            </p>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <Package className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{getTotalItems()}</span>
                <span className={styles.statLabel}>Total Items</span>
              </div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <TrendingUp className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  ${getTotalAmount().toFixed(2)}
                </span>
                <span className={styles.statLabel}>Total Amount</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search cart items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.actionsContainer}>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className={styles.clearButton}>
              <Trash2 className={styles.actionIcon} />
              Clear Cart
            </button>
          )}
        </div>
      </div>

      <div className={styles.cartContainer}>
        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <ShoppingCart className={styles.emptyIcon} />
            <h3>
              {cartItems.length === 0 ? "Your cart is empty" : "No items found"}
            </h3>
            <p>
              {cartItems.length === 0
                ? "Add some delicious items to get started"
                : "Try adjusting your search"}
            </p>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {filteredItems.map((item) => (
                <div key={item.CartId} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img
                      src={item.Delicacy?.DelicacyImage}
                      alt={item.Delicacy?.Name}
                      className={styles.delicacyImage}
                    />
                    {!item.Delicacy?.IsAvailable && (
                      <div className={styles.unavailableBadge}>Unavailable</div>
                    )}
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>{item.Delicacy?.Name}</h3>
                      <div className={styles.categoryBadge}>
                        {item.Delicacy?.Category}
                      </div>
                    </div>
                    <p className={styles.itemDescription}>
                      {item.Delicacy?.Description}
                    </p>
                    <div className={styles.itemMeta}>
                      <span className={styles.unitPrice}>
                        ${Number(item.Delicacy?.Price ?? 0).toFixed(2)} each
                      </span>
                      <div className={styles.addedTime}>
                        <Calendar className={styles.timeIcon} />
                        <span>
                          Added {new Date(item.AddedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() =>
                          DecrementCartQuantity(item.CartId)
                        }
                        className={styles.quantityButton}
                        disabled={item.Quantity <= 1}
                      >
                        <Minus className={styles.quantityIcon} />
                      </button>
                      <span className={styles.quantity}>{item.Quantity}</span>
                      <button
                        onClick={() =>
                          IncrementCartQuantity(item.CartId)
                        }
                        className={styles.quantityButton}
                      >
                        <Plus className={styles.quantityIcon} />
                      </button>
                    </div>

                    <div className={styles.itemTotal}>
                      <span className={styles.subtotal}>
                        ${getItemSubtotal(item).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.CartId)}
                      className={styles.removeButton}
                    >
                      <Trash2 className={styles.removeIcon} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <div className={styles.summaryContent}>
                <div className={styles.summaryHeader}>
                  <h3>Order Summary</h3>
                </div>

                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <span>Items ({getTotalItems()})</span>
                    <span>${getTotalAmount().toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Service Fee</span>
                    <span>$5.00</span>
                  </div>
                  <div className={styles.summaryDivider}></div>
                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>${(getTotalAmount() + 5.0).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className={styles.checkoutButton}
                  disabled={cartItems.length === 0}
                >
                  <CreditCard className={styles.checkoutIcon} />
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {!paymentStatus ? (
              <>
                <div className={styles.modalHeader}>
                  <h3>Select Payment Method</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className={styles.modalCloseButton}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.paymentMethodSelector}>
                    <div className={styles.paymentOptions}>
                      <label className={styles.paymentOption}>
                        <input
                          type="radio"
                          value="mpesa"
                          checked={paymentMethod === "mpesa"}
                          onChange={(e) =>
                            setPaymentMethod(e.target.value as PaymentMethod)
                          }
                        />
                        <div className={styles.paymentOptionContent}>
                          <span className={styles.paymentIcon}>📱</span>
                          <span className={styles.paymentLabel}>M-PESA</span>
                        </div>
                      </label>
                      <label className={styles.paymentOption}>
                        <input
                          type="radio"
                          value="stripe"
                          checked={paymentMethod === "stripe"}
                          onChange={(e) =>
                            setPaymentMethod(e.target.value as PaymentMethod)
                          }
                        />
                        <div className={styles.paymentOptionContent}>
                          <span className={styles.paymentIcon}>💳</span>
                          <span className={styles.paymentLabel}>Stripe</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className={styles.paymentSummary}>
                    <div className={styles.summaryRow}>
                      <span>Subtotal:</span>
                      <span>${getTotalAmount().toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Service Fee:</span>
                      <span>$5.00</span>
                    </div>
                    <div className={styles.summaryDivider}></div>
                    <div className={styles.summaryTotal}>
                      <span>Total:</span>
                      <span>${(getTotalAmount() + 5.0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    className={styles.proceedButton}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.paymentStatusModal}>
                <div className={styles.paymentIconContainer}>
                  {paymentStatus.type === "processing" && (
                    <Loader2 className={styles.processingSpinner} size={64} />
                  )}
                  {paymentStatus.type === "success" && (
                    <div className={styles.successIcon}>
                      <Check size={64} />
                    </div>
                  )}
                  {paymentStatus.type === "error" && (
                    <div className={styles.errorIcon}>
                      <X size={64} />
                    </div>
                  )}
                </div>
                <h3 className={styles.paymentTitle}>{paymentStatus.title}</h3>
                <p className={styles.paymentMessage}>{paymentStatus.message}</p>

                {paymentStatus.type === "processing" && (
                  <div className={styles.paymentInfo}>
                    <div className={styles.infoCard}>
                      <span className={styles.infoLabel}>Payment Method:</span>
                      <span className={styles.infoValue}>
                        {paymentMethod === "mpesa" ? "M-PESA" : "Stripe"}
                      </span>
                    </div>
                    <div className={styles.infoCard}>
                      <span className={styles.infoLabel}>Amount:</span>
                      <span className={styles.infoValue}>
                        ${(getTotalAmount() + 5.0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
