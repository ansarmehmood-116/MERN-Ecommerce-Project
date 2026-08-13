import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//here we are using useLocation hook this is very beneficial because sometime if we want to
//enter a page in a website and we are not logged in so we are required to sign in and after
//sign-in we move to home page so if we want to stay in same page where we want to enter we
//use useLocation.

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue); //5,4,3,2,1 decreasing
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);
  return (
    <>
      {/* converted html to jsx */}
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh",width:'100vw' }}
      >
        <h1 className="text-center">redirecting to you in {count} seconds</h1>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;
