import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Bed,
  Star,
  MessageSquare,
  Filter,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Plus,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import styles from "../../../styles/user/user_routes/Bookings.module.css";

// Interface definitions (using your provided interfaces)
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

export interface Room {
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

export interface Booking {
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

export interface Accommodation {
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
  Delicacy: any;
  OrderItems: any[];
}

export interface Cart {
  CartId: string;
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  AddedAt: string;
  User: User;
  Delicacy: any;
}

export interface Recovery {
  RecoveryId: string;
  UserId: string;
  VerificationCode: number;
  ExpiresAt: string;
  IsUsed: boolean;
  CreatedAt: string;
  User: User;
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

export interface Review {
  ReviewId: string;
  UserId: string;
  RoomId?: string;
  DelicacyId?: string;
  Rating: number;
  Comment: string;
  CreatedAt: string;
  User: User;
  Room?: Room;
  Delicacy?: any;
}

export interface Notification {
  NotificationId: string;
  UserId: string;
  Title: string;
  Message: string;
  IsRead: boolean;
  CreatedAt: string;
  User: User;
}

export interface RoomImage {
  RoomImageId: string;
  RoomId: string;
  ImageUrl: string;
  Room: Room;
}

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    BookingId: "book1",
    UserId: "user1",
    RoomId: "room1",
    CheckInDate: "2024-12-10",
    CheckOutDate: "2024-12-13",
    NumberOfGuests: 2,
    TotalAmount: 900,
    SpecialRequests: "Early check-in and room service breakfast",
    BookingStatus: "Confirmed",
    PaymentStatus: "Completed",
    CreatedAt: "2024-11-25",
    UpdatedAt: "2024-11-26",
    User: {} as User,
    Room: {
      RoomId: "room1",
      RoomNumber: "301",
      RoomType: "Executive Suite",
      PricePerNight: 300,
      Description:
        "Luxurious executive suite with city view and premium amenities",
      Capacity: 3,
      Status: "Available",
      RoomImage:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500",
      CreatedAt: "2024-01-01",
      UpdatedAt: "2024-01-01",
      Accommodations: [],
      Bookings: [],
      Reviews: [],
      RoomImages: [],
    },
  },
  {
    BookingId: "book2",
    UserId: "user1",
    RoomId: "room2",
    CheckInDate: "2024-12-20",
    CheckOutDate: "2024-12-22",
    NumberOfGuests: 4,
    TotalAmount: 800,
    SpecialRequests:
      "Conference setup with projector and catering for 15 people",
    BookingStatus: "Pending",
    PaymentStatus: "Pending",
    CreatedAt: "2024-12-01",
    UpdatedAt: "2024-12-01",
    User: {} as User,
    Room: {
      RoomId: "room2",
      RoomNumber: "Conference B",
      RoomType: "Meeting Bay",
      PricePerNight: 400,
      Description:
        "Modern meeting bay with advanced AV equipment and catering facilities",
      Capacity: 20,
      Status: "Available",
      RoomImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
      CreatedAt: "2024-01-01",
      UpdatedAt: "2024-01-01",
      Accommodations: [],
      Bookings: [],
      Reviews: [],
      RoomImages: [],
    },
  },
  {
    BookingId: "book3",
    UserId: "user1",
    RoomId: "room3",
    CheckInDate: "2024-11-01",
    CheckOutDate: "2024-11-03",
    NumberOfGuests: 1,
    TotalAmount: 500,
    SpecialRequests: "Quiet room for business calls",
    BookingStatus: "Completed",
    PaymentStatus: "Completed",
    CreatedAt: "2024-10-15",
    UpdatedAt: "2024-11-03",
    User: {} as User,
    Room: {
      RoomId: "room3",
      RoomNumber: "105",
      RoomType: "Business Room",
      PricePerNight: 250,
      Description:
        "Professional business room with workspace and high-speed internet",
      Capacity: 2,
      Status: "Available",
      RoomImage:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500",
      CreatedAt: "2024-01-01",
      UpdatedAt: "2024-01-01",
      Accommodations: [],
      Bookings: [],
      Reviews: [],
      RoomImages: [],
    },
  },
  {
    BookingId: "book4",
    UserId: "user1",
    RoomId: "room4",
    CheckInDate: "2024-11-20",
    CheckOutDate: "2024-11-21",
    NumberOfGuests: 1,
    TotalAmount: 200,
    SpecialRequests: "Late checkout requested",
    BookingStatus: "Cancelled",
    PaymentStatus: "Refunded",
    CreatedAt: "2024-11-10",
    UpdatedAt: "2024-11-18",
    User: {} as User,
    Room: {
      RoomId: "room4",
      RoomNumber: "202",
      RoomType: "Standard Room",
      PricePerNight: 200,
      Description: "Comfortable standard room with essential amenities",
      Capacity: 2,
      Status: "Available",
      RoomImage:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
      CreatedAt: "2024-01-01",
      UpdatedAt: "2024-01-01",
      Accommodations: [],
      Bookings: [],
      Reviews: [],
      RoomImages: [],
    },
  },
];

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filteredBookings, setFilteredBookings] =
    useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<string | null>(
    null
  );

  // Filter and search functionality
  useEffect(() => {
    let filtered = bookings;

    // Filter by status
    if (filterStatus !== "All") {
      if (filterStatus === "Active") {
        filtered = filtered.filter(
          (booking) =>
            booking.BookingStatus === "Confirmed" ||
            booking.BookingStatus === "Pending"
        );
      } else {
        filtered = filtered.filter(
          (booking) => booking.BookingStatus === filterStatus
        );
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.Room.RoomNumber.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          booking.Room.RoomType.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          booking.BookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.BookingStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, filterStatus]);

  const handleCompletePayment = async (bookingId: string) => {
    setProcessingPayment(bookingId);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setBookings((prev) =>
      prev.map((booking) =>
        booking.BookingId === bookingId
          ? {
              ...booking,
              PaymentStatus: "Completed",
              BookingStatus: "Confirmed",
            }
          : booking
      )
    );

    setProcessingPayment(null);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.BookingId === bookingId
            ? {
                ...booking,
                BookingStatus: "Cancelled",
                PaymentStatus:
                  booking.PaymentStatus === "Completed"
                    ? "Refund Pending"
                    : "Cancelled",
              }
            : booking
        )
      );
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className={styles["status-icon"]} />;
      case "Pending":
        return <Clock className={styles["status-icon"]} />;
      case "Completed":
        return <UserCheck className={styles["status-icon"]} />;
      case "Cancelled":
        return <AlertCircle className={styles["status-icon"]} />;
      default:
        return <Clock className={styles["status-icon"]} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Confirmed":
        return styles["status-confirmed"];
      case "Pending":
        return styles["status-pending"];
      case "Completed":
        return styles["status-completed"];
      case "Cancelled":
        return styles["status-cancelled"];
      default:
        return styles["status-pending"];
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className={styles["payment-icon"]} />;
      case "Pending":
        return <Clock className={styles["payment-icon"]} />;
      case "Refunded":
      case "Refund Pending":
        return <AlertCircle className={styles["payment-icon"]} />;
      default:
        return <AlertCircle className={styles["payment-icon"]} />;
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case "Completed":
        return styles["payment-completed"];
      case "Pending":
        return styles["payment-pending"];
      case "Refunded":
        return styles["payment-refunded"];
      case "Refund Pending":
        return styles["payment-refund-pending"];
      default:
        return styles["payment-failed"];
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isBookingEditable = (booking: Booking) => {
    return (
      booking.BookingStatus === "Pending" ||
      booking.BookingStatus === "Confirmed"
    );
  };

  const isBookingCancellable = (booking: Booking) => {
    return (
      booking.BookingStatus !== "Cancelled" &&
      booking.BookingStatus !== "Completed"
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles.title}>My Bookings</h1>
            <p className={styles.subtitle}>
              Track and manage your room reservations
            </p>
          </div>
          <div className={styles["header-actions"]}>
            <button className={styles["new-booking-btn"]}>
              <Plus className={styles.icon} />
              New Booking
            </button>
            <button
              className={`${styles["refresh-btn"]} ${
                isLoading ? styles.loading : ""
              }`}
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={styles.icon} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles["search-box"]}>
          <Search className={styles["search-icon"]} />
          <input
            type="text"
            placeholder="Search by room number, type, booking ID, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles["search-input"]}
          />
        </div>

        <div className={styles["filter-box"]}>
          <Filter className={styles["filter-icon"]} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles["filter-select"]}
          >
            <option value="All">All Bookings</option>
            <option value="Active">Active Bookings</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className={styles["stats-grid"]}>
        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <Bed />
          </div>
          <div className={styles["stat-content"]}>
            <h3>{bookings.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <CheckCircle />
          </div>
          <div className={styles["stat-content"]}>
            <h3>
              {
                bookings.filter(
                  (booking) => booking.BookingStatus === "Confirmed"
                ).length
              }
            </h3>
            <p>Confirmed</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <Clock />
          </div>
          <div className={styles["stat-content"]}>
            <h3>
              {
                bookings.filter(
                  (booking) => booking.BookingStatus === "Pending"
                ).length
              }
            </h3>
            <p>Pending</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <DollarSign />
          </div>
          <div className={styles["stat-content"]}>
            <h3>
              $
              {bookings
                .reduce((sum, booking) => sum + booking.TotalAmount, 0)
                .toLocaleString()}
            </h3>
            <p>Total Value</p>
          </div>
        </div>
      </div>

      <div className={styles["bookings-grid"]}>
        {filteredBookings.length === 0 ? (
          <div className={styles["empty-state"]}>
            <CalendarDays className={styles["empty-icon"]} />
            <h3>No bookings found</h3>
            <p>
              Try adjusting your search or filter criteria, or create a new
              booking
            </p>
            <button className={styles["new-booking-btn"]}>
              <Plus className={styles.icon} />
              Create New Booking
            </button>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.BookingId} className={styles["booking-card"]}>
              <div className={styles["card-header"]}>
                <img
                  src={
                    booking.Room.RoomImage ||
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500"
                  }
                  alt={booking.Room.RoomType}
                  className={styles["room-image"]}
                />
                <div className={styles["status-badges"]}>
                  <div
                    className={`${styles["status-badge"]} ${getStatusClass(
                      booking.BookingStatus
                    )}`}
                  >
                    {getStatusIcon(booking.BookingStatus)}
                    <span>{booking.BookingStatus}</span>
                  </div>
                  <div
                    className={`${
                      styles["payment-badge"]
                    } ${getPaymentStatusClass(booking.PaymentStatus)}`}
                  >
                    {getPaymentStatusIcon(booking.PaymentStatus)}
                    <span>{booking.PaymentStatus}</span>
                  </div>
                </div>
              </div>

              <div className={styles["card-content"]}>
                <div className={styles["room-info"]}>
                  <h3 className={styles["room-title"]}>
                    {booking.Room.RoomType}
                  </h3>
                  <p className={styles["room-number"]}>
                    Room {booking.Room.RoomNumber}
                  </p>
                </div>

                <div className={styles["booking-details"]}>
                  <div className={styles.detail}>
                    <Calendar className={styles.icon} />
                    <span>
                      {formatDate(booking.CheckInDate)} -{" "}
                      {formatDate(booking.CheckOutDate)}
                    </span>
                  </div>

                  <div className={styles.detail}>
                    <Clock className={styles.icon} />
                    <span>
                      {calculateNights(
                        booking.CheckInDate,
                        booking.CheckOutDate
                      )}{" "}
                      nights
                    </span>
                  </div>

                  <div className={styles.detail}>
                    <Users className={styles.icon} />
                    <span>
                      {booking.NumberOfGuests} guests • Capacity:{" "}
                      {booking.Room.Capacity}
                    </span>
                  </div>

                  <div className={styles.detail}>
                    <DollarSign className={styles.icon} />
                    <span className={styles.amount}>
                      ${booking.TotalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {booking.SpecialRequests && (
                  <div className={styles["special-requests"]}>
                    <MessageSquare className={styles.icon} />
                    <p>{booking.SpecialRequests}</p>
                  </div>
                )}

                <div className={styles.description}>
                  <p>{booking.Room.Description}</p>
                </div>

                <div className={styles["card-actions"]}>
                  {booking.PaymentStatus === "Pending" && (
                    <button
                      className={`${styles["payment-btn"]} ${
                        processingPayment === booking.BookingId
                          ? styles.processing
                          : ""
                      }`}
                      onClick={() => handleCompletePayment(booking.BookingId)}
                      disabled={processingPayment === booking.BookingId}
                    >
                      <CreditCard className={styles.icon} />
                      {processingPayment === booking.BookingId
                        ? "Processing..."
                        : "Complete Payment"}
                    </button>
                  )}

                  <button className={styles["details-btn"]}>
                    <Eye className={styles.icon} />
                    View Details
                  </button>

                  {isBookingEditable(booking) && (
                    <button className={styles["edit-btn"]}>
                      <Edit className={styles.icon} />
                      Edit
                    </button>
                  )}

                  {isBookingCancellable(booking) && (
                    <button
                      className={styles["cancel-btn"]}
                      onClick={() => handleCancelBooking(booking.BookingId)}
                    >
                      <Trash2 className={styles.icon} />
                      Cancel
                    </button>
                  )}
                </div>

                <div className={styles["card-footer"]}>
                  <div className={styles["booking-id"]}>
                    Booking ID: #{booking.BookingId.slice(-6).toUpperCase()}
                  </div>
                  <div className={styles["booking-date"]}>
                    Booked on {formatDate(booking.CreatedAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};