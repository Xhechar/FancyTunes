import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Bed,
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
import { Booking, User } from "../../../interfaces/interfaces";
import { UsersService } from "../../../services/user.service";
import { socket } from "../../../socket.io";
import Toast, { ToastProps } from "../../../components/Toast";

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] =
    useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<string | null>(
    null
  );
  const [ toast, setToast ] = useState<ToastProps | null>(null);

  useEffect(() => {

    socket.connect();

    socket.on("booking-created", (newBooking: Booking) => {
      setBookings((prev) => [...prev, newBooking]);
    });

    socket.on("booking-updated", (updatedBooking: Booking) => {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.BookingId === updatedBooking.BookingId
            ? updatedBooking
            : booking
        )
      );
    });

    socket.on("booking-deleted", (deletedBooking: Booking) => {
      setBookings((prev) =>
        prev.filter(
          (booking) => booking.BookingId !== deletedBooking.BookingId
        )
      );
    });

    return () => {
      socket.off("booking-created");
      socket.off("booking-updated");
      socket.off("booking-deleted");
      socket.disconnect();
    };

  }, []);

  useEffect(() => {

    try {
      let getUser = async () => {
        let result = await UsersService.GetUserByUserId();

        if (result.success) {
          setBookings(() => (result.data as unknown as User).Bookings as Booking[]);
        } else {
          const toast: ToastProps = {
            isVisible: true,
            type: "warning",
            title: result.error as string,
            message: result.message as string,
            onClose: () => setToast(null),
          };
          setToast(toast);
        }
      };
      getUser();
    } catch (error: any) {
      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: error?.response?.data?.error as string || "An error occurred",
        message: error?.response?.data?.message as string || "Unable to fetch bookings at the moment, please try again later.",
        onClose: () => setToast(null),
      };
      setToast(toast);
    }
  
  }, []);

  useEffect(() => {

    let filtered = bookings;

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

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          String(booking.BusinessRoom?.RoomCount).toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          booking.BusinessRoom?.Amenities?.toLowerCase().includes(
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
      {toast && <Toast {...toast} />}
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
                    booking.BusinessRoom?.BusinessRoomImage ||
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500"
                  }
                  alt={booking.BusinessRoom?.Name}
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
                    {booking.BusinessRoom?.Name}
                  </h3>
                  <p className={styles["room-number"]}>
                    Room {booking.BusinessRoom?.RoomCount}
                  </p>
                </div>

                <div className={styles["booking-details"]}>
                  <div className={styles.detail}>
                    <Calendar className={styles.icon} />
                    <span>
                      {formatDate(booking.CheckInTime.toString())} -{" "}
                      {formatDate(booking.CheckOutTime.toString())}
                    </span>
                  </div>

                  <div className={styles.detail}>
                    <Clock className={styles.icon} />
                    <span>
                      {calculateNights(
                        booking.CheckInTime.toString(),
                        booking.CheckOutTime.toString()
                      )}{" "}
                      nights
                    </span>
                  </div>

                  <div className={styles.detail}>
                    <Users className={styles.icon} />
                    <span>
                      {booking.NumberOfGuests} guests • Capacity:{" "}
                      {booking.BusinessRoom?.Capacity}
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
                  <p>{booking.BusinessRoom?.Description}</p>
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
                    Booked on {formatDate(booking.CreatedAt.toString())}
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