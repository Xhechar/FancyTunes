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
import "../styles/NotFound.css";

interface QuickLink {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  color: string;
}

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
    // Add floating animation to elements
    const floatingElements = document.querySelectorAll(".floating-element");
    floatingElements.forEach((element, index) => {
      (element as HTMLElement).style.animationDelay = `${index * 0.5}s`;
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search results or home with search query
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* 404 Header Section */}
        <div className="error-header">
          <div className="error-number">
            <span className="number-4">4</span>
            <span className="number-0">
              <div className="plate-icon">
                <div className="plate"></div>
                <div className="food-item item-1"></div>
                <div className="food-item item-2"></div>
                <div className="food-item item-3"></div>
              </div>
            </span>
            <span className="number-4">4</span>
          </div>
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-description">
            Oops! It seems this page has gone off the menu. But don't worry, we
            have plenty of delicious options waiting for you!
          </p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search for dishes, reservations, or information..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <ArrowRight size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Links Section */}
        <div className="quick-links-section">
          <h2 className="section-title">Where would you like to go?</h2>
          <div className="quick-links-grid">
            {quickLinks.map((link, index) => (
              <div
                key={index}
                className="quick-link-card"
                onClick={() => handleQuickLinkClick(link.path)}
                style={{ "--accent-color": link.color } as React.CSSProperties}
              >
                <div className="link-icon">{link.icon}</div>
                <h3 className="link-title">{link.title}</h3>
                <p className="link-description">{link.description}</p>
                <div className="link-arrow">
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="popular-section">
          <h3 className="popular-title">Popular searches</h3>
          <div className="popular-tags">
            {popularPages.map((page, index) => (
              <button
                key={index}
                className="popular-tag"
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
        <div className="contact-info">
          <div className="brand-section">
            <h2 className="brand-name">FancyTunes</h2>
            <p className="brand-tagline">Premium Dining Experience</p>
          </div>

          <div className="contact-details">
            <div className="contact-item">
              <MapPin size={18} />
              <span>123 Gourmet Street, Nairobi, Kenya</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>+254 700 123 456</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>info@fancytunes.com</span>
            </div>
            <div className="contact-item">
              <Clock size={18} />
              <span>Open Daily: 11:00 AM - 11:00 PM</span>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="home-button-section">
          <button onClick={() => navigate("/")} className="home-button">
            <Home size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="background-decoration">
        <div className="floating-element floating-utensils">
          <ChefHat size={40} />
        </div>
        <div className="floating-element floating-star">
          <Star size={30} />
        </div>
        <div className="floating-element floating-coffee">
          <Coffee size={35} />
        </div>
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
        <div className="decoration-circle circle-4"></div>
      </div>
    </div>
  );
};