import React from "react";

const ReviewSummary = ({ rating = 0, count = 0 }) => {
  const safeRating = Number(rating) || 0;
  const safeCount = Number(count) || 0;

  return (
    <div className="review-summary">
      <span className="review-summary-stars">
        ★
      </span>
      <span className="review-summary-rating">
        {safeRating.toFixed(1)}
      </span>
      <span className="review-summary-count">
        ({safeCount} {safeCount === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
};

export default ReviewSummary;