import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryFormInput from "../../components/Form/CategoryFormInput";
import { Modal } from "antd";
import "./AdminStyles/CreateCateg.css";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    try {
      const { data } = await axios.post("/api/v1/category/create-category", {
        name,
      });
      if (data?.success) {
        toast.success(`${name} created successfully`);
        setName(""); // Clear input on success
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in creating category");
    }
  };

  // Get All Categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category list");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Update Category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data?.success) {
        toast.success(`${updatedName} updated successfully`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating category");
    }
  };

  // Delete Category
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${pId}`
      );
      if (data?.success) {
        toast.success(`Category deleted successfully`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong during deletion");
    }
  };

  // Filter categories by search
  const filteredCategories = categories?.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="admin-create-category-page">
      <div className="container-fluid py-3 px-3 dashboard">
        <div className="row g-3">
          {/* Admin Sidebar */}
          <div className="col-lg-3 col-md-4">
            <AdminMenu />
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9 col-md-8">
            {/* Centered Sky Blue Page Header */}
            <div 
              className="p-3 mb-4 rounded-3 text-center shadow categoryHeading"
            >
              <h2 className="fw-bold mb-1">Category Management</h2>
              <p className="small mb-0 opacity-90 headLine">
                Add, update, or remove product categories for your catalog
              </p>
            </div>

            {/* Create Category Form Card */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title fw-semibold mb-0">Add New Category</h5>
                  <span className="badge bg-primary rounded-pill px-3 py-2 fs-6">
                    Total: {categories?.length || 0}
                  </span>
                </div>
                <CategoryFormInput
                  handleSubmit={handleSubmit}
                  value={name}
                  setValue={setName}
                />
              </div>
            </div>

            {/* Category Data Table Card */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="card-title fw-semibold mb-0">All Categories</h5>
                
                {/* Real-time Search Input */}
                <div style={{ maxWidth: "260px", width: "100%" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-2"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="py-3 ps-3">Category Name</th>
                        <th scope="col" className="py-3 text-end pe-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories && filteredCategories.length > 0 ? (
                        filteredCategories.map((c) => (
                          <tr key={c._id}>
                            <td className="fw-medium ps-3">{c.name}</td>
                            <td className="text-end pe-3">
                              {/* Redesigned Edit Button */}
                              <button
                                className="btn btn-sm btn-light text-primary border-primary-subtle me-2 rounded-2 px-3 shadow-sm d-inline-flex align-items-center gap-1 fw-medium"
                                style={{ transition: "all 0.2s ease" }}
                                title="Edit Category"
                                onClick={() => {
                                  setVisible(true);
                                  setUpdatedName(c.name);
                                  setSelected(c);
                                }}
                              >
                                <i className="bi bi-pencil-square fs-6"></i>
                                <span>Edit</span>
                              </button>

                              {/* Redesigned Delete Button */}
                              <button
                                className="btn btn-sm btn-light text-danger border-danger-subtle rounded-2 px-3 shadow-sm d-inline-flex align-items-center gap-1 fw-medium"
                                style={{ transition: "all 0.2s ease" }}
                                title="Delete Category"
                                onClick={() => handleDelete(c._id)}
                              >
                                <i className="bi bi-trash3 fs-6"></i>
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center py-4 text-muted">
                            No categories found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Ant Design Modal for Updating Category */}
            <Modal
              title="Update Category"
              open={visible}
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
              centered
            >
              <div className="pt-3">
                <CategoryFormInput
                  value={updatedName}
                  setValue={setUpdatedName}
                  handleSubmit={handleUpdate}
                />
              </div>
            </Modal>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
