"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FaMinus } from "react-icons/fa";

export default function ManageProductsPage() {
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
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [availability, setAvailability] = useState("");
  const [images, setImages] = useState([]); // Images state holds an array of URLs
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // For demonstration purposes, we'll hard-code sellerId.
  const sellerId = 1;

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

  // Handlers to switch forms.
  const handleAddProduct = () => {
    setAddProduct(true);
    setEditProduct(false);
    setDeleteProduct(false);
    setFocused("add");
    // Reset form fields.
    setName("");
    setPrice("");
    setDiscountedPrice("");
    setDescription("");
    setCategoryId("");
    setBreedId("");
    setSex("");
    setNature("");
    setWeight("");
    setHeight("");
    setAge("");
    setAvailability("");
    setImages([]);
    setItem(null);
  };

  const handleEditProduct = () => {
    setAddProduct(false);
    setEditProduct(true);
    setDeleteProduct(false);
    setFocused("edit");
    // Reset form fields.
    setName("");
    setPrice("");
    setDiscountedPrice("");
    setDescription("");
    setCategoryId("");
    setBreedId("");
    setSex("");
    setNature("");
    setWeight("");
    setHeight("");
    setAge("");
    setAvailability("");
    setImages([]);
    setItem(null);
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
      const response = await fetch(`/api/allItems`);
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
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemsData();
  }, []);

  // Fetch a single product's data using the product API.
  const fetchItemData = async (itemId) => {
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
      setWeight(data.weight || "");
      setHeight(data.height || "");
      setAge(data.age || "");
      setAvailability(data.availability || "");
      setImages(data.images || []); // Existing product images
    } catch (err) {
      setItemError(err.message);
      alert(err.message);
    } finally {
      setItemLoading(false);
    }
  };
  function resetForm() {
    setName("");
    setPrice("");
    setDiscountedPrice("");
    setDescription("");
    setCategoryId("");
    setBreedId("");
    setSex("");
    setNature("");
    setWeight("");
    setHeight("");
    setAge("");
    setAvailability("");
    setImages([]);
    setItem(null);
  }
  // Handler for adding a product.
  // Handler for adding a product.
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!isAddFormValid) {
      alert("Please fill out all required fields with valid values.");
      return;
    }
    try {
      const res = await fetch("/api/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          discountedPrice:
            discountedPrice != undefined ? Number(discountedPrice) : "",
          description,
          categoryId: Number(categoryId),
          breedId: breedId ? Number(breedId) : null,
          sex,
          nature,
          weight: weight ? Number(weight) : null,
          height: height ? Number(height) : null,
          age: age ? Number(age) : null,
          availability,
          images, // Array of image URLs
          sellerId,
          isDiscounted: discountedPrice != "" && discountedPrice < price,
        }),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to add product.");
      }
      alert(`Product "${name}" added successfully!`);
      // Reset form state.
      fetchItemsData();
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler for editing a product.
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!isEditFormValid || !item) {
      alert(
        "Please select a product and fill out all required fields with valid values."
      );
      return;
    }
    try {
      const res = await fetch(`/api/item?productId=${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          discountedPrice:
            discountedPrice != undefined ? Number(discountedPrice) : "",
          description,
          categoryId: Number(categoryId),
          breedId: breedId ? Number(breedId) : null,
          sex,
          nature,
          weight: weight ? Number(weight) : null,
          height: height ? Number(height) : null,
          age: age ? Number(age) : null,
          availability,
          images,
          isDiscounted: discountedPrice != "" && discountedPrice < price,
        }),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to update product.");
      }
      alert(`Product "${item.name}" updated successfully!`);
      fetchItemsData();
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler for deleting a product.
  const handleDeleteProductSubmit = async (e) => {
    e.preventDefault();
    if (!item) {
      alert("Please select a product to delete.");
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
      alert(`Product "${item.name}" deleted successfully!`);
      fetchItemsData();
      setItem(null);
      // Optionally, refresh the product list.
    } catch (err) {
      alert(err.message);
    }
  };

  function removeImage(url) {
    setImages(images.filter((img_url) => img_url != url));
  }
  // Handler for file upload via Cloudinary (unsigned upload).
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);
    // Replace with your unsigned upload preset name
    formData.append("upload_preset", "RoyalAseelFarms");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dlthizgza/upload`, // Replace "your_cloud_name" with your actual Cloudinary cloud name.
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      const data = await response.json();
      // Append the uploaded image URL to the images array
      setImages((prevImages) => [...prevImages, data.secure_url]);
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMsg("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center md:gap-10">
      <Header />
      <div className="w-full max-w-[1200px] px-4">
        {loading ? (
          <div className="text-sm md:text-base text-gray-500 p-2 self-start">
            loading...
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
                    <h3 className="font-bold text-orange-800">Add Product</h3>
                    <form
                      className="flex flex-col gap-2.5 text-sm"
                      onSubmit={handleAddProductSubmit}
                    >
                      <div>
                        <label className="mx-0.5">Product Name*</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
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
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Description</label>
                        <input
                          type="text"
                          value={description}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          onChange={(e) => setDescription(e.target.value)}
                          maxLength="500"
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
                        <label className="mx-0.5">Sex</label>
                        <select
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                          value={sex}
                          onChange={(e) => setSex(e.target.value)}
                        >
                          <option value="">select sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
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
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        />
                        {uploading && <p>Uploading...</p>}
                        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                        {/* Image Preview */}
                        {images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
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
                      <button
                        type="submit"
                        className="mt-4 p-3 px-4 rounded-xl border bg-[#9e6e3b] hover:bg-[#8a6034] text-white"
                      >
                        Add Product
                      </button>
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
                    <h3 className="font-bold text-orange-800">Edit Product</h3>
                    <form
                      className="flex flex-col gap-2.5 text-sm"
                      onSubmit={handleEditProductSubmit}
                    >
                      <div>
                        <label className="mx-0.5">Product*</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          onChange={(e) => {
                            if (e.target.value) {
                              fetchItemData(e.target.value);
                            }
                          }}
                          value={item ? item.id : ""}
                        >
                          <option value="">Select a product</option>
                          {items.map((prod, i) => (
                            <option key={i} value={prod.id}>
                              {prod.name}
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
                        <input
                          type="text"
                          value={description}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          onChange={(e) => setDescription(e.target.value)}
                          maxLength="500"
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
                        <label className="mx-0.5">Sex</label>
                        <select
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                          value={sex}
                          onChange={(e) => setSex(e.target.value)}
                        >
                          <option value="">select sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
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
                          multiple
                          onChange={handleFileChange}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        />
                        {uploading && <p>Uploading...</p>}
                        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                        {/* Image Preview */}
                        {images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2 ">
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
                      <button
                        type="submit"
                        className="mt-4 p-3 px-4 rounded-xl border bg-[#9e6e3b] hover:bg-[#8a6034] text-white"
                      >
                        Update Product
                      </button>
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
                    <h3 className="font-bold text-orange-800">
                      Delete Product
                    </h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleDeleteProductSubmit}
                    >
                      <label>Select Product</label>
                      <select
                        className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        required
                        onChange={(e) => {
                          if (e.target.value && e.target.value !== "0") {
                            fetchItemData(e.target.value);
                          } else {
                            setItem(null);
                          }
                        }}
                        value={item ? item.id : ""}
                      >
                        <option value="0">Select a product</option>
                        {items.map((prod, i) => (
                          <option key={i} value={prod.id}>
                            {prod.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={!item}
                        className="p-3 px-4 mt-2 rounded-xl border bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 disabled:hover:bg-red-500"
                      >
                        Delete Product
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}
