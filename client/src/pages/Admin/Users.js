import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { MdDelete, MdSearch, MdPeople } from "react-icons/md";
import "./AdminStyles/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); //main page loader

  // Fetch users from the API
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/users");

      // Total users count includes admins
      setTotalUsers(data.users.length);

      // Show only non-admin users in the table
      const nonAdminUsers = data.users.filter((user) => user.role !== 1);
      setUsers(nonAdminUsers);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const handleDelete = async (userId) => {
    try {
      let answer = window.prompt("Are You Sure want to delete this user?");
      if (!answer) return;
      await axios.delete(`/api/v1/auth/user/${userId}`);
      toast.success("User deleted successfully");
      // Update table
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

      // Update total users count
      setTotalUsers((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Search users
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.phone?.toLowerCase().includes(searchText) ||
      user.address?.toLowerCase().includes(searchText)
    );
  });

  return (
    <Layout title={"Dashboard - All-Users"}>
      <div className="users-page">
        <div className="container-fluid p-3 dashboard">
          <div className="row g-3">
            {/* Admin Menu */}
            <div className="col-md-3 users-menu-column">
              <AdminMenu />
            </div>

            {/* Users Content */}
            <div className="col-md-9 users-content-column">
              {/* Header + Total Count */}
              <div className="users-top-section">
                <div className="users-heading-wrapper">
                  <h1 className="text-center usersHeading rounded-2">
                    All Users
                  </h1>
                </div>

                <div className="users-count-card">
                  <div className="users-count-icon">
                    <MdPeople />
                  </div>

                  <div>
                    <span className="users-count-label">Total Users</span>

                    <strong className="users-count-number">{totalUsers}</strong>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="users-toolbar ">
                <div className="users-search">
                  <MdSearch className="users-search-icon" />

                  <input
                    type="text"
                    placeholder="Search users by name, email, phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="users-result-count">
                  Showing {filteredUsers.length} user
                  {filteredUsers.length !== 1 ? "s" : ""}
                </div>
              </div>
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "40vh" }}
                >
                  <div className="spinner-border text-grey" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : users && users.length > 0 ? (
                <>
                  {/* Users Table */}
                  <div className="users-table-card shadow">
                    <div className="users-table-wrapper">
                      <table className="table table-hover mb-0 align-middle users-table">
                        <thead>
                          <tr>
                            <th scope="col" className="text-center">
                              #
                            </th>

                            <th scope="col" className="text-center">
                              Name
                            </th>

                            <th scope="col" className="text-center">
                              Email
                            </th>

                            <th scope="col" className="text-center">
                              Phone
                            </th>

                            <th scope="col" className="text-center">
                              Address
                            </th>

                            <th scope="col" className="text-center">
                              Joined
                            </th>

                            <th scope="col" className="text-center">
                              Delete
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                              <tr key={user._id}>
                                <td className="text-center users-index">
                                  {index + 1}
                                </td>

                                <td className="text-center users-name">
                                  {user.name || "N/A"}
                                </td>

                                <td className="text-center">
                                  {user.email || "N/A"}
                                </td>

                                <td className="text-center">
                                  {user.phone || "N/A"}
                                </td>

                                <td className="text-center users-address">
                                  {user.address || "N/A"}
                                </td>

                                <td className="text-center users-date">
                                  {user.createdAt
                                    ? new Date(
                                        user.createdAt,
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </td>

                                <td
                                  className="text-center users-delete-cell"
                                  onClick={() => handleDelete(user._id)}
                                >
                                  <button
                                    type="button"
                                    className="users-delete-btn"
                                    title="Delete User"
                                  >
                                    <MdDelete />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="users-empty-state">
                                {search
                                  ? "No users found matching your search."
                                  : "No users available."}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="d-flex flex-column justify-content-center align-items-center text-center p-5 bg-white rounded-3 shadow-sm my-4"
                  style={{ minHeight: "350px" }}
                >
                  <div style={{ fontSize: "3.5rem" }} className="mb-2">
                    👤
                  </div>
                  <h4 className="fw-bold text-secondary">No user Yet</h4>
                  <p className="text-muted mb-4">
                    Looks like no user have registered Yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
