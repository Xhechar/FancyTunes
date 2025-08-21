import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
  Bath
} from 'lucide-react';
import styles from "../../../styles/user/user_routes/Dashboard.module.css";
import { Room, Delicacy, Booking, Order, Cart, User, Notification } from '../../../interfaces/interfaces';

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
  const [activeTab, setActiveTab] = useState<'rooms' | 'delicacies' | 'bookings' | 'orders' | 'cart'>('rooms');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDelicacy, setSelectedDelicacy] = useState<Delicacy | null>(null);
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const bookingForm = useForm<BookingFormData>();
  const orderForm = useForm<OrderFormData>();

  // Mock data - Replace with actual API calls
  const [rooms] = useState<Room[]>([
    {
      RoomId: '1',
      RoomNumber: '101',
      RoomType: 'Deluxe Suite',
      PricePerNight: 150,
      Description: 'Luxurious suite with ocean view and premium amenities',
      Capacity: 4,
      Status: 'Available',
      RoomImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500',
      CreatedAt: '2024-01-01',
      UpdatedAt: '2024-01-01',
      Accommodations: [],
      Bookings: [],
      Reviews: [],
      RoomImages: []
    },
    {
      RoomId: '2',
      RoomNumber: '201',
      RoomType: 'Conference Hall',
      PricePerNight: 300,
      Description: 'Modern conference facility with state-of-the-art equipment',
      Capacity: 50,
      Status: 'Available',
      RoomImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
      CreatedAt: '2024-01-01',
      UpdatedAt: '2024-01-01',
      Accommodations: [],
      Bookings: [],
      Reviews: [],
      RoomImages: []
    }
  ]);

  const [delicacies] = useState<Delicacy[]>([
    {
      DelicacyId: '1',
      Name: 'Grilled Salmon',
      Description: 'Fresh Atlantic salmon with herbs and lemon',
      Price: 28.99,
      DelicacyImage: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500',
      Category: 'Main Course',
      IsAvailable: true,
      CreatedAt: '2024-01-01',
      UpdatedAt: '2024-01-01',
      Orders: [],
      Carts: [],
      OrderItems: [],
      Reviews: []
    },
    {
      DelicacyId: '2',
      Name: 'Chocolate Cake',
      Description: 'Rich chocolate cake with vanilla frosting',
      Price: 12.99,
      DelicacyImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
      Category: 'Dessert',
      IsAvailable: true,
      CreatedAt: '2024-01-01',
      UpdatedAt: '2024-01-01',
      Orders: [],
      Carts: [],
      OrderItems: [],
      Reviews: []
    }
  ]);

  const [userBookings] = useState<Booking[]>([]);
  const [userOrders] = useState<Order[]>([]);

  const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Beverages'];

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
    console.log('Booking data:', { ...data, RoomId: selectedRoom?.RoomId });
    setShowBookingModal(false);
    bookingForm.reset();
  };

  const onOrderSubmit = (data: OrderFormData) => {
    console.log('Order data:', { ...data, DelicacyId: selectedDelicacy?.DelicacyId });
    setShowOrderModal(false);
    orderForm.reset();
  };

  const addToCart = (delicacy: Delicacy) => {
    const newCartItem: Cart = {
      CartId: Date.now().toString(),
      UserId: 'current-user-id',
      DelicacyId: delicacy.DelicacyId,
      Quantity: 1,
      AddedAt: new Date().toISOString(),
      User: {} as User,
      Delicacy: delicacy
    };
    setCartItems([...cartItems, newCartItem]);
  };

  const removeFromCart = (cartId: string) => {
    setCartItems(cartItems.filter(item => item.CartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.CartId === cartId ? { ...item, Quantity: newQuantity } : item
    ));
  };

  const filteredRooms = rooms.filter(room =>
    room.RoomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDelicacies = delicacies.filter(delicacy => {
    const matchesSearch = delicacy.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delicacy.Description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || delicacy.Category === selectedCategory;
    return matchesSearch && matchesCategory && delicacy.IsAvailable;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`star ${i < rating ? 'filled' : ''}`}
        size={16}
      />
    ));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-top">
          <button onClick={handleBack} className="back-button">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="notifications">
            <Bell size={20} />
            {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
          </div>
        </div>
        
        <div className="welcome-section">
          <h1 className="dashboard-title">Welcome to FancyTunes</h1>
          <p className="dashboard-subtitle">Discover amazing rooms and delicious cuisine</p>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search rooms, delicacies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'delicacies' && (
            <div className="category-filter">
              <Filter size={18} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          <Bed size={20} />
          <span>Rooms</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'delicacies' ? 'active' : ''}`}
          onClick={() => setActiveTab('delicacies')}
        >
          <ChefHat size={20} />
          <span>Menu</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Calendar size={20} />
          <span>My Bookings</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Clock size={20} />
          <span>My Orders</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          <ShoppingCart size={20} />
          <span>Cart</span>
          {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'rooms' && (
          <div className="rooms-section">
            <div className="section-header">
              <h2>Available Rooms</h2>
              <span className="count">{filteredRooms.length} rooms</span>
            </div>
            <div className="rooms-grid">
              {filteredRooms.map(room => (
                <div key={room.RoomId} className="room-card">
                  <div className="room-image">
                    <img src={room.RoomImage} alt={room.RoomType} />
                    <div className="room-status">
                      <span className={`status ${room.Status.toLowerCase()}`}>
                        {room.Status}
                      </span>
                    </div>
                  </div>
                  <div className="room-content">
                    <div className="room-header">
                      <h3>{room.RoomType}</h3>
                      <span className="room-number">#{room.RoomNumber}</span>
                    </div>
                    <p className="room-description">{room.Description}</p>
                    <div className="room-details">
                      <div className="detail">
                        <Users size={16} />
                        <span>{room.Capacity} guests</span>
                      </div>
                      <div className="detail">
                        <MapPin size={16} />
                        <span>Premium Location</span>
                      </div>
                    </div>
                    <div className="room-amenities">
                      <Wifi size={16} />
                      <Tv size={16} />
                      <Coffee size={16} />
                      <Bath size={16} />
                      <Car size={16} />
                    </div>
                    <div className="room-footer">
                      <div className="price">
                        <span className="amount">${room.PricePerNight}</span>
                        <span className="period">/night</span>
                      </div>
                      <button
                        className="book-button"
                        onClick={() => handleBookRoom(room)}
                        disabled={room.Status !== 'Available'}
                      >
                        {room.Status === 'Available' ? 'Book Now' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'delicacies' && (
          <div className="delicacies-section">
            <div className="section-header">
              <h2>Our Menu</h2>
              <span className="count">{filteredDelicacies.length} items</span>
            </div>
            <div className="delicacies-grid">
              {filteredDelicacies.map(delicacy => (
                <div key={delicacy.DelicacyId} className="delicacy-card">
                  <div className="delicacy-image">
                    <img src={delicacy.DelicacyImage} alt={delicacy.Name} />
                    <button 
                      className="favorite-button"
                      onClick={() => {/* Handle favorite */}}
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className="delicacy-content">
                    <div className="delicacy-header">
                      <h3>{delicacy.Name}</h3>
                      <span className="category-badge">{delicacy.Category}</span>
                    </div>
                    <p className="delicacy-description">{delicacy.Description}</p>
                    <div className="delicacy-rating">
                      {renderStars(4)}
                      <span className="rating-text">(4.0)</span>
                    </div>
                    <div className="delicacy-footer">
                      <div className="price">
                        <span className="amount">${delicacy.Price}</span>
                      </div>
                      <div className="action-buttons">
                        <button
                          className="cart-button"
                          onClick={() => addToCart(delicacy)}
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          className="order-button"
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

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="section-header">
              <h2>My Bookings</h2>
              <span className="count">{userBookings.length} bookings</span>
            </div>
            {userBookings.length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} />
                <h3>No Bookings Yet</h3>
                <p>Start by booking your first room!</p>
                <button
                  className="primary-button"
                  onClick={() => setActiveTab('rooms')}
                >
                  Browse Rooms
                </button>
              </div>
            ) : (
              <div className="bookings-list">
                {userBookings.map(booking => (
                  <div key={booking.BookingId} className="booking-card">
                    {/* Booking content */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="section-header">
              <h2>My Orders</h2>
              <span className="count">{userOrders.length} orders</span>
            </div>
            {userOrders.length === 0 ? (
              <div className="empty-state">
                <Clock size={48} />
                <h3>No Orders Yet</h3>
                <p>Discover our delicious menu!</p>
                <button
                  className="primary-button"
                  onClick={() => setActiveTab('delicacies')}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {userOrders.map(order => (
                  <div key={order.OrderId} className="order-card">
                    {/* Order content */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="cart-section">
            <div className="section-header">
              <h2>Shopping Cart</h2>
              <span className="count">{cartItems.length} items</span>
            </div>
            {cartItems.length === 0 ? (
              <div className="empty-state">
                <ShoppingCart size={48} />
                <h3>Your Cart is Empty</h3>
                <p>Add some delicious items to your cart!</p>
                <button
                  className="primary-button"
                  onClick={() => setActiveTab('delicacies')}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="cart-content">
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.CartId} className="cart-item">
                      <div className="item-image">
                        <img src={item.Delicacy.DelicacyImage} alt={item.Delicacy.Name} />
                      </div>
                      <div className="item-details">
                        <h4>{item.Delicacy.Name}</h4>
                        <p>${item.Delicacy.Price}</p>
                      </div>
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateCartQuantity(item.CartId, item.Quantity - 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.Quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.CartId, item.Quantity + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="item-total">
                        ${(item.Delicacy.Price * item.Quantity).toFixed(2)}
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.CartId)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="total">
                    <strong>
                      Total: ${cartItems.reduce((sum, item) => sum + (item.Delicacy.Price * item.Quantity), 0).toFixed(2)}
                    </strong>
                  </div>
                  <button className="checkout-button">
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
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book {selectedRoom.RoomType}</h3>
              <button onClick={() => setShowBookingModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={bookingForm.handleSubmit(onBookingSubmit)} className="booking-form">
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  {...bookingForm.register('CheckInDate', { 
                    required: 'Check-in date is required',
                    validate: value => new Date(value) > new Date() || 'Check-in date must be in the future'
                  })}
                />
                {bookingForm.formState.errors.CheckInDate && (
                  <span className="error">{bookingForm.formState.errors.CheckInDate.message}</span>
                )}
              </div>
              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  {...bookingForm.register('CheckOutDate', { 
                    required: 'Check-out date is required',
                    validate: (value) => {
                      const checkIn = bookingForm.watch('CheckInDate');
                      return new Date(value) > new Date(checkIn) || 'Check-out date must be after check-in date';
                    }
                  })}
                />
                {bookingForm.formState.errors.CheckOutDate && (
                  <span className="error">{bookingForm.formState.errors.CheckOutDate.message}</span>
                )}
              </div>
              <div className="form-group">
                <label>Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max={selectedRoom.Capacity}
                  {...bookingForm.register('NumberOfGuests', { 
                    required: 'Number of guests is required',
                    min: { value: 1, message: 'At least 1 guest is required' },
                    max: { value: selectedRoom.Capacity, message: `Maximum ${selectedRoom.Capacity} guests allowed` }
                  })}
                />
                {bookingForm.formState.errors.NumberOfGuests && (
                  <span className="error">{bookingForm.formState.errors.NumberOfGuests.message}</span>
                )}
              </div>
              <div className="form-group">
                <label>Special Requests (Optional)</label>
                <textarea
                  {...bookingForm.register('SpecialRequests')}
                  placeholder="Any special requirements..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowBookingModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Book Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedDelicacy && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order {selectedDelicacy.Name}</h3>
              <button onClick={() => setShowOrderModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={orderForm.handleSubmit(onOrderSubmit)} className="order-form">
              <div className="delicacy-preview">
                <img src={selectedDelicacy.DelicacyImage} alt={selectedDelicacy.Name} />
                <div className="preview-details">
                  <h4>{selectedDelicacy.Name}</h4>
                  <p>{selectedDelicacy.Description}</p>
                  <span className="price">${selectedDelicacy.Price}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="1"
                  {...orderForm.register('Quantity', { 
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Minimum quantity is 1' },
                    max: { value: 10, message: 'Maximum quantity is 10' }
                  })}
                />
                {orderForm.formState.errors.Quantity && (
                  <span className="error">{orderForm.formState.errors.Quantity.message}</span>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowOrderModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
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