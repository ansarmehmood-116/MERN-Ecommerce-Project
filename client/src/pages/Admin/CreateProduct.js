import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd"; //destructured from antd for dropdown menu
import { useNavigate } from "react-router-dom";
import "./AdminStyles/CreateProduct.css";

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  //______________________________________________________________________

  // Create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //1-we are using form data because we have photo so browser have default form we can use it
      //2- if we donot want to use formData then wrap all the input anmd select tags within form tag and add handle create function on form on submit event.
      const productData = new FormData(); //it is created with new keyword
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping); // Sends "1" or "0"

      // Added missing 'await' keyword
      const { data } = await axios.post(
        "/api/v1/product/create-product",
        productData, //instead of passing one by one parameter it is good to pass productData
      );

      if (data?.success) {
        toast.success(data?.message || "Product Created Successfully");
        //instead of optional Chaining we also can use data && data.message
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating product");
    } finally {
      setLoading(false);
    }
  };
  //_______________________________________________________________________
  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="create-product-page">
        <div className="container-fluid py-3 px-3 dashboard">
          <div className="row g-3">
            {/* Admin Sidebar */}
            <div className="col-lg-3 col-md-4">
              <AdminMenu />
            </div>

            {/* Main Content Area */}
            <div className="col-lg-9 col-md-8">
              {/* Sky Blue Header */}
              <div className="p-3 mb-4 rounded-3 text-center shadow-sm CreateproductsHeading">
                <h2 className="fw-bold mb-1">Create New Product</h2>
                <p className="small mb-0 opacity-90 headLine">
                  Fill in the details below to add a new item to your store
                </p>
              </div>

              {/* Form Container Card */}
              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleCreate}>
                    <div className="row g-3">
                      {/* Category Selection */}
                      <div className="col-12">
                        <label className="form-label fw-medium text-secondary">
                          Category <span className="text-danger">*</span>
                        </label>
                        <Select
                          // bordered={false} //to make border hidden
                          placeholder="Select a category"
                          size="large"
                          showSearch
                          className="w-100"
                          //in antd css library we get by default the "(value)" props in functions we donot need to set explicitly it takes the value from select option itself
                          onChange={(value) => setCategory(value)}
                          value={category || undefined}
                          filterOption={(input, option) =>
                            (option?.children ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {categories?.map((c) => (
                            <Option key={c._id} value={c._id}>
                              {c.name}
                            </Option>
                          ))}
                        </Select>
                      </div>

                      {/* Image Upload Button & Preview */}
                      <div className="col-12">
                        <label className="form-label fw-medium text-secondary">
                          Product Image <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex flex-column align-items-center justify-content-center p-3 border border-2 border-dashed rounded-3 bg-light">
                          <label className="btn btn-outline-primary px-4 py-2 rounded-2 mb-0 shadow-sm cursor-pointer d-inline-flex align-items-center gap-2">
                            <i className="bi bi-cloud-arrow-up fs-5"></i>
                            <span>
                              {photo ? photo.name : "Upload Product Photo"}
                            </span>
                            {/* here we have used ternary operator if photo exits it will show photo name other wise say upload photo */}
                            <input
                              type="file"
                              name="photo"
                              accept="image/*" //the accept property will only accept image and image/* means any type of image png,jpg etc
                              onChange={(e) => setPhoto(e.target.files[0])}
                              //in above we have used antd design Select box that's why we have used default value here we are using other framworks boxes i.e div so we use (e) event and file exist in array form that's why i have used [0] index 0.
                              hidden
                            />
                          </label>
                          <small className="text-muted mt-2">
                            Supported formats: JPG, PNG, WEBP (Max 1MB)
                          </small>
                        </div>

                        {/* Photo Preview Box */}
                        {photo && ( //this line means if photo exists the return
                          <div className="mt-3 text-center position-relative d-inline-block">
                            {/* this div will show the uploaded image */}
                            <img
                              //  as we havn't direct photo and niether we can get direct image so we use the url parameters of browser and can get photo i.e when we select image in above label so the brwoser has some properties to get that image and can access to the address of that photo so we will use this property and display image we also can add some package from npm js to show photo preview check a good documented package and use but we can use browser property which is best
                              src={URL.createObjectURL(photo)}
                              alt="product_photo"
                              height={"180px"}
                              className="img-thumbnail rounded-3 shadow-sm object-fit-cover"
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0 translate-middle shadow-sm"
                              title="Remove Photo"
                              onClick={() => setPhoto("")}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Product Name */}
                      <div className="col-md-12">
                        <label className="form-label fw-medium text-secondary">
                          Product Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          placeholder="e.g. Wireless Bluetooth Headphones"
                          className="form-control form-control-lg fs-6"
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="col-12">
                        <label className="form-label fw-medium text-secondary">
                          Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                          rows="4"
                          value={description}
                          placeholder="Enter detailed product description..."
                          className="form-control fs-6"
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>

                      {/* Price & Quantity in Side-by-Side Grid */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-secondary">
                          Price ($) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={price}
                          placeholder="0.00"
                          className="form-control form-control-lg fs-6"
                          onChange={(e) => setPrice(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium text-secondary">
                          Quantity <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={quantity}
                          placeholder="100"
                          className="form-control form-control-lg fs-6"
                          onChange={(e) => setQuantity(e.target.value)}
                          required
                        />
                      </div>

                      {/* Shipping Selection */}
                      <div className="col-12">
                        <label className="form-label fw-medium text-secondary">
                          Free Shipping
                        </label>
                        <Select
                          placeholder="Select Shipping Option"
                          size="large"
                          className="w-100"
                          onChange={(value) => setShipping(value)}
                          value={shipping || undefined}
                        >
                          <Option value="0">No</Option>
                          <Option value="1">Yes</Option>
                        </Select>
                      </div>

                      {/* Submit Button */}
                      <div className="col-12 mt-4 text-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary btn-lg px-4 rounded-3 shadow-sm d-inline-flex align-items-center gap-2 create-product-btn"
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              ></span>
                              <span>Creating...</span>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-plus-circle fs-5"></i>
                              <span>CREATE PRODUCT</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default CreateProduct;
//_____________________________________________________________
