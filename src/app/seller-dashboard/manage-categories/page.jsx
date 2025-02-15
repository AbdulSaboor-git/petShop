"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import useAuthUser from "@/hooks/authUser";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@/redux/notificationThunk";

export default function ManageCategoriesPage() {
  const { user, userLoading, logout } = useAuthUser();

  const [focused, setFocused] = useState("add");
  const [addCategory, setAddCategory] = useState(true);
  const [editCategory, setEditCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [name, setName] = useState("");

  // Basic form validation: category name must be at least 1 character.
  const isAddFormValid = name.trim().length >= 1;
  const isEditFormValid = selectedCategory !== null && name.trim().length >= 1;

  const dispatch = useDispatch();
  const showMessage = (msg, state) => {
    dispatch(
      triggerNotification({
        msg: msg,
        success: state,
      })
    );
  };

  // Helper function to fetch categories (and breeds if needed) from API.
  const fetchCategoriesData = async () => {
    try {
      const response = await fetch(`/api/categories_breeds`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories.");
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      setError(err.message);
      showMessage(err.message, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  // Fetch a single category's data (for editing/deleting)
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
      showMessage(err.message, false);
    }
  };

  const handleAddCategory = () => {
    setAddCategory(true);
    setEditCategory(false);
    setDeleteCategory(false);
    setName("");
    setSelectedCategory(null);
    setFocused("add");
  };

  const handleEditCategory = () => {
    setAddCategory(false);
    setEditCategory(true);
    setDeleteCategory(false);
    setName("");
    setSelectedCategory(null);
    setFocused("edit");
  };

  const handleDeleteCategory = () => {
    setAddCategory(false);
    setEditCategory(false);
    setDeleteCategory(true);
    setSelectedCategory(null);
    setFocused("delete");
  };

  // Handler for add category form submission.
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    if (!isAddFormValid) {
      showMessage("Please enter a valid category name.", false);
      return;
    }
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to add category.");
      }
      showMessage(`Category "${name}" added successfully!`, true);
      setName("");
      fetchCategoriesData();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  // Handler for edit category form submission.
  const handleEditCategorySubmit = async (e) => {
    e.preventDefault();
    if (!isEditFormValid) {
      showMessage("Select a category and enter a valid name.", false);
      return;
    }
    try {
      const res = await fetch(`/api/category/${selectedCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to update category.");
      }
      showMessage(
        `Category "${selectedCategory.name}" updated successfully!`,
        true
      );
      setName("");
      setSelectedCategory(null);
      fetchCategoriesData();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  // Handler for delete category form submission.
  const handleDeleteCategorySubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      showMessage("Select a category to delete.", false);
      return;
    }
    try {
      const res = await fetch(`/api/category/${selectedCategory.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete category.");
      }
      showMessage(`Category "${name}" deleted successfully!`, true);
      setSelectedCategory(null);
      fetchCategoriesData();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 md:gap-10">
      <Header />
      <div className="w-full max-w-[1200px] px-4">
        {!userLoading && !user ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            Unauthorized Access.
            {showMessage("Unauthorized Access", false)}
          </div>
        ) : loading ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            loading...
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl md:text-2xl font-semibold text-center">
              Seller Dashboard
            </h1>
            <h1 className="font-semibold text-center">Manage Categories</h1>

            {/* Navigation buttons */}
            <div className="flex flex-col md:flex-row gap-6 h-fit">
              <div className="flex flex-row md:flex-col h-fit gap-2 text-sm w-full md:w-fit border-b md:border-b-0 border-[#00000060] pb-6 md:pb-0 md:min-w-[200px]">
                <button
                  onClick={handleAddCategory}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] hover:text-white flex-1 text-center ${
                    focused === "add"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e]"
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={handleEditCategory}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] hover:text-white flex-1 text-center ${
                    focused === "edit"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e]"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] hover:text-white flex-1 text-center ${
                    focused === "delete"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e]"
                  }`}
                >
                  Delete
                </button>
              </div>
              <div className="w-full">
                {addCategory && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <h3 className="font-bold text-orange-800">Add Category</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleAddCategorySubmit}
                    >
                      <div>
                        <label className="mx-0.5">Category Name</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={1}
                          maxLength={50}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 p-3 px-4 rounded-xl border bg-[#9e6e3b] hover:bg-[#8a6034] text-white"
                      >
                        Add Category
                      </button>
                    </form>
                  </div>
                )}
                {editCategory && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <h3 className="font-bold text-orange-800">Edit Category</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleEditCategorySubmit}
                    >
                      <div>
                        <label className="mx-0.5">Select Category</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          onChange={(e) => {
                            if (e.target.value) {
                              fetchCategoryData(e.target.value);
                            } else {
                              setSelectedCategory(null);
                            }
                          }}
                          value={selectedCategory ? selectedCategory.id : ""}
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
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          value={name}
                          minLength={1}
                          maxLength={50}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 p-3 px-4 rounded-xl border bg-[#9e6e3b] hover:bg-[#8a6034] text-white"
                      >
                        Update Category
                      </button>
                    </form>
                  </div>
                )}
                {deleteCategory && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <h3 className="font-bold text-orange-800">
                      Delete Category
                    </h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleDeleteCategorySubmit}
                    >
                      <div>
                        <label className="mx-0.5">Select Category</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          onChange={(e) => {
                            if (e.target.value) {
                              fetchCategoryData(e.target.value);
                            } else {
                              setSelectedCategory(null);
                            }
                          }}
                          value={selectedCategory ? selectedCategory.id : ""}
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
                        className="p-3 px-4 mt-2 rounded-xl border bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 disabled:hover:bg-red-500"
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
