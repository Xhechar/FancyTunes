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
} from "lucide-react"; 
import styles from "../../../styles/user/user_routes/Accommodations.module.css";
import { Accommodation, User } from "../../../interfaces/interfaces";
import { UsersService } from "../../../services/user.service";
import { socket } from "../../../socket.io";
import Toast, {ToastProps} from "../../../components/Toast";


export const Accommodations: React.FC = () => {
  const [accommodations, setAccommodations] =
    useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] =
    useState<Accommodation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<string | null>(
    null
  );
  const [ toast, setToast ] = useState<ToastProps | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on("accommodation-created", (newAccommodation: Accommodation) => {
      setAccommodations((prev) => [...prev, newAccommodation]);
    });

    socket.on("accommodation-updated", (updatedAccommodation: Accommodation) => {
      setAccommodations((prev) =>
        prev.map((acc) =>
          acc.AccommodationId === updatedAccommodation.AccommodationId
            ? updatedAccommodation
            : acc
        )
      );
    });

    socket.on("accommodation-deleted", (deletedAccommodation: Accommodation) => {
      setAccommodations((prev) =>
        prev.filter(
          (acc) => acc.AccommodationId !== deletedAccommodation.AccommodationId
        )
      );
    });

    return () => {
      socket.off("accommodation-created");
      socket.off("accommodation-updated");
      socket.off("accommodation-deleted");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {

    try {

      let getUserAccommodations = async () => {
        let result = await UsersService.GetUserByUserId();

        if (result.success) {
          setAccommodations(
            () => (result.data as unknown as User).Accommodations as Accommodation[]
          );
        }
      };

      getUserAccommodations();
      
    } catch (error: any) {

      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: error?.response?.data?.error as string || "Error",
        message: error?.response?.data?.message as string || "An unexpected error occurred.",
        onClose: function (): void {
          setToast(null);
        }
      };

      setToast(() => toast)
      
    }

  }, []);

  useEffect(() => {

    let filtered = accommodations;

    if (filterStatus !== "All") {
      if (filterStatus === "Active") {
        filtered = filtered.filter((acc) => acc.IsActive);
      } else if (filterStatus === "Completed") {
        filtered = filtered.filter((acc) => !acc.IsActive);
      } else {
        filtered = filtered.filter((acc) => acc.PaymentStatus === filterStatus);
      }
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((acc) => {
        const roomCount = String(acc.Room?.RoomCount ?? "");
        const roomType = acc.Room?.RoomType ?? "";
        const accId = acc.AccommodationId ?? "";
        return (
          roomCount.toLowerCase().includes(term) ||
          roomType.toLowerCase().includes(term) ||
          accId.toLowerCase().includes(term)
        );
      });
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
      {toast && <Toast {...toast} />}
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
              Ksh. {accommodations.reduce((sum, acc) => sum + Number(acc.TotalAmount), 0)}
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
                    accommodation.Room?.RoomImage ||
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500"
                  }
                  alt={accommodation.Room?.RoomType}
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
                    {accommodation.Room?.RoomType}
                  </h3>
                  <p className={styles["room-number"]}>
                    Room {accommodation.Room?.RoomCount}
                  </p>
                </div>

                <div className={styles["booking-details"]}>
                  <div className={styles.detail}>
                    <Calendar className={styles.icon} />
                    <span>
                      {formatDate(accommodation.CheckInDate.toString())} -{" "}
                      {formatDate(accommodation.CheckOutDate.toString())}
                    </span>
                  </div>

                  <div className={styles.detail}>
                    <Clock className={styles.icon} />
                    <span>
                      {calculateNights(
                        accommodation.CheckInDate.toString(),
                        accommodation.CheckOutDate.toString()
                      )}{" "}
                      nights
                    </span>
                  </div>

                  <div className={styles.detail}>
                    <Users className={styles.icon} />
                    <span>Up to {accommodation.Room?.Capacity} guests</span>
                  </div>

                  <div className={styles.detail}>
                    <DollarSign className={styles.icon} />
                    <span className={styles.amount}>
                      Ksh. {accommodation.TotalAmount.toLocaleString()}
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
                  <p>{accommodation.Room?.Description}</p>
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
