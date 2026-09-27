import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ReviewForm = ({
  productId,
  hasReviewed,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasReviewed) {
      toast.error("You have already reviewed this product.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    if (comment.trim().length < 3) {
      toast.error("Review must contain at least 3 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `/api/v1/review/product/${productId}`,
        {
          rating,
          comment,
        }
      );

      if (data.success) {
        toast.success(data.message);

        setRating(0);
        setHoverRating(0);
        setComment("");

        if (onReviewAdded) {
          onReviewAdded();
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to add review."
      );
    } finally {
      setLoading(false);
    }
  };

  if (hasReviewed) {
    return (
      <div className="review-already">
        <strong>✓ You have already reviewed this product.</strong>
      </div>
    );
  }

  return (
    <form
      className="review-form"
      onSubmit={handleSubmit}
    >
      <h3>Write a Review</h3>

      <div className="review-rating-input">
        <span>Your Rating:</span>

        <div className="review-stars-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={
                star <= (hoverRating || rating)
                  ? "active"
                  : ""
              }
              onClick={() => setRating(star)}
              onMouseEnter={() =>
                setHoverRating(star)
              }
              onMouseLeave={() =>
                setHoverRating(0)
              }
              aria-label={`${star} star`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
        placeholder="Share your experience with this product..."
        maxLength={1000}
        rows={5}
      />

      <div className="review-form-footer">
        <small>
          {comment.length}/1000
        </small>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;