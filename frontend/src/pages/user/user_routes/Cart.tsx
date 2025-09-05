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

// Import your interfaces
interface User {
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

interface Delicacy {
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

interface Cart {
  CartId: string;
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  AddedAt: string;
  User: User;
  Delicacy: Delicacy;
}

interface Booking {
  BookingId: string;
  UserId: string;
  RoomId: string;
  CheckInDate: string;
  CheckOutDate: string;
  NumberOfGuests: number;
  TotalAmount: number;
  SpecialRequests?: string;
  BookingStatus: string;
  PaymentStatus: string;
  CreatedAt: string;
  UpdatedAt: string;
  User: User;
  Room: Room;
}

interface Room {
  RoomId: string;
  RoomNumber: string;
  RoomType: string;
  PricePerNight: number;
  Description: string;
  Capacity: number;
  Status: string;
  RoomImage?: string;
  CreatedAt: string;
  UpdatedAt: string;
  Accommodations: Accommodation[];
  Bookings: Booking[];
  Reviews: Review[];
  RoomImages: RoomImage[];
}

interface Order {
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

interface OrderItem {
  OrderItemId: string;
  OrderId: string;
  DelicacyId: string;
  Quantity: number;
  Price: number;
  Subtotal: number;
  Order: Order;
  Delicacy: Delicacy;
}

interface Accommodation {
  AccommodationId: string;
  UserId: string;
  RoomId: string;
  CheckInDate: string;
  CheckOutDate: string;
  TotalAmount: number;
  SpecialRequests?: string;
  PaymentStatus: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  User: User;
  Room: Room;
}

interface Recovery {
  RecoveryId: string;
  UserId: string;
  VerificationCode: number;
  ExpiresAt: string;
  IsUsed: boolean;
  CreatedAt: string;
  User: User;
}

interface Payment {
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

interface Review {
  ReviewId: string;
  UserId: string;
  RoomId?: string;
  DelicacyId?: string;
  Rating: number;
  Comment: string;
  CreatedAt: string;
  User: User;
  Room?: Room;
  Delicacy?: Delicacy;
}

interface Notification {
  NotificationId: string;
  UserId: string;
  Title: string;
  Message: string;
  IsRead: boolean;
  CreatedAt: string;
  User: User;
}

interface RoomImage {
  RoomImageId: string;
  RoomId: string;
  ImageUrl: string;
  Room: Room;
}

export const Cart: React.FC = () => {
  // Mock user data
  const user: User = {
    UserId: "user123",
    FullName: "Sarah Johnson",
    Email: "sarah.johnson@email.com",
    Phone: "+1234567890",
    Password: "",
    Role: "Customer",
    ProfileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    IsWelcome: true,
    CreatedAt: "2024-01-15T10:00:00Z",
    UpdatedAt: "2024-08-20T15:30:00Z",
    Bookings: [],
    Accommodations: [],
    Orders: [],
    Carts: [],
    Recoveries: [],
    Payments: [],
    Reviews: [],
    Notifications: [],
  };

  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [filteredItems, setFilteredItems] = useState<Cart[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock cart data
  useEffect(() => {
    const mockCartItems: Cart[] = [
      {
        CartId: "cart1",
        UserId: user.UserId,
        DelicacyId: "del1",
        Quantity: 2,
        AddedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        User: user,
        Delicacy: {
          DelicacyId: "del1",
          Name: "Truffle Pasta Carbonara",
          Description:
            "Handmade pasta with black truffle cream sauce, pancetta, and aged parmesan",
          Price: 35.0,
          DelicacyImage:
            "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
          Category: "Main Course",
          IsAvailable: true,
          CreatedAt: "",
          UpdatedAt: "",
          Orders: [],
          Carts: [],
          OrderItems: [],
          Reviews: [],
        },
      },
      {
        CartId: "cart2",
        UserId: user.UserId,
        DelicacyId: "del2",
        Quantity: 1,
        AddedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        User: user,
        Delicacy: {
          DelicacyId: "del2",
          Name: "Mediterranean Seafood Platter",
          Description:
            "Fresh lobster, prawns, scallops, and mussels with herb butter and lemon",
          Price: 85.0,
          DelicacyImage:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
          Category: "Seafood",
          IsAvailable: true,
          CreatedAt: "",
          UpdatedAt: "",
          Orders: [],
          Carts: [],
          OrderItems: [],
          Reviews: [],
        },
      },
      {
        CartId: "cart3",
        UserId: user.UserId,
        DelicacyId: "del3",
        Quantity: 3,
        AddedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        User: user,
        Delicacy: {
          DelicacyId: "del3",
          Name: "Chocolate Lava Cake",
          Description:
            "Warm chocolate cake with molten center, served with vanilla ice cream",
          Price: 12.0,
          DelicacyImage:
            "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
          Category: "Dessert",
          IsAvailable: true,
          CreatedAt: "",
          UpdatedAt: "",
          Orders: [],
          Carts: [],
          OrderItems: [],
          Reviews: [],
        },
      },
      {
        CartId: "cart4",
        UserId: user.UserId,
        DelicacyId: "del4",
        Quantity: 1,
        AddedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        User: user,
        Delicacy: {
          DelicacyId: "del4",
          Name: "Caesar Salad Supreme",
          Description:
            "Crisp romaine lettuce with house-made croutons, parmesan, and caesar dressing",
          Price: 18.0,
          DelicacyImage:
            "https://images.unsplash.com/photo-1512852939750-1305098529bf?w=400",
          Category: "Appetizer",
          IsAvailable: false,
          CreatedAt: "",
          UpdatedAt: "",
          Orders: [],
          Carts: [],
          OrderItems: [],
          Reviews: [],
        },
      },
      {
        CartId: "cart5",
        UserId: user.UserId,
        DelicacyId: "del5",
        Quantity: 2,
        AddedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        User: user,
        Delicacy: {
          DelicacyId: "del5",
          Name: "Craft Beer Selection",
          Description: "Local brewery selection of three premium craft beers",
          Price: 22.0,
          DelicacyImage:
            "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400",
          Category: "Beverages",
          IsAvailable: true,
          CreatedAt: "",
          UpdatedAt: "",
          Orders: [],
          Carts: [],
          OrderItems: [],
          Reviews: [],
        },
      },
    ];

    setTimeout(() => {
      setCartItems(mockCartItems);
      setFilteredItems(mockCartItems);
      setLoading(false);
    }, 1000);
  }, [user]);

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

  const getItemSubtotal = (item: Cart) => {
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