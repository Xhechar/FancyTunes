import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Bed,
  Calendar,
  ShoppingCart,
  UtensilsCrossed,
  Star,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChefHat,
  CreditCard,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import {
  User as UserInterface,
  Notification,
} from "../../interfaces/interfaces";
import styles from "../../styles/user/UserDashboard.module.css";
import { UsersService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import Toast, {ToastProps} from "../../components/Toast";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  description: string;
}

interface UserDashboardProps {
  user?: UserInterface;
  notifications?: Notification[];
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  notifications = [],
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [ currentUser, setUser ] = useState<UserInterface | null>(null);
  const [ toast, setToast ] = useState<ToastProps | null>();

  useEffect(() => {
    const fetchUser = async() => {
      let result = await UsersService.GetUserByUserId();

      if(result.success) setUser(() => result.data as UserInterface)
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const unread = notifications.filter(
      (notification) => !notification.IsRead
    ).length;
    setUnreadNotifications(unread);
  }, [notifications]);

  const navigationItems: NavItem[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <Home size={20} />,
      path: "dashboard",
      description: "Dashboard home and summary",
    },
    {
      id: "accommodations",
      label: "Accommodations",
      icon: <Bed size={20} />,
      path: "accommodations",
      badge: user?.Accommodations?.filter((acc) => acc.IsActive).length || 0,
      description: "Manage your room accommodations",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: <Calendar size={20} />,
      path: "bookings",
      badge:
        user?.Bookings?.filter(
          (booking) => booking.BookingStatus === "confirmed"
        ).length || 0,
      description: "View and manage your bookings",
    },
    {
      id: "orders",
      label: "Orders",
      icon: <UtensilsCrossed size={20} />,
      path: "orders",
      badge:
        user?.Orders?.filter((order) => order.OrderStatus === "pending")
          .length || 0,
      description: "Track your food orders",
    },
    {
      id: "cart",
      label: "Cart",
      icon: <ShoppingCart size={20} />,
      path: "cart",
      badge: user?.Carts?.length || 0,
      description: "Items in your cart",
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard size={20} />,
      path: "my-payments",
      description: "Payment history and methods",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star size={20} />,
      path: "reviews",
      description: "Your reviews and ratings",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={20} />,
      path: "notifications",
      badge: unreadNotifications,
      description: "View all notifications",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User size={20} />,
      path: "profile",
      description: "Manage your account",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "settings",
      description: "Account preferences",
    },
  ];

  const isActiveRoute = (path: string): boolean => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string): void => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = async() => {
    try {
      let result = await AuthService.Logout();

      if (result.success) {
        setToast({
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message:
            (result.message as string) ?? "logout successful. Welconme back.",
          onClose: () => setToast(null),
        });

        setTimeout(() => {
          navigate("/login");
        }, 6500);
      } else {
        setToast({
          isVisible: true,
          type: "warning",
          title: result.error as string,
          message: (result.message as string) ?? "logout error.",
          onClose: () => setToast(null),
        });
      }
    } catch (error: any) {
      setToast({
        isVisible: true,
        type: "error",
        title: error?.response?.data?.error as string ?? "SERVER ERROR",
        message: error?.response?.data?.message as string ?? "An error occured during logout",
        onClose: () => setToast(null)
      });
    }
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles["user-dashboard"]}>
      {/* Mobile Header */}
      <header className={styles["mobile-header"]}>
        <div className={styles["mobile-header-content"]}>
          <button
            className={styles["sidebar-toggle"]}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={styles["mobile-brand"]}>
            <ChefHat className={styles["brand-icon"]} size={24} />
            <span className={styles["brand-name"]}>FancyTunes</span>
          </div>

          <div className={styles["mobile-user-info"]}>
            <div className={styles["notification-badge"]}>
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className={styles["badge"]}>{unreadNotifications}</span>
              )}
            </div>
            <div className={styles["user-avatar"]}>
              {currentUser?.ProfileImage ? (
                <img src={currentUser.ProfileImage} alt="Profile" />
              ) : (
                <User size={20} />
              )}
            </div>
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <div
          className={styles["sidebar-overlay"]}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {toast && <Toast {...toast} />}
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles["sidebar-open"] : ""
        }`}
      >
        <div className={styles["sidebar-content"]}>
          <div className={styles["sidebar-brand"]}>
            <div className={styles["brand-logo"]}>
              <ChefHat size={32} />
            </div>
            <div className={styles["brand-text"]}>
              <h1 className={styles["brand-name"]}>FancyTunes</h1>
              <span className={styles["brand-tagline"]}>
                Premium Dining Experience
              </span>
            </div>
          </div>

          <div className={styles["user-info-section"]}>
            <div className={styles["user-avatar-large"]}>
              {currentUser?.ProfileImage ? (
                <img src={currentUser.ProfileImage} alt="Profile" />
              ) : (
                <User size={32} />
              )}
            </div>
            <div className={styles["user-details"]}>
              <h3 className={styles["user-name"]}>
                {currentUser?.FullName || "Guest User"}
              </h3>
              <p className={styles["user-email"]}>
                {currentUser?.Email || "guest@fancytunes.com"}
              </p>
              <span className={styles["user-role"]}>
                {currentUser?.Role === "user" ? "Customer" : "User"}
              </span>
            </div>
          </div>

          <nav className={styles["sidebar-nav"]}>
            <div className={styles["nav-section"]}>
              <h4 className={styles["nav-section-title"]}>Main Menu</h4>
              {navigationItems.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`${styles["nav-item"]} ${
                    isActiveRoute(item.path) ? styles["nav-item-active"] : ""
                  }`}
                  title={item.description}
                >
                  <span className={styles["nav-icon"]}>{item.icon}</span>
                  <span className={styles["nav-label"]}>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={styles["nav-badge"]}>{item.badge}</span>
                  )}
                </button>
              ))}
            </div>

            <div className={styles["nav-section"]}>
              <h4 className={styles["nav-section-title"]}>Services</h4>
              {navigationItems.slice(4, 8).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`${styles["nav-item"]} ${
                    isActiveRoute(item.path) ? styles["nav-item-active"] : ""
                  }`}
                  title={item.description}
                >
                  <span className={styles["nav-icon"]}>{item.icon}</span>
                  <span className={styles["nav-label"]}>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={styles["nav-badge"]}>{item.badge}</span>
                  )}
                </button>
              ))}
            </div>

            <div className={styles["nav-section"]}>
              <h4 className={styles["nav-section-title"]}>Account</h4>
              {navigationItems.slice(8).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`${styles["nav-item"]} ${
                    isActiveRoute(item.path) ? styles["nav-item-active"] : ""
                  }`}
                  title={item.description}
                >
                  <span className={styles["nav-icon"]}>{item.icon}</span>
                  <span className={styles["nav-label"]}>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={styles["nav-badge"]}>{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className={styles["sidebar-footer"]}>
          <div className={styles["contact-info"]}>
            <div className={styles["contact-item"]}>
              <Phone size={16} />
              <span>+254 700 123 456</span>
            </div>
            <div className={styles["contact-item"]}>
              <Mail size={16} />
              <span>support@fancytunes.com</span>
            </div>
            <div className={styles["contact-item"]}>
              <MapPin size={16} />
              <span>Nairobi, Kenya</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={styles["logout-btn"]}
            title="Sign out of your account"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles["main-content"]}>
        <div className={styles["content-container"]}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};