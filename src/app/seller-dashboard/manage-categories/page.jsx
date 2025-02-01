"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ManageCategoriesPage() {
  const [addCategory, setAddCategory] = useState(true);
  const [editCategory, setEditCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [name, setName] = useState("");

  // ADDED: Basic validation – category name must be at least 1 character.
  const isAddFormValid = name.trim().length >= 1;
  const isEditFormValid = selectedCategory !== null && name.trim().length >= 1;

  const handleAddCategory = () => {
    setAddCategory(true);
    setEditCategory(false);
    setDeleteCategory(false);
    setName("");
    setSelectedCategory(null);
  };

  const handleEditCategory = () => {
    setAddCategory(false);
    setEditCategory(true);
    setDeleteCategory(false);
    setName("");
    setSelectedCategory(null);
  };

  const handleDeleteCategory = () => {
    setAddCategory(false);
    setEditCategory(false);
    setDeleteCategory(true);
    setSelectedCategory(null);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories_breeds`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ADDED: Fetch a single category's data
  const fetchCategoryData = async (categoryId) => {
    try {
      const response = await fetch(`/api/category/${categoryId}`);
      if (!response.ok) {
        throw new Error("Category not found");
      }
      const data = await response.json();
      setSelectedCategory(data);
      setName(data.name || "");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center md:gap-10">
      <Header />
      <div className="w-full max-w-[1200px] px-4">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-center">
              Manage Categories
            </h1>

            {/* ADDED: Responsive container for side-by-side (desktop) or stacked (mobile) layout */}
            <div className="flex flex-col md:flex-row gap-6 h-fit">
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-fit border-b md:border-b-0 md:border-r border-gray-400 pb-4 md:pr-6 md:pb-0">
                <button
                  onClick={handleAddCategory}
                  className="p-2 px-4 rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex-1 text-center"
                >
                  Add Category
                </button>
                <button
                  onClick={handleEditCategory}
                  className="p-2 px-4 rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex-1 text-center"
                >
                  Edit Category
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className="p-2 px-4 rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex-1 text-center"
                >
                  Delete Category
                </button>
              </div>
              <div className="w-full">
                {addCategory && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-orange-800">Add Category</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!isAddFormValid) {
                          alert("Please enter a valid category name.");
                          return;
                        }
                        // ADDED: Insert your add-category submission logic here.
                        console.log("Category Added:", name);
                      }}
                    >
                      <div>
                        <label className="mx-0.5">Category Name</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-blue-500 w-full"
                          required
                          minLength={1}
                          maxLength={50}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 p-2 px-4 rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                      >
                        Add Category
                      </button>
                    </form>
                  </div>
                )}
                {editCategory && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-orange-800">Edit Category</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!isEditFormValid) {
                          alert("Select a category and enter a valid name.");
                          return;
                        }
                        // ADDED: Insert your update-category submission logic here.
                        console.log(
                          "Category Updated:",
                          selectedCategory.id,
                          name
                        );
                      }}
                    >
                      <div>
                        <label className="mx-0.5">Select Category</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-blue-500 w-full"
                          required
                          onChange={(e) => {
                            if (e.target.value) {
                              fetchCategoryData(e.target.value);
                            } else {
                              setSelectedCategory(null);
                            }
                          }}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Category Name</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-blue-500 w-full"
                          required
                          value={name}
                          minLength={1}
                          maxLength={50}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 p-2 px-4 rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                      >
                        Update Category
                      </button>
                    </form>
                  </div>
                )}
                {deleteCategory && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-orange-800">
                      Delete Category
                    </h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!selectedCategory) {
                          alert("Select a category to delete.");
                          return;
                        }
                        // ADDED: Insert your deletion logic here.
                        console.log("Category Deleted:", selectedCategory.id);
                      }}
                    >
                      <div>
                        <label className="mx-0.5">Select Category</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-blue-500 w-full"
                          required
                          onChange={(e) => {
                            if (e.target.value) {
                              fetchCategoryData(e.target.value);
                            } else {
                              setSelectedCategory(null);
                            }
                          }}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={!selectedCategory}
                        className="mt-4 p-2 px-4 rounded-xl border border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-80"
                      >
                        Delete Category
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
