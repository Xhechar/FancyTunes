import React, { useState, useEffect } from "react";
import {
  Clock,
  Search,
  Filter,
  RefreshCw,
  Star,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Plus,
  ShoppingBag,
  ChefHat,
  Timer,
  MessageSquare,
} from "lucide-react";
import styles from "../../../styles/user/user_routes/Orders.module.css";
import { User, Order, Delicacy, OrderItem } from "../../../interfaces/interfaces";

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    OrderId: "order1",
    UserId: "user1",
    DelicacyId: "del1",
    Quantity: 2,
    TotalAmount: 45.5,
    OrderStatus: "Delivered",
    OrderedAt: "2024-12-20T14:30:00Z",
    DeliveredAt: "2024-12-20T15:45:00Z",
    PaymentStatus: "Completed",
    User: {} as User,
    Delicacy: {
      DelicacyId: "del1",
      Name: "Grilled Salmon with Herbs",
      Description:
        "Fresh Atlantic salmon grilled to perfection with Mediterranean herbs and lemon sauce",
      Price: 22.75,
      DelicacyImage:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500",
      Category: "Main Course",
      IsAvailable: true,
      CreatedAt: "2024-01-01",
      UpdatedAt: "2024-01-01",
      Orders: [],
      Carts: [],
      OrderItems: [],
      Reviews: [],
    },
    OrderItems: [
      {
        OrderItemId: "item1",
        OrderId: "order1",
        DelicacyId: "del1",
        Quantity: 2,
        Price: 22.75,
        Subtotal: 45.5,
        Order: {} as Order,
        Delicacy: {} as Delicacy,
      },
    ],
  },
  {
    OrderId: "order2",
    UserId: "user1",
    DelicacyId: "del2",
    Quantity: 1,
    TotalAmount: 18.99,
    OrderStatus: "Preparing",
    OrderedAt: "2024-12-21T12:15:00Z",
    PaymentStatus: "Completed",
    User: {} as User,
    Delicacy: {
      DelicacyId: "del2",
      Name: "Truffle Mushroom Risotto",
      Description:
        "Creamy arborio rice with wild mushrooms and black truffle oil",
      Price: 18.99,
      DelicacyImage:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500",
      Category: "Main Course",
      IsAvailable: true,
      CreatedAt: "2024-01-01",
      UpdatedAt: "2024-01-01",
      Orders: [],
      Carts: [],
      OrderItems: [],
      Reviews: [],
    },
    OrderItems: [
      {
        OrderItemId: "item2",
        OrderId: "order2",
        DelicacyId: "del2",
        Quantity: 1,
        Price: 18.99,
        Subtotal: 18.99,
        Order: {} as Order,
        Delicacy: {} as Delicacy,
      },
    ],
  },
  {
    OrderId: "order3",
    UserId: "user1",
    DelicacyId: "del3",
    Quantity: 3,
    TotalAmount: 35.97,
    OrderStatus: "On the way",
    OrderedAt: "2024-12-21T18:20:00Z",
    PaymentStatus: "Completed",
    User: {} as User,
    Delicacy: {
      DelicacyId: "del3",
      Name: "Chocolate Lava Cake",
      Description:
        "Warm chocolate cake with molten center, served with vanilla ice cream",
      Price: 11.99,
      DelicacyImage:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500",
      Category: "Dessert",
      IsAvailable: true,
      CreatedAt: "2024-01-01",
      UpdatedAt: "2024-01-01",
      Orders: [],
      Carts: [],
      OrderItems: [],
      Reviews: [],
    },
    OrderItems: [
      {
        OrderItemId: "item3",
        OrderId: "order3",
        DelicacyId: "del3",
        Quantity: 3,
        Price: 11.99,
        Subtotal: 35.97,
        Order: {} as Order,
        Delicacy: {} as Delicacy,
      },
    ],
  },
  {
    OrderId: "order4",
    UserId: "user1",
    DelicacyId: "del4",
    Quantity: 2,
    TotalAmount: 29.98,
    OrderStatus: "Cancelled",
    OrderedAt: "2024-12-19T16:45:00Z",
    PaymentStatus: "Refunded",
    User: {} as User,
    Delicacy: {
      DelicacyId: "del4",
      Name: "Caesar Salad Supreme",
      Description:
        "Fresh romaine lettuce with parmesan cheese, croutons and our signature Caesar dressing",
      Price: 14.99,
      DelicacyImage:
        "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500",
      Category: "Salad",
      IsAvailable: true,
      CreatedAt: "2024-01-01",
      UpdatedAt: "2024-01-01",
      Orders: [],
      Carts: [],
      OrderItems: [],
      Reviews: [],
    },
    OrderItems: [
      {
        OrderItemId: "item4",
        OrderId: "order4",
        DelicacyId: "del4",
        Quantity: 2,
        Price: 14.99,
        Subtotal: 29.98,
        Order: {} as Order,
        Delicacy: {} as Delicacy,
      },
    ],
  },
  {
    OrderId: "order5",
    UserId: "user1",
    DelicacyId: "del5",
    Quantity: 1,
    TotalAmount: 24.5,
    OrderStatus: "Pending",
    OrderedAt: "2024-12-21T19:30:00Z",
    PaymentStatus: "Pending",
    User: {} as User,
    Delicacy: {
      DelicacyId: "del5",
      Name: "Wagyu Beef Steak",
      Description:
        "Premium wagyu beef cooked to your preference with roasted vegetables",
      Price: 24.5,
      DelicacyImage:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500",
      Category: "Main Course",
      IsAvailable: true,
      CreatedAt: "2024-01-01",
      UpdatedAt: "2024-01-01",
      Orders: [],
      Carts: [],
      OrderItems: [],
      Reviews: [],
    },
    OrderItems: [
      {
        OrderItemId: "item5",
        OrderId: "order5",
        DelicacyId: "del5",
        Quantity: 1,
        Price: 24.5,
        Subtotal: 24.5,
        Order: {} as Order,
        Delicacy: {} as Delicacy,
      },
    ],
  },
];

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);

  // Filter and search functionality
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== "All") {
      if (filterStatus === "Active") {
        filtered = filtered.filter(
          (order) =>
            order.OrderStatus === "Preparing" ||
            order.OrderStatus === "On the way" ||
            order.OrderStatus === "Pending"
        );
      } else {
        filtered = filtered.filter(
          (order) => order.OrderStatus === filterStatus
        );
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.Delicacy.Name.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          order.OrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.OrderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.Delicacy.Category.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, filterStatus]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className={styles["status-icon"]} />;
      case "Preparing":
        return <ChefHat className={styles["status-icon"]} />;
      case "On the way":
        return <Truck className={styles["status-icon"]} />;
      case "Pending":
        return <Clock className={styles["status-icon"]} />;
      case "Cancelled":
        return <XCircle className={styles["status-icon"]} />;
      default:
        return <AlertCircle className={styles["status-icon"]} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return styles["status-delivered"];
      case "Preparing":
        return styles["status-preparing"];
      case "On the way":
        return styles["status-on-way"];
      case "Pending":
        return styles["status-pending"];
      case "Cancelled":
        return styles["status-cancelled"];
      default:
        return styles["status-pending"];
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
      default:
        return styles["payment-failed"];
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstimatedDeliveryTime = (orderedAt: string, status: string) => {
    if (status === "Delivered" || status === "Cancelled") return null;

    const orderTime = new Date(orderedAt);
    const estimatedTime = new Date(orderTime.getTime() + 45 * 60 * 1000); // 45 minutes

    return estimatedTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setOrders((prev) =>
        prev.map((order) =>
          order.OrderId === orderId
            ? {
                ...order,
                OrderStatus: "Cancelled",
                PaymentStatus:
                  order.PaymentStatus === "Completed"
                    ? "Refunded"
                    : "Cancelled",
              }
            : order
        )
      );
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles.title}>My Orders</h1>
            <p className={styles.subtitle}>
              Track your delicious orders from FancyTunes
            </p>
          </div>
          <div className={styles["header-actions"]}>
            <button className={styles["new-order-btn"]}>
              <Plus className={styles.icon} />
              New Order
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={`${styles["refresh-btn"]} ${
                isLoading ? styles.loading : ""
              }`}
            >
              <RefreshCw className={styles.icon} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles["search-box"]}>
          <Search className={styles["search-icon"]} />
          <input
            type="text"
            placeholder="Search orders by name, ID, status, or category..."
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
            <option value="All">All Orders</option>
            <option value="Active">Active Orders</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="On the way">On the way</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles["stats-grid"]}>
        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <ShoppingBag />
          </div>
          <div className={styles["stat-content"]}>
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <CheckCircle />
          </div>
          <div className={styles["stat-content"]}>
            <h3>
              {
                orders.filter((order) => order.OrderStatus === "Delivered")
                  .length
              }
            </h3>
            <p>Delivered</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <Timer />
          </div>
          <div className={styles["stat-content"]}>
            <h3>
              {
                orders.filter((order) =>
                  ["Preparing", "On the way", "Pending"].includes(
                    order.OrderStatus
                  )
                ).length
              }
            </h3>
            <p>Active</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <DollarSign />
          </div>
          <div className={styles["stat-content"]}>
            <h3>
              $
              {orders
                .reduce((sum, order) => sum + order.TotalAmount, 0)
                .toFixed(2)}
            </h3>
            <p>Total Spent</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className={styles["orders-list"]}>
        {filteredOrders.length === 0 ? (
          <div className={styles["empty-state"]}>
            <Package className={styles["empty-icon"]} />
            <h3>No orders found</h3>
            <p>
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filter criteria"
                : "You haven't placed any orders yet"}
            </p>
            <button className={styles["new-order-btn"]}>
              <Plus className={styles.icon} />
              Place Your First Order
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.OrderId} className={styles["order-card"]}>
              <div className={styles["card-header"]}>
                <img
                  src={order.Delicacy.DelicacyImage}
                  alt={order.Delicacy.Name}
                  className={styles["delicacy-image"]}
                />
                <div className={styles["status-badges"]}>
                  <div
                    className={`${styles["status-badge"]} ${getStatusClass(
                      order.OrderStatus
                    )}`}
                  >
                    {getStatusIcon(order.OrderStatus)}
                    <span>{order.OrderStatus}</span>
                  </div>
                  <div
                    className={`${
                      styles["payment-badge"]
                    } ${getPaymentStatusClass(order.PaymentStatus)}`}
                  >
                    <span>{order.PaymentStatus}</span>
                  </div>
                </div>
              </div>

              <div className={styles["card-content"]}>
                <div className={styles["order-info"]}>
                  <h3 className={styles["delicacy-title"]}>
                    {order.Delicacy.Name}
                  </h3>
                  <p className={styles["delicacy-description"]}>
                    {order.Delicacy.Description}
                  </p>
                  <span className={styles["category-badge"]}>
                    {order.Delicacy.Category}
                  </span>
                </div>

                <div className={styles["order-details"]}>
                  <div className={styles.detail}>
                    <Calendar className={styles.icon} />
                    <span>{formatDate(order.OrderedAt)}</span>
                  </div>
                  <div className={styles.detail}>
                    <Package className={styles.icon} />
                    <span>Qty: {order.Quantity}</span>
                  </div>
                  <div className={styles.detail}>
                    <DollarSign className={styles.icon} />
                    <span className={styles.amount}>
                      ${order.TotalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {getEstimatedDeliveryTime(
                  order.OrderedAt,
                  order.OrderStatus
                ) && (
                  <div className={styles["estimated-delivery"]}>
                    <Clock className={styles.icon} />
                    <span>
                      Estimated delivery:{" "}
                      {getEstimatedDeliveryTime(
                        order.OrderedAt,
                        order.OrderStatus
                      )}
                    </span>
                  </div>
                )}

                {order.DeliveredAt && (
                  <div className={styles["delivered-time"]}>
                    <CheckCircle className={styles.icon} />
                    <span>Delivered: {formatDate(order.DeliveredAt)}</span>
                  </div>
                )}

                <div className={styles["card-actions"]}>
                  <button className={styles["details-btn"]}>
                    <Eye className={styles.icon} />
                    Details
                  </button>

                  {order.OrderStatus === "Delivered" && (
                    <button className={styles["review-btn"]}>
                      <Star className={styles.icon} />
                      Review
                    </button>
                  )}

                  {order.OrderStatus !== "Delivered" &&
                    order.OrderStatus !== "Cancelled" && (
                      <button
                        className={styles["cancel-btn"]}
                        onClick={() => handleCancelOrder(order.OrderId)}
                      >
                        <XCircle className={styles.icon} />
                        Cancel
                      </button>
                    )}

                  <button className={styles["reorder-btn"]}>
                    <Plus className={styles.icon} />
                    Reorder
                  </button>

                  {order.OrderStatus === "On the way" && (
                    <button className={styles["track-btn"]}>
                      <Truck className={styles.icon} />
                      Track
                    </button>
                  )}
                </div>

                <div className={styles["card-footer"]}>
                  <div className={styles["order-id"]}>
                    Order ID: #{order.OrderId.slice(-8).toUpperCase()}
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