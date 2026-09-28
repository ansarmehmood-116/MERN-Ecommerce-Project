import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react"; //see 0-Notes folder for details
// import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [clientToken, setClientToken] = useState(""); //with braintree API
  const [instance, setInstance] = useState(""); //with braintree API
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // ____________________________________________________________________________

  // if someone add items to cart but not logged in and click on cart so it will make the cart empty dircetly untill you are not logged in but i have diabbled this part because if someone guest add items and want to buy that so it should available in their cart to remember upon login he will directed to this cart again and can check out but if he logged out without checkout then cart will be set to empty
  // useEffect(() => {
  //   if (!auth?.token) {
  //     setCart([]); // Clear cart in state
  //     localStorage.removeItem("cart"); // Clear cart from localStorage
  //   }
  // }, [auth?.token]);
  // __________________________________________________________________________

  //__See details about this function in 0-Notes.js__
  //___________Grouping same item multipple quantities in cart_______________
  const groupCartItems = (cart) => {
    return cart.reduce((acc, item) => {
      const foundItem = acc.find((cartItem) => cartItem._id === item._id);
      if (foundItem) {
        foundItem.quantity += 1;
      } else {
        acc.push({ ...item, quantity: 1 });
      }
      return acc;
    }, []);
  };

  const groupedCartItems = groupCartItems(cart);
  //________________________________________________________________

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      // cart?.map((item) => {
      //   total = total + item.price;
      // });
      groupedCartItems.map((item) => {
        total += item.price * item.quantity;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //_________________________________________________________________________________

  //______increase and decrease product quantity in cart______
  const increaseQuantity = (product) => {
    try {
      // Find the original product in cart
      const originalProduct = cart.find((item) => item._id === product._id);

      // Get available stock from the original product
      const availableStock = originalProduct?.quantity;

      // Current quantity in cart
      const currentQtyInCart = cart.filter(
        (item) => item._id === product._id,
      ).length;

      // Check stock
      if (currentQtyInCart >= availableStock) {
        toast.error("No more stock available for this item!");
        return;
      }

      // Increase immediately
      const updatedCart = [...cart, originalProduct];

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
    }
  };

  // 2. Decrease Quantity Handler
  const decreaseQuantity = (pid) => {
    const index = cart.findIndex((item) => item._id === pid);
    if (index !== -1) {
      const updatedCart = [...cart];
      updatedCart.splice(index, 1); // Removes only one instance
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  // 3. Remove Complete Product (All Instances)
  const removeCompletely = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
    }
  };

  //detele item one by one if many quantities of same product but not all at once
  // const removeCartItem = (pid) => {
  //   try {
  //     let myCart = [...cart];
  //     let index = myCart.findIndex((item) => item._id === pid);
  //     myCart.splice(index, 1);
  //     setCart(myCart); //to update the cart after deletion
  //     localStorage.setItem("cart", JSON.stringify(myCart));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  //________________________________________________________________________________

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/payment/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);
  //___________________________________________________________
  //   handle payments
  // const handlePayment = async () => {
  //   try {
  //     setLoading(true);
  //     const { nonce } = await instance.requestPaymentMethod();
  //     const { data } = await axios.post("/api/v1/payment/braintree/payment", {
  //       nonce,
  //       cart,
  //     });

  //     // Reduce quantity in database this is also best to use but i am using
  //     await Promise.all(
  //       //Parallel Execution: Promise.all allows multiple asynchronous
  //       //tasks to run in parallel rather than sequentially. This improves
  //       //performance, especially when sending multiple HTTP requests, as
  //       //they are all initiated simultaneously.
  //       groupedCartItems.map(async (item) => {
  //         try {
  //           await axios.post(`/api/v1/payment/reduce-quantity`, {
  //             productId: item._id,
  //             quantity: item.quantity,
  //           });
  //         } catch (error) {
  //           console.error(
  //             `Failed to reduce quantity for product ${item._id}:`,
  //             error,
  //           );
  //         }
  //       }),
  //     );

  //If you don't use Promise.all, you would need to handle each asynchronous operation individually,which can lead to several issues.Sequential Execution: Without Promise.all, you would typically handle each asynchronous request one after the other, leading to slower execution.
  //     // for (const item of groupedCartItems) {
  //     //   await axios.post(`/api/v1/payment/reduce-quantity`, {
  //     //     productId: item._id,
  //     //     quantity: item.quantity,
  //     //   });
  //     // }

  //     setLoading(false);
  //     localStorage.removeItem("cart");
  //     setCart([]);
  //     navigate("/dashboard/user/orders");
  //     toast.success("Payment Completed Successfully ");
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  //In this version we already handled reduce quantity and purchasetime price and item quantity reserved so no separate reduced Quantity function needed.
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const {data}= await axios.post("/api/v1/payment/braintree/payment", {
        nonce,
        cart,
        shippingAddress,
      });

      if (data?.success) {
        localStorage.removeItem("cart");
        setCart([]);
        navigate("/dashboard/user/orders");
        toast.success("Payment Completed Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Payment failed. Your stock has not been consumed.",
      );
    } finally {
      setLoading(false);
    }
  };
  // ___________________________________________________________________
  return (
    <Layout title={"Orders Cart"}>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12 cartHead">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello ${auth?.token && auth?.user?.name}`}

              <p className="text-center mb-1 mt-1 fs-6 fw-normal">
                {/* {cart?.length? `You Have ${cart.length} items in your cart ${*/}
                {groupedCartItems.length
                  ? `You Have ${groupedCartItems.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart 🛒 Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container mt-3 mb-3">
          <div className="row">
            <div className="col-md-7 p-0 m-0">
              {/* {cart?.map((p) => ( */}
              {groupedCartItems.map((p) => (
                <div
                  className="row card flex-row align-items-center p-2 mb-2 ms-0 shadow-sm"
                  key={p._id}
                >
                  {/* Product Image */}
                  <div className="col-auto p-0">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top rounded ms-3"
                      alt={p.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="col-md-6 px-2 d-flex flex-column justify-content-center ms-3">
                    <h6 className="fw-bold mb-1 text-truncate">{p.name}</h6>
                    <p className="text-muted small mb-1">
                      {p.description?.substring(0, 35)}...
                    </p>
                    <span className="itemPrice fw-semibold text-primary mb-1 small">
                      Price : ${p.price}
                    </span>
                    {/* <p>Quantity : {p.quantity}</p> */}

                    {/* Quantity Controls */}
                    <div className="quantity-control d-flex align-items-center gap-2">
                      <span className="quantity-label small fw-semibold text-secondary">
                        Quantity:
                      </span>
                      <div className="quantity-selector d-flex align-items-center border rounded px-1">
                        <button
                          className="btn btn-sm btn-link text-decoration-none px-2 py-0"
                          onClick={() => decreaseQuantity(p._id)}
                          title="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="quantity-value px-2 small fw-bold">
                          {p.quantity}
                        </span>
                        <button
                          className="btn btn-sm btn-link text-decoration-none px-2 py-0"
                          onClick={() => increaseQuantity(p)}
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="itemTotal text-secondary fw-semibold small">
                        Sub-Total: $
                        {((p?.price || 0) * (p?.quantity || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="col-md-3 d-flex align-items-center justify-content-end pe-4">
                    <button
                      className="btn btn-danger btn-sm"
                      //onClick={() => removeCartItem(p._id)}
                      onClick={() => removeCompletely(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary Section */}
            <div className="col-md-4 ms-auto cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4 className="text-success ">Total : {totalPrice()} </h4>

              {/* _________ONLY IF SHIPPING REQUIRED_________ */}
              {groupedCartItems.length > 0 && (
                <div className="shipping-address-form mb-3">
                  <h4>Shipping Address</h4>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Full Name"
                    value={shippingAddress.name}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="tel"
                    className="form-control mb-2"
                    placeholder="Phone Number"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Street Address"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        address: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="State (Optional)"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Postal Code (Optional)"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postalCode: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Country"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        country: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}
              {auth?.user?.address ? (
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {/* {!clientToken || !auth?.token || !cart?.length ? ( */}
                {!clientToken || !auth?.token || !groupedCartItems.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      //we can add this API from npm js braintree-web-drop-in-react
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary mb-2 mt-2 w-100"
                      onClick={handlePayment}
                      disabled={
                        loading ||
                        !instance ||
                            !shippingAddress.name.trim() ||
                            !shippingAddress.phone.trim() ||
                            !shippingAddress.address.trim() ||
                            !shippingAddress.city.trim() ||
                            !shippingAddress.country.trim() ||
                        !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
