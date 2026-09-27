import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import useCategory from "../../hooks/useCategory"; // 👈 1. Hook Import Karein
import "./AdminStyles/UpdateProduct.css";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  // Custom hook for fetching categories
  //👉🏻Directly call this custom hook here and removed the manual created api call "getAllCategory" so it has save extra lines as well as removed it's useEffect too and for learning purpose the same manual api is present in create product page there we also can use this custome useCategory() hook but that is intentionaly left to learn the manual api too. for Learning Points regarding react goto gemini chat named "React Learning Points" and thepoints are (React component, Custom Hook, Context API)
  const categories = useCategory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  //__________________________________________________________________

  // Get single product details
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-productDetails/${params.slug}`
      );
      if (data?.product) {
        setName(data.product.name || "");
        setId(data.product._id || "");
        setDescription(data.product.description || "");
        setPrice(data.product.price || "");
        setQuantity(data.product.quantity || "");
        setShipping(data.product.shipping ? "1" : "0");
        setCategory(data.product.category?._id || "");
      }
    } catch (error) {
      console.log("GET PRODUCT ERROR:", error);
      toast.error("Error loading product details");
    }
  };

  useEffect(() => {
    if (params?.slug) getSingleProduct();
    // eslint-disable-next-line
  }, [params?.slug]);
  //___________________________________________________________________

  // ❌ REMOVED: getAllCategory() function and its useEffect have been removed completely!
  //___________________________________________________________________

  // Update product handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      if (photo) productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`,
        productData
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to update product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong during update");
    } finally {
      setLoading(false);
    }
  };
  //_____________________________________________________________________________

  // Delete product handler
  const handleDelete = async () => {
    try {
      let answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;

      setDeleteLoading(true);
      const { data } = await axios.delete(
        `/api/v1/product/delete-product/${id}`
      );

      if (data?.success) {
        toast.success("Product Deleted Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to delete product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting");
    } finally {
      setDeleteLoading(false);
    }
  };
//___________________________________________________________________

  return (
    <Layout title={"Dashboard - Update Product"}>
       <div className="update-product-page">
      <div className="container-fluid py-3 px-3 dashboard">
        <div className="row g-3">
          {/* Admin Sidebar */}
          <div className="col-lg-3 col-md-4">
            <AdminMenu />
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9 col-md-8">
            {/* Header Banner */}
            <div
              className="p-3 mb-4 rounded-3 text-center shadow-sm UpdateProdHeading"
            >
              <h2 className="fw-bold mb-1">Update Product</h2>
              <p className="small mb-0 opacity-90">
                Modify product details or remove this product from inventory
              </p>
            </div>

            {/* Form Card */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleUpdate}>
                  <div className="row g-3">

                    {/* Category Selector */}
                    <div className="col-12">
                      <label className="form-label fw-medium text-secondary">
                        Category <span className="text-danger">*</span>
                      </label>
                      <Select
                        placeholder="Select a category"
                        size="large"
                        showSearch
                        className="w-100"
                        onChange={(value) => setCategory(value)}
                        value={category || undefined}
                        filterOption={(input, option) =>
                          (option?.children ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {/* 👈 3. Render directly using the hook output */}
                        {categories?.map((c) => (
                          <Option key={c._id} value={c._id}>
                            {c.name}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Image Upload Dropzone */}
                    <div className="col-12">
                      <label className="form-label fw-medium text-secondary">
                        Product Photo
                      </label>
                      <div className="d-flex flex-column align-items-center justify-content-center p-3 border border-2 border-dashed rounded-3 bg-light">
                        <label className="btn btn-outline-primary px-4 py-2 rounded-2 mb-0 shadow-sm cursor-pointer d-inline-flex align-items-center gap-2">
                          <i className="bi bi-cloud-arrow-up fs-5"></i>
                          <span>{photo ? photo.name : "Change Photo"}</span>
                           {/*here we have used ternary cobdition in both condition picture will be selected but we are updating the product so if the user select new photo the object url will be used otherwise for existingphoto fetch API will used.*/}
                          <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files[0])}
                            hidden
                          />
                        </label>
                        <small className="text-muted mt-2">
                          Select a new image to replace the existing one
                        </small>
                      </div>

                      {/* Photo Preview Box */}
                      <div className="mt-3 text-center">
                        {photo ? (
                          <div className="position-relative d-inline-block">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt="product_photo_preview"
                              height={"180px"}
                              className="img-thumbnail rounded-3 shadow-sm object-fit-cover"
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0 translate-middle shadow-sm"
                              title="Clear Selected Photo"
                              onClick={() => setPhoto("")}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        ) : (
                          id && (
                            <img
                              src={`/api/v1/product/product-photo/${id}`}
                              alt="existing_product_photo"
                              height={"180px"}
                              className="img-thumbnail rounded-3 shadow-sm object-fit-cover"
                            />
                          )
                        )}
                      </div>
                    </div>

                    {/* Product Name */}
                    <div className="col-12">
                      <label className="form-label fw-medium text-secondary">
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        placeholder="Enter product name"
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
                        placeholder="Enter description"
                        className="form-control fs-6"
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    {/* Price & Quantity Grid */}
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
                        placeholder="0"
                        className="form-control form-control-lg fs-6"
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                      />
                    </div>

                    {/* Shipping */}
                    <div className="col-12">
                      <label className="form-label fw-medium text-secondary">
                        Free Shipping
                      </label>
                      <Select
                        placeholder="Select Shipping"
                        size="large"
                        className="w-100"
                        onChange={(value) => setShipping(value)}
                        value={shipping}
                      >
                        <Option value="0">No</Option>
                        <Option value="1">Yes</Option>
                      </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-12 mt-4 d-flex flex-wrap gap-2 justify-content-between align-items-center">
                      <button
                        type="button"
                        disabled={deleteLoading || loading}
                        className="btn btn-outline-danger px-4 py-2 rounded-3 shadow-sm d-inline-flex align-items-center gap-2"
                        onClick={handleDelete}
                      >
                        {deleteLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-trash3 fs-6"></i>
                            <span>DELETE PRODUCT</span>
                          </>
                        )}
                      </button>

                      <button
                        type="submit"
                        disabled={loading || deleteLoading}
                        className="btn btn-primary btn-lg px-4 rounded-3 shadow-sm d-inline-flex align-items-center gap-2"
                        style={{ backgroundColor: "#00bfff", borderColor: "#00bfff" }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-arrow-repeat fs-5"></i>
                            <span>UPDATE PRODUCT</span>
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
export default UpdateProduct;
//___________________________________________________________________________

//_________________________OLD-VERSION of the page___________________________
// import React, { useState, useEffect } from "react";
// import Layout from "./../../components/Layout/Layout";
// import AdminMenu from "./../../components/Layout/AdminMenu";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { Select } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import useCategory from "../../hooks/useCategory"; // 👈 1. Hook Import Karein
// import "./AdminStyles/UpdateProduct.css";

// const { Option } = Select;

// const UpdateProduct = () => {
//   const navigate = useNavigate();
//   const params = useParams();
  
//   //👉🏻Directly call this custom hook here and removed the manual created api call "getAllCategory" so it has save extra lines as well as removed it's useEffect too and for learning purpose the same manual api is present in create product page there we also can use this custome useCategory() hook but that is intentionaly left to learn the manual api too. for Learning Points regarding react goto gemini chat named "React Learning Points" and thepoints are (React component, Custom Hook, Context API)
//   const categories = useCategory(); 

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [shipping, setShipping] = useState("");
//   const [photo, setPhoto] = useState("");
//   const [id, setId] = useState("");

//   // Get single product details
//   const getSingleProduct = async () => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/product/get-productDetails/${params.slug}`
//       );
//       setName(data?.product?.name || "");
//       setId(data?.product?._id || "");
//       setDescription(data?.product?.description || "");
//       setPrice(data?.product?.price || "");
//       setQuantity(data?.product?.quantity || "");
//       setShipping(data?.product?.shipping ? "1" : "0");
//       setCategory(data?.product?.category?._id || "");
//     } catch (error) {
//       console.log("GET PRODUCT ERROR:", error);
//       toast.error("Error loading product details");
//     }
//   };

//   useEffect(() => {
//     if (params?.slug) getSingleProduct();
//     // eslint-disable-next-line
//   }, [params?.slug]);

//   // ❌ REMOVED: getAllCategory() function and its useEffect have been removed completely!

//   // Update product function
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const productData = new FormData();
//       productData.append("name", name);
//       productData.append("description", description);
//       productData.append("price", price);
//       productData.append("quantity", quantity);
//       photo && productData.append("photo", photo);
//       productData.append("category", category);
//       productData.append("shipping", shipping);

//       const { data } = await axios.put(
//         `/api/v1/product/update-product/${id}`,
//         productData
//       );
//       if (data?.success) {
//         toast.success("Product Updated Successfully");
//         navigate("/dashboard/admin/products");
//       } else {
//         toast.error(data?.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong");
//     }
//   };

//   // Delete product function
//   const handleDelete = async () => {
//     try {
//       let answer = window.prompt("Are You Sure want to delete this product ? ");
//       if (!answer) return;
//       const { data } = await axios.delete(
//         `/api/v1/product/delete-product/${id}`
//       );
//       toast.success("Product Deleted Successfully");
//       navigate("/dashboard/admin/products");
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <Layout title={"Dashboard - Update Product"}>
//       <div className="container-fluid p-3 dashboard">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9 d-flex flex-column align-items-center">
//             <h1 className="text-center mb-3">Update Product</h1>
//             <div className="m-1 w-75">
//               <Select
//                 bordered={false}
//                 placeholder="Select a category"
//                 size="large"
//                 showSearch
//                 className="form-select mb-3"
//                 onChange={(value) => setCategory(value)}
//                 value={category}
//               >
//                 {/* 👈 3. Render directly using the hook output */}
//                 {categories?.map((c) => (
//                   <Option key={c._id} value={c._id}>
//                     {c.name}
//                   </Option>
//                 ))}
//               </Select>
              
//               <div className="mb-3">
//                 <label className="btn btn-outline-secondary col-md-12">
//                   {photo ? photo.name : "Upload Photo"}
//                   <input
//                     type="file"
//                     name="photo"
//                     accept="image/*"
//                     onChange={(e) => setPhoto(e.target.files[0])}
//                     hidden
//                   />
//                 </label>
//               </div>
              
//               <div className="mb-3">
//                 {photo ? (
//                   //here we have used ternary cobdition in both condition picture
//                   //will be selected but we are updating the product so if the user
//                   //select new photo the object url will be used otherwise for existingphoto fetch API will used.
//                   <div className="text-center">
//                     <img
//                       src={URL.createObjectURL(photo)}
//                       alt="product_photo"
//                       height={"200px"}
//                       className="img img-responsive"
//                     />
//                   </div>
//                 ) : (
//                   id && (
//                     <div className="text-center">
//                       <img
//                         src={`/api/v1/product/product-photo/${id}`}
//                         alt="product_photo"
//                         height={"200px"}
//                         className="img img-responsive"
//                       />
//                     </div>
//                   )
//                 )}
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="text"
//                   value={name}
//                   placeholder="write a name"
//                   className="form-control"
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>

//               <div className="mb-3">
//                 <textarea
//                   value={description}
//                   placeholder="write a description"
//                   className="form-control"
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="number"
//                   value={price}
//                   placeholder="write a Price"
//                   className="form-control"
//                   onChange={(e) => setPrice(e.target.value)}
//                 />
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="number"
//                   value={quantity}
//                   placeholder="write a quantity"
//                   className="form-control"
//                   onChange={(e) => setQuantity(e.target.value)}
//                 />
//               </div>

//               <div className="mb-3">
//                 <Select
//                   bordered={false}
//                   placeholder="Select Shipping"
//                   size="large"
//                   showSearch
//                   className="form-select mb-3"
//                   onChange={(value) => setShipping(value)}
//                   value={shipping}
//                 >
//                   <Option value="0">No</Option>
//                   <Option value="1">Yes</Option>
//                 </Select>
//               </div>

//               <div className="mb-3">
//                 <button className="btn btn-primary" onClick={handleUpdate}>
//                   UPDATE PRODUCT
//                 </button>
//               </div>

//               <div className="mb-3">
//                 <button className="btn btn-danger" onClick={handleDelete}>
//                   DELETE PRODUCT
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default UpdateProduct;
//___________________________________________________________________________