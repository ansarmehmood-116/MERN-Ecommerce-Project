import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment"; //used for time and data best deal with it install npm i moment
import { Link } from "react-router-dom";
import "./UserStyles/UserOrders.css";
import { AiOutlineReload } from "react-icons/ai";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true); //main page loader
  const [loadbtnstate, setLoadbtnstate] = useState(false); //loadMore button state
  const [auth] = useAuth();

  const getOrders = async (pageNumber = 1, loadMore = false) => {
    try {
      // const { data } = await axios.get("/api/v1/order/orders");
      // setOrders(data); use these both lines with old controller for no paging

      //For_Paging_use this api from line 24 to 36 other wise use above 2 commented lines with old controller also remove these with parameter page=1
      if (loadMore) {
        setLoadbtnstate(true);
      }

      const { data } = await axios.get(
        `/api/v1/order/orders?page=${pageNumber}&limit=6`,
      );

      if (loadMore) {
        setOrders((prev) => [...prev, ...data?.orders]);
      } else {
        setOrders(data?.orders);
      }

      setPage(pageNumber);
      setHasMore(data?.hasMore);
      // ______________________________________________________
    } catch (error) {
      console.log(error);
    } finally {
      if (loadMore) {
        setLoadbtnstate(false); //this will false when loadmore btn load more pages
      } else {
        setLoading(false); //this will false only when page loads
      }
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders(1, false);
  }, [auth?.token]);

  //_______________________________________________________________

  //___No__Duplicate_products__Grouping needed in OrderSChema V2___
  // const groupProducts = (products) => {
  //   return products.reduce((acc, product) => {
  //     const foundProduct = acc.find((p) => p._id === product._id);
  //     if (foundProduct) {
  //       foundProduct.quantity += 1;
  //     } else {
  //       acc.push({ ...product, quantity: 1 });
  //     }
  //     return acc;
  //   }, []);
  // };
  // ______________________________________________________________

  return (
    <Layout title={"Your Orders"}>
      <div className="user-orders-page">
        <div className="container-fluid p-3 dashboard">
          <div className="row g-3">
            <div className="col-md-3">
              <UserMenu />
            </div>

            <div className="col-md-9">
              <h1 className="text-center ordersHeading p-1 rounded-2 d-flex align-items-center justify-content-center gap-2">
                <span className="mb-1 mt-1">🛒</span>
                <span className="mb-1 mt-1">All Orders</span>
              </h1>

              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "40vh" }}
                >
                  <div className="spinner-border text-grey" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : orders && orders.length > 0 ? (
                <>
                  {/* <p>{JSON.stringify(orders,null,4)}</p> */}

                  {orders?.map((o, i) => {
                    // const groupedProducts = groupProducts(o?.products); no nedd of this in version 2 orderModel see details in adminOrders

                    return (
                      <div
                        className="border shadow rounded-2 mb-4 bg-white"
                        key={o._id}
                      >
                        <div className="rounded-3">
                          <table className="table table-hover mb-0 align-middle table-responsive">
                            <thead className="table-light">
                              <tr>
                                <th scope="col" className="text-center">
                                  #
                                </th>

                                <th scope="col" className="text-center">
                                  Order ID
                                </th>

                                <th scope="col" className="text-center">
                                  Status
                                </th>

                                <th scope="col" className="text-center">
                                  Buyer
                                </th>

                                <th scope="col" className="text-center">
                                  Date
                                </th>

                                <th scope="col" className="text-center">
                                  Payment
                                </th>

                                <th scope="col" className="text-center">
                                  Qty
                                </th>

                                <th scope="col" className="text-center">
                                  Paid Amount
                                </th>

                                <th scope="col" className="text-center">
                                  Action
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                <td className="text-center">{i + 1}</td>

                                <td className="text-center">
                                  <strong>#{o?._id?.slice(-6)}</strong>
                                </td>

                                <td className="text-center">
                                  <span
                                    className={`badge ${
                                      o?.status
                                        ?.toLowerCase()
                                        .includes("cancel")
                                        ? "bg-danger"
                                        : o?.status?.toLowerCase() ===
                                            "delivered"
                                          ? "bg-success"
                                          : "bg-primary"
                                    }`}
                                  >
                                    {o?.status?.toLowerCase() === "cancel"
                                      ? "Cancelled"
                                      : o?.status}
                                  </span>
                                </td>

                                <td className="text-center">
                                  {o?.buyer?.name || "N/A"}
                                </td>

                                <td className="text-center">
                                  {moment(o?.createdAt).fromNow()}
                                </td>

                                <td className="text-center">
                                  <span
                                    className={`badge ${
                                      o?.payment?.success
                                        ? "bg-success"
                                        : "bg-danger"
                                    }`}
                                  >
                                    {o?.payment?.success ? "Success" : "Failed"}
                                  </span>
                                </td>

                                {/* <td>{o?.products?.length}</td> */}

                                <td className="text-center">
                                  {o?.products?.reduce(
                                    (total, item) =>
                                      total + (item?.quantity || 0),
                                    0,
                                  )}
                                </td>

                                <td className="text-center">
                                  $ {o?.payment?.transaction?.amount || "0.00"}
                                </td>

                                <td className="text-center">
                                  <Link
                                    to={`/dashboard/user/invoice/${o?._id}`}
                                    className="btn btn-sm btn-outline-primary fw-semibold px-3 py-1 shadow-sm"
                                  >
                                    📄 Invoice
                                  </Link>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {/* Product Cards Container */}
                        <div className="p-3 bg-light border-top">
                          {/* {groupedProducts?.map((p) => (  no need of this in orderModel version 2 see details in adminOrders page */}
                          {o?.products?.map((item) => (
                            <div
                              className="card mb-2 p-2 flex-row align-items-center shadow-sm border-0"
                              // key={p._id}
                              key={item?.product?._id}
                            >
                              <div className="col-auto">
                                <img
                                  // src={`/api/v1/product/product-photo/${p._id}`}//see details in adminOrders or orderModel schema
                                  src={`/api/v1/product/product-photo/${item?.product?._id}`}
                                  className="rounded"
                                  // alt={p.name}
                                  alt={item?.product?.name || "Product"}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>

                              <div className="col ms-3">
                                <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                                  <h6 className="fw-bold mb-0 text-truncate">
                                    {/* {p.name} see details in adminOrder or orderModel*/}
                                    {item?.product?.name}
                                  </h6>
                                  <span className="shipping-product-badge">
                                    🚚 Shipping
                                  </span>
                                </div>
                                <p className="text-muted small mb-1">
                                  {/* {p.description?.substring(0, 50)}... */}
                                  {item?.product?.description?.substring(0, 50)}
                                  ...
                                </p>

                                <div className="d-flex gap-3 small fw-semibold text-secondary">
                                  <span>
                                    {/* Price: ${p.price} */}
                                    Price: ${item?.price}
                                  </span>

                                  <span>
                                    {/* Quantity: {p.quantity} */}
                                    Quantity: {item?.quantity}
                                  </span>

                                  <span>
                                    Total: $
                                    {(
                                      (item?.price || 0) * (item?.quantity || 0)
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <div className="m-2 p-3 UserOrdersLodmoreContainer">
                    {hasMore && (
                      <button
                        className="btn loadmore"
                        onClick={() => {
                          getOrders(page + 1, true);
                        }}
                        disabled={loadbtnstate}
                      >
                        {loadbtnstate ? (
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
                </>
              ) : (
                /* No Orders Found State */
                <div
                  className="d-flex flex-column justify-content-center align-items-center text-center p-5 bg-transparent rounded-3 shadow-sm my-4"
                  style={{ minHeight: "350px" }}
                >
                  <div style={{ fontSize: "3.5rem" }} className="mb-2">
                    📦
                  </div>

                  <h4 className="fw-bold text-secondary">
                    No Order Placed Yet
                  </h4>

                  <p className="text-secondary mb-4">
                    Looks like you haven't bought anything from our store yet.
                  </p>

                  <Link
                    to="/"
                    className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
// ____________________________________________________________________
