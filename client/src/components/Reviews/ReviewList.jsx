import React from "react";
import { HiTrash } from "react-icons/hi2";
import moment from "moment";

const ReviewList = ({
  reviews,
  currentUserId,
  isAdmin,
  onDelete,
}) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet.</p>
        <span>Be the first to review this product.</span>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => {
        const isOwner =
          review.user?._id?.toString() ===
          currentUserId?.toString();

        return (
          <div
            className="review-card"
            key={review._id}
          >
            <div className="review-card-header">
              <div>
                <strong>
                  {review.user?.name || "User"}
                </strong>

                <div className="review-card-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= review.rating
                          ? "active"
                          : ""
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="review-card-right">
                <small>
                  {moment(review.createdAt).fromNow()}
                </small>

                {(isOwner || isAdmin) && (
                  <button
                    className="review-delete-btn"
                    onClick={() =>
                      onDelete(review._id)
                    }
                    title="Delete review"
                  >
                    <HiTrash />
                  </button>
                )}
              </div>
            </div>

            <p className="review-comment">
              {review.comment}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;