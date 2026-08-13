import React from "react";
import Layout from "./../../components/Layout/Layout";
import { useState } from "react";
import toast from "react-hot-toast";
//here we have removed ",{Toaster}" no need of it
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AuthStyles.css";
//this our own css so we have imported it.

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  //form handle function to evolve each time refresh behavior of form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(name,email,password,phone,address);
    try {
      const res = await axios.post(
        // `${process.env.REACT_APP_API}/api/v1/auth/register`, we will use env later as we have already added proxy
        "/api/v1/auth/forgot-password",
        {
          email,
          newPassword,
          answer,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
        //it will check if we were in some page so it will navigate to that page after login
        //otherwise move to home page.
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Forgot Password Ecommerce-App"}>
      {/* <h1>Forgot Password</h1> */}
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">RESET PASSWORD</h4>
          <div className="mb-3">
            {/* <label htmlFor="exampleInputName" className="form-label">
              Email
            </label> */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email"
              required
              // aria-describedby="emailHelp"
            />
            {/* <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div> */}
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Favorite Sport"
              required
            />
          </div>
          <div className="mb-3">
            {/* <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label> */}
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            RESET
          </button>
        </form>
      </div>
    </Layout>
  );
};
export default ForgotPassword;
