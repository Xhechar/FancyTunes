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
import { Payment, Booking, Order, Room, Delicacy, User } from "../../../interfaces/interfaces";
import { UsersService } from "../../../services/user.service";
import Toast, { ToastProps } from "../../../components/Toast";
import { socket } from "../../../socket.io";

interface PaymentWithDetails extends Payment {
  relatedBooking?: Booking;
  relatedOrder?: Order;
  relatedRoom?: Room;
  relatedDelicacy?: Delicacy;
}

export const MyPayments: React.FC = () => {
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
  const [toast, setToast] = useState<ToastProps | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on("payment-created", (newPayment: PaymentWithDetails) => {
      setPayments((prevPayments) => [newPayment, ...prevPayments]);
    });

    socket.on("payment-updated", (updatedPayment: PaymentWithDetails) => {
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.PaymentId === updatedPayment.PaymentId
            ? updatedPayment
            : payment
        )
      );
    });

    socket.on("payment-deleted", (deletedPayment: PaymentWithDetails) => {
      setPayments((prevPayments) =>
        prevPayments.filter(
          (payment) => payment.PaymentId !== deletedPayment.PaymentId
        )
      );
    });

    return () => {
      socket.off("payment-created");
      socket.off("payment-updated");
      socket.off("payment-deleted");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    try {
      let getUser = async () => {
        let result = await UsersService.GetUserByUserId();

        if (result.success) {
          setPayments(() => (result.data as unknown as User).Payments as Payment[]);
          setFilteredPayments(() => (result.data as unknown as User).Payments as Payment[]);
          setLoading(false);
        } else {
          const toast: ToastProps = {
            isVisible: true,
            type: "warning",
            title: result.error as string,
            message: result.message as string,
            onClose: function (): void {
              setToast(null);
            }
          };
          setToast(() => toast);
          setLoading(false);
        }
      };
      getUser();
    } catch (error: any) {
      
    }
  }, []);

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
      {toast && <Toast {...toast} />}
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
                            Room {payment.relatedRoom.RoomCount}
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
