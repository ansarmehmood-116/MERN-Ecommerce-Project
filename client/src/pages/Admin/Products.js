import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";



const Products = () => {
  const [products, setProducts] = useState([]);

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-12 col-md-3 mb-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center productsHeading">All Products List</h1>

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
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {/* Fixed width and height for the box */}
                  <div 
                    className="card m-2 productBox" 
                    style={{ width: "18rem", height: "400px", display: "flex", flexDirection: "column", background: "rgba(128, 128, 128, 0.097)"}}
                  >
                    {/* Fixed height for image wrapper to ensure alignment */}
                    <div 
                      className="card-image-wrapper" 
                      style={{ height: "200px", overflow: "hidden" }}
                    >
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
                    </div>
                    
                    {/* Flex-grow ensures the body fills the remaining card space */}
                    <div className="card-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "Center" }}>
                      <div className="card-name-price">
                        <h5 className="card-title" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{p.name}</h5>
                        <h5 className="card-title card-price" style={{ color: "#28a745" }}>
                          {p.quantity > 0 ? (
                            p.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })
                          ) : (
                            <span className="out-stock" style={{ color: "red", fontSize: "0.9rem" }}>*Out Of Stock</span>
                          )}
                        </h5>
                      </div>
                      <p className="card-text" style={{ fontSize: "0.9rem", color: "#666" }}>
                        {p.description.substring(0, 45)}...
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;