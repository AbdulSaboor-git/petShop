"use client";
import React, { useEffect, useState, useCallback } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FaMinus } from "react-icons/fa";
import useAuthUser from "@/hooks/authUser";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@/redux/notificationThunk";
import Loader from "@/components/loader";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/components/getCroppedImg";

export default function ManageProductsPage() {
  const { user, userLoading, logout } = useAuthUser();
  const sellerId = user?.id;

  const [focused, setFocused] = useState("add");
  const [addProduct, setAddProduct] = useState(true);
  const [editProduct, setEditProduct] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [itemLoading, setItemLoading] = useState(true);
  const [itemError, setItemError] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [breedId, setBreedId] = useState("");
  const [sex, setSex] = useState("");
  const [nature, setNature] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [isfeatured, setIsFeatured] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [availability, setAvailability] = useState("");
  const [images, setImages] = useState([]); // Images state holds an array of URLs

  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const dispatch = useDispatch();
  const showMessage = (msg, state) => {
    dispatch(
      triggerNotification({
        msg: msg,
        success: state,
      })
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      let functionParam = params.get("function");
      let idParam = params.get("id") || "undefined";
      let ID = parseInt(idParam, 10);

      if (functionParam && functionParam != "undefined") {
        if (functionParam == "add") {
          handleAddProduct();
        } else if (functionParam == "edit") {
          handleEditProduct();
        } else {
          handleDeleteProduct();
        }
      }
      if (ID && ID != "undefined") {
        // setItemId([ID]);
        fetchItemData(ID);
      }
    }
  }, []);

  // Form validation states.
  const isAddFormValid =
    name.trim().length >= 3 &&
    price !== "" &&
    Number(price) > 0 &&
    categoryId !== "" &&
    images.length != 0;
  const isEditFormValid =
    name.trim().length >= 3 &&
    price !== "" &&
    Number(price) > 0 &&
    categoryId !== "" &&
    images.length != 0;

  function resetForm() {
    setName("");
    setPrice("");
    setDiscountedPrice("");
    setDescription("");
    setCategoryId("");
    setBreedId("");
    setSex("");
    setNature("");
    setSpecifications("");
    setIsFeatured(false);
    setWeight("");
    setHeight("");
    setAge("");
    setAvailability("");
    setImages([]);
    setItem(null);
    setImageSrc(null);
    setShowCropper(false);
  }

  // Handlers to switch forms.
  const handleAddProduct = () => {
    setAddProduct(true);
    setEditProduct(false);
    setDeleteProduct(false);
    setFocused("add");
    // Reset form fields.
    resetForm();
  };

  const handleEditProduct = () => {
    setAddProduct(false);
    setEditProduct(true);
    setDeleteProduct(false);
    setFocused("edit");
    // Reset form fields.
    resetForm();
  };

  const handleDeleteProduct = () => {
    setAddProduct(false);
    setEditProduct(false);
    setDeleteProduct(true);
    setFocused("delete");
    setItem(null);
  };

  // Fetch all products, categories, and breeds.
  const fetchItemsData = async () => {
    try {
      const response = await fetch(`/api/allItems?sellerId=${sellerId}`);
      const response2 = await fetch(`/api/categories_breeds`);
      if (!response.ok || !response2.ok) {
        throw new Error("Failed to fetch data.");
      }
      const data = await response.json();
      const data2 = await response2.json();

      setItems(data.items);
      setCategories(data2.categories);
      setBreeds(data2.breeds);
    } catch (err) {
      setError(err.message);
      showMessage(err.message, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sellerId) return;
    fetchItemsData();
  }, [sellerId]);

  const payload = {
    name: name.trim(),
    price: Number(price),
    discountedPrice:
      discountedPrice != undefined ? Number(discountedPrice) : "",
    description:
      description && description.toString().trim() !== ""
        ? description.trim()
        : null,
    categoryId: Number(categoryId),
    breedId:
      breedId && breedId.toString().trim() !== "" ? Number(breedId) : null,
    sex: sex && sex.toString().trim() !== "" ? sex.trim() : null,
    nature: nature && nature.toString().trim() !== "" ? nature.trim() : null,
    specifications:
      specifications && specifications.toString().trim() !== ""
        ? specifications.trim()
        : null,
    weight: weight && weight.toString().trim() !== "" ? Number(weight) : null,
    height: height && height.toString().trim() !== "" ? Number(height) : null,
    age: age && age.toString().trim() !== "" ? Number(age) : null,
    availability,
    isfeatured,
    images, // An array of image URLs
    sellerId,
  };

  // Fetch a single product's data using the product API.
  const fetchItemData = async (itemId) => {
    if (itemId === "null") {
      setItem(null);
      resetForm();
      return;
    }
    setItemLoading(true);
    try {
      const response = await fetch(`/api/item?productId=${itemId}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      const data = await response.json();
      setItem(data);
      setName(data.name || "");
      setPrice(data.price || "");
      setDiscountedPrice(data.discountedPrice || "");
      setDescription(data.description || "");
      setCategoryId(data.categoryId || "");
      setBreedId(data.breedId || "");
      setSex(data.sex || "");
      setNature(data.nature || "");
      setSpecifications(data.specifications || "");
      setIsFeatured(data.isfeatured || false);
      setWeight(data.weight || "");
      setHeight(data.height || "");
      setAge(data.age || "");
      setAvailability(data.availability || "");
      setImages(data.images || []); // Existing product images
    } catch (err) {
      setItemError(err.message);
      showMessage(err.message, false);
    } finally {
      setItemLoading(false);
    }
  };

  // Handler for adding a product.
  // Handler for adding a product.
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!isAddFormValid) {
      showMessage(
        "Please fill out all required fields with valid values.",
        false
      );
      return;
    }
    try {
      const res = await fetch("/api/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to add product.");
      }
      resetForm();
      showMessage(`Product "${name}" added successfully!`, true);
      fetchItemsData();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  // Handler for editing a product.
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!isEditFormValid || !item) {
      showMessage(
        "Please select a product and fill out all required fields with valid values.",
        false
      );
      return;
    }
    try {
      const res = await fetch(`/api/item?productId=${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to update product.");
      }
      showMessage(`Product "${item.name}" updated successfully!`, true);
      resetForm();
      fetchItemsData();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  // Handler for deleting a product.
  const handleDeleteProductSubmit = async (e) => {
    e.preventDefault();
    if (!item) {
      showMessage("Please select a product to delete.", false);
      return;
    }
    try {
      const res = await fetch(`/api/item?productId=${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to delete product.");
      }
      showMessage(`Product "${item.name}" deleted successfully!`, true);
      fetchItemsData();
      setItem(null);
      // Optionally, refresh the product list.
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  function removeImage(url) {
    setImages(images.filter((img_url) => img_url != url));
  }
  // Handler for file upload via Cloudinary (unsigned upload).
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  // Called when cropping is complete (the cropped area is determined)
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // When the user clicks "Crop", we generate the cropped image and upload it.
  const handleCropAndUpload = async () => {
    try {
      const croppedImageDataUrl = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
      // Now, upload the cropped image data URL to Cloudinary
      const formData = new FormData();
      // Cloudinary accepts data URLs if you prefix them with "data:image/jpeg;base64,"
      formData.append("file", croppedImageDataUrl);
      formData.append("upload_preset", "RoyalAseelFarms");
      setUploading(true);
      setShowCropper(false);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dlthizgza/upload`,
        { method: "POST", body: formData }
      );
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
      const data = await response.json();
      images.push(data.secure_url);
      setErrorMsg("");
      setImageSrc(null);
    } catch (error) {
      console.error("Error cropping/uploading image:", error);
      setErrorMsg("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && !user) {
      showMessage("Unauthorized Access", false);
    }
  }, [userLoading, user]);

  return (
    <div className="flex flex-col items-center gap-5 md:gap-10">
      <Header />
      <div className="w-full max-w-[1200px] px-4">
        {!user && !userLoading ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            Unauthorized Access.
          </div>
        ) : loading ? (
          <div className="h-screen pt-5">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl md:2xl font-semibold text-center">
              Seller Dashboard
            </h1>
            <h1 className="font-semibold text-center">Manage Products</h1>

            {/* Navigation buttons for Add, Edit, Delete */}
            <div className="flex flex-col md:flex-row gap-6 h-fit">
              <div className="flex flex-row md:flex-col h-fit gap-2 text-sm w-full md:w-fit border-b md:border-b-0 border-[#00000060] pb-6 md:pb-0 md:min-w-[200px]">
                <button
                  onClick={handleAddProduct}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] hover:text-white flex-1 text-center ${
                    focused === "add"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e]"
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={handleEditProduct}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] hover:text-white flex-1 text-center text-[#9e6e3b] ${
                    focused === "edit"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e]"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] hover:text-white flex-1 text-center text-[#9e6e3b] ${
                    focused === "delete"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e]"
                  }`}
                >
                  Delete
                </button>
              </div>
              <div className="w-full">
                {addProduct && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <form
                      className="flex flex-col gap-2.5 text-sm"
                      onSubmit={handleAddProductSubmit}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-orange-800 text-base">
                          Add Product
                        </h3>
                        <div className="flex gap-2 text-xs">
                          <button
                            type="reset"
                            onClick={resetForm}
                            className=" p-1.5 px-4 rounded-xl border bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={uploading}
                            className="p-1.5 px-4 rounded-xl border bg-green-500 hover:bg-green-600 text-white"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="mx-0.5">Product Name*</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={3}
                          maxLength={100}
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Price*</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          onChange={(e) => setPrice(e.target.value)}
                          min="0"
                          value={price}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Discounted Price</label>
                        <input
                          type="number"
                          onChange={(e) => setDiscountedPrice(e.target.value)}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={discountedPrice}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Description</label>
                        <textarea
                          value={description}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full resize-none"
                          onChange={(e) => setDescription(e.target.value)}
                          maxLength="5000"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Category*</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                        >
                          <option value="">select a category</option>
                          {categories.map((categ, i) => (
                            <option key={i} value={categ.id}>
                              {categ.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Breed</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={breedId}
                          onChange={(e) => setBreedId(e.target.value)}
                        >
                          <option value="">select a breed</option>
                          {breeds.map((breed, i) => (
                            <option key={i} value={breed.id}>
                              {breed.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Gender</label>
                        <select
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                          value={sex}
                          onChange={(e) => setSex(e.target.value)}
                        >
                          <option value="">select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Is Featured</label>
                        <select
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                          value={isfeatured ? "true" : "false"}
                          onChange={(e) =>
                            setIsFeatured(e.target.value === "true")
                          }
                        >
                          <option value="false">False</option>
                          <option value="true">True</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Specification</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={specifications}
                          onChange={(e) => setSpecifications(e.target.value)}
                          maxLength="200"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Nature</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={nature}
                          onChange={(e) => setNature(e.target.value)}
                          maxLength="200"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Weight (g)</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Height (cm)</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Age (years)</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Availability</label>
                        <select
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Images*</label>
                        <input
                          type="file"
                          accept="image/*"
                          value={""}
                          onChange={handleFileChange}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        />
                        {uploading && (
                          <p className="text-sm text-gray-500  mt-3">
                            Uploading...
                          </p>
                        )}
                        {errorMsg && (
                          <p className="text-sm text-red-500  mt-3">
                            {errorMsg}
                          </p>
                        )}
                        {/* Image Preview */}
                        {images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {images.map((url, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={url}
                                  value={""}
                                  alt={`Product Image ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-md border"
                                />
                                <div
                                  onClick={() => {
                                    removeImage(url);
                                  }}
                                  className="absolute p-0.5 right-0.5 top-0.5 bg-gray-50 cursor-pointer rounded-full text-red-500"
                                >
                                  <FaMinus size={10} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-gray-500 ${
                          !isAddFormValid && "text-red-500"
                        }`}
                      >
                        * required fields
                      </p>
                    </form>
                  </div>
                )}
                {editProduct && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <form
                      className="flex flex-col gap-2.5 text-sm"
                      onSubmit={handleEditProductSubmit}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-orange-800 text-base">
                          Edit Product
                        </h3>
                        <div className="flex gap-2 text-xs">
                          <button
                            type="reset"
                            onClick={resetForm}
                            className=" p-1.5 px-4 rounded-xl border bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={uploading}
                            className="p-1.5 px-4 rounded-xl border bg-green-500 hover:bg-green-600 text-white"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="mx-0.5">Product*</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full bg-[#9e6e3b2e]"
                          required
                          onChange={(e) => {
                            if (e.target.value) {
                              fetchItemData(e.target.value);
                            }
                          }}
                          value={item ? item.id : ""}
                        >
                          <option value="null">Select a product</option>
                          {items.map((prod, i) => (
                            <option key={i} value={prod.id}>
                              <p className="">{prod.name} </p>
                              {prod.availability == "UNAVAILABLE" &&
                                "(unavailable)"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Product Id</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={item ? item.id : ""}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Product Name*</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          value={name}
                          minLength={3}
                          maxLength={100}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="mx-0.5">Price*</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Discounted Price</label>
                        <input
                          type="number"
                          onChange={(e) => setDiscountedPrice(e.target.value)}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={discountedPrice}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Description</label>
                        <textarea
                          value={description}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full resize-none"
                          onChange={(e) => setDescription(e.target.value)}
                          maxLength="5000"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Category*</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                        >
                          <option value="">select a category</option>
                          {categories.map((categ, i) => (
                            <option key={i} value={categ.id}>
                              {categ.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Breed</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={breedId}
                          onChange={(e) => setBreedId(e.target.value)}
                        >
                          <option value="">select a breed</option>
                          {breeds.map((breed, i) => (
                            <option key={i} value={breed.id}>
                              {breed.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Gender</label>
                        <select
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                          value={sex}
                          onChange={(e) => setSex(e.target.value)}
                        >
                          <option value="">select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Is Featured</label>
                        <select
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                          value={isfeatured ? "true" : "false"}
                          onChange={(e) =>
                            setIsFeatured(e.target.value === "true")
                          }
                        >
                          <option value="false">False</option>
                          <option value="true">True</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Specification</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={specifications}
                          onChange={(e) => setSpecifications(e.target.value)}
                          maxLength="200"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Nature</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={nature}
                          onChange={(e) => setNature(e.target.value)}
                          maxLength="200"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Weight (g)</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Height (cm)</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Age (years)</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Availability</label>
                        <select
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Images*</label>
                        <input
                          type="file"
                          value={""}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        />
                        {uploading && (
                          <p className="text-sm text-gray-500 mt-3">
                            Uploading...
                          </p>
                        )}
                        {errorMsg && (
                          <p className="text-sm text-red-500 mt-3">
                            {errorMsg}
                          </p>
                        )}
                        {/* Image Preview */}
                        {images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3 ">
                            {images.map((url, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={url}
                                  alt={`Product Image ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-md border"
                                />
                                <div
                                  onClick={() => {
                                    removeImage(url);
                                  }}
                                  className="absolute p-0.5 right-0.5 top-0.5 bg-gray-50 cursor-pointer rounded-full text-red-500"
                                >
                                  <FaMinus size={10} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-gray-500
                          ${!isEditFormValid && "text-red-500"}`}
                      >
                        * required fields
                      </p>
                    </form>
                  </div>
                )}
                {deleteProduct && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleDeleteProductSubmit}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-orange-800 text-base">
                          Delete Product
                        </h3>
                        <div className="flex gap-2 text-xs">
                          <button
                            type="reset"
                            onClick={resetForm}
                            className=" p-1.5 px-4 rounded-xl border bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!item || itemLoading}
                            className="p-1.5 px-4 rounded-xl border bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 disabled:hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <label>Select Product</label>
                      <select
                        className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        required
                        onChange={(e) => {
                          fetchItemData(e.target.value);
                        }}
                        value={item ? item.id : ""}
                      >
                        <option value="null">Select a product</option>
                        {items.map((prod, i) => (
                          <option key={i} value={prod.id}>
                            {prod.name}{" "}
                            {prod.availability == "UNAVAILABLE" &&
                              "(unavailable)"}
                          </option>
                        ))}
                      </select>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {showCropper && imageSrc && (
        <div className="fixed inset-0 text-xs md:text-sm bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="relative w-80 h-80 ">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <button
            onClick={handleCropAndUpload}
            disabled={uploading}
            className="mt-4 bg-gradient-to-br to-[#5c3a16] via-[#734e26] from-[#936433] hover:bg-gradient-radial text-white px-4 py-2 rounded-md"
          >
            Crop & Upload
          </button>
          <button
            onClick={() => {
              setShowCropper(false);
              setImageSrc(null);
            }}
            className="mt-2 bg-gradient-to-br from-red-500 to-red-700 hover:bg-gradient-radial text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}
