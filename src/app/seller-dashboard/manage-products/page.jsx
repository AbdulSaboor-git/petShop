"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ManageProductsPage() {
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
  const [gender, setGender] = useState(""); // Gender state
  const [nature, setNature] = useState(""); // Nature state
  const [weight, setWeight] = useState(""); // Weight state
  const [height, setHeight] = useState(""); // Height state
  const [age, setAge] = useState(""); // Age state
  const [availability, setAvailability] = useState(""); // Availability state
  const [images, setImages] = useState([]); // Images state

  // ADDED: Simple form validation state for add/edit forms
  const isAddFormValid =
    name.trim().length >= 3 && // product name must be at least 3 characters
    price !== "" &&
    Number(price) > 0 &&
    categoryId !== "";
  const isEditFormValid =
    item !== null &&
    name.trim().length >= 3 &&
    price !== "" &&
    Number(price) > 0 &&
    categoryId !== "";

  const handleAddProduct = () => {
    setAddProduct(true);
    setEditProduct(false);
    setDeleteProduct(false);
  };

  const handleEditProduct = () => {
    setAddProduct(false);
    setEditProduct(true);
    setDeleteProduct(false);
    setName("");
    setPrice("");
    setDiscountedPrice("");
    setDescription("");
    setCategoryId("");
    setBreedId("");
    setGender("");
    setNature("");
    setWeight("");
    setHeight("");
    setAge("");
    setAvailability("");
    setImages([]);
    setItem(null); // ADDED: reset selected item for edit
  };

  const handleDeleteProduct = () => {
    setAddProduct(false);
    setEditProduct(false);
    setDeleteProduct(true);
    setItem(null); // ADDED: reset selected item for delete
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/homeItems`);
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
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const fetchItemData = async (itemId) => {
    try {
      const response = await fetch(`/api/item/${itemId}`);
      if (!response.ok) {
        throw new Error("Item not found");
      }
      const data = await response.json();
      setItem(data);
      setName(data.name || "");
      setPrice(data.price || "");
      setDiscountedPrice(data.discountedPrice || "");
      setDescription(data.description || "");
      setCategoryId(data.categoryId || "");
      setBreedId(data.breedId || "");
      setGender(data.gender || "");
      setNature(data.nature || "");
      setWeight(data.weight || "");
      setHeight(data.height || "");
      setAge(data.age || "");
      setAvailability(data.availability || "");
      setImages(data.images || []);
    } catch (err) {
      setItemError(err.message);
    } finally {
      setItemLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center md:gap-10">
      <Header />
      <div className="w-full max-w-[1200px] px-4">
        {loading ? (
          <div>loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:3xl font-semibold text-center">
              Seller Dashboard
            </h1>
            <h1 className="text-xl font-semibold text-center">
              Manage Products
            </h1>

            {/* ADDED: flex-col for mobile, flex-row for medium screens */}
            <div className="flex flex-col md:flex-row gap-6 h-fit">
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-fit border-b md:border-b-0 md:border-r border-[#00000060] pb-4 md:pr-6 md:pb-0">
                <button
                  onClick={handleAddProduct}
                  className="p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] hover:bg-[#9e6e3b] hover:text-white flex-1 text-center"
                >
                  Add Product
                </button>
                <button
                  onClick={handleEditProduct}
                  className="p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] hover:bg-[#9e6e3b] hover:text-white flex-1 text-center"
                >
                  Edit Product
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] hover:bg-[#9e6e3b] hover:text-white flex-1 text-center"
                >
                  Delete Product
                </button>
              </div>
              <div className="w-full">
                {addProduct && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-orange-800">Add Product</h3>
                    <form
                      className="flex flex-col gap-2.5 text-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        // ADDED: Validate the form before submission
                        if (!isAddFormValid) {
                          alert(
                            "Please fill out all required fields with valid values."
                          );
                          return;
                        }
                        // ADDED: Insert form submission logic for adding product here.
                      }}
                    >
                      <div>
                        <label className="mx-0.5">Product Name</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={3} // ADDED: minimum length constraint
                          maxLength={100} // ADDED: maximum length constraint
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Price</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          onChange={(e) => setPrice(e.target.value)}
                          min="0" // ADDED: price must be positive
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Discounted Price</label>
                        <input
                          type="number"
                          onChange={(e) => setDiscountedPrice(e.target.value)}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Description</label>
                        <input
                          type="text"
                          onChange={(e) => setDescription(e.target.value)}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          maxLength="500"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Category</label>
                        <select
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
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
                        <label className="mx-0.5">Breed (Optional)</label>
                        <select
                          onChange={(e) => setBreedId(e.target.value)}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
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
                          onChange={(e) => setGender(e.target.value)}
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                        >
                          <option value="">select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Nature</label>
                        <input
                          onChange={(e) => setNature(e.target.value)}
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          maxLength="200" // ADDED: limit nature text
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Weight (g)</label>
                        <input
                          onChange={(e) => setWeight(e.target.value)}
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          min="0"
                          step="0.1" // ADDED: allow decimal weights
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Height (cm)</label>
                        <input
                          onChange={(e) => setHeight(e.target.value)}
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Age (years)</label>
                        <input
                          onChange={(e) => setAge(e.target.value)}
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Availability</label>
                        <select
                          onChange={(e) => setAvailability(e.target.value)}
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Images</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*" // ADDED: accept only images
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] hover:bg-[#9e6e3b] hover:text-white"
                      >
                        Add Product
                      </button>
                    </form>
                  </div>
                )}
                {editProduct && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-orange-800">Edit Product</h3>
                    <form
                      className="flex flex-col gap-2.5 text-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        // ADDED: Validate the form before updating
                        if (!isEditFormValid) {
                          alert(
                            "Please select a product and fill out all required fields with valid values."
                          );
                          return;
                        }
                        // ADDED: Insert form submission logic for updating product here.
                      }}
                    >
                      <div>
                        <label className="mx-0.5">Product</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          onChange={(e) => {
                            // ADDED: Only fetch if a valid product id is selected
                            if (e.target.value) {
                              fetchItemData(e.target.value);
                            }
                          }}
                        >
                          <option value="">Select a product</option>
                          {items.map((item, i) => (
                            <option key={i} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Product Name</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          value={name}
                          minLength={3} // ADDED: minimum length constraint
                          maxLength={100} // ADDED: maximum length constraint
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Price</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          min="0" // ADDED: price must be positive
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Discounted Price</label>
                        <input
                          type="number"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={discountedPrice}
                          onChange={(e) => setDiscountedPrice(e.target.value)}
                          min="0"
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
                        <label className="mx-0.5">Category</label>
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
                        <label className="mx-0.5">Breed (Optional)</label>
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
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="">select gender</option>
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
                        <label className="mx-0.5">Images</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*" // ADDED: accept only image files
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] hover:bg-[#9e6e3b] hover:text-white"
                      >
                        Update Product
                      </button>
                    </form>
                  </div>
                )}
                {deleteProduct && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-orange-800">
                      Delete Product
                    </h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        // ADDED: Check if a valid product is selected before deletion
                        if (!item) {
                          alert("Please select a product to delete.");
                          return;
                        }
                        // ADDED: Insert deletion logic here.
                      }}
                    >
                      <label>Select Product</label>
                      <select
                        className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        required
                        onChange={(e) => {
                          // ADDED: Only fetch item data if a valid product is selected
                          if (e.target.value && e.target.value !== "0") {
                            fetchItemData(e.target.value);
                          } else {
                            setItem(null);
                          }
                        }}
                      >
                        <option value="0">Select a product</option>
                        {items.map((item, i) => (
                          <option key={i} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={!item} // ADDED: disable delete if no product is selected
                        className="p-2 px-4 rounded-xl border border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-80"
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
