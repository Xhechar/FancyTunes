import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Calendar,
  Users,
  Clock,
  Star,
  MapPin,
  CreditCard,
  ShoppingCart,
  Bell,
  Search,
  Filter,
  Heart,
  Eye,
  Plus,
  Minus,
  Check,
  X,
  ChefHat,
  Bed,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
} from "lucide-react";
import styles from "../../../styles/user/user_routes/Dashboard.module.css";
import {
  Room,
  Delicacy,
  Booking,
  Order,
  Cart,
  User,
  Notification,
} from "../../../interfaces/interfaces";
import { DelicacyService } from "../../../services/delicacy.service";
import { RoomsService } from "../../../services/room.service";
import { UsersService } from "../../../services/user.service";

// Form interfaces
interface BookingFormData {
  RoomId: string;
  CheckInDate: string;
  CheckOutDate: string;
  NumberOfGuests: number;
  SpecialRequests?: string;
}

interface OrderFormData {
  DelicacyId: string;
  Quantity: number;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "rooms" | "delicacies" | "bookings" | "orders" | "cart"
  >("rooms");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDelicacy, setSelectedDelicacy] = useState<Delicacy | null>(
    null
  );
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const bookingForm = useForm<BookingFormData>();
  const orderForm = useForm<OrderFormData>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [delicacies, setDelicacies] = useState<Delicacy[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    const getDelicacies = async() => {
      let result = await DelicacyService.GetAvailableDelicacies();

      if (result.success) {
        setDelicacies(() => result.dataList as Delicacy[]);
      }
    };

    const getRooms = async() => {
      let result = await RoomsService.GetAllRooms();

      if (result.success) {
        setRooms(() => result.dataList as Room[]);
      }
    };

    const getSingleUser = async() => {
      let result = await UsersService.GetUserByUserId();

      if (result.success) {
        setUserBookings(() => (result.data as User).Bookings);
        setUserOrders(() => (result.data as User).Orders);
        setNotifications(() => (result.data as User).Notifications);
        setCartItems(() => (result.data as User).Carts);
      }
    };

    getDelicacies();
    getRooms();
    getSingleUser();
  }, []);

  const categories = [
    "All",
    "Appetizer",
    "Main Course",
    "Dessert",
    "Beverages",
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleOrderDelicacy = (delicacy: Delicacy) => {
    setSelectedDelicacy(delicacy);
    setShowOrderModal(true);
  };

  const onBookingSubmit = (data: BookingFormData) => {
    console.log("Booking data:", { ...data, RoomId: selectedRoom?.RoomId });
    setShowBookingModal(false);
    bookingForm.reset();
  };

  const onOrderSubmit = (data: OrderFormData) => {
    console.log("Order data:", {
      ...data,
      DelicacyId: selectedDelicacy?.DelicacyId,
    });
    setShowOrderModal(false);
    orderForm.reset();
  };

  const addToCart = (delicacy: Delicacy) => {
    const newCartItem: Cart = {
      CartId: Date.now().toString(),
      UserId: "current-user-id",
      DelicacyId: delicacy.DelicacyId,
      Quantity: 1,
      AddedAt: new Date(),
      User: {} as User,
      Delicacy: delicacy,
    };
    setCartItems([...cartItems, newCartItem]);
  };

  const removeFromCart = (cartId: string) => {
    setCartItems(cartItems.filter((item) => item.CartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.CartId === cartId ? { ...item, Quantity: newQuantity } : item
      )
    );
  };

  const filteredRooms = rooms?.filter(
    (room) =>
      room.RoomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDelicacies = delicacies?.filter((delicacy) => {
    const matchesSearch =
      delicacy.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delicacy.Description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || delicacy.Category === selectedCategory;
    return matchesSearch && matchesCategory && delicacy.IsAvailable;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${styles.star} ${i < rating ? styles.filled : ""}`}
        size={16}
      />
    ));
  };

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["dashboard-header"]}>
        <div className={styles["header-top"]}>
          <button onClick={handleBack} className={styles["back-button"]}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className={styles.notifications}>
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className={styles["notification-badge"]}>
                {notifications.length}
              </span>
            )}
          </div>
        </div>

        <div className={styles["welcome-section"]}>
          <h1 className={styles["dashboard-title"]}>Welcome to FancyTunes</h1>
          <p className={styles["dashboard-subtitle"]}>
            Discover amazing rooms and delicious cuisine
          </p>
        </div>

        <div className={styles["search-section"]}>
          <div className={styles["search-bar"]}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search rooms, delicacies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === "delicacies" && (
            <div className={styles["category-filter"]}>
              <Filter size={18} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className={styles["dashboard-tabs"]}>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "rooms" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("rooms")}
        >
          <Bed size={20} />
          <span>Rooms</span>
        </button>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "delicacies" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("delicacies")}
        >
          <ChefHat size={20} />
          <span>Menu</span>
        </button>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "bookings" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          <Calendar size={20} />
          <span>My Bookings</span>
        </button>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "orders" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          <Clock size={20} />
          <span>My Orders</span>
        </button>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "cart" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("cart")}
        >
          <ShoppingCart size={20} />
          <span>Cart</span>
          {cartItems.length > 0 && (
            <span className={styles["cart-badge"]}>{cartItems.length}</span>
          )}
        </button>
      </div>

      <div className={styles["dashboard-content"]}>
        {activeTab === "rooms" && (
          <div className={styles["rooms-section"]}>
            <div className={styles["section-header"]}>
              <h2>Available Rooms</h2>
              <span className={styles.count}>{filteredRooms?.length} rooms</span>
            </div>
            <div className={styles["rooms-grid"]}>
              {filteredRooms?.map((room) => (
                <div key={room.RoomId} className={styles["room-card"]}>
                  <div className={styles["room-image"]}>
                    <img src={room.RoomImage} alt={room.RoomType} />
                    <div className={styles["room-status"]}>
                      <span
                        className={`${styles.status} ${
                          styles[room.Status.toLowerCase()]
                        }`}
                      >
                        {room.Status}
                      </span>
                    </div>
                  </div>
                  <div className={styles["room-content"]}>
                    <div className={styles["room-header"]}>
                      <h3>{room.RoomType}</h3>
                      <span className={styles["room-number"]}>
                        #{room.RoomCount}
                      </span>
                    </div>
                    <p className={styles["room-description"]}>
                      {room.Description}
                    </p>
                    <div className={styles["room-details"]}>
                      <div className={styles.detail}>
                        <Users size={16} />
                        <span>{room.Capacity} guests</span>
                      </div>
                      <div className={styles.detail}>
                        <MapPin size={16} />
                        <span>Premium Location</span>
                      </div>
                    </div>
                    <div className={styles["room-amenities"]}>
                      <Wifi size={16} />
                      <Tv size={16} />
                      <Coffee size={16} />
                      <Bath size={16} />
                      <Car size={16} />
                    </div>
                    <div className={styles["room-footer"]}>
                      <div className={styles.price}>
                        <span className={styles.amount}>
                          ${room.PricePerNight}
                        </span>
                        <span className={styles.period}>/night</span>
                      </div>
                      <button
                        className={styles["book-button"]}
                        onClick={() => handleBookRoom(room)}
                        disabled={room.Status !== "Available"}
                      >
                        {room.Status === "Available"
                          ? "Book Now"
                          : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "delicacies" && (
          <div className={styles["delicacies-section"]}>
            <div className={styles["section-header"]}>
              <h2>Our Menu</h2>
              <span className={styles.count}>
                {filteredDelicacies?.length} items
              </span>
            </div>
            <div className={styles["delicacies-grid"]}>
              {filteredDelicacies?.map((delicacy) => (
                <div
                  key={delicacy.DelicacyId}
                  className={styles["delicacy-card"]}
                >
                  <div className={styles["delicacy-image"]}>
                    <img src={delicacy.DelicacyImage} alt={delicacy.Name} />
                    <button
                      className={styles["favorite-button"]}
                      onClick={() => {
                        /* Handle favorite */
                      }}
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className={styles["delicacy-content"]}>
                    <div className={styles["delicacy-header"]}>
                      <h3>{delicacy.Name}</h3>
                      <span className={styles["category-badge"]}>
                        {delicacy.Category}
                      </span>
                    </div>
                    <p className={styles["delicacy-description"]}>
                      {delicacy.Description}
                    </p>
                    <div className={styles["delicacy-rating"]}>
                      {renderStars(4)}
                      <span className={styles["rating-text"]}>(4.0)</span>
                    </div>
                    <div className={styles["delicacy-footer"]}>
                      <div className={styles.price}>
                        <span className={styles.amount}>${delicacy.Price}</span>
                      </div>
                      <div className={styles["action-buttons"]}>
                        <button
                          className={styles["cart-button"]}
                          onClick={() => addToCart(delicacy)}
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          className={styles["order-button"]}
                          onClick={() => handleOrderDelicacy(delicacy)}
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className={styles["bookings-section"]}>
            <div className={styles["section-header"]}>
              <h2>My Bookings</h2>
              <span className={styles.count}>
                {userBookings?.length} bookings
              </span>
            </div>
            {userBookings?.length === 0 ? (
              <div className={styles["empty-state"]}>
                <Calendar size={48} />
                <h3>No Bookings Yet</h3>
                <p>Start by booking your first room!</p>
                <button
                  className={styles["primary-button"]}
                  onClick={() => setActiveTab("rooms")}
                >
                  Browse Rooms
                </button>
              </div>
            ) : (
              <div className={styles["bookings-list"]}>
                {userBookings?.map((booking) => (
                  <div
                    key={booking.BookingId}
                    className={styles["booking-card"]}
                  >
                    {/* Booking content */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className={styles["orders-section"]}>
            <div className={styles["section-header"]}>
              <h2>My Orders</h2>
              <span className={styles.count}>{userOrders?.length} orders</span>
            </div>
            {userOrders?.length === 0 ? (
              <div className={styles["empty-state"]}>
                <Clock size={48} />
                <h3>No Orders Yet</h3>
                <p>Discover our delicious menu!</p>
                <button
                  className={styles["primary-button"]}
                  onClick={() => setActiveTab("delicacies")}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className={styles["orders-list"]}>
                {userOrders?.map((order) => (
                  <div key={order.OrderId} className={styles["order-card"]}>
                    {/* Order content */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "cart" && (
          <div className={styles["cart-section"]}>
            <div className={styles["section-header"]}>
              <h2>Shopping Cart</h2>
              <span className={styles.count}>{cartItems.length} items</span>
            </div>
            {cartItems.length === 0 ? (
              <div className={styles["empty-state"]}>
                <ShoppingCart size={48} />
                <h3>Your Cart is Empty</h3>
                <p>Add some delicious items to your cart!</p>
                <button
                  className={styles["primary-button"]}
                  onClick={() => setActiveTab("delicacies")}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className={styles["cart-content"]}>
                <div className={styles["cart-items"]}>
                  {cartItems.map((item) => (
                    <div key={item.CartId} className={styles["cart-item"]}>
                      <div className={styles["item-image"]}>
                        <img
                          src={item.Delicacy.DelicacyImage}
                          alt={item.Delicacy.Name}
                        />
                      </div>
                      <div className={styles["item-details"]}>
                        <h4>{item.Delicacy.Name}</h4>
                        <p>${item.Delicacy.Price}</p>
                      </div>
                      <div className={styles["quantity-controls"]}>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.CartId, item.Quantity - 1)
                          }
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.Quantity}</span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.CartId, item.Quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className={styles["item-total"]}>
                        ${(item.Delicacy.Price * item.Quantity).toFixed(2)}
                      </div>
                      <button
                        className={styles["remove-button"]}
                        onClick={() => removeFromCart(item.CartId)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles["cart-summary"]}>
                  <div className={styles.total}>
                    <strong>
                      Total: $
                      {cartItems
                        .reduce(
                          (sum, item) =>
                            sum + item.Delicacy.Price * item.Quantity,
                          0
                        )
                        .toFixed(2)}
                    </strong>
                  </div>
                  <button className={styles["checkout-button"]}>
                    <CreditCard size={20} />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["modal-header"]}>
              <h3>Book {selectedRoom.RoomType}</h3>
              <button onClick={() => setShowBookingModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={bookingForm.handleSubmit(onBookingSubmit)}
              className={styles["booking-form"]}
            >
              <div className={styles["form-group"]}>
                <label>Check-in Date</label>
                <input
                  type="date"
                  {...bookingForm.register("CheckInDate", {
                    required: "Check-in date is required",
                    validate: (value) =>
                      new Date(value) > new Date() ||
                      "Check-in date must be in the future",
                  })}
                />
                {bookingForm.formState.errors.CheckInDate && (
                  <span className={styles.error}>
                    {bookingForm.formState.errors.CheckInDate.message}
                  </span>
                )}
              </div>
              <div className={styles["form-group"]}>
                <label>Check-out Date</label>
                <input
                  type="date"
                  {...bookingForm.register("CheckOutDate", {
                    required: "Check-out date is required",
                    validate: (value) => {
                      const checkIn = bookingForm.watch("CheckInDate");
                      return (
                        new Date(value) > new Date(checkIn) ||
                        "Check-out date must be after check-in date"
                      );
                    },
                  })}
                />
                {bookingForm.formState.errors.CheckOutDate && (
                  <span className={styles.error}>
                    {bookingForm.formState.errors.CheckOutDate.message}
                  </span>
                )}
              </div>
              <div className={styles["form-group"]}>
                <label>Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max={selectedRoom.Capacity}
                  {...bookingForm.register("NumberOfGuests", {
                    required: "Number of guests is required",
                    min: { value: 1, message: "At least 1 guest is required" },
                    max: {
                      value: selectedRoom.Capacity,
                      message: `Maximum ${selectedRoom.Capacity} guests allowed`,
                    },
                  })}
                />
                {bookingForm.formState.errors.NumberOfGuests && (
                  <span className={styles.error}>
                    {bookingForm.formState.errors.NumberOfGuests.message}
                  </span>
                )}
              </div>
              <div className={styles["form-group"]}>
                <label>Special Requests (Optional)</label>
                <textarea
                  {...bookingForm.register("SpecialRequests")}
                  placeholder="Any special requirements..."
                />
              </div>
              <div className={styles["modal-actions"]}>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className={styles["cancel-button"]}
                >
                  Cancel
                </button>
                <button type="submit" className={styles["submit-button"]}>
                  Book Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedDelicacy && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setShowOrderModal(false)}
        >
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["modal-header"]}>
              <h3>Order {selectedDelicacy.Name}</h3>
              <button onClick={() => setShowOrderModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={orderForm.handleSubmit(onOrderSubmit)}
              className={styles["order-form"]}
            >
              <div className={styles["delicacy-preview"]}>
                <img
                  src={selectedDelicacy.DelicacyImage}
                  alt={selectedDelicacy.Name}
                />
                <div className={styles["preview-details"]}>
                  <h4>{selectedDelicacy.Name}</h4>
                  <p>{selectedDelicacy.Description}</p>
                  <span className={styles.price}>
                    ${selectedDelicacy.Price}
                  </span>
                </div>
              </div>
              <div className={styles["form-group"]}>
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="1"
                  {...orderForm.register("Quantity", {
                    required: "Quantity is required",
                    min: { value: 1, message: "Minimum quantity is 1" },
                    max: { value: 10, message: "Maximum quantity is 10" },
                  })}
                />
                {orderForm.formState.errors.Quantity && (
                  <span className={styles.error}>
                    {orderForm.formState.errors.Quantity.message}
                  </span>
                )}
              </div>
              <div className={styles["modal-actions"]}>
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className={styles["cancel-button"]}
                >
                  Cancel
                </button>
                <button type="submit" className={styles["submit-button"]}>
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
