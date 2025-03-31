"use client";
import React, { useCallback, useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import useAuthUser from "@/hooks/authUser";
import { showMessage } from "@/hooks/useMessage";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

export default function ManageCategoriesPage() {
  const { user, userLoading } = useAuthUser();
  const router = useRouter();
  // Tab state
  const [focused, setFocused] = useState("add");
  const [addCategory, setAddCategory] = useState(true);
  const [editCategory, setEditCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);

  // Data states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState(null);

  // Basic form validations
  const isAddFormValid = name.trim().length >= 1;
  const isEditFormValid = selectedCategory !== null && name.trim().length >= 1;

  // Helper: Reset form fields
  const resetForm = () => {
    setName("");
    setSelectedCategory(null);
  };

  // Fetch all categories (from the categories_breeds API)
  const fetchCategoriesData = useCallback(async () => {
    try {
      const response = await fetch(`/api/category`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch categories.");
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
      showMessage(err.message, false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single category details for editing/deleting
  const fetchCategoryData = async (categoryId) => {
    if (categoryId === "null") {
      setSelectedCategory(null);
      resetForm();
      return;
    }
    const existingCategory = categories.find((cat) => cat.id === categoryId);
    if (existingCategory) {
      setSelectedCategory(existingCategory);
      setName(existingCategory.name);
      return;
    }
    setCategoryLoading(true);
    try {
      const response = await fetch(`/api/category/${categoryId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Category not found");
      }
      const data = await response.json();
      setSelectedCategory(data);
      setName(data.name || "");
    } catch (err) {
      console.error("Error fetching category data:", err);
      setError(err.message);
      showMessage(err.message, false);
    } finally {
      setCategoryLoading(false);
    }
  };

  // Switch to Add mode
  const handleAddCategory = () => {
    setAddCategory(true);
    setEditCategory(false);
    setDeleteCategory(false);
    resetForm();
    setFocused("add");
  };

  // Switch to Edit mode
  const handleEditCategory = () => {
    setAddCategory(false);
    setEditCategory(true);
    setDeleteCategory(false);
    resetForm();
    setFocused("edit");
  };

  // Switch to Delete mode
  const handleDeleteCategory = () => {
    setAddCategory(false);
    setEditCategory(false);
    setDeleteCategory(true);
    resetForm();
    setFocused("delete");
  };

  // Handler for adding a category
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
      const newCategory = await res.json();
      setCategories([...categories, newCategory]);

      showMessage(`Category "${name}" added successfully!`, true);
      resetForm();
      // fetchCategoriesData();
    } catch (err) {
      console.error("Error adding category:", err);
      showMessage(err.message, false);
    }
  };

  // Handler for editing a category
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
      const updatedCategory = await res.json();
      setCategories(
        categories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );
      showMessage(
        `Category "${selectedCategory.name}" updated successfully!`,
        true
      );
      resetForm();
      // fetchCategoriesData();
    } catch (err) {
      console.error("Error updating category:", err);
      showMessage(err.message, false);
    }
  };

  // Handler for deleting a category
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
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to delete category.");
      }
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
      showMessage(`Category "${name}" deleted successfully!`, true);
      resetForm();
      // fetchCategoriesData();
    } catch (err) {
      console.error("Error deleting category:", err);
      showMessage(err.message, false);
    }
  };

  // Fetch categories when user is loaded
  useEffect(() => {
    if (!userLoading && user && categories.length === 0) {
      fetchCategoriesData();
    }
  }, [userLoading, user, fetchCategoriesData]);

  // If user is not authorized, show a message.
  useEffect(() => {
    if (!userLoading) {
      if (!user || user.role !== "ADMIN") {
        showMessage("Unauthorized Access", false);
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      }
    }
  }, [user, userLoading, router]);

  return (
    <div className="flex flex-col items-center gap-5 md:gap-10">
      <Header />
      <div className="w-full max-w-[1200px] px-4">
        {!userLoading && !user ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            Unauthorized Access.
          </div>
        ) : userLoading ? (
          <div className="h-screen">
            <Loader />
          </div>
        ) : user.role != "ADMIN" ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            Unauthorized Access.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl md:text-2xl font-semibold text-center">
              Seller Dashboard
            </h1>
            <h1 className="font-semibold text-center">Manage Categories</h1>
            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row gap-6 h-fit">
              <div className="flex flex-row md:flex-col h-fit gap-2 text-sm w-full md:w-fit border-b md:border-b-0 border-[#00000060] pb-6 md:pb-0 md:min-w-[200px]">
                <button
                  onClick={handleAddCategory}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] flex-1 text-center ${
                    focused === "add"
                      ? "bg-[#9e6e3b] text-white  hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e] hover:text-white"
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={handleEditCategory}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] flex-1 text-center ${
                    focused === "edit"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e] hover:text-white"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] flex-1 text-center ${
                    focused === "delete"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e] hover:text-white"
                  }`}
                >
                  Delete
                </button>
              </div>
              <div className="w-full">
                {addCategory && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleAddCategorySubmit}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-orange-800 text-base">
                          Add Category
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
                            className="p-1.5 px-4 rounded-xl border bg-green-500 hover:bg-green-600 text-white"
                          >
                            Add
                          </button>
                        </div>
                      </div>
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
                    </form>
                  </div>
                )}
                {editCategory && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleEditCategorySubmit}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-orange-800 text-base">
                          Edit Category
                        </h3>
                        <div className="flex gap-2 text-xs">
                          <button
                            type="reset"
                            onClick={resetForm}
                            disabled={!selectedCategory || categoryLoading}
                            className=" p-1.5 px-4 rounded-xl border bg-gray-400 hover:bg-gray-500 text-white disabled:hover:bg-gray-400 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!selectedCategory || categoryLoading}
                            className="p-1.5 px-4 rounded-xl border bg-green-500 hover:bg-green-600 text-white disabled:opacity-60  disabled:hover:bg-green-500"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="mx-0.5">Select Category</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full bg-[#9e6e3b2e]"
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
                          <option value="null">Select a category</option>
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
                    </form>
                  </div>
                )}
                {deleteCategory && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleDeleteCategorySubmit}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-orange-800 text-base">
                          Delete Category
                        </h3>
                        <div className="flex gap-2 text-xs">
                          <button
                            type="reset"
                            onClick={resetForm}
                            disabled={!selectedCategory || categoryLoading}
                            className="p-1.5 px-4 rounded-xl border bg-gray-400 hover:bg-gray-500 text-white disabled:hover:bg-gray-400 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!selectedCategory || categoryLoading}
                            className="p-1.5 px-4 rounded-xl border bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 disabled:hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
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
                          <option value="null">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
