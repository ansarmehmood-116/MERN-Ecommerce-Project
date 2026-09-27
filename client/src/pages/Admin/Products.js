import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { AiOutlineReload } from "react-icons/ai";
import "./AdminStyles/Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true); // main loader

  // these were added for paging purpose in admin products otherwise no need
  const [page, setPage] = useState(1); //default will be page 1 in pagination
  const [hasMore, setHasMore] = useState(false);
  const [loadMoreBtn, setLoadMoreBtn] = useState(false); //for loadmore button


  //getall products
  const getAllProducts = async (pageNumber = 1,loadMore = false) => {
    try {
      // These lines can be used directly before catch{}block when no paging needed simply backend controller we had set to 12 products limit but that was not fine because if a product lied 13 of the list then that couldnot be updated 2nly paging is good for optimization without burdening api fetching all product from Db and setLoading(true) in useState is good it will spin directly without delay when page open while here it will wait for fuction after page load then executes we also can use homePage product-list api both sare fetching the products but here we have set more then 6 pruducts per page
      // setLoading(true);
      // const { data } = await axios.get("/api/v1/product/get-product");
      // setLoading(false);//it is good to keep it false in finally{}block
      // setProducts(data?.products);
    if (loadMore) {
     setLoadMoreBtn(true);
    }
    const { data } = await axios.get(
      `/api/v1/product/get-product?page=${pageNumber}&limit=9`,
    );
    if (loadMore) {
     setProducts((prev) => [...prev, ...data?.products]);
    }else{
     setProducts(data?.products);
      }
    setPage(pageNumber);
    setHasMore(data?.hasMore);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    } finally {
        if (loadMore) {
        setLoadMoreBtn(false); //this will false when loadmore btn load more pages
      } else {
        setLoading(false); //this will false only when page loads
      }
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts(1, false);
  }, []);
  //____________________________________________________________________

  // Search product function
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      setPage(1);
      getAllProducts();
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/search/${keyword}`);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error fetching search results");
    }
  };
  //_____________________________________________________________________________

  return (
    <Layout>
      <div className="admin-products-page">
        <div className="container-fluid p-3 dashboard">
          <div className="row g-3">
            <div className="col-3 col-md-3 mb-3">
              <AdminMenu />
            </div>
            <div className="col-md-9 AdminProducts">
              <h1 className="text-center productsHeading">All Products List</h1>
              <p className="headLine">Click on each product to update</p>

              {/* Full-Width Modern Search Bar */}
              <div className="card border-0 shadow-sm rounded-3 mb-4 p-3 bg-light w-75 admin-product-search">
                <form onSubmit={handleSearch}>
                  <div className="row g-2 align-items-center">
                    {/* Search Input Box */}
                    <div className="col">
                      <div className="input-group input-group-lg bg-white rounded-3 shadow-sm border overflow-hidden custom-search-bar">
                        <span className="input-group-text bg-white border-0 text-muted ps-3">
                          <i className="bi bi-search fs-5"></i>
                        </span>
                        <input
                          type="search"
                          className="form-control border-0 shadow-none fs-6 py-2 remove-native-x"
                          placeholder="Search products by name, category, or keyword..."
                          value={keyword}
                          onChange={(e) => {
                            const val = e.target.value;
                            setKeyword(val);
                            if (val.trim() === "") {
                              setPage(1);
                              getAllProducts();
                            }
                          }}
                        />
                        {keyword && (
                          <button
                            type="button"
                            className="btn btn-link text-muted text-decoration-none border-0 pe-3"
                            onClick={() => {
                              setKeyword("");
                              setPage(1);
                              getAllProducts();
                            }}
                          >
                            <i className="bi bi-x-circle-fill fs-5"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="col-auto">
                      <button
                        className="btn btn-lg px-3 text-white fw-semibold shadow-sm rounded-3 d-inline-flex align-items-center gap-2 h-100 search-hover-btn"
                        type="submit"
                        style={{
                          "--btn-bg": "#0fb9ed",
                          "--btn-hover-bg": "#0099cc", // Darker blue for hover
                          backgroundColor: "var(--btn-bg)",
                          borderColor: "var(--btn-bg)",
                        }}
                      >
                        <i className="bi bi-search"></i>
                        <span className="d-none d-sm-inline hover">Search</span>
                      </button>
                    </div>
                  </div>
                </form>
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
              ) : products && products?.length > 0 ? (
                <>
                  <div className="d-flex flex-wrap justify-content-center">
                    {products?.map((p) => (
                      <Link
                        //the link is used to show the single product and their details so onclickingany product it will lead to that product details in UpdateProduct page
                        key={p._id}
                        to={`/dashboard/admin/product/${p.slug}`}
                        //we donot have added UpdateProduct in Admin Menu list if Admin want's to
                        //update the product so he will simply click on that product and it will
                        //lead to update page through `/dashboard/admin/product/${p.slug}`link //and we have added this link for UpdateProduct.js page in App.js through the route i.e <Route path='admin/product/:slug' element={<UpdateProduct/>} />
                        className="product-link"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {/* Fixed width and height for the box */}
                        <div
                          className="card m-2 productBox"
                          style={{
                            width: "18rem",
                            height: "400px",
                            display: "flex",
                            flexDirection: "column",
                            background: "rgba(128, 128, 128, 0.097)",
                          }}
                        >
                          {/* Fixed height for image wrapper to ensure alignment */}
                          <div
                            className="card-image-wrapper"
                            style={{ height: "280px", overflow: "hidden" }}
                          >
                            {p?._id && (
                              <img
                                src={`/api/v1/product/product-photo/${p._id}`}
                                className="card-img-top"
                                alt={p.name}
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  objectFit: "fill", // Makes the whole picture visible
                                }}
                              />
                            )}
                          </div>

                          {/* Flex-grow ensures the body fills the remaining card space */}
                          <div
                            className="card-body"
                            style={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "Center",
                            }}
                          >
                            <div className="card-name-price">
                              <h5
                                className="card-title"
                                style={{
                                  fontSize: "1.1rem",
                                  fontWeight: "bold",
                                }}
                              >
                                {p.name}
                              </h5>
                              <h5
                                className="card-title card-price"
                                style={{ color: "#28a745" }}
                              >
                                {p.quantity > 0 ? (
                                  p.price.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })
                                ) : (
                                  <span
                                    className="out-stock"
                                    style={{
                                      color: "red",
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    *Out Of Stock
                                  </span>
                                )}
                              </h5>
                            </div>
                            <p
                              className="card-text"
                              style={{ fontSize: "0.9rem", color: "#666" }}
                            >
                              {p.description.substring(0, 40)}...
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="NoData text-center my-5 p-4 border rounded bg-white shadow-sm">
                  <i className="bi bi-exclamation-circle text-warning fs-1 d-block mb-2"></i>
                  <h4 className="fw-bold text-secondary">No Products Found</h4>
                  <p className="text-muted mb-0">
                    {keyword
                      ? `No results match your search "${keyword}". Try searching with a different name or category.`
                      : "No products available in the inventory."}
                  </p>
                </div>
              )}
              <div className="m-2 p-3 ProductLoadMoreContainer">
                {hasMore && (
                  <button
                    className="btn loadmore"
                     onClick={() => {
                       getAllProducts(page + 1, true);
                      }}
                    disabled={loadMoreBtn}
                  >
                    {loadMoreBtn ? (
                      "Loading ..."
                    ) : (
                      <>
                        {" "}
                        Loadmore <AiOutlineReload />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
