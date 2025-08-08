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
  Calendar,
  Utensils,
  Building,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";

const sampleRooms = [
  {
    RoomId: "1",
    RoomNumber: "CR-001",
    RoomType: "Conference Hall",
    PricePerNight: 250,
    Description:
      "Spacious conference hall perfect for corporate meetings and events",
    Capacity: 50,
    Status: "Available",
    RoomImage:
      "https://i.pinimg.com/736x/c8/0b/68/c80b683b417cef1cc85cf95b777aafeb.jpg",
    CreatedAt: "2024-01-15T10:00:00Z",
    UpdatedAt: "2024-01-15T10:00:00Z",
    Accommodations: [],
    Bookings: [],
    Reviews: [],
    RoomImages: [],
  },
  {
    RoomId: "2",
    RoomNumber: "MB-002",
    RoomType: "Meeting Bay",
    PricePerNight: 150,
    Description: "Intimate meeting space ideal for small team discussions",
    Capacity: 12,
    Status: "Available",
    RoomImage:
      "https://i.pinimg.com/736x/f4/a5/1b/f4a51ba1eac54469c36240785a8e9701.jpg",
    CreatedAt: "2024-01-15T10:00:00Z",
    UpdatedAt: "2024-01-15T10:00:00Z",
    Accommodations: [],
    Bookings: [],
    Reviews: [],
    RoomImages: [],
  },
  {
    RoomId: "3",
    RoomNumber: "DR-003",
    RoomType: "Dining Room",
    PricePerNight: 300,
    Description: "Elegant private dining room for special occasions",
    Capacity: 20,
    Status: "Available",
    RoomImage:
      "https://i.pinimg.com/736x/23/f5/15/23f515fdd3f362e365b8f6f31bfb7270.jpg",
    CreatedAt: "2024-01-15T10:00:00Z",
    UpdatedAt: "2024-01-15T10:00:00Z",
    Accommodations: [],
    Bookings: [],
    Reviews: [],
    RoomImages: [],
  },
];

const sampleDelicacies = [
  {
    DelicacyId: "1",
    Name: "Truffle Risotto",
    Description: "Creamy arborio rice with black truffle and parmesan",
    Price: 45,
    DelicacyImage:
      "https://i.pinimg.com/1200x/8c/7f/36/8c7f3619468690693e9b5561c9e4fe84.jpg",
    Category: "Main Course",
    IsAvailable: true,
    CreatedAt: "2024-01-15T10:00:00Z",
    UpdatedAt: "2024-01-15T10:00:00Z",
    Orders: [],
    Carts: [],
    OrderItems: [],
    Reviews: [],
  },
  {
    DelicacyId: "2",
    Name: "Wagyu Beef Steak",
    Description: "Premium wagyu beef cooked to perfection",
    Price: 85,
    DelicacyImage:
      "https://i.pinimg.com/736x/5a/01/14/5a0114b9f21c7b2231061ec6e3a81a0a.jpg",
    Category: "Main Course",
    IsAvailable: true,
    CreatedAt: "2024-01-15T10:00:00Z",
    UpdatedAt: "2024-01-15T10:00:00Z",
    Orders: [],
    Carts: [],
    OrderItems: [],
    Reviews: [],
  },
  {
    DelicacyId: "3",
    Name: "Chocolate Soufflé",
    Description: "Decadent chocolate soufflé with vanilla ice cream",
    Price: 25,
    DelicacyImage:
      "https://i.pinimg.com/1200x/f6/d1/58/f6d158eb208d61fc964b5e0cca61f8c2.jpg",
    Category: "Dessert",
    IsAvailable: true,
    CreatedAt: "2024-01-15T10:00:00Z",
    UpdatedAt: "2024-01-15T10:00:00Z",
    Orders: [],
    Carts: [],
    OrderItems: [],
    Reviews: [],
  },
];

const sampleReviews = [
  {
    ReviewId: "1",
    UserId: "1",
    RoomId: "1",
    DelicacyId: undefined,
    Rating: 5,
    Comment: "Excellent conference facilities and outstanding service!",
    CreatedAt: "2024-01-20T14:30:00Z",
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
      CreatedAt: "2024-01-10T10:00:00Z",
      UpdatedAt: "2024-01-10T10:00:00Z",
      Bookings: [],
      Accommodations: [],
      Orders: [],
      Carts: [],
      Recoveries: [],
      Payments: [],
      Reviews: [],
      Notifications: [],
    },
    Room: sampleRooms[0],
    Delicacy: undefined,
  },
  {
    ReviewId: "2",
    UserId: "2",
    RoomId: undefined,
    DelicacyId: "1",
    Rating: 5,
    Comment: "The truffle risotto was absolutely divine! Will order again.",
    CreatedAt: "2024-01-22T19:15:00Z",
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
      CreatedAt: "2024-01-12T10:00:00Z",
      UpdatedAt: "2024-01-12T10:00:00Z",
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
    Delicacy: sampleDelicacies[0],
  },
];

