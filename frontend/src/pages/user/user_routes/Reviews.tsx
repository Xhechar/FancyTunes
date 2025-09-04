import React, { useState, useEffect } from "react";
import {
  Star,
  Edit3,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  Filter,
  Search,
  Utensils,
  Bed,
  TrendingUp,
  Award,
} from "lucide-react";
import styles from "../../../styles/user/user_routes/Reviews.module.css";

// Import your interfaces
interface User {
  UserId: string;
  FullName: string;
  Email: string;
  Phone: string;
  Password: string;
  Role: string;
  ProfileImage?: string;
  IsWelcome: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  Bookings: Booking[];
  Accommodations: Accommodation[];
  Orders: Order[];
  Carts: Cart[];
  Recoveries: Recovery[];
  Payments: Payment[];
  Reviews: Review[];
  Notifications: Notification[];
}

interface Room {
  RoomId: string;
  RoomNumber: string;
  RoomType: string;
  PricePerNight: number;
  Description: string;
  Capacity: number;
  Status: string;
  RoomImage?: string;
  CreatedAt: string;
  UpdatedAt: string;
  Accommodations: Accommodation[];
  Bookings: Booking[];
  Reviews: Review[];
  RoomImages: RoomImage[];
}

interface Delicacy {
  DelicacyId: string;
  Name: string;
  Description: string;
  Price: number;
  DelicacyImage: string;
  Category: string;
  IsAvailable: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  Orders: Order[];
  Carts: Cart[];
  OrderItems: OrderItem[];
  Reviews: Review[];
}

interface Review {
  ReviewId: string;
  UserId: string;
  RoomId?: string;
  DelicacyId?: string;
  Rating: number;
  Comment: string;
  CreatedAt: string;
  User: User;
  Room?: Room;
  Delicacy?: Delicacy;
}

interface Payment {
  PaymentId: string;
  UserId: string;
  Amount: number;
  PaymentMethod: string;
  PaymentReference: string;
  TransactionId: string;
  Status: string;
  BookingId?: string;
  OrderId?: string;
  PaidAt: string;
  CreatedAt: string;
  User: User;
}

interface Booking {
  BookingId: string;
  UserId: string;
  RoomId: string;
  CheckInDate: string;
  CheckOutDate: string;
  NumberOfGuests: number;
  TotalAmount: number;
  SpecialRequests?: string;
  BookingStatus: string;
  PaymentStatus: string;
  CreatedAt: string;
  UpdatedAt: string;
  User: User;
  Room: Room;
}

interface Order {
  OrderId: string;
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  TotalAmount: number;
  OrderStatus: string;
  OrderedAt: string;
  DeliveredAt?: string;
  PaymentStatus: string;
  User: User;
  Delicacy: Delicacy;
  OrderItems: OrderItem[];
}

interface OrderItem {
  OrderItemId: string;
  OrderId: string;
  DelicacyId: string;
  Quantity: number;
  Price: number;
  Subtotal: number;
  Order: Order;
  Delicacy: Delicacy;
}

interface Accommodation {
  AccommodationId: string;
  UserId: string;
  RoomId: string;
  CheckInDate: string;
  CheckOutDate: string;
  TotalAmount: number;
  SpecialRequests?: string;
  PaymentStatus: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  User: User;
  Room: Room;
}

interface Cart {
  CartId: string;
  UserId: string;
  DelicacyId: string;
  Quantity: number;
  AddedAt: string;
  User: User;
  Delicacy: Delicacy;
}

interface Recovery {
  RecoveryId: string;
  UserId: string;
  VerificationCode: number;
  ExpiresAt: string;
  IsUsed: boolean;
  CreatedAt: string;
  User: User;
}

interface Notification {
  NotificationId: string;
  UserId: string;
  Title: string;
  Message: string;
  IsRead: boolean;
  CreatedAt: string;
  User: User;
}

interface RoomImage {
  RoomImageId: string;
  RoomId: string;
  ImageUrl: string;
  Room: Room;
}

interface ReviewWithPayment extends Review {
  relatedPayment?: Payment;
  relatedBooking?: Booking;
  relatedOrder?: Order;
}

