import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {
  const params = useParams();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  //__________________________________________________________________________________

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    //call this function in getProduct function
    //above after setProducts
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products); //as we have used products in backend related-product
      //
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="productContainer">
        <div className="row product-details">
          <div className="col-md-6">
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
              className="card-img-top"
              alt={product.name}
              height="300"
              width={"350px"}
            />
          </div>
          <div className="col-md-6 product-details-info">
            <h1 className="text-center">Product Details</h1>
            {/* {JSON.stringify(product,null,4)} */}
            {/* {JSON.stringify(RelatedProducts,null,4)} */}
            <hr />
            <h6>Name : {product.name}</h6>
            <h6>Description : {product.description}</h6>
            <h6>
              Price :
              {product?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </h6>
            <h6>Category : {product?.category?.name}</h6>

            {/* Conditionally display quantity or out of stock message */}
            <h6>
              Available :{" "}
              {product?.quantity > 0 ? (
                product.quantity
              ) : (
                <span className="out-stock">*Out Of Stock</span>
              )}
            </h6>
            {/* Disable button if out of stock */}
            <button
              className="btn btn-secondary ms-1 cartButton"
              onClick={() => {
                setCart([...cart, product]);
                localStorage.setItem(
                  "cart",
                  JSON.stringify([...cart, product])
                );
                toast.success("Item Added to cart Successfully");
                //...cart means any value in cart should
                //be kept as it is and p means product details
              }}
              disabled={product?.quantity <= 0}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <hr />
        <div className="row container similar-products">
          <h4>Similar Products ➡️</h4>
          {relatedProducts.length < 1 && (
            <p className="text-center">No Similar Products found</p>
          )}
          <div className="d-flex flex-wrap">
            {relatedProducts?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
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
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
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
      </div>
    </Layout>
  );
};

export default ProductDetails;
