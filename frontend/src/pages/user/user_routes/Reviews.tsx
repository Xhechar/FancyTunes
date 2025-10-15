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
import { Review, Payment, Booking, Order, User } from "../../../interfaces/interfaces";
import { UsersService } from "../../../services/user.service";

interface ReviewWithPayment extends Review {
  relatedPayment?: Payment;
  relatedBooking?: Booking;
  relatedOrder?: Order;
}

export const Reviews: React.FC = () => {
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

  useEffect(() => {

    const getUser = async() => {
      let result = await UsersService.GetUserByUserId();

      if(result.success) {
        setReviews((result.data as unknown as User).Reviews);
        setFilteredReviews((result.data as unknown as User).Reviews);
        setLoading(false);
      }
    };
    getUser();
  }, []);

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
                          Room {review.Room.RoomCount}
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
                    {canEditReview(review.CreatedAt.toString()) &&
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

                    {!canEditReview(review.CreatedAt.toString()) && (
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
