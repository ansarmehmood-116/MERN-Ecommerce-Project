import React from "react";
import { NavLink } from "react-router-dom";
import { useOrders } from "../../context/ordersNotifyContext";
import { Badge } from "antd";

const AdminMenu = () => {

  const [orders]=useOrders();
  const pendingOrders = orders?.filter(order => order.status === "Not Process").length;

  return (
    <>
      <div className="text-center dashboard-menu">
        <div className="list-group">
          <h4 className="panelHeading">Admin Panel</h4>
          <NavLink
            to="/dashboard/admin/create-category"
            className="list-group-item list-group-item-action panelOption"
          >
            Create Category
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className="list-group-item list-group-item-action panelOption"
          >
            Create Product
          </NavLink>
          <NavLink
            to="/dashboard/admin/Products"
            className="list-group-item list-group-item-action panelOption"
          >
            Products
          </NavLink>
          <NavLink
            to="/dashboard/admin/orders"
            className="list-group-item list-group-item-action panelOption"
          >
            <Badge
              count={pendingOrders}
              showZero
              offset={[10, -4]}
              style={{background:"dodgerblue"}}
            >
              Orders
            </Badge>
          </NavLink>
          <NavLink
            to="/dashboard/admin/adminUsers"
            className="list-group-item list-group-item-action panelOption"
          >
            Admins
          </NavLink>
          <NavLink
            to="/dashboard/admin/users"
            className="list-group-item list-group-item-action panelOption"
          >
            Users
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
