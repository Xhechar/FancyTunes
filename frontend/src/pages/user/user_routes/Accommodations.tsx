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
} from "lucide-react";
import styles from "../../../styles/user/user_routes/Accommodations.module.css";

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

export interface RoomImage {
  RoomImageId: string;
  RoomId: string;
  ImageUrl: string;
  Room: Room;
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

// Mock data for demonstration
const mockAccommodations: Accommodation[] = [
  {
    AccommodationId: "1",
    UserId: "user1",
    RoomId: "room1",
    CheckInDate: "2024-12-01",
    CheckOutDate: "2024-12-05",
    TotalAmount: 1200,
    SpecialRequests: "Late check-in requested, ocean view preferred",
    PaymentStatus: "Completed",
    IsActive: true,
    CreatedAt: "2024-11-15",
    UpdatedAt: "2024-11-20",
    User: {} as User,
    Room: {
      RoomId: "room1",
      RoomNumber: "101",
      RoomType: "Deluxe Suite",
      PricePerNight: 300,
      Description: "Luxurious suite with ocean view and premium amenities",
      Capacity: 2,
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
    AccommodationId: "2",
    UserId: "user1",
    RoomId: "room2",
    CheckInDate: "2024-12-15",
    CheckOutDate: "2024-12-18",
    TotalAmount: 600,
    SpecialRequests: "Conference setup needed",
    PaymentStatus: "Pending",
    IsActive: true,
    CreatedAt: "2024-11-20",
    UpdatedAt: "2024-11-20",
    User: {} as User,
    Room: {
      RoomId: "room2",
      RoomNumber: "Conference A",
      RoomType: "Conference Hall",
      PricePerNight: 200,
      Description: "Modern conference hall with state-of-the-art AV equipment",
      Capacity: 50,
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
    AccommodationId: "3",
    UserId: "user1",
    RoomId: "room3",
    CheckInDate: "2024-11-10",
    CheckOutDate: "2024-11-12",
    TotalAmount: 400,
    SpecialRequests: "Extra towels and room service",
    PaymentStatus: "Completed",
    IsActive: false,
    CreatedAt: "2024-11-01",
    UpdatedAt: "2024-11-12",
    User: {} as User,
    Room: {
      RoomId: "room3",
      RoomNumber: "205",
      RoomType: "Standard Room",
      PricePerNight: 200,
      Description: "Comfortable standard room with all essential amenities",
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
];

export const Accommodations: React.FC = () => {
  const [accommodations, setAccommodations] =
    useState<Accommodation[]>(mockAccommodations);
  const [filteredAccommodations, setFilteredAccommodations] =
    useState<Accommodation[]>(mockAccommodations);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<string | null>(
    null
  );

  // Filter and search functionality
  useEffect(() => {
    let filtered = accommodations;

    // Filter by status
    if (filterStatus !== "All") {
      if (filterStatus === "Active") {
        filtered = filtered.filter((acc) => acc.IsActive);
      } else if (filterStatus === "Completed") {
        filtered = filtered.filter((acc) => !acc.IsActive);
      } else {
        filtered = filtered.filter((acc) => acc.PaymentStatus === filterStatus);
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (acc) =>
          acc.Room.RoomNumber.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          acc.Room.RoomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          acc.AccommodationId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAccommodations(filtered);
  }, [accommodations, searchTerm, filterStatus]);

  const handleCompletePayment = async (accommodationId: string) => {
    setProcessingPayment(accommodationId);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setAccommodations((prev) =>
      prev.map((acc) =>
        acc.AccommodationId === accommodationId
          ? { ...acc, PaymentStatus: "Completed" }
          : acc
      )
    );

    setProcessingPayment(null);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className={styles["status-icon"]} />;
      case "Pending":
        return <Clock className={styles["status-icon"]} />;
      default:
        return <AlertCircle className={styles["status-icon"]} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Completed":
        return styles["status-completed"];
      case "Pending":
        return styles["status-pending"];
      default:
        return styles["status-failed"];
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles.title}>My Accommodations</h1>
            <p className={styles.subtitle}>
              Manage your room bookings and reservations
            </p>
          </div>
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

      <div className={styles.controls}>
        <div className={styles["search-box"]}>
          <Search className={styles["search-icon"]} />
          <input
            type="text"
            placeholder="Search by room number, type, or booking ID..."
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
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Payment Pending</option>
          </select>
        </div>
      </div>

      <div className={styles["stats-grid"]}>
        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <Bed />
          </div>
          <div className={styles["stat-content"]}>
            <h3>{accommodations.length}</h3>
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
                accommodations.filter(
                  (acc) => acc.PaymentStatus === "Completed"
                ).length
              }
            </h3>
            <p>Paid Bookings</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <Clock />
          </div>
          <div className={styles["stat-content"]}>
            <h3>
              {
                accommodations.filter((acc) => acc.PaymentStatus === "Pending")
                  .length
              }
            </h3>
            <p>Pending Payment</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <DollarSign />
          </div>
          <div className={styles["stat-content"]}>
            <h3>
              $
              {accommodations
                .reduce((sum, acc) => sum + acc.TotalAmount, 0)
                .toLocaleString()}
            </h3>
            <p>Total Value</p>
          </div>
        </div>
      </div>

      <div className={styles["accommodations-grid"]}>
        {filteredAccommodations.length === 0 ? (
          <div className={styles["empty-state"]}>
            <Bed className={styles["empty-icon"]} />
            <h3>No accommodations found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredAccommodations.map((accommodation) => (
            <div
              key={accommodation.AccommodationId}
              className={styles["accommodation-card"]}
            >
              <div className={styles["card-header"]}>
                <img
                  src={
                    accommodation.Room.RoomImage ||
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500"
                  }
                  alt={accommodation.Room.RoomType}
                  className={styles["room-image"]}
                />
                <div
                  className={`${styles["status-badge"]} ${getStatusClass(
                    accommodation.PaymentStatus
                  )}`}
                >
                  {getStatusIcon(accommodation.PaymentStatus)}
                  <span>{accommodation.PaymentStatus}</span>
                </div>
              </div>

              <div className={styles["card-content"]}>
                <div className={styles["room-info"]}>
                  <h3 className={styles["room-title"]}>
                    {accommodation.Room.RoomType}
                  </h3>
                  <p className={styles["room-number"]}>
                    Room {accommodation.Room.RoomNumber}
                  </p>
                </div>

                <div className={styles["booking-details"]}>
                  <div className={styles.detail}>
                    <Calendar className={styles.icon} />
                    <span>
                      {formatDate(accommodation.CheckInDate)} -{" "}
                      {formatDate(accommodation.CheckOutDate)}
                    </span>
                  </div>

                  <div className={styles.detail}>
                    <Clock className={styles.icon} />
                    <span>
                      {calculateNights(
                        accommodation.CheckInDate,
                        accommodation.CheckOutDate
                      )}{" "}
                      nights
                    </span>
                  </div>

                  <div className={styles.detail}>
                    <Users className={styles.icon} />
                    <span>Up to {accommodation.Room.Capacity} guests</span>
                  </div>

                  <div className={styles.detail}>
                    <DollarSign className={styles.icon} />
                    <span className={styles.amount}>
                      ${accommodation.TotalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {accommodation.SpecialRequests && (
                  <div className={styles["special-requests"]}>
                    <MessageSquare className={styles.icon} />
                    <p>{accommodation.SpecialRequests}</p>
                  </div>
                )}

                <div className={styles.description}>
                  <p>{accommodation.Room.Description}</p>
                </div>

                <div className={styles["card-actions"]}>
                  {accommodation.PaymentStatus === "Pending" && (
                    <button
                      className={`${styles["payment-btn"]} ${
                        processingPayment === accommodation.AccommodationId
                          ? styles.processing
                          : ""
                      }`}
                      onClick={() =>
                        handleCompletePayment(accommodation.AccommodationId)
                      }
                      disabled={
                        processingPayment === accommodation.AccommodationId
                      }
                    >
                      <CreditCard className={styles.icon} />
                      {processingPayment === accommodation.AccommodationId
                        ? "Processing..."
                        : "Complete Payment"}
                    </button>
                  )}

                  <button className={styles["details-btn"]}>
                    View Details
                  </button>
                </div>

                <div className={styles["card-footer"]}>
                  <div className={styles["booking-id"]}>
                    Booking ID: #
                    {accommodation.AccommodationId.slice(-6).toUpperCase()}
                  </div>
                  <div className={styles["booking-date"]}>
                    Booked on {formatDate(accommodation.CreatedAt)}
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