export const Landing: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("rooms");
  const navigate = useNavigate();

  const heroSlides = [
    {
      image:
        "https://i.pinimg.com/736x/40/d1/a2/40d1a2ce92e2b27d672352687ea5928f.jpg",
      title: "Welcome to FancyTunes",
      subtitle: "Where Culinary Excellence Meets Perfect Ambiance",
    },
    {
      image:
        "https://i.pinimg.com/1200x/1a/b0/8a/1ab08a6e785a72ba600d73124837d08f.jpg",
      title: "Premium Dining Experience",
      subtitle: "Exquisite Delicacies in Elegant Settings",
    },
    {
      image:
        "https://i.pinimg.com/1200x/c7/5b/c9/c75bc9a248e6ca99ac666cfdba67c5be.jpg",
      title: "Unforgettable Moments",
      subtitle: "Create Lasting Memories with Us",
    },
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

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
      ".feature-card, .card, .review-card"
    );

    animatableElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const navigateToPage = (path: string) => {
    navigate(path);
  };

  return (
    <div className="landing-page">
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
            <button className="btn btn-primary">Book Now</button>
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
              <div className="hero-content">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <div className="hero-actions">
                  <button className="btn btn-primary btn-large">
                    Reserve a Table
                  </button>
                  <button className="btn btn-outline btn-large">
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-btn prev" onClick={prevSlide}>
          <ChevronLeft size={24} />
        </button>
        <button className="slider-btn next" onClick={nextSlide}>
          <ChevronRight size={24} />
        </button>
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
              <div className="feature-icon">{/* <Building size={32} /> */}</div>
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

      {/* Rooms & Menu Section */}
      <section className="content-section" id="rooms">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Offerings</h2>
            <div className="tabs">
              <button
                className={`tab ${activeTab === "rooms" ? "active" : ""}`}
                onClick={() => setActiveTab("rooms")}
              >
                <Building size={20} />
                Rooms
              </button>
              <button
                className={`tab ${activeTab === "delicacies" ? "active" : ""}`}
                onClick={() => setActiveTab("delicacies")}
              >
                <Utensils size={20} />
                Delicacies
              </button>
            </div>
          </div>

          {activeTab === "rooms" && (
            <div className="cards-grid">
              {sampleRooms.map((room) => (
                <div key={room.RoomId} className="card room-card">
                  <div className="card-image">
                    <img src={room.RoomImage} alt={room.RoomType} />
                    <div className="card-overlay">
                      <button className="btn btn-primary">Book Now</button>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="card-title">{room.RoomType}</h3>
                      <span className={`status ${room.Status.toLowerCase()}`}>
                        {room.Status}
                      </span>
                    </div>
                    <p className="card-description">{room.Description}</p>
                    <div className="card-details">
                      <div className="detail">
                        <Users size={16} />
                        <span>Capacity: {room.Capacity}</span>
                      </div>
                      <div className="detail">
                        <Building size={16} />
                        <span>Room: {room.RoomNumber}</span>
                      </div>
                    </div>
                    <div className="card-price">
                      <span className="price">${room.PricePerNight}</span>
                      <span className="period">per night</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "delicacies" && (
            <div className="cards-grid">
              {sampleDelicacies.map((delicacy) => (
                <div key={delicacy.DelicacyId} className="card delicacy-card">
                  <div className="card-image">
                    <img src={delicacy.DelicacyImage} alt={delicacy.Name} />
                    <div className="card-overlay">
                      <button className="btn btn-primary">Add to Cart</button>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="card-title">{delicacy.Name}</h3>
                      <span className="category">{delicacy.Category}</span>
                    </div>
                    <p className="card-description">{delicacy.Description}</p>
                    <div className="card-price">
                      <span className="price">${delicacy.Price}</span>
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
      </section>

      {/* Reviews Section */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="reviews-grid">
            {sampleReviews.map((review) => (
              <div key={review.ReviewId} className="review-card">
                <div className="review-header">
                  <img
                    src={review.User.ProfileImage}
                    alt={review.User.FullName}
                    className="reviewer-avatar"
                  />
                  <div className="reviewer-info">
                    <h4 className="reviewer-name">{review.User.FullName}</h4>
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
                <a href="#">Room Booking</a>
                <a href="#">Delicacies</a>
                <a href="#">Events</a>
                <a href="#">Catering</a>
              </div>
              <div className="link-group">
                <h4>About</h4>
                <a href="#">Our Story</a>
                <a href="#">Chef's Menu</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 FancyTunes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
