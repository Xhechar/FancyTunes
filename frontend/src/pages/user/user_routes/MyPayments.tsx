import React, { useState, useEffect } from "react";
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Utensils,
  Bed,
  TrendingUp,
  Receipt,
  Banknote,
  Smartphone,
  Building2,
  Download,
  Eye,
} from "lucide-react";
import styles from "../../../styles/user/user_routes/MyPayments.module.css";

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

interface PaymentWithDetails extends Payment {
  relatedBooking?: Booking;
  relatedOrder?: Order;
  relatedRoom?: Room;
  relatedDelicacy?: Delicacy;
}

export const MyPayments: React.FC = () => {
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

  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<
    PaymentWithDetails[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending" | "failed"
  >("all");
  const [filterMethod, setFilterMethod] = useState<
    "all" | "credit-card" | "digital-wallet" | "bank-transfer"
  >("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "amount-high" | "amount-low"
  >("newest");
  const [loading, setLoading] = useState(true);

  // Mock payments data
  useEffect(() => {
    const mockPayments: PaymentWithDetails[] = [
      {
        PaymentId: "pay1",
        UserId: user.UserId,
        Amount: 250.0,
        PaymentMethod: "Credit Card",
        PaymentReference: "REF123456",
        TransactionId: "TXN789012",
        Status: "Completed",
        BookingId: "book1",
        PaidAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        CreatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        User: user,
        relatedRoom: {
          RoomId: "room1",
          RoomNumber: "101",
          RoomType: "Deluxe Suite",
          PricePerNight: 250,
          Description: "Luxury suite with city view and premium amenities",
          Capacity: 2,
          Status: "Available",
          RoomImage:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
          CreatedAt: "",
          UpdatedAt: "",
          Accommodations: [],
          Bookings: [],
          Reviews: [],
          RoomImages: [],
        },
      },
      {
        PaymentId: "pay2",
        UserId: user.UserId,
        Amount: 67.5,
        PaymentMethod: "Digital Wallet",
        PaymentReference: "REF789123",
        TransactionId: "TXN456789",
        Status: "Pending",
        OrderId: "order1",
        PaidAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        CreatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        User: user,
        relatedDelicacy: {
          DelicacyId: "del1",
          Name: "Truffle Pasta Carbonara",
          Description: "Handmade pasta with black truffle cream sauce",
          Price: 35,
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
        PaymentId: "pay3",
        UserId: user.UserId,
        Amount: 450.0,
        PaymentMethod: "Bank Transfer",
        PaymentReference: "REF345678",
        TransactionId: "TXN123456",
        Status: "Completed",
        BookingId: "book2",
        PaidAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        CreatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        User: user,
        relatedRoom: {
          RoomId: "room2",
          RoomNumber: "C-Hall-A",
          RoomType: "Executive Conference Hall",
          PricePerNight: 450,
          Description: "Large conference hall with premium facilities",
          Capacity: 50,
          Status: "Available",
          RoomImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
          CreatedAt: "",
          UpdatedAt: "",
          Accommodations: [],
          Bookings: [],
          Reviews: [],
          RoomImages: [],
        },
      },
      {
        PaymentId: "pay4",
        UserId: user.UserId,
        Amount: 125.75,
        PaymentMethod: "Credit Card",
        PaymentReference: "REF567890",
        TransactionId: "TXN987654",
        Status: "Completed",
        OrderId: "order2",
        PaidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        CreatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        User: user,
        relatedDelicacy: {
          DelicacyId: "del2",
          Name: "Mediterranean Seafood Platter",
          Description: "Fresh lobster, prawns, scallops with herb butter",
          Price: 85,
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
        PaymentId: "pay5",
        UserId: user.UserId,
        Amount: 145.5,
        PaymentMethod: "Digital Wallet",
        PaymentReference: "REF890123",
        TransactionId: "TXN654321",
        Status: "Failed",
        OrderId: "order3",
        PaidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        CreatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        User: user,
        relatedDelicacy: {
          DelicacyId: "del3",
          Name: "Premium Wagyu Steak",
          Description: "Grade A5 wagyu beef with truffle mashed potatoes",
          Price: 120,
          DelicacyImage:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
          Category: "Premium Main Course",
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
        PaymentId: "pay6",
        UserId: user.UserId,
        Amount: 160.0,
        PaymentMethod: "Credit Card",
        PaymentReference: "REF234567",
        TransactionId: "TXN345678",
        Status: "Completed",
        BookingId: "book3",
        PaidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        CreatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        User: user,
        relatedRoom: {
          RoomId: "room3",
          RoomNumber: "M-201",
          RoomType: "Meeting Bay",
          PricePerNight: 80,
          Description: "Intimate meeting space for small teams",
          Capacity: 8,
          Status: "Available",
          RoomImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400",
          CreatedAt: "",
          UpdatedAt: "",
          Accommodations: [],
          Bookings: [],
          Reviews: [],
          RoomImages: [],
        },
      },
    ];

    setTimeout(() => {
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, [user]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = payments.filter((payment) => {
      const matchesSearch =
        payment.PaymentReference.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ||
        payment.TransactionId.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ||
        (payment.relatedRoom?.RoomType.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ??
          false) ||
        (payment.relatedDelicacy?.Name.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ??
          false);

      const matchesStatus =
        filterStatus === "all" || payment.Status.toLowerCase() === filterStatus;
      const matchesMethod =
        filterMethod === "all" ||
        payment.PaymentMethod.toLowerCase().replace(" ", "-") === filterMethod;

      return matchesSearch && matchesStatus && matchesMethod;
    });

    // Sort payments
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
        );
      } else if (sortBy === "amount-high") {
        return b.Amount - a.Amount;
      } else {
        return a.Amount - b.Amount;
      }
    });

    setFilteredPayments(filtered);
  }, [payments, searchTerm, filterStatus, filterMethod, sortBy]);

  const getTotalAmount = () => {
    return payments.reduce((sum, payment) => sum + payment.Amount, 0);
  };

  const getCompletedPayments = () => {
    return payments.filter((p) => p.Status === "Completed").length;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
        return <CreditCard className={styles.methodIcon} />;
      case "digital wallet":
        return <Smartphone className={styles.methodIcon} />;
      case "bank transfer":
        return <Building2 className={styles.methodIcon} />;
      default:
        return <Banknote className={styles.methodIcon} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className={styles.statusIcon} />;
      case "pending":
        return <Clock className={styles.statusIcon} />;
      case "failed":
        return <AlertCircle className={styles.statusIcon} />;
      default:
        return <Clock className={styles.statusIcon} />;
    }
  };

  const handleDownloadReceipt = (paymentId: string) => {
    // Mock download functionality
    console.log(`Downloading receipt for payment: ${paymentId}`);
  };

  const handleViewDetails = (paymentId: string) => {
    // Mock view details functionality
    console.log(`Viewing details for payment: ${paymentId}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your payments...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              <Receipt className={styles.titleIcon} />
              Payment History
            </h1>
            <p className={styles.subtitle}>
              Track and manage all your payment transactions
            </p>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <DollarSign className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  ${getTotalAmount().toFixed(2)}
                </span>
                <span className={styles.statLabel}>Total Spent</span>
              </div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <TrendingUp className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {getCompletedPayments()}
                </span>
                <span className={styles.statLabel}>Completed</span>
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
            placeholder="Search by reference, transaction ID, or item..."
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
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "completed" | "pending" | "failed"
                )
              }
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={filterMethod}
              onChange={(e) =>
                setFilterMethod(
                  e.target.value as
                    | "all"
                    | "credit-card"
                    | "digital-wallet"
                    | "bank-transfer"
                )
              }
              className={styles.filterSelect}
            >
              <option value="all">All Methods</option>
              <option value="credit-card">Credit Card</option>
              <option value="digital-wallet">Digital Wallet</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "newest"
                    | "oldest"
                    | "amount-high"
                    | "amount-low"
                )
              }
              className={styles.filterSelect}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount (High)</option>
              <option value="amount-low">Amount (Low)</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.paymentsGrid}>
        {filteredPayments.length === 0 ? (
          <div className={styles.emptyState}>
            <Receipt className={styles.emptyIcon} />
            <h3>No payments found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment.PaymentId} className={styles.paymentCard}>
              <div className={styles.paymentHeader}>
                <div className={styles.paymentType}>
                  {payment.relatedRoom ? (
                    <div className={styles.typeIndicator}>
                      <Bed className={styles.typeIcon} />
                      <span>Room Booking</span>
                    </div>
                  ) : (
                    <div className={styles.typeIndicator}>
                      <Utensils className={styles.typeIcon} />
                      <span>Food Order</span>
                    </div>
                  )}
                </div>

                <div
                  className={`${styles.statusBadge} ${
                    styles[payment.Status.toLowerCase()]
                  }`}
                >
                  {getStatusIcon(payment.Status)}
                  <span>{payment.Status}</span>
                </div>
              </div>

              <div className={styles.paymentContent}>
                <div className={styles.amountSection}>
                  <div className={styles.amount}>
                    <span className={styles.currency}>$</span>
                    <span className={styles.value}>
                      {payment.Amount.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.paymentDate}>
                    <Calendar className={styles.dateIcon} />
                    <span>{new Date(payment.PaidAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {(payment.relatedRoom || payment.relatedDelicacy) && (
                  <div className={styles.itemInfo}>
                    {payment.relatedRoom && (
                      <div className={styles.itemDetails}>
                        <img
                          src={payment.relatedRoom.RoomImage}
                          alt={payment.relatedRoom.RoomType}
                          className={styles.itemImage}
                        />
                        <div>
                          <h3 className={styles.itemName}>
                            {payment.relatedRoom.RoomType}
                          </h3>
                          <p className={styles.itemDesc}>
                            Room {payment.relatedRoom.RoomNumber}
                          </p>
                        </div>
                      </div>
                    )}

                    {payment.relatedDelicacy && (
                      <div className={styles.itemDetails}>
                        <img
                          src={payment.relatedDelicacy.DelicacyImage}
                          alt={payment.relatedDelicacy.Name}
                          className={styles.itemImage}
                        />
                        <div>
                          <h3 className={styles.itemName}>
                            {payment.relatedDelicacy.Name}
                          </h3>
                          <p className={styles.itemDesc}>
                            {payment.relatedDelicacy.Category}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.paymentDetails}>
                  <div className={styles.methodInfo}>
                    {getPaymentMethodIcon(payment.PaymentMethod)}
                    <span>{payment.PaymentMethod}</span>
                  </div>
                  <div className={styles.referenceInfo}>
                    <span className={styles.label}>Ref:</span>
                    <span className={styles.reference}>
                      {payment.PaymentReference}
                    </span>
                  </div>
                  <div className={styles.transactionInfo}>
                    <span className={styles.label}>TxID:</span>
                    <span className={styles.transaction}>
                      {payment.TransactionId}
                    </span>
                  </div>
                </div>

                <div className={styles.paymentActions}>
                  <button
                    onClick={() => handleViewDetails(payment.PaymentId)}
                    className={styles.viewButton}
                  >
                    <Eye className={styles.actionIcon} />
                    View Details
                  </button>
                  {payment.Status === "Completed" && (
                    <button
                      onClick={() => handleDownloadReceipt(payment.PaymentId)}
                      className={styles.downloadButton}
                    >
                      <Download className={styles.actionIcon} />
                      Receipt
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
