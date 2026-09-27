import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { HiHeart } from "react-icons/hi2";
import { useAuth } from "../context/auth";
import "./FavouriteButton.css";

const FavouriteButton = ({ productId }) => {
  const [auth] = useAuth();
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check whether this product is already favourite
  useEffect(() => {
    const checkFavourite = async () => {
      if (!auth?.token || !productId) return;

      try {
        const { data } = await axios.get(
          "/api/v1/user/favourites"
        );

        const favourites = data?.favourites || [];
        const exists = favourites.some(
          (item) => item?._id === productId
        );

        setIsFavourite(exists);
      } catch (error) {
        console.log("CHECK FAVOURITE ERROR:", error);
      }
    };

    checkFavourite();
  }, [auth?.token, productId]);
// ______________________________________________________________________

  // Add / Remove favourite
  const handleFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!auth?.token) {
      toast.error("Please login to add favourites");
      return;
    }

    try {
      setLoading(true);

      if (isFavourite) {
        await axios.delete(
          `/api/v1/user/favourites/${productId}`
        );

        setIsFavourite(false);
        toast.success("Removed from favourites");
      } else {
        await axios.post(
          `/api/v1/user/favourites/${productId}`
        );

        setIsFavourite(true);
        toast.success("Added to favourites");
      }
    } catch (error) {
      console.error("FAVOURITE ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`favourite-button ${
        isFavourite ? "active" : ""
      }`}
      onClick={handleFavourite}
      disabled={loading}
      title={
        isFavourite
          ? "Remove from favourites"
          : "Add to favourites"
      }
      aria-label={
        isFavourite
          ? "Remove from favourites"
          : "Add to favourites"
      }
    >
      <HiHeart />
    </button>
  );
};

export default FavouriteButton;