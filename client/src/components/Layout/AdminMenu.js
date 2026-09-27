import React from "react";
import { NavLink } from "react-router-dom";
import { useOrders } from "../../context/ordersNotifyContext";
import { useOutOfStock } from "../../context/outOfStockContext";
import { Badge } from "antd";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  HiFolderPlus,
  HiPlusCircle,
  HiPencilSquare,
  HiExclamationTriangle,
  HiShoppingCart,
  HiReceiptPercent,
  HiChartBar, // Added Icon for Analytics
  HiUserGroup,
  HiUsers,
} from "react-icons/hi2";

import "./LayoutStyles/AdminMenu.css";

const AdminMenu = () => {
  const { outOfStockCount } = useOutOfStock();

  const [orders] = useOrders();

  const pendingOrders = orders?.filter(
    (order) => order.status === "Not Process",
  ).length;

  return (
    <>
      <div className="admin-menu-page">
        <div className="dashboard-menu panelHeading text-center rounded-2">
          <div className="list-group shadow-sm">
            {/* Matches the 'ordersHeading' color and style from All Orders */}

            <h4 className="py-3 px-3 mb-0 border-bottom fw-bold fs-4 d-flex align-items-center justify-content-center">
              <MdAdminPanelSettings
                style={{ color: "#00bfff" }}
                className="fs-2 me-2 flex-shrink-0"
              />

              <span className="w-100 text-center pe-5">Admin Panel</span>
            </h4>

            <NavLink
              to="/dashboard/admin/create-category"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2 mt-0"
            >
              <HiFolderPlus style={{ color: "#00bfff" }} className="fs-5" />
              Create Category
            </NavLink>

            <NavLink
              to="/dashboard/admin/create-product"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <HiPlusCircle style={{ color: "#00bfff" }} className="fs-5" />
              Create Product
            </NavLink>

            <NavLink
              to="/dashboard/admin/Products"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <HiPencilSquare style={{ color: "#00bfff" }} className="fs-5" />
              Update Product
            </NavLink>

            <NavLink
              to="/dashboard/admin/OutStocked"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <HiExclamationTriangle
                style={{ color: "#00bfff" }}
                className="fs-5"
              />

              <Badge
                count={outOfStockCount}
                showZero
                offset={[110, 7]}
                style={{ background: "#00bfff" }}
              >
                Out of Stock
              </Badge>
            </NavLink>

            <NavLink
              to="/dashboard/admin/orders"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <HiShoppingCart style={{ color: "#00bfff" }} className="fs-5" />

              <Badge
                count={pendingOrders}
                showZero
                offset={[100, 7]}
                style={{ background: "#00bfff" }}
              >
                Admin Orders
              </Badge>
            </NavLink>

            <NavLink
              to="/dashboard/admin/transaction-history"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <HiReceiptPercent style={{ color: "#00bfff" }} className="fs-5" />
              Transaction History
            </NavLink>

            {/* Analytics Link Correctly Placed */}

            <NavLink
              to="/dashboard/admin/analytics"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <HiChartBar style={{ color: "#00bfff" }} className="fs-5" />
              Analytics
            </NavLink>

            <NavLink
              to="/dashboard/admin/adminUsers"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <HiUserGroup style={{ color: "#00bfff" }} className="fs-5" />
              Admins
            </NavLink>

            <NavLink
              to="/dashboard/admin/users"
              className="list-group-item list-group-item-action panelOption d-flex align-items-center gap-2"
            >
              <HiUsers style={{ color: "#00bfff" }} className="fs-5" />
              Users
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
