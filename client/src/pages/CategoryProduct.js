//single Category page i.e category name by slug e.g Wrist-Watch
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import axios from "axios";
import FavouriteButton from "../components/FavouriteButton";
import ReviewSummary from "../components/Reviews/ReviewSummary";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);
  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`,
      );
      setProducts(data?.products); //as we have added products and category in producController call back fnction so we have attached both from data here
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Category-Products"}>
      <div className="category-product-page">
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
            <div className="category">
              <h4 className="text-center">Category - {category?.name}</h4>
              <h6 className="text-center">{products?.length} result found </h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex flex-wrap justify-content-center">
                    {products?.map((p) => (
                      <div className="card m-2 position-relative" key={p._id}>
                        {/* ✅ Optional chaining prevents 404 / CastError */}
                        {p?._id && (
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p?.name || "Product Image"}
                          />
                        )}
                        <div className="position-absolute top-0 end-0 m-2">
                          <FavouriteButton productId={p?._id} />
                        </div>
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
                          <p className="card-text">
                            {p?.description?.substring(0, 60)}...
                          </p>
                          <div className="card-name-price">
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
                      toast.success("Item Added to cart");
                    }}
                  >
                    ADD TO CART
                  </button> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div> */}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
