import React, { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Building,
  BriefcaseBusiness,
  Wifi,
  Monitor,
  Coffee,
  BedDouble,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import { AuthService } from "../services/auth.service";
import { CartService } from "../services/cart.service";
import { RoomsService } from "../services/room.service";
import { BusinessRoomService } from "../services/business.room.service";
import { DelicacyService } from "../services/delicacy.service";
import { ReviewsService } from "../services/review.service";
import Toast, { ToastProps } from "../components/Toast";
import { Room, BusinessRoom, Delicacy, Review } from "../interfaces/interfaces";

// Helper to parse amenities string into array
const parseAmenities = (amenities?: string): string[] => {
  if (!amenities) return [];
  return amenities.split(",").map((a) => a.trim());
};

// Amenity icon map
const amenityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi size={13} />,
  "High-Speed Wi-Fi": <Wifi size={13} />,
  "Video Conferencing": <Monitor size={13} />,
  "Coffee Station": <Coffee size={13} />,
  default: <Star size={13} />,
};

const getAmenityIcon = (amenity: string) => {
  return amenityIcons[amenity] ?? amenityIcons["default"];
};

export const Landing: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("rooms");
  const [toast, setToast] = useState<ToastProps | null>(null);
  // eslint-disable-next-line
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // State variables for data
  const [rooms, setRooms] = useState<Room[]>([]);
  const [businessRooms, setBusinessRooms] = useState<BusinessRoom[]>([]);
  const [delicacies, setDelicacies] = useState<Delicacy[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Loading and error states
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingBusinessRooms, setLoadingBusinessRooms] = useState(true);
  const [loadingDelicacies, setLoadingDelicacies] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [errorRooms, setErrorRooms] = useState<string | null>(null);
  const [errorBusinessRooms, setErrorBusinessRooms] = useState<string | null>(
    null,
  );
  const [errorDelicacies, setErrorDelicacies] = useState<string | null>(null);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);

  const navigate = useNavigate();

  const sampleReviews = [
    {
      ReviewId: "1",
      UserId: "1",
      RoomId: "1",
      DelicacyId: undefined,
      Rating: 5,
      Comment: "Excellent conference facilities and outstanding service!",
      CreatedAt: new Date("2024-01-20T14:30:00Z"),
      User: {
        UserId: "1",
        FullName: "Sarah Johnson",
        Email: "sarah@example.com",
        Phone: "+254700123456",
        Password: "",
        Role: "Customer",
        ProfileImage:
          "https://i.pinimg.com/736x/89/18/6e/89186e357f672a7eb9c19e1d3dc7c18c.jpg",
        IsWelcome: true,
        CreatedAt: new Date("2024-01-10T10:00:00Z"),
        UpdatedAt: new Date("2024-01-10T10:00:00Z"),
        Bookings: [],
        Accommodations: [],
        Orders: [],
        Carts: [],
        Recoveries: [],
        Payments: [],
        Reviews: [],
        Notifications: [],
      },
      Room: undefined,
      Delicacy: undefined,
    },
    {
      ReviewId: "2",
      UserId: "2",
      RoomId: undefined,
      DelicacyId: "1",
      Rating: 5,
      Comment: "The truffle risotto was absolutely divine! Will order again.",
      CreatedAt: new Date("2024-01-22T19:15:00Z"),
      User: {
        UserId: "2",
        FullName: "Michael Chen",
        Email: "michael@example.com",
        Phone: "+254700234567",
        Password: "",
        Role: "Customer",
        ProfileImage:
          "https://i.pinimg.com/736x/eb/76/a4/eb76a46ab920d056b02d203ca95e9a22.jpg",
        IsWelcome: true,
        CreatedAt: new Date("2024-01-12T10:00:00Z"),
        UpdatedAt: new Date("2024-01-12T10:00:00Z"),
        Bookings: [],
        Accommodations: [],
        Orders: [],
        Carts: [],
        Recoveries: [],
        Payments: [],
        Reviews: [],
        Notifications: [],
      },
      Room: undefined,
      Delicacy: undefined,
    },
  ];

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await AuthService.AuthenticateUser();
        setIsAuthenticated(response.success);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      setLoadingRooms(true);
      setErrorRooms(null);
      try {
        const response = await RoomsService.GetAllRooms();
        if (response.success && response.dataList) {
          setRooms(response.dataList);
        } else {
          setErrorRooms(response.error || "Failed to fetch rooms");
        }
      } catch (error) {
        setErrorRooms("An error occurred while fetching rooms");
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  // Fetch business rooms
  useEffect(() => {
    const fetchBusinessRooms = async () => {
      setLoadingBusinessRooms(true);
      setErrorBusinessRooms(null);
      try {
        const response = await BusinessRoomService.GetAvailableBusinessRooms();
        if (response.success && response.dataList) {
          setBusinessRooms(response.dataList);
        } else {
          setErrorBusinessRooms(
            response.error || "Failed to fetch business rooms",
          );
        }
      } catch (error) {
        setErrorBusinessRooms(
          "An error occurred while fetching business rooms",
        );
      } finally {
        setLoadingBusinessRooms(false);
      }
    };
    fetchBusinessRooms();
  }, []);

  // Fetch delicacies
  useEffect(() => {
    const fetchDelicacies = async () => {
      setLoadingDelicacies(true);
      setErrorDelicacies(null);
      try {
        const response = await DelicacyService.GetAvailableDelicacies();
        if (response.success && response.dataList) {
          setDelicacies(response.dataList);
        } else {
          setErrorDelicacies(response.error || "Failed to fetch delicacies");
        }
      } catch (error) {
        setErrorDelicacies("An error occurred while fetching delicacies");
      } finally {
        setLoadingDelicacies(false);
      }
    };
    fetchDelicacies();
  }, []);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      setErrorReviews(null);
      try {
        const response = await ReviewsService.GetAllReviews();
        if (
          response.success &&
          response.dataList &&
          response.dataList.length > 0
        ) {
          setReviews(response.dataList);
        } else {
          setReviews(sampleReviews);
        }
      } catch (error) {
        setReviews(sampleReviews);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  const heroSlides = [
    {
      image:
        "https://res.cloudinary.com/dakyiye2e/image/upload/v1776424258/uap4bgocplr3c32xp9vq.jpg",
      title: "Welcome to FancyTunes",
      subtitle: "Where Culinary Excellence Meets Perfect Ambiance",
    },
    {
      image:
        "https://res.cloudinary.com/dakyiye2e/image/upload/v1776424378/ijx4qn8ksjpb9iasygsk.jpg",
      title: "Premium Accommodation Experience",
      subtitle: "Exquisite Rooms in Elegant Settings",
    },
    {
      image:
        "https://res.cloudinary.com/dakyiye2e/image/upload/v1776424471/qfsqvcffwpegreqtvfvx.jpg",
      title: "Comfort Conference & Business Rooms",
      subtitle: "Get perfect rooms with custom adjustments",
    },
    {
      image:
        "https://res.cloudinary.com/dakyiye2e/image/upload/v1776424663/fbjfpharp9sutifiocum.jpg",
      title: "Unforgettable Moments",
      subtitle: "Create Lasting Memories with Us",
    },
    {
      image:
        "https://res.cloudinary.com/dakyiye2e/image/upload/v1776425190/smt7hpkyhx2ogdoo4ykr.jpg",
      title: "Mouth Watering Delicacies",
      subtitle: "Feast your belly, with exquisite dishes.",
    },
  ];

  const heroStats = [
    { label: "Rooms Available", value: "24+", icon: <BedDouble size={18} /> },
    { label: "Business Suites", value: "8", icon: <Building size={18} /> },
    { label: "Menu Items", value: "60+", icon: <Utensils size={18} /> },
    { label: "Service Hours", value: "24/7", icon: <Clock size={18} /> },
  ];

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    });

    const animatableElements = document.querySelectorAll(
      ".feature-card, .card, .review-card",
    );
    animatableElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab, rooms, businessRooms, delicacies, reviews]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );

  const navigateToPage = (path: string) => navigate(path);

  const handleAddToCart = async (delicacyId: string) => {
    // Check authentication
    try {
      const authResponse = await AuthService.AuthenticateUser();
      if (!authResponse.success) {
        navigate("/login");
        return;
      }
    } catch {
      navigate("/login");
      return;
    }

    try {
      const response = await CartService.CreateCart(delicacyId, {
        Quantity: 1,
      });

      if (response.success) {
        setToast({
          isVisible: true,
          type: "success",
          title: "Added to Cart",
          message: response.message || "Item added to cart successfully!",
          onClose() {
            setToast(null);
          },
        });
      } else {
        setToast({
          isVisible: true,
          type: "error",
          title: "Error",
          message:
            response.error || response.message || "Failed to add item to cart",
          onClose() {
            setToast(null);
          },
        });
      }
    } catch (error: any) {
      setToast({
        isVisible: true,
        type: "error",
        title: "Error",
        message:
          error?.error?.message ??
          "An error occurred while adding item to cart",
        onClose() {
          setToast(null);
        },
      });
    }
  };

  const handleBookAccommodation = async (roomId: string) => {
    // Check authentication
    try {
      const authResponse = await AuthService.AuthenticateUser();
      if (!authResponse.success) {
        navigate("/login");
        return;
      }
    } catch {
      navigate("/login");
      return;
    }

    // Navigate to accommodation booking page with room ID
    navigate(`/dashboard`);
  };

  const handleBookBusinessRoom = async (businessRoomId: string) => {
    // Check authentication
    try {
      const authResponse = await AuthService.AuthenticateUser();
      if (!authResponse.success) {
        navigate("/login");
        return;
      }
    } catch {
      navigate("/login");
      return;
    }

    // Navigate to business room booking page with room ID
    navigate(`/dashboard`);
  };

  return (
    <div className="landing-page">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="nav-brand">
            <h1 className="logo">FancyTunes</h1>
          </div>
          <nav className="nav-menu">
            <a href="#home" className="nav-link">
              Home
            </a>
            <a href="#rooms" className="nav-link">
              Rooms
            </a>
            <a href="#delicacies" className="nav-link">
              Menu
            </a>
            <a href="#reviews" className="nav-link">
              Reviews
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="btn btn-outline"
              onClick={() => navigateToPage("/login")}
            >
              Sign In
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigateToPage("/register")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay"></div>
            </div>
          ))}
        </div>

        {/* Slide nav arrows */}
        <button className="slider-btn prev" onClick={prevSlide}>
          <ChevronLeft size={22} />
        </button>
        <button className="slider-btn next" onClick={nextSlide}>
          <ChevronRight size={22} />
        </button>

        {/* Main hero layout */}
        <div className="hero-layout">
          {/* Left — text content */}
          <div className="hero-content">
            <span className="hero-eyebrow">Nairobi's Premier Venue</span>
            <h1 className="hero-title">{heroSlides[currentSlide].title}</h1>
            <p className="hero-subtitle">{heroSlides[currentSlide].subtitle}</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-large">
                Reserve a Table
              </button>
              <button className="btn btn-hero-outline btn-large">
                View Menu
              </button>
            </div>
          </div>

          {/* Right — stats panel */}
          <div className="hero-stats-panel">
            <p className="stats-panel-label">AT A GLANCE</p>
            <div className="stats-grid">
              {heroStats.map((stat, i) => (
                <div className="stat-item" key={i}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="stats-panel-divider" />
            <p className="stats-panel-tagline">
              "A dining and stay experience like no other in Nairobi."
            </p>
          </div>
        </div>

        {/* Slide dots */}
        <div className="slider-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Building size={32} />
              </div>
              <h3>Premium Spaces</h3>
              <p>
                Conference halls and meeting bays for all your business needs
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Utensils size={32} />
              </div>
              <h3>Gourmet Cuisine</h3>
              <p>Exquisite delicacies prepared by world-class chefs</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={32} />
              </div>
              <h3>24/7 Service</h3>
              <p>Round-the-clock service for your convenience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms / Business Rooms / Delicacies Section */}
      <section className="content-section" id="rooms">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Offerings</h2>
            <div className="tabs">
              <button
                className={`tab ${activeTab === "rooms" ? "active" : ""}`}
                onClick={() => setActiveTab("rooms")}
              >
                <BedDouble size={18} />
                Rooms
              </button>
              <button
                className={`tab ${activeTab === "business" ? "active" : ""}`}
                onClick={() => setActiveTab("business")}
              >
                <BriefcaseBusiness size={18} />
                Business Rooms
              </button>
              <button
                className={`tab ${activeTab === "delicacies" ? "active" : ""}`}
                onClick={() => setActiveTab("delicacies")}
              >
                <Utensils size={18} />
                Delicacies
              </button>
            </div>
          </div>

          {/* Accommodation Rooms */}
          {activeTab === "rooms" && (
            <div>
              {loadingRooms ? (
                <div className="loading-container">
                  <Loader size={40} className="spinner" />
                  <p>Loading rooms...</p>
                </div>
              ) : errorRooms ? (
                <div className="error-container">
                  <p className="error-message">{errorRooms}</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="empty-container">
                  <p>No rooms available at the moment.</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {rooms.map((room) => (
                    <div key={room.RoomId} className="card room-card">
                      <div className="card-image">
                        <img src={room.RoomImage} alt={room.RoomType} />
                        <div className="card-overlay">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleBookAccommodation(room.RoomId)}
                          >
                            {isLoadingAuth ? "Loading..." : "Accommodate"}
                          </button>
                        </div>
                      </div>
                      <div className="card-content">
                        <div className="card-header">
                          <h3 className="card-title">{room.RoomType}</h3>
                          <span
                            className={`status ${room.Status.toLowerCase()}`}
                          >
                            {room.Status}
                          </span>
                        </div>
                        <p className="card-description">{room.Description}</p>
                        <div className="card-details">
                          <div className="detail">
                            <Users size={15} />
                            <span>Capacity: {room.Capacity}</span>
                          </div>
                          <div className="detail">
                            <BedDouble size={15} />
                            <span>
                              {room.RoomCount} unit
                              {room.RoomCount !== 1 ? "s" : ""} available
                            </span>
                          </div>
                        </div>
                        <div className="card-price">
                          <div>
                            <span className="price">
                              Ksh {room.PricePerNight.toLocaleString()}
                            </span>
                            <span className="period"> / night</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Business Rooms */}
          {activeTab === "business" && (
            <div>
              {loadingBusinessRooms ? (
                <div className="loading-container">
                  <Loader size={40} className="spinner" />
                  <p>Loading business rooms...</p>
                </div>
              ) : errorBusinessRooms ? (
                <div className="error-container">
                  <p className="error-message">{errorBusinessRooms}</p>
                </div>
              ) : businessRooms.length === 0 ? (
                <div className="empty-container">
                  <p>No business rooms available at the moment.</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {businessRooms.map((room) => (
                    <div
                      key={room.BusinessRoomId}
                      className="card business-card"
                    >
                      <div className="card-image">
                        <img
                          src={
                            room.BusinessRoomImage ||
                            "https://i.pinimg.com/736x/c8/0b/68/c80b683b417cef1cc85cf95b777aafeb.jpg"
                          }
                          alt={room.Name}
                        />
                        <div className="card-overlay">
                          <button
                            className={`btn ${room.IsAvailable ? "btn-primary" : "btn-disabled"}`}
                            disabled={!room.IsAvailable}
                            onClick={() =>
                              handleBookBusinessRoom(room.BusinessRoomId)
                            }
                          >
                            {isLoadingAuth
                              ? "Loading..."
                              : !room.IsAvailable
                                ? "Unavailable"
                                : "Book Room"}
                          </button>
                        </div>
                      </div>
                      <div className="card-content">
                        <div className="card-header">
                          <h3 className="card-title">{room.Name}</h3>
                          <span
                            className={`status ${room.IsAvailable ? "available" : "unavailable"}`}
                          >
                            {room.IsAvailable ? "Available" : "Booked"}
                          </span>
                        </div>
                        <p className="card-description">{room.Description}</p>
                        <div className="card-details">
                          <div className="detail">
                            <Users size={15} />
                            <span>Up to {room.Capacity} people</span>
                          </div>
                          <div className="detail">
                            <Building size={15} />
                            <span>
                              {room.RoomCount} room
                              {room.RoomCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        {room.Amenities && (
                          <div className="amenities-list">
                            {parseAmenities(room.Amenities).map((a, i) => (
                              <span className="amenity-tag" key={i}>
                                {getAmenityIcon(a)}
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="card-price">
                          <div>
                            <span className="price">
                              Ksh {room.PricePerHour.toLocaleString()}
                            </span>
                            <span className="period"> / hour</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Delicacies */}
          {activeTab === "delicacies" && (
            <div>
              {loadingDelicacies ? (
                <div className="loading-container">
                  <Loader size={40} className="spinner" />
                  <p>Loading delicacies...</p>
                </div>
              ) : errorDelicacies ? (
                <div className="error-container">
                  <p className="error-message">{errorDelicacies}</p>
                </div>
              ) : delicacies.length === 0 ? (
                <div className="empty-container">
                  <p>No delicacies available at the moment.</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {delicacies.map((delicacy) => (
                    <div
                      key={delicacy.DelicacyId}
                      className="card delicacy-card"
                    >
                      <div className="card-image">
                        <img src={delicacy.DelicacyImage} alt={delicacy.Name} />
                        <div className="card-overlay">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddToCart(delicacy.DelicacyId)}
                            disabled={!delicacy.IsAvailable}
                          >
                            {isLoadingAuth ? "Loading..." : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                      <div className="card-content">
                        <div className="card-header">
                          <h3 className="card-title">{delicacy.Name}</h3>
                          <span className="category">{delicacy.Category}</span>
                        </div>
                        <p className="card-description">
                          {delicacy.Description}
                        </p>
                        <div className="card-price">
                          <span className="price">
                            Ksh {delicacy.Price.toLocaleString()}
                          </span>
                          <span
                            className={`availability ${
                              delicacy.IsAvailable ? "available" : "unavailable"
                            }`}
                          >
                            {delicacy.IsAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          {loadingReviews ? (
            <div className="loading-container">
              <Loader size={40} className="spinner" />
              <p>Loading reviews...</p>
            </div>
          ) : errorReviews ? (
            <div className="error-container">
              <p className="error-message">{errorReviews}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="empty-container">
              <p>No reviews available yet.</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div key={review.ReviewId} className="review-card">
                  <div className="review-header">
                    <img
                      src={review.User?.ProfileImage}
                      alt={review.User?.FullName}
                      className="reviewer-avatar"
                    />
                    <div className="reviewer-info">
                      <h4 className="reviewer-name">{review.User?.FullName}</h4>
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.Rating ? "filled" : ""}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="review-comment">"{review.Comment}"</p>
                  <div className="review-subject">
                    {review.Room && `Room: ${review.Room.RoomType}`}
                    {review.Delicacy && `Delicacy: ${review.Delicacy.Name}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2 className="section-title">Get in Touch</h2>
              <p className="contact-description">
                Ready to experience the finest dining and accommodation? Contact
                us today.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <MapPin size={20} />
                  <span>123 Gourmet Street, Nairobi, Kenya</span>
                </div>
                <div className="contact-item">
                  <Phone size={20} />
                  <span>+254 700 123 456</span>
                </div>
                <div className="contact-item">
                  <Mail size={20} />
                  <span>hello@fancytunes.com</span>
                </div>
                <div className="contact-item">
                  <Clock size={20} />
                  <span>Open 24/7</span>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <div className="form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="form-textarea"
                  ></textarea>
                </div>
                <button className="btn btn-primary btn-full">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="logo">FancyTunes</h3>
              <p>Where culinary excellence meets perfect ambiance</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Services</h4>
                {/* eslint-disable-next-line */}
                <a href="#">Room Booking</a>
                {/* eslint-disable-next-line */}
                <a href="#">Business Rooms</a>
                {/* eslint-disable-next-line */}
                <a href="#">Delicacies</a>
                {/* eslint-disable-next-line */}
                <a href="#">Events</a>
                {/* eslint-disable-next-line */}
                <a href="#">Catering</a>
              </div>
              <div className="link-group">
                <h4>About</h4>
                {/* eslint-disable-next-line */}
                <a href="#">Our Story</a>
                {/* eslint-disable-next-line */}
                <a href="#">Chef's Menu</a>
                {/* eslint-disable-next-line */}
                <a href="#">Careers</a>
                {/* eslint-disable-next-line */}
                <a href="#">Press</a>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                {/* eslint-disable-next-line */}
                <a href="#">Help Center</a>
                {/* eslint-disable-next-line */}
                <a href="#">Contact</a>
                {/* eslint-disable-next-line */}
                <a href="#">Privacy Policy</a>
                {/* eslint-disable-next-line */}
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 FancyTunes. All rights reserved.</p>
            <p className="footer-dev">
              Developed by{" "}
              <a
                href="https://Xhechar.github.io/felix"
                className="footer-dev-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                xhechar
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