export const Reviews: React.FC = () => {
  // Mock user data
  const user: User = {
    UserId: "user123",
    FullName: "Sarah Johnson",
    Email: "sarah.johnson@email.com",
    Phone: "+1234567890",
    Password: "",
    Role: "Customer",
    ProfileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    IsWelcome: true,
    CreatedAt: "2024-01-15T10:00:00Z",
    UpdatedAt: "2024-08-20T15:30:00Z",
    Bookings: [],
    Accommodations: [],
    Orders: [],
    Carts: [],
    Recoveries: [],
    Payments: [],
    Reviews: [],
    Notifications: [],
  };
  const [reviews, setReviews] = useState<ReviewWithPayment[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewWithPayment[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "room" | "delicacy">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">(
    "newest"
  );
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [loading, setLoading] = useState(true);

  // Mock reviews data - replace with actual API calls
  useEffect(() => {
    const mockReviews: ReviewWithPayment[] = [
      {
        ReviewId: "1",
        UserId: user.UserId,
        RoomId: "room1",
        Rating: 5,
        Comment:
          "Absolutely fantastic experience! The room was pristine, spacious, and had an incredible view of the city skyline. The staff was exceptionally attentive and made our anniversary celebration truly memorable.",
        CreatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        User: user,
        Room: {
          RoomId: "room1",
          RoomNumber: "101",
          RoomType: "Deluxe Suite",
          PricePerNight: 250,
          Description: "Luxury suite with city view and premium amenities",
          Capacity: 2,
          Status: "Available",
          RoomImage:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
          CreatedAt: "",
          UpdatedAt: "",
          Accommodations: [],
          Bookings: [],
          Reviews: [],
          RoomImages: [],
        },
        relatedPayment: {
          PaymentId: "pay1",
          UserId: user.UserId,
          Amount: 250,
          PaymentMethod: "Credit Card",
          PaymentReference: "REF123456",
          TransactionId: "TXN789012",
          Status: "Completed",
          BookingId: "book1",
          PaidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          CreatedAt: "",
          User: user,
        },
      },
      {
        ReviewId: "2",
        UserId: user.UserId,
        DelicacyId: "del1",
        Rating: 4,
        Comment:
          "The truffle pasta was absolutely divine - rich, creamy, and perfectly al dente. However, the chocolate soufflé was a bit too sweet for my taste. Overall, a wonderful dining experience with exceptional service.",
        CreatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        User: user,
        Delicacy: {
          DelicacyId: "del1",
          Name: "Truffle Pasta Carbonara",
          Description:
            "Handmade pasta with black truffle cream sauce, pancetta, and aged parmesan",
          Price: 35,
          DelicacyImage:
            "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
          Category: "Main Course",
          IsAvailable: true,
          CreatedAt: "",
          UpdatedAt: "",
          Orders: [],
          Carts: [],
          OrderItems: [],
          Reviews: [],
        },
        relatedPayment: {
          PaymentId: "pay2",
          UserId: user.UserId,
          Amount: 67.5,
          PaymentMethod: "Digital Wallet",
          PaymentReference: "REF789123",
          TransactionId: "TXN456789",
          Status: "Pending",
          OrderId: "order1",
          PaidAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          CreatedAt: "",
          User: user,
        },
      },
      {
        ReviewId: "3",
        UserId: user.UserId,
        RoomId: "room2",
        Rating: 5,
        Comment:
          "Perfect for our business conference! The conference hall was well-equipped with state-of-the-art AV equipment, comfortable seating, and excellent acoustics. The catering service was top-notch.",
        CreatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        User: user,
        Room: {
          RoomId: "room2",
          RoomNumber: "C-Hall-A",
          RoomType: "Executive Conference Hall",
          PricePerNight: 450,
          Description:
            "Large conference hall with premium facilities for corporate events",
          Capacity: 50,
          Status: "Available",
          RoomImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
          CreatedAt: "",
          UpdatedAt: "",
          Accommodations: [],
          Bookings: [],
          Reviews: [],
          RoomImages: [],
        },
        relatedPayment: {
          PaymentId: "pay3",
          UserId: user.UserId,
          Amount: 450,
          PaymentMethod: "Bank Transfer",
          PaymentReference: "REF345678",
          TransactionId: "TXN123456",
          Status: "Completed",
          BookingId: "book2",
          PaidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          CreatedAt: "",
          User: user,
        },
      },
      {
        ReviewId: "4",
        UserId: user.UserId,
        DelicacyId: "del2",
        Rating: 3,
        Comment:
          "The seafood platter was fresh and beautifully presented, but the lobster was slightly overcooked. The wine pairing suggested by the sommelier was excellent though.",
        CreatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        User: user,
        Delicacy: {
          DelicacyId: "del2",
          Name: "Mediterranean Seafood Platter",
          Description:
            "Fresh lobster, prawns, scallops, and mussels with herb butter",
          Price: 85,
          DelicacyImage:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
          Category: "Seafood",
          IsAvailable: true,
          CreatedAt: "",
          UpdatedAt: "",
          Orders: [],
          Carts: [],
          OrderItems: [],
          Reviews: [],
        },
        relatedPayment: {
          PaymentId: "pay4",
          UserId: user.UserId,
          Amount: 125.75,
          PaymentMethod: "Credit Card",
          PaymentReference: "REF567890",
          TransactionId: "TXN987654",
          Status: "Completed",
          OrderId: "order2",
          PaidAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          CreatedAt: "",
          User: user,
        },
      },
      {
        ReviewId: "5",
        UserId: user.UserId,
        DelicacyId: "del3",
        Rating: 5,
        Comment:
          "Outstanding wagyu beef! Perfectly cooked to medium-rare as requested. The truffle mash and seasonal vegetables were the perfect accompaniments. This is fine dining at its best.",
        CreatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        User: user,
        Delicacy: {
          DelicacyId: "del3",
          Name: "Premium Wagyu Steak",
          Description:
            "Grade A5 wagyu beef with truffle mashed potatoes and seasonal vegetables",
          Price: 120,
          DelicacyImage:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
          Category: "Premium Main Course",
          IsAvailable: true,
          CreatedAt: "",
          UpdatedAt: "",
          Orders: [],
          Carts: [],
          OrderItems: [],
          Reviews: [],
        },
        relatedPayment: {
          PaymentId: "pay5",
          UserId: user.UserId,
          Amount: 145.5,
          PaymentMethod: "Digital Wallet",
          PaymentReference: "REF890123",
          TransactionId: "TXN654321",
          Status: "Completed",
          OrderId: "order3",
          PaidAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          CreatedAt: "",
          User: user,
        },
      },
      {
        ReviewId: "6",
        UserId: user.UserId,
        RoomId: "room3",
        Rating: 4,
        Comment:
          "Great meeting room for our team workshop. Good natural lighting, comfortable furniture, and reliable WiFi. The only downside was that the air conditioning was a bit too cold.",
        CreatedAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(), // 10 days ago
        User: user,
        Room: {
          RoomId: "room3",
          RoomNumber: "M-201",
          RoomType: "Meeting Bay",
          PricePerNight: 80,
          Description:
            "Intimate meeting space perfect for small team collaborations",
          Capacity: 8,
          Status: "Available",
          RoomImage:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400",
          CreatedAt: "",
          UpdatedAt: "",
          Accommodations: [],
          Bookings: [],
          Reviews: [],
          RoomImages: [],
        },
        relatedPayment: {
          PaymentId: "pay6",
          UserId: user.UserId,
          Amount: 160,
          PaymentMethod: "Credit Card",
          PaymentReference: "REF234567",
          TransactionId: "TXN345678",
          Status: "Completed",
          BookingId: "book3",
          PaidAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
          CreatedAt: "",
          User: user,
        },
      },
    ];

    setTimeout(() => {
      setReviews(mockReviews);
      setFilteredReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, [user]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = reviews.filter((review) => {
      const matchesSearch =
        review.Comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.Room?.RoomType.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ??
          false) ||
        (review.Delicacy?.Name.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ??
          false);

      const matchesFilter =
        filterType === "all" ||
        (filterType === "room" && review.RoomId) ||
        (filterType === "delicacy" && review.DelicacyId);

      return matchesSearch && matchesFilter;
    });

    // Sort reviews
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
        );
      } else {
        return b.Rating - a.Rating;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, filterType, sortBy]);

  const canEditReview = (createdAt: string): boolean => {
    const reviewTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const oneHourInMs = 60 * 60 * 1000;
    return currentTime - reviewTime < oneHourInMs;
  };

  const handleEditReview = (review: ReviewWithPayment) => {
    setEditingReview(review.ReviewId);
    setEditComment(review.Comment);
    setEditRating(review.Rating);
  };

  const handleSaveEdit = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.ReviewId === reviewId
          ? { ...review, Comment: editComment, Rating: editRating }
          : review
      )
    );
    setEditingReview(null);
  };

  const handleCompletePayment = (paymentId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.relatedPayment?.PaymentId === paymentId
          ? {
              ...review,
              relatedPayment: { ...review.relatedPayment, Status: "Completed" },
            }
          : review
      )
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.Rating, 0) / reviews.length
    );
  };

  const renderStars = (
    rating: number,
    interactive: boolean = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${styles.star} ${
              star <= rating ? styles.starFilled : ""
            } ${interactive ? styles.starInteractive : ""}`}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              <MessageSquare className={styles.titleIcon} />
              My Reviews
            </h1>
            <p className={styles.subtitle}>
              Manage and track your dining and accommodation reviews
            </p>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <Award className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{reviews.length}</span>
                <span className={styles.statLabel}>Total Reviews</span>
              </div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <TrendingUp className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {getAverageRating().toFixed(1)}
                </span>
                <span className={styles.statLabel}>Avg Rating</span>
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
            placeholder="Search reviews, rooms, or dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <Filter className={styles.filterIcon} />
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "all" | "room" | "delicacy")
              }
              className={styles.filterSelect}
            >
              <option value="all">All Reviews</option>
              <option value="room">Room Reviews</option>
              <option value="delicacy">Food Reviews</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "oldest" | "rating")
              }
              className={styles.filterSelect}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.reviewsGrid}>
        {filteredReviews.length === 0 ? (
          <div className={styles.emptyState}>
            <MessageSquare className={styles.emptyIcon} />
            <h3>No reviews found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.ReviewId} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewType}>
                  {review.RoomId ? (
                    <div className={styles.typeIndicator}>
                      <Bed className={styles.typeIcon} />
                      <span>Room Review</span>
                    </div>
                  ) : (
                    <div className={styles.typeIndicator}>
                      <Utensils className={styles.typeIcon} />
                      <span>Food Review</span>
                    </div>
                  )}
                </div>

                <div className={styles.reviewDate}>
                  <Calendar className={styles.dateIcon} />
                  <span>{new Date(review.CreatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className={styles.reviewContent}>
                <div className={styles.itemInfo}>
                  {review.Room && (
                    <div className={styles.itemDetails}>
                      <img
                        src={review.Room.RoomImage}
                        alt={review.Room.RoomType}
                        className={styles.itemImage}
                      />
                      <div>
                        <h3 className={styles.itemName}>
                          {review.Room.RoomType}
                        </h3>
                        <p className={styles.itemDesc}>
                          Room {review.Room.RoomNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {review.Delicacy && (
                    <div className={styles.itemDetails}>
                      <img
                        src={review.Delicacy.DelicacyImage}
                        alt={review.Delicacy.Name}
                        className={styles.itemImage}
                      />
                      <div>
                        <h3 className={styles.itemName}>
                          {review.Delicacy.Name}
                        </h3>
                        <p className={styles.itemDesc}>
                          {review.Delicacy.Category}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.ratingSection}>
                  {editingReview === review.ReviewId
                    ? renderStars(editRating, true, setEditRating)
                    : renderStars(review.Rating)}
                </div>

                <div className={styles.commentSection}>
                  {editingReview === review.ReviewId ? (
                    <div className={styles.editForm}>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className={styles.editTextarea}
                        rows={3}
                      />
                      <div className={styles.editActions}>
                        <button
                          onClick={() => handleSaveEdit(review.ReviewId)}
                          className={styles.saveButton}
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingReview(null)}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.comment}>{review.Comment}</p>
                  )}
                </div>

                <div className={styles.reviewFooter}>
                  <div className={styles.paymentStatus}>
                    {review.relatedPayment && (
                      <div
                        className={`${styles.paymentBadge} ${
                          styles[review.relatedPayment.Status.toLowerCase()]
                        }`}
                      >
                        {review.relatedPayment.Status === "Completed" ? (
                          <CheckCircle className={styles.statusIcon} />
                        ) : (
                          <AlertCircle className={styles.statusIcon} />
                        )}
                        <span>Payment {review.relatedPayment.Status}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.actions}>
                    {canEditReview(review.CreatedAt) &&
                      editingReview !== review.ReviewId && (
                        <button
                          onClick={() => handleEditReview(review)}
                          className={styles.editButton}
                          title="Edit review"
                        >
                          <Edit3 className={styles.actionIcon} />
                          Edit
                        </button>
                      )}

                    {!canEditReview(review.CreatedAt) && (
                      <div className={styles.editExpired}>
                        <Clock className={styles.clockIcon} />
                        <span>Edit period expired</span>
                      </div>
                    )}

                    {review.relatedPayment &&
                      review.relatedPayment.Status === "Pending" && (
                        <button
                          onClick={() =>
                            handleCompletePayment(
                              review.relatedPayment!.PaymentId
                            )
                          }
                          className={styles.paymentButton}
                        >
                          Complete Payment
                        </button>
                      )}
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
