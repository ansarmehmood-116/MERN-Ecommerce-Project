import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import "../styles/ProductDetails.css";
import FavouriteButton from "../components/FavouriteButton";
import ReviewSummary from "../components/Reviews/ReviewSummary";
import ReviewsSection from "../components/Reviews/ReviewsSection";

const ProductDetails = () => {
  const params = useParams();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-productDetails/${params.slug}`,
      );
      setProduct(data?.product);

      // getSimilarProduct(data.product._id, data.product.category._id);
      //added condition to above commented line just for loading similar products after getting product details at same time
      if (data?.product?._id && data?.product?.category?._id) {
        await getSimilarProduct(data.product._id, data.product.category._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  //initial product details
  useEffect(() => {
    if (params?.slug) getProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);

  //________________________________________________________________________________

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    //call this function in getProduct function
    //above after setProducts
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`,
      );
      setRelatedProducts(data?.products); //as we have used products in backend related-product
      //
    } catch (error) {
      console.log(error);
    }
  };
  //_______________________________________________________________________________

  // 1. Calculate how many of this specific product are currently in the cart
  const cartQuantityForThisProduct =
    cart?.filter((item) => item._id === product?._id).length || 0;

  // 2. Calculate dynamic available stock remaining for this session
  const remainingStock = (product?.quantity || 0) - cartQuantityForThisProduct;

  // 3. Robust Add to Cart handler with explicit stock check
  const handleAddToCart = () => {
    if (remainingStock <= 0) {
      toast.error("No more stock available for this item!");
      return;
    }

    const updatedCart = [...cart, product];
    //...cart means any value in cart should be kept as it is and product means product details
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item added to cart successfully");
  };
  // ________________________________________________________________________

  return (
    <Layout title={"Product Details Page"}>
      <div className="product-details-page">
        <div className="product-details-container">
          {/*i have put this to prevent out of stock appearance for half second while clicking on product details */}
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
              {" "}
              {/*react fragment used here to allow multipple devs */}
              <div className="row product-details">
                {/* ================= PRODUCT IMAGE ================= */}
                <div className="col-md-6 productdetail-img">
                  {product?._id && (
                    <div className="product-main-image-wrapper">
                      <img
                        src={`/api/v1/product/product-photo/${product._id}`}
                        className="card-img-top product-main-image"
                        alt={product.name}
                      />
                    </div>
                  )}
                </div>

                {/* ================= PRODUCT INFORMATION ================= */}
                <div className="col-md-6 product-details-info">
                  <h4 className="text-center fw-bold">Product Details</h4>
                  {/* {JSON.stringify(product,null,4)} */}
                  {/* {JSON.stringify(RelatedProducts,null,4)} */}
                  <hr />

                  <div className="product-meta-top">
                    <span className="product-meta-label">PRODUCT</span>
                    <span className="product-id">ID: {product?._id}</span>
                  </div>

                  {/* <h6>Name: {product?.name}</h6> */}
                  <h1>{product?.name}</h1>
                  
                  {/*_____ Product Rating _____ */}
                  <div className="product-main-rating">
                    <ReviewSummary
                      rating={product?.averageRating}
                      count={product?.reviewCount}
                    />
                  </div>

                  <div className="product-main-price">
                    {product?.price?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>

                  <p className="product-main-description">
                    {product?.description}
                  </p>

                  <div className="product-information-list">
                    <div className="product-information-item">
                      <span>Category</span>
                      <strong>{product?.category?.name}</strong>
                    </div>

                    {/* Conditionally display quantity or out of stock message */}
                    {/* Dynamically display actual available stock remaining */}
                    <div className="product-information-item">
                      <span>Availability</span>
                      <strong
                        className={
                          remainingStock > 0
                            ? "stock-available"
                            : "stock-unavailable"
                        }
                      >
                        {remainingStock > 0
                          ? `${remainingStock} available`
                          : "Out of Stock"}
                      </strong>
                    </div>

                    <div className="product-information-item">
                      <span>Shipping</span>

                      <strong>
                        {product?.shipping === true || product?.shipping === "1"
                          ? "Available"
                          : "Not Available"}
                      </strong>
                    </div>
                  </div>

                  {/* ================= BUTTONS ================= */}
                  <div className="d-flex gap-2 w-100 product-action-buttons">
                    {/* Disable button if out of stock */}
                    <button
                      className="btn btn-secondary ms-1 cartButton flex-grow-1"
                      // onClick={() => {
                      //   setCart([...cart, product]);
                      //   localStorage.setItem(
                      //     "cart",
                      //     JSON.stringify([...cart, product]),
                      //   );
                      //   toast.success("Item Added to cart Successfully");
                      // }}
                      // disabled={product?.quantity <= 0}
                      onClick={handleAddToCart}
                      disabled={remainingStock <= 0}
                    >
                      {remainingStock <= 0 ? "OUT OF STOCK" : "🛒 ADD TO CART"}
                    </button>
                    <FavouriteButton productId={product?._id} />
                  </div>
                </div>
              </div>
              <hr />
              {/* ================= PRODUCT INFORMATION ================= */}
              <ReviewsSection productId={product?._id} />
              <hr />
              <div className="row container similar-products">
                <h4>Similar Products ➡️</h4>
                {relatedProducts.length < 1 && (
                  <p className="text-center">No Similar Products found</p>
                )}
                <div className="d-flex flex-wrap">
                  {relatedProducts?.map((p) => (
                    <div className="card m-2 position-relative" key={p._id}>
                      <div className="card-image-wrapper">
                        {p?._id && (
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                          />
                        )}
                      </div>
                      <div className="position-absolute top-0 end-0 m-2">
                        <FavouriteButton productId={p?._id} />
                      </div>

                      {/* CARD BODY */}
                      <div className="card-body">
                        <div className="card-name-price">
                          <h5 className="card-title">{p.name}</h5>
                          <h5 className="card-title card-price">
                            {p.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </h5>
                        </div>
                        <ReviewSummary
                          rating={p.averageRating}
                          count={p.reviewCount}
                        />
                        <p className="card-text ">
                          {p.description?.substring(0, 55)}
                          {p.description?.length > 55 ? "..." : ""}
                        </p>

                        <div className="card-name-price related-card-action">
                          <button
                            className="btn btn-info ms-1"
                            onClick={() => navigate(`/product/${p.slug}`)}
                          >
                            More Details
                          </button>
                          {/* <button
                                className="btn btn-dark ms-1"
                                onClick={() => {
                                setCart([...cart, p]);
                                localStorage.setItem(
                                "cart",
                                JSON.stringify([...cart, p])
                                );
                                toast.success("Item Added to cart successfully");
                                }}
                                >
                                ADD TO CART
                              </button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
