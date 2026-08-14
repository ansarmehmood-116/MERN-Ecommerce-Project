import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import Typewriter from "typewriter-effect";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import "../styles/Homepage.css";

// import {useAuth} from "../context/auth"
// import { json } from "react-router-dom";
// These two commented lines were used for testing user details in json fromat commented below

const Homepage = () => {
  // const [auth,setAuth]=useAuth(); //it was used for testing below commented lines in Layout
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(true);
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1); //default will be page 1 in pagination
  const [loading, setLoading] = useState(false);
  //_______________________________________________________________________________

  //products shuffling
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  //___________________________________________________________________________

  //get Products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      // setProducts(data.products); //without shuffling we can use direct this
      const shuffledProducts = shuffleArray(data.products);
      setProducts(shuffledProducts);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    //for all the products
    if (!checked.length || !radio.length) {
      getAllProducts();
    }
  }, [checked.length, radio.length]);
  //actually in dependency array [] we must have to pass the condition value to iterate accordingly
  //_____________________________________________________________________________

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  }; //it's useEffect function is above in useEffect of getAllCategory

  useEffect(() => {
    getTotal(); //we also can use this in one useEffect of above getAllCategory() but
    //in my view separate is best
  }, []);
  //_____________________________________________________________________________

  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      // setProducts([...products, ...data?.products]);
      const shuffledProducts = shuffleArray([...products, ...data?.products]);
      setProducts(shuffledProducts);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  //________________________________________________________________________________

  //filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    //for filtered products
    if (checked.length || radio.length) filterProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, radio]);

  //__________________________________________________________________________

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  //change toggle
  const handleToggle = () => {
    setToggle(!toggle);
    // !toggle means reverse of toggle means set false
  };
  return (
    <Layout title={"All Products - Best offers "}>
      {/* <h1>Home-page</h1>
       <pre>{JSON.stringify(auth,null,4)}</pre> */}
      {/* above two commented lines were used for testing to show user details either admin
       or customer */}
      {/* banner image */}
      {/* <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      /> */}
      {/* banner image */}
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item">
            <img
              src="images/ecommerce1.jpg"
              className="d-block w-100 img1 img"
              alt="banner-image"
            />
            {/* <h1 className="img1-heading">Ecommerce Application</h1> */}
            <h1 className="img1-heading">
              <Typewriter
                options={{
                  strings: ["Ecommerce", "Store", "Application"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </h1>
          </div>
          <div className="carousel-item active">
            <img
              src="images/slider-bg2.jpg"
              className="d-block w-100 img2 img"
              alt="banner-image"
            />
            <div className="detail-box">
              <div className="container">
                <div className="row">
                  <div className="col-md-7 col-lg-6">
                    <h1 className="heading2">
                      <span>Sale 20% Off</span>
                      <br />
                      On Everything
                    </h1>
                    <p>
                      Explicabo esse amet tempora quibusdam laudantium, laborum
                      eaque magnam fugiat hic? Esse dicta aliquid error
                      repudiandae earum suscipit fugiat molestias, veniam, vel
                      architecto veritatis delectus repellat modi impedit sequi.
                    </p>
                    <div className="btn-box">
                      <a
                        className="btn1"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const element =
                            document.getElementById("all-products");
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      >
                        Shop Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="/images/ecommerce3.webp"
              className="d-block w-100 img img3"
              alt="banner-image"
            />
            <h1 className="img3-heading">
              <Typewriter
                options={{
                  strings: ["Shop", "At Your", "Door Step!"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </h1>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="container-fluid row mt-3 home-page">
        {/* side bar */}
        <span className="filterButton" onClick={handleToggle}>
          Product Filter &nbsp;
          {toggle ? <SlArrowDown size={20} /> : <SlArrowUp size={20} />}
        </span>
        {/* _________________________________________________________________ */}
        <div className={toggle ? "noFilters" : "filters"}>
          {/* <div className="col-md-3 filters"> */}
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column filter-container">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                <span className="categories">{c.name}</span>
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>
                    <span className="prices">{p.name}</span>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        {/* _________________________________________________________________ */}

        <div className="col-md-12">
          {/* {JSON.stringify(checked,null,4)}  just for testing category based or price 
           based products*/}

          <h1 className="text-center" id="all-products">All Our Products</h1>
          <div className="d-flex flex-wrap justify-content-center">
            {products && products.length > 0 ? (
              products?.map((p) => (
                <div className="card m-2 productBox" key={p._id}>
                  <div className="card-image-wrapper">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                  </div>
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title card-name">{p.name}</h5>
                      <h5 className="card-title card-price">
                        {p.quantity > 0 ? (
                          p.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                        ) : (
                          <span className="out-stock">*Out Of Stock</span>
                        )}
                        {/* "Out Of Stock"  without span we use double quotes */}
                      </h5>
                    </div>
                    <p className="card-text">
                      {p.description.substring(0, 60)}...
                    </p>
                    <div className="card-name-price">
                      <button
                        className="btn btn-info ms-1"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>

                      <button
                        className="btn btn-dark ms-1 cartBtn"
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p]),
                          );
                          toast.success("Item Added to cart Successfully");
                          //...cart means any value in cart should
                          //be kept as it is and p means product details
                        }}
                        disabled={p?.quantity <= 0}
                      >
                        {/* ADD TO CART */}
                        🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center w-100">
                <h5 className="noProducts">No products found</h5>
              </div>
            )}
          </div>

          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
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
    </Layout>
  );
};

export default Homepage;
