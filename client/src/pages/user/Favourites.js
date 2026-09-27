import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HiHeart } from "react-icons/hi2";
import "./UserStyles/UserFavourites.css";
import ReviewSummary from "../../components/Reviews/ReviewSummary";

const Favourites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const getFavourites = async () => {
    try {
      const { data } = await axios.get("/api/v1/user/favourites");
      if (data?.success) {
        setFavorites(data.favourites || []);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Unable to load favourites",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavourites();
  }, []);

  const removeFavourite = async (productId) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/user/favourites/${productId}`,
      );
      if (data?.success) {
        setFavorites((previous) =>
          previous.filter((product) => product._id !== productId),
        );
        toast.success("Removed from favourites");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Unable to remove favourite",
      );
    }
  };

  // this one is not good practice instead of this i used below inside component so user can't feel bored
  //   if (loading) {
  //     return (
  //       <Layout title={"My Favourites"}>
  //         <div className="container text-center favourite-loading">
  //           Loading favourites...
  //         </div>
  //       </Layout>
  //     );
  //   }

  return (
    <Layout title={"My Favourites"}>
      <div className="container-fluid favourite-page p-3">
        <div className="row g-3">
          {/* USER MENU */}
          <div className="col-md-3">
            <UserMenu />
          </div>

          {/* CONTENT */}
          <div className="col-md-9">
            <div className="favourite-header">
              <div>
                <h2>❤️ My Favourites</h2>
                <p>Products you saved for later.</p>
              </div>

              <span>
                {favorites.length}{" "}
                {favorites.length === 1 ? "Product" : "Products"}
              </span>
            </div>
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "40vh" }}
              >
                <div className="spinner-border text-grey" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {favorites.length === 0 ? (
                  <div className="empty-favourites">
                    <div className="empty-favourite-icon">❤️</div>

                    <h4>No Favourite Products</h4>

                    <p>
                      You haven't added any products to your favourites yet.
                    </p>

                    <button onClick={() => navigate("/")}>
                      Start Shopping →
                    </button>
                  </div>
                ) : (
                  <div className="row g-3">
                    {favorites.map((product) => (
                      <div
                        className="col-sm-6 col-lg-4 favouriteProductCard"
                        key={product._id}
                      >
                        <div className="favourite-card">
                          <div className="favourite-image-wrapper position-relative">
                            <img
                              src={`/api/v1/product/product-photo/${product._id}`}
                              alt={product.name}
                              className="favourite-image"
                            />

                            <button
                              className="remove-favourite"
                              onClick={() => removeFavourite(product._id)}
                              title="Remove from favourites"
                            >
                              <HiHeart />
                            </button>
                          </div>
                          <div className="favourite-content card-body">
                            <div className="card-name-price">
                              <h5>{product.name}</h5>
                              <strong>
                                {product.price.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}
                              </strong>
                            </div>
                            <p>
                              {product?.description?.substring(0, 40)}...
                              {/* {product.description?.length > 70 ? "..." : ""} */}
                            </p>
                            <ReviewSummary
                              rating={product.averageRating}
                              count={product.reviewCount}
                            />
                            <div className="favourite-bottom">
                              <button
                                onClick={() =>
                                  navigate(`/product/${product.slug}`)
                                }
                              >
                                View Product
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Favourites;
