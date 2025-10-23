import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Utensils,
  Bed,
  Briefcase,
  ShoppingCart,
  CreditCard,
  Users,
  Star,
  Bell,
  Settings,
  LogOut,
  User,
  Calendar,
  Package,
} from "lucide-react";
import styles from "../../styles/admin/admin.module.css";
import Toast, { ToastProps } from "../../components/Toast";
import { AuthService } from "../../services/auth.service";

export const Admin: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastProps | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const navLinks = [
    { path: "/admin", label: "Dashboard", icon: <Home size={18} /> },
    {
      label: "Delicacies",
      icon: <Utensils size={18} />,
      dropdown: [
        { path: "/admin/delicacies", label: "Manage Delicacies" },
        { path: "/admin/user-orders", label: "Orders" },
        { path: "/admin/carts", label: "Carts" },
      ],
    },
    {
      label: "Accommodations",
      icon: <Bed size={18} />,
      dropdown: [
        { path: "/admin/rooms", label: "Manage Rooms" },
        { path: "/admin/user-accommodations", label: "Accommodations" },
        { path: "/admin/room-images", label: "Room Gallery" },
      ],
    },
    {
      label: "Business & Events",
      icon: <Briefcase size={18} />,
      dropdown: [
        { path: "/admin/business-rooms", label: "Business Rooms" },
        { path: "/admin/user-bookings", label: "Bookings" },
      ],
    },
    {
      label: "Management",
      icon: <Settings size={18} />,
      dropdown: [
        { path: "/admin/users", label: "Users" },
        { path: "/admin/payments", label: "Payments" },
        { path: "/admin/user-reviews", label: "Reviews" },
        { path: "/admin/notifications", label: "Notifications" },
        { path: "/admin/recoveries", label: "Recoveries" },
      ],
    },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const LogoutUser = async () => {
    try {
      let result = await AuthService.Logout();

      if (result.success) {
        setToast({
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message: result.message as string,
          onClose: () => setToast(null),
        });
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (error: any) {
      setToast({
        isVisible: true,
        type: "error",
        title: error?.response?.data?.error as string || "ERROR",
        message:
          error?.response?.data?.message || "An error occurred during logout.",
        onClose: () => setToast(null),
      });
    }
  }

  return (
    <>
      {toast && <Toast {...toast} />}
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.navContainer}>
          <Link to="/admin" className={styles.logo}>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>Fancy Tunes</span>
              <span className={styles.logoSub}>Admin Portal</span>
            </div>
          </Link>

          <div
            className={`${styles.navLinks} ${
              isMobileMenuOpen ? styles.mobileMenuOpen : ""
            }`}
          >
            {navLinks.map((link, index) => (
              <div key={index} className={styles.navItem}>
                {link.dropdown ? (
                  <>
                    <button
                      className={styles.navLink}
                      onClick={() => toggleDropdown(link.label)}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                      <span
                        className={`${styles.dropdownArrow} ${
                          activeDropdown === link.label ? styles.open : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    <div
                      className={`${styles.dropdown} ${
                        activeDropdown === link.label ? styles.show : ""
                      }`}
                    >
                      {link.dropdown.map((subLink, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subLink.path}
                          className={`${styles.dropdownItem} ${
                            isActiveLink(subLink.path) ? styles.active : ""
                          }`}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className={`${styles.navLink} ${
                      isActiveLink(link.path) ? styles.active : ""
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className={styles.navActions}>
            <button className={styles.actionButton}>
              <Bell size={20} />
              <span className={styles.badge}>3</span>
            </button>
            <button className={styles.actionButton}>
              <User size={20} />
            </button>
            <button className={styles.actionButton}
            onClick={() => LogoutUser()}>
              <LogOut size={20} />
            </button>
          </div>

          <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </>
  );
};