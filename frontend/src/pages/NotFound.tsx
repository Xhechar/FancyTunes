import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  ChefHat,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Coffee,
  Users,
  Clock,
  Star,
} from "lucide-react";
import styles from "../styles/NotFound.module.css";

interface QuickLink {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  color: string;
};

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const quickLinks: QuickLink[] = [
    {
      icon: <Home size={24} />,
      title: "Home",
      description: "Return to our main page",
      path: "/",
      color: "var(--primary-color)",
    },
    {
      icon: <ChefHat size={24} />,
      title: "Our Menu",
      description: "Explore our delicious dishes",
      path: "/menu",
      color: "var(--accent-color)",
    },
    {
      icon: <Calendar size={24} />,
      title: "Reservations",
      description: "Book your table now",
      path: "/reservations",
      color: "var(--gold-color)",
    },
    {
      icon: <Users size={24} />,
      title: "Private Dining",
      description: "Conference halls & meeting bays",
      path: "/private-dining",
      color: "var(--success-color)",
    },
    {
      icon: <Phone size={24} />,
      title: "Contact Us",
      description: "Get in touch with our team",
      path: "/contact",
      color: "var(--info-color)",
    },
    {
      icon: <Coffee size={24} />,
      title: "Order Online",
      description: "Order your favorites for delivery",
      path: "/order",
      color: "var(--warning-color)",
    },
  ];

  const popularPages = [
    "Signature Dishes",
    "Wine Selection",
    "Special Events",
    "Chef's Specials",
    "Dietary Options",
    "Location & Hours",
  ];

  useEffect(() => {
    const floatingElements = document.querySelectorAll(
      `.${styles["floating-element"]}`
    );
    floatingElements.forEach((element, index) => {
      (element as HTMLElement).style.animationDelay = `${index * 0.5}s`;
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={styles["not-found-container"]}>
      <div className={styles["not-found-content"]}>
        {/* 404 Header Section */}
        <div className={styles["error-header"]}>
          <div className={styles["error-number"]}>
            <span className={styles["number-4"]}>4</span>
            <span className={styles["number-0"]}>
              <div className={styles["plate-icon"]}>
                <div className={styles["plate"]}></div>
                <div
                  className={`${styles["food-item"]} ${styles["item-1"]}`}
                ></div>
                <div
                  className={`${styles["food-item"]} ${styles["item-2"]}`}
                ></div>
                <div
                  className={`${styles["food-item"]} ${styles["item-3"]}`}
                ></div>
              </div>
            </span>
            <span className={styles["number-4"]}>4</span>
          </div>
          <h1 className={styles["error-title"]}>Page Not Found</h1>
          <p className={styles["error-description"]}>
            Oops! It seems this page has gone off the menu. But don't worry, we
            have plenty of delicious options waiting for you!
          </p>
        </div>

        {/* Search Section */}
        <div className={styles["search-section"]}>
          <form onSubmit={handleSearch} className={styles["search-form"]}>
            <div className={styles["search-input-wrapper"]}>
              <Search className={styles["search-icon"]} size={20} />
              <input
                type="text"
                placeholder="Search for dishes, reservations, or information..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles["search-input"]}
              />
              <button type="submit" className={styles["search-button"]}>
                <ArrowRight size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Links Section */}
        <div className={styles["quick-links-section"]}>
          <h2 className={styles["section-title"]}>
            Where would you like to go?
          </h2>
          <div className={styles["quick-links-grid"]}>
            {quickLinks.map((link, index) => (
              <div
                key={index}
                className={styles["quick-link-card"]}
                onClick={() => handleQuickLinkClick(link.path)}
                style={{ "--accent-color": link.color } as React.CSSProperties}
              >
                <div className={styles["link-icon"]}>{link.icon}</div>
                <h3 className={styles["link-title"]}>{link.title}</h3>
                <p className={styles["link-description"]}>{link.description}</p>
                <div className={styles["link-arrow"]}>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className={styles["popular-section"]}>
          <h3 className={styles["popular-title"]}>Popular searches</h3>
          <div className={styles["popular-tags"]}>
            {popularPages.map((page, index) => (
              <button
                key={index}
                className={styles["popular-tag"]}
                onClick={() =>
                  navigate("/search?q=" + encodeURIComponent(page))
                }
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className={styles["contact-info"]}>
          <div className={styles["brand-section"]}>
            <h2 className={styles["brand-name"]}>FancyTunes</h2>
            <p className={styles["brand-tagline"]}>Premium Dining Experience</p>
          </div>

          <div className={styles["contact-details"]}>
            <div className={styles["contact-item"]}>
              <MapPin size={18} />
              <span>123 Gourmet Street, Nairobi, Kenya</span>
            </div>
            <div className={styles["contact-item"]}>
              <Phone size={18} />
              <span>+254 700 123 456</span>
            </div>
            <div className={styles["contact-item"]}>
              <Mail size={18} />
              <span>info@fancytunes.com</span>
            </div>
            <div className={styles["contact-item"]}>
              <Clock size={18} />
              <span>Open Daily: 11:00 AM - 11:00 PM</span>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className={styles["home-button-section"]}>
          <button
            onClick={() => navigate("/")}
            className={styles["home-button"]}
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Background Decorations */}
      <div className={styles["background-decoration"]}>
        <div
          className={`${styles["floating-element"]} ${styles["floating-utensils"]}`}
        >
          <ChefHat size={40} />
        </div>
        <div
          className={`${styles["floating-element"]} ${styles["floating-star"]}`}
        >
          <Star size={30} />
        </div>
        <div
          className={`${styles["floating-element"]} ${styles["floating-coffee"]}`}
        >
          <Coffee size={35} />
        </div>
        <div
          className={`${styles["decoration-circle"]} ${styles["circle-1"]}`}
        ></div>
        <div
          className={`${styles["decoration-circle"]} ${styles["circle-2"]}`}
        ></div>
        <div
          className={`${styles["decoration-circle"]} ${styles["circle-3"]}`}
        ></div>
        <div
          className={`${styles["decoration-circle"]} ${styles["circle-4"]}`}
        ></div>
      </div>
    </div>
  );
};