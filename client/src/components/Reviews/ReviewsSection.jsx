import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import ReviewSummary from "./ReviewSummary";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

import { useAuth } from "../../context/auth";

import "./Styles/Reviews.css"

const ReviewsSection = ({ productId }) => {
  const [auth] = useAuth();

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET REVIEWS
  // =====================================================

  const getReviews = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/v1/review/product/${productId}`
      );

      if (data.success) {
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }
    } catch (error) {
      console.error(
        "GET REVIEWS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      getReviews();
    }
  }, [productId, getReviews]);

  // =====================================================
  // CHECK IF CURRENT USER ALREADY REVIEWED
  // =====================================================

  const currentUserId = auth?.user?._id;
  const hasReviewed = reviews.some(
    (review) =>
      review.user?._id?.toString() ===
      currentUserId?.toString()
  );

  // =====================================================
  // DELETE REVIEW
  // =====================================================
  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmed) {
      return;
    }
    try {
      const { data } = await axios.delete(
        `/api/v1/review/${reviewId}`
      );

      if (data?.success) {
        toast?.success(data?.message);

        getReviews();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete review."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <section className="reviews-section">
        <h2>Customer Reviews</h2>

        <div className="reviews-loading">
          Loading reviews...
        </div>
      </section>
    );
  }

  // =====================================================
  // UI
  // =====================================================
  return (
    <section className="reviews-section">
      <div className="reviews-section-header">
        <div>
          <h2>Customer Reviews</h2>

          <ReviewSummary
            rating={averageRating}
            count={totalReviews}
          />
        </div>
      </div>

      {auth?.user && (
        <ReviewForm
          productId={productId}
          hasReviewed={hasReviewed}
          onReviewAdded={getReviews}
        />
      )}

      {!auth?.user && (
        <div className="review-login-message">
          Please login to write a review.
        </div>
      )}

      <ReviewList
        reviews={reviews}
        currentUserId={currentUserId}
        isAdmin={auth?.user?.role === 1}
        onDelete={handleDeleteReview}
      />
    </section>
  );
};

export default ReviewsSection;