import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import "./AdminStyles/Outstock.css";

const OutStocked = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/out-of-stock");

      if (data?.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title="Out of Stock Products">
      <div className="out-stock-page">
        <div className="container-fluid py-3 px-3 dashboard">
          <div className="row g-3">
            <div className="col-md-3">
              <AdminMenu />
            </div>

            <div className="col-md-9">
              <h1 className="text-center mb-4 OutStock">
                Out of Stock Products
              </h1>

              {loading ? (
                <h4 className="text-center">Loading...</h4>
              ) : products.length === 0 ? (
                <h4 className="text-center">No Out of Stock Products 🎉</h4>
              ) : (
                <div className="d-flex flex-wrap justify-content-center">
                  {products.map((p) => (
                    <div
                      className="card m-2 productBox"
                      style={{
                        width: "17rem",
                        height: "400px",
                        display: "flex",
                        flexDirection: "column",
                        background: "rgba(128, 128, 128, 0.097)",
                      }}
                      key={p._id}
                    >
                      <div className="card">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          style={{
                            height: "260px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div className="card-body">
                          <div className="card-name-price">
                              <h5 className="card-title">{p.name}</h5>
                              <strong className="text-success">
                                {p.price.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}
                              </strong>
                            </div>
                          <p className="card-text">
                            {p.description?.substring(0, 45)}...
                          </p>
                          <p className="text-danger fw-bold">Out of Stock !</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OutStocked;
