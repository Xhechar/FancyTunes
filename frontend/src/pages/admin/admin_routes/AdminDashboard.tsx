import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Bed,
  Briefcase,
  Utensils,
  ShoppingCart,
  Calendar,
  Clock,
  Star,
  Bell,
  CheckCircle,
  XCircle,
  Package,
  CreditCard,
} from "lucide-react";
import styles from "../../../styles/admin/admin_routes/AdminDashboard.module.css";

export const AdminDashboard: React.FC = () => {
  const [timeOfDay, setTimeOfDay] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hour = now.getHours();

      if (hour < 12) setTimeOfDay("Morning");
      else if (hour < 17) setTimeOfDay("Afternoon");
      else setTimeOfDay("Evening");

      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Mock data - Replace with actual API calls
  const stats = {
    totalRevenue: 45230.5,
    revenueGrowth: 12.5,
    totalBookings: 156,
    bookingsGrowth: 8.3,
    activeRooms: 24,
    roomsGrowth: -2.1,
    totalOrders: 342,
    ordersGrowth: 15.7,
  };

  const recentBookings = [
    {
      id: "1",
      guestName: "John Doe",
      roomType: "Deluxe Suite",
      checkIn: "2024-10-16",
      status: "Confirmed",
      amount: 450,
    },
    {
      id: "2",
      guestName: "Jane Smith",
      roomType: "Business Room",
      checkIn: "2024-10-17",
      status: "Pending",
      amount: 120,
    },
    {
      id: "3",
      guestName: "Mike Johnson",
      roomType: "Presidential",
      checkIn: "2024-10-18",
      status: "Confirmed",
      amount: 780,
    },
  ];

  const recentOrders = [
    {
      id: "1",
      customer: "Sarah Wilson",
      items: "Grilled Salmon, Caesar Salad",
      total: 38.98,
      status: "Delivered",
      time: "10 mins ago",
    },
    {
      id: "2",
      customer: "Tom Brown",
      items: "Chocolate Lava Cake x2",
      total: 25.98,
      status: "Preparing",
      time: "25 mins ago",
    },
    {
      id: "3",
      customer: "Emily Davis",
      items: "Main Course, Beverage",
      total: 42.5,
      status: "Pending",
      time: "35 mins ago",
    },
  ];

  const quickStats = [
    {
      label: "Available Rooms",
      value: 18,
      icon: <Bed size={24} />,
      color: "success",
    },
    {
      label: "Occupied Rooms",
      value: 6,
      icon: <CheckCircle size={24} />,
      color: "warning",
    },
    {
      label: "Pending Orders",
      value: 12,
      icon: <Clock size={24} />,
      color: "info",
    },
    {
      label: "Today's Revenue",
      value: "$2,340",
      icon: <DollarSign size={24} />,
      color: "accent",
    },
  ];

  const topDelicacies = [
    { name: "Grilled Salmon", orders: 45, revenue: 1304.55 },
    { name: "Chocolate Lava Cake", orders: 38, revenue: 493.62 },
    { name: "Caesar Salad", orders: 32, revenue: 319.68 },
  ];

  const upcomingEvents = [
    {
      name: "Corporate Meeting",
      room: "Executive Conference",
      date: "Oct 16, 2024",
      time: "10:00 AM",
    },
    {
      name: "Wedding Reception",
      room: "Grand Banquet Hall",
      date: "Oct 18, 2024",
      time: "6:00 PM",
    },
    {
      name: "Business Seminar",
      room: "Conference Room B",
      date: "Oct 20, 2024",
      time: "2:00 PM",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeText}>
          <h1 className={styles.welcomeTitle}>Good {timeOfDay}, Admin! 👋</h1>
          <p className={styles.welcomeSubtitle}>
            {currentDate} • Here's what's happening at Fancy Tunes today
          </p>
        </div>
        <div className={styles.quickActions}>
          <button className={styles.quickActionBtn}>
            <Bell size={20} />
            Notifications
            <span className={styles.notifBadge}>5</span>
          </button>
          <button className={styles.quickActionBtn}>
            <Calendar size={20} />
            View Calendar
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "var(--gradient-accent)" }}
          >
            <DollarSign size={28} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Revenue</p>
            <h3 className={styles.statValue}>
              ${stats.totalRevenue.toLocaleString()}
            </h3>
            <div className={`${styles.statChange} ${styles.positive}`}>
              <TrendingUp size={16} />
              <span>+{stats.revenueGrowth}% from last month</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "var(--gradient-primary)" }}
          >
            <Calendar size={28} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Bookings</p>
            <h3 className={styles.statValue}>{stats.totalBookings}</h3>
            <div className={`${styles.statChange} ${styles.positive}`}>
              <TrendingUp size={16} />
              <span>+{stats.bookingsGrowth}% from last month</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "linear-gradient(135deg, #27ae60, #2ecc71)" }}
          >
            <Bed size={28} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Active Rooms</p>
            <h3 className={styles.statValue}>{stats.activeRooms}</h3>
            <div className={`${styles.statChange} ${styles.negative}`}>
              <TrendingDown size={16} />
              <span>{Math.abs(stats.roomsGrowth)}% from last month</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "linear-gradient(135deg, #e67e22, #f39c12)" }}
          >
            <ShoppingCart size={28} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Orders</p>
            <h3 className={styles.statValue}>{stats.totalOrders}</h3>
            <div className={`${styles.statChange} ${styles.positive}`}>
              <TrendingUp size={16} />
              <span>+{stats.ordersGrowth}% from last month</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.quickStatsGrid}>
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className={`${styles.quickStatCard} ${styles[stat.color]}`}
          >
            <div className={styles.quickStatIcon}>{stat.icon}</div>
            <div className={styles.quickStatContent}>
              <p className={styles.quickStatLabel}>{stat.label}</p>
              <h4 className={styles.quickStatValue}>{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Calendar size={20} />
              <h2>Recent Bookings</h2>
            </div>
            <a href="/admin/user-bookings" className={styles.viewAll}>
              View All →
            </a>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Room Type</th>
                  <th>Check-in</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className={styles.guestName}>{booking.guestName}</td>
                    <td>{booking.roomType}</td>
                    <td>{booking.checkIn}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[booking.status.toLowerCase()]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className={styles.amount}>${booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Utensils size={20} />
              <h2>Recent Orders</h2>
            </div>
            <a href="/admin/user-orders" className={styles.viewAll}>
              View All →
            </a>
          </div>
          <div className={styles.ordersList}>
            {recentOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <p className={styles.customerName}>{order.customer}</p>
                    <p className={styles.orderItems}>{order.items}</p>
                  </div>
                  <span
                    className={`${styles.orderStatus} ${
                      styles[order.status.toLowerCase()]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className={styles.orderFooter}>
                  <span className={styles.orderTime}>{order.time}</span>
                  <span className={styles.orderTotal}>${order.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Star size={20} />
              <h2>Top Selling Delicacies</h2>
            </div>
            <a href="/admin/delicacies" className={styles.viewAll}>
              View All →
            </a>
          </div>
          <div className={styles.topItemsList}>
            {topDelicacies.map((item, index) => (
              <div key={index} className={styles.topItem}>
                <div className={styles.topItemRank}>#{index + 1}</div>
                <div className={styles.topItemInfo}>
                  <p className={styles.topItemName}>{item.name}</p>
                  <p className={styles.topItemOrders}>{item.orders} orders</p>
                </div>
                <div className={styles.topItemRevenue}>
                  ${item.revenue.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Briefcase size={20} />
              <h2>Upcoming Events</h2>
            </div>
            <a href="/admin/user-bookings" className={styles.viewAll}>
              View All →
            </a>
          </div>
          <div className={styles.eventsList}>
            {upcomingEvents.map((event, index) => (
              <div key={index} className={styles.eventCard}>
                <div className={styles.eventDate}>
                  <Calendar size={18} />
                  <span>{event.date}</span>
                </div>
                <h4 className={styles.eventName}>{event.name}</h4>
                <p className={styles.eventRoom}>{event.room}</p>
                <div className={styles.eventTime}>
                  <Clock size={16} />
                  <span>{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};