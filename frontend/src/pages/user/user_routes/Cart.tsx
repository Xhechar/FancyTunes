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
} from "lucide-react";
import styles from "../../../styles/user/user_routes/Cart.module.css";
import { User, Cart as UserCart } from "../../../interfaces/interfaces";
import { UsersService } from "../../../services/user.service";

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<UserCart[]>([]);
  const [filteredItems, setFilteredItems] = useState<UserCart[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock cart data
  useEffect(() => {
    const getUser = async() => {
      let result = await UsersService.GetUserByUserId();

      if (result.success) {
        setCartItems(() => (result.data as unknown as User).Carts);
        setFilteredItems(() => (result.data as unknown as User).Carts);
        setLoading(false);
      }
    };
    getUser();
  }, []);

  // Filter functionality
  useEffect(() => {
    const filtered = cartItems.filter(
      (item) =>
        item.Delicacy.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Delicacy.Category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [cartItems, searchTerm]);

  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.CartId === cartId ? { ...item, Quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.CartId !== cartId));
  };

  const getTotalAmount = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.Delicacy.Price * item.Quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.Quantity, 0);
  };

  const getItemSubtotal = (item: UserCart) => {
    return item.Delicacy.Price * item.Quantity;
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout...");
  };

  const clearCart = () => {
    setCartItems([]);
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
                      src={item.Delicacy.DelicacyImage}
                      alt={item.Delicacy.Name}
                      className={styles.delicacyImage}
                    />
                    {!item.Delicacy.IsAvailable && (
                      <div className={styles.unavailableBadge}>Unavailable</div>
                    )}
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>{item.Delicacy.Name}</h3>
                      <div className={styles.categoryBadge}>
                        {item.Delicacy.Category}
                      </div>
                    </div>
                    <p className={styles.itemDescription}>
                      {item.Delicacy.Description}
                    </p>
                    <div className={styles.itemMeta}>
                      <span className={styles.unitPrice}>
                        ${item.Delicacy.Price.toFixed(2)} each
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
                          updateQuantity(item.CartId, item.Quantity - 1)
                        }
                        className={styles.quantityButton}
                        disabled={item.Quantity <= 1}
                      >
                        <Minus className={styles.quantityIcon} />
                      </button>
                      <span className={styles.quantity}>{item.Quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.CartId, item.Quantity + 1)
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
    </div>
  );
};