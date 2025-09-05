import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Check, 
  Trash2, 
  Calendar,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  Gift,
  Utensils,
  Bed,
  CreditCard,
  Clock
} from 'lucide-react';
import styles from '../styles/components/Notificationss.module.css';

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

interface Notification {
  NotificationId: string;
  UserId: string;
  Title: string;
  Message: string;
  IsRead: boolean;
  CreatedAt: string;
  User: User;
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

interface Cart {
  CartId: string;
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  AddedAt: string;
  User: User;
  Delicacy: Delicacy;
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

interface RoomImage {
  RoomImageId: string;
  RoomId: string;
  ImageUrl: string;
  Room: Room;
}

export const Notificationss: React.FC = () => {
  // Mock user data
  const user: User = {
    UserId: 'user123',
    FullName: 'Sarah Johnson',
    Email: 'sarah.johnson@email.com',
    Phone: '+1234567890',
    Password: '',
    Role: 'Customer',
    ProfileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    IsWelcome: true,
    CreatedAt: '2024-01-15T10:00:00Z',
    UpdatedAt: '2024-08-20T15:30:00Z',
    Bookings: [],
    Accommodations: [],
    Orders: [],
    Carts: [],
    Recoveries: [],
    Payments: [],
    Reviews: [],
    Notifications: []
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [loading, setLoading] = useState(true);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        NotificationId: 'notif1',
        UserId: user.UserId,
        Title: 'Order Confirmed',
        Message: 'Your order for Truffle Pasta Carbonara has been confirmed and is being prepared. Estimated delivery time: 25 minutes.',
        IsRead: false,
        CreatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        User: user
      },
      {
        NotificationId: 'notif2',
        UserId: user.UserId,
        Title: 'Payment Successful',
        Message: 'Your payment of $250.00 for Deluxe Suite booking has been processed successfully. Reference: REF123456',
        IsRead: false,
        CreatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        User: user
      },
      {
        NotificationId: 'notif3',
        UserId: user.UserId,
        Title: 'Room Ready for Check-in',
        Message: 'Your Deluxe Suite (Room 101) is now ready for check-in. Please visit the reception desk with your booking confirmation.',
        IsRead: true,
        CreatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        User: user
      },
      {
        NotificationId: 'notif4',
        UserId: user.UserId,
        Title: 'Special Offer Available',
        Message: 'Enjoy 20% off on all premium seafood dishes this weekend. Limited time offer - book your table now!',
        IsRead: false,
        CreatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        User: user
      },
      {
        NotificationId: 'notif5',
        UserId: user.UserId,
        Title: 'Booking Reminder',
        Message: 'Reminder: Your Executive Conference Hall booking is scheduled for tomorrow at 2:00 PM. Please arrive 15 minutes early.',
        IsRead: true,
        CreatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        User: user
      },
      {
        NotificationId: 'notif6',
        UserId: user.UserId,
        Title: 'Order Delivered',
        Message: 'Your Mediterranean Seafood Platter has been delivered to your room. We hope you enjoy your meal!',
        IsRead: true,
        CreatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        User: user
      },
      {
        NotificationId: 'notif7',
        UserId: user.UserId,
        Title: 'Review Request',
        Message: 'Thank you for your recent stay! We would love to hear about your experience. Please take a moment to leave a review.',
        IsRead: false,
        CreatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        User: user
      },
      {
        NotificationId: 'notif8',
        UserId: user.UserId,
        Title: 'New Menu Items',
        Message: 'Discover our latest culinary creations! Our chef has added 5 new seasonal dishes to the menu. View menu online.',
        IsRead: true,
        CreatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        User: user
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, [user]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = notifications.filter(notification => {
      const matchesSearch = notification.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.Message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'unread' && !notification.IsRead) ||
                           (filterStatus === 'read' && notification.IsRead);
      
      return matchesSearch && matchesFilter;
    });

    // Sort notifications
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
      } else {
        return new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime();
      }
    });

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, filterStatus, sortBy]);

  const getUnreadCount = () => {
    return notifications.filter(n => !n.IsRead).length;
  };

  const getTotalCount = () => {
    return notifications.length;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.NotificationId === notificationId 
        ? { ...notification, IsRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => 
      ({ ...notification, IsRead: true })
    ));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => 
      notification.NotificationId !== notificationId
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('order') || lowerTitle.includes('menu')) {
      return <Utensils className={styles.notificationIcon} />;
    } else if (lowerTitle.includes('room') || lowerTitle.includes('booking')) {
      return <Bed className={styles.notificationIcon} />;
    } else if (lowerTitle.includes('payment')) {
      return <CreditCard className={styles.notificationIcon} />;
    } else if (lowerTitle.includes('offer') || lowerTitle.includes('special')) {
      return <Gift className={styles.notificationIcon} />;
    } else if (lowerTitle.includes('reminder')) {
      return <Clock className={styles.notificationIcon} />;
    } else {
      return <Info className={styles.notificationIcon} />;
    }
  };

  const getTimeAgo = (createdAt: string) => {
    const now = new Date().getTime();
    const created = new Date(createdAt).getTime();
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your notifications...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              <Bell className={styles.titleIcon} />
              Notifications
            </h1>
            <p className={styles.subtitle}>
              Stay updated with your latest activities and updates
            </p>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <BellRing className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{getUnreadCount()}</span>
                <span className={styles.statLabel}>Unread</span>
              </div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <Bell className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{getTotalCount()}</span>
                <span className={styles.statLabel}>Total</span>
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
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <Filter className={styles.filterIcon} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unread' | 'read')}
              className={styles.filterSelect}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className={styles.filterSelect}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className={styles.actionsContainer}>
          {getUnreadCount() > 0 && (
            <button
              onClick={markAllAsRead}
              className={styles.markAllButton}
            >
              <CheckCircle className={styles.actionIcon} />
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className={styles.clearAllButton}
            >
              <Trash2 className={styles.actionIcon} />
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className={styles.notificationsContainer}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell className={styles.emptyIcon} />
            <h3>{notifications.length === 0 ? 'No notifications yet' : 'No notifications found'}</h3>
            <p>{notifications.length === 0 ? 'When you have new updates, they will appear here' : 'Try adjusting your search or filters'}</p>
          </div>
        ) : (
          <div className={styles.notificationsList}>
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.NotificationId} 
                className={`${styles.notificationCard} ${!notification.IsRead ? styles.unread : ''}`}
              >
                <div className={styles.notificationHeader}>
                  <div className={styles.notificationMeta}>
                    {getNotificationIcon(notification.Title)}
                    <div className={styles.notificationTime}>
                      <Calendar className={styles.timeIcon} />
                      <span>{getTimeAgo(notification.CreatedAt)}</span>
                    </div>
                  </div>
                  
                  {!notification.IsRead && (
                    <div className={styles.unreadIndicator}></div>
                  )}
                </div>

                <div className={styles.notificationContent}>
                  <h3 className={styles.notificationTitle}>{notification.Title}</h3>
                  <p className={styles.notificationMessage}>{notification.Message}</p>
                </div>

                <div className={styles.notificationActions}>
                  {!notification.IsRead && (
                    <button
                      onClick={() => markAsRead(notification.NotificationId)}
                      className={styles.markReadButton}
                    >
                      <Check className={styles.actionIcon} />
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.NotificationId)}
                    className={styles.deleteButton}
                  >
                    <Trash2 className={styles.actionIcon} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};