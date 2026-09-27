import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUserCircle,
  FaUserEdit,
  FaBoxOpen,
  FaHeart,
  FaRegHeart,
  FaShoppingBag,
} from "react-icons/fa";
import "./LayoutStyles/UserMenu.css";
import { BiSolidUserDetail } from "react-icons/bi";

const UserMenu = () => {
  return (
    <>
      <div className="user-menu-page">
        <div className="dashboard-menu panelHeading text-center rounded-2">
          <div className="list-group shadow-sm">
            {/* Header section matching AdminMenu */}
            <h4 className="py-3 px-3 mb-0 border-bottom fw-bold fs-4 d-flex align-items-center justify-content-center">
              {/* <FaUserCircle
              style={{ color: "#00a2ff" }}
              className="fs-2 me-2 flex-shrink-0"
            /> */}

              <BiSolidUserDetail
                style={{ color: "#00aeff" }}
                className="fs-2 me-2 flex-shrink-0"
              />
              <span className="w-100 text-center pe-5">User Panel</span>
            </h4>
            <NavLink
              to="/dashboard/user/orders"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <FaBoxOpen
                style={{ color: "#00bfff" }}
                className="fs-5 flex-shrink-0"
              />
              My Orders
            </NavLink>

            {/* Favourites with Dynamic Red Heart Icon */}
            <NavLink
              to="/dashboard/user/favourites"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <FaHeart
                      style={{ color: "#ff4d4f" }}
                      className="fs-5 flex-shrink-0"
                    />
                  ) : (
                    <FaRegHeart
                      style={{ color: "#00bfff" }}
                      className="fs-5 flex-shrink-0"
                    />
                  )}
                  Favourites
                </>
              )}
            </NavLink>

            <NavLink
              to="/"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <FaShoppingBag
                style={{ color: "#00bfff" }}
                className="fs-5 flex-shrink-0"
              />
              Continue Shopping
            </NavLink>

            <NavLink
              to="/dashboard/user/profile"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <FaUserEdit
                style={{ color: "#00bfff" }}
                className="fs-5 flex-shrink-0"
              />
              Edit Profile
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
