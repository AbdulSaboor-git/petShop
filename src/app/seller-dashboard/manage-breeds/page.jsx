"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import useAuthUser from "@/hooks/authUser";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@/redux/notificationThunk";
import Loader from "@/components/loader";

export default function ManageBreedsPage() {
  const { user, userLoading, logout } = useAuthUser();

  const [focused, setFocused] = useState("add");
  const [addBreed, setAddBreed] = useState(true);
  const [editBreed, setEditBreed] = useState(false);
  const [deleteBreed, setDeleteBreed] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState(null);

  const [name, setName] = useState("");

  // Basic form validation: breed name must be at least 1 character.
  const isAddFormValid = name.trim().length >= 1;
  const isEditFormValid = selectedBreed !== null && name.trim().length >= 1;

  const dispatch = useDispatch();
  const showMessage = (msg, state) => {
    dispatch(
      triggerNotification({
        msg: msg,
        success: state,
      })
    );
  };

  function resetForm() {
    setName("");
    setSelectedBreed(null);
  }
  const handleAddBreed = () => {
    setAddBreed(true);
    setEditBreed(false);
    setDeleteBreed(false);
    resetForm();
    setFocused("add");
  };

  const handleEditBreed = () => {
    setAddBreed(false);
    setEditBreed(true);
    setDeleteBreed(false);
    resetForm();
    setFocused("edit");
  };

  const handleDeleteBreed = () => {
    setAddBreed(false);
    setEditBreed(false);
    setDeleteBreed(true);
    resetForm();
    setFocused("delete");
  };

  const fetchBreeds = async () => {
    try {
      const response = await fetch(`/api/categories_breeds`);
      if (!response.ok) {
        throw new Error("Failed to fetch breeds.");
      }
      const data = await response.json();
      setBreeds(data.breeds);
    } catch (err) {
      setError(err.message);
      showMessage(err.message, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && user) {
      fetchBreeds();
    }
  }, [userLoading, user]);

  // Fetch a single breed's data
  const fetchBreedData = async (breedId) => {
    setSelectedBreed(null);
    try {
      const response = await fetch(`/api/breed/${breedId}`);
      if (!response.ok) {
        throw new Error("Breed not found");
      }
      const data = await response.json();
      setSelectedBreed(data);
      setName(data.name || "");
    } catch (err) {
      setError(err.message);
      showMessage(err.message, false);
    }
  };

  const handleAddBreedSubmit = async (e) => {
    e.preventDefault();
    if (!isAddFormValid) {
      showMessage("Please enter a valid breed name.", false);
      return;
    }
    try {
      const res = await fetch("/api/breed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to add breed.");
      }
      showMessage(`Breed "${name}" added successfully!`, true);
      resetForm();
      fetchBreeds();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  // Handler for edit category form submission.
  const handleEditBreedSubmit = async (e) => {
    e.preventDefault();
    if (!isEditFormValid) {
      showMessage("Select a breed and enter a valid name.", false);
      return;
    }
    try {
      const res = await fetch(`/api/breed/${selectedBreed.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to update breed.");
      }
      showMessage(`Breed "${selectedBreed.name}" updated successfully!`, true);
      resetForm();

      fetchBreeds();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  // Handler for delete category form submission.
  const handleDeleteBreedSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBreed) {
      showMessage("Select a breed to delete.", false);
      return;
    }
    try {
      const res = await fetch(`/api/breed/${selectedBreed.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete breed.");
      }
      showMessage(`Breed "${name}" deleted successfully!`, true);
      resetForm();
      fetchBreeds();
    } catch (err) {
      showMessage(err.message, false);
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
        {!userLoading && !user ? (
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
            <h1 className="font-semibold text-center">Manage Breeds</h1>
            {/* Responsive container for side-by-side (desktop) or stacked (mobile) layout */}
            <div className="flex flex-col md:flex-row gap-6 h-fit">
              <div className="flex flex-row md:flex-col h-fit gap-2 text-sm w-full md:w-fit border-b md:border-b-0 border-[#00000060] pb-6 md:pb-0 md:min-w-[200px]">
                <button
                  onClick={handleAddBreed}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b]  hover:text-white flex-1 text-center ${
                    focused === "add"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e]"
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={handleEditBreed}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b]  hover:text-white  flex-1 text-center ${
                    focused === "edit"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e] "
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteBreed}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b]  hover:text-white  flex-1 text-center ${
                    focused === "delete"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e]"
                  }`}
                >
                  Delete
                </button>
              </div>
              <div className="w-full">
                {addBreed && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <h3 className="font-bold text-orange-800">Add Breed</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleAddBreedSubmit}
                    >
                      <div>
                        <label className="mx-0.5">Breed Name</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={1}
                          maxLength={50}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          type="submit"
                          className="p-3 px-4 rounded-xl border bg-[#9e6e3b] hover:bg-[#8a6034] text-white"
                        >
                          Add Breed
                        </button>
                        <button
                          type="reset"
                          onClick={resetForm}
                          className=" p-3 px-4 rounded-xl border bg-red-500 hover:bg-red-600 text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {editBreed && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <h3 className="font-bold text-orange-800">Edit Breed</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleEditBreedSubmit}
                    >
                      <div>
                        <label className="mx-0.5">Select Breed</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          onChange={(e) => {
                            if (e.target.value) {
                              fetchBreedData(e.target.value);
                            } else {
                              setSelectedBreed(null);
                            }
                          }}
                          value={selectedBreed ? selectedBreed.id : ""}
                        >
                          <option value="">Select a breed</option>
                          {breeds.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Breed Name</label>
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
                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          type="submit"
                          className="p-3 px-4 rounded-xl border bg-[#9e6e3b] hover:bg-[#8a6034] text-white"
                        >
                          Update Category
                        </button>
                        <button
                          type="reset"
                          onClick={resetForm}
                          className=" p-3 px-4 rounded-xl border bg-red-500 hover:bg-red-600 text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {deleteBreed && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <h3 className="font-bold text-orange-800">Delete Breed</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleDeleteBreedSubmit}
                    >
                      <div>
                        <label className="mx-0.5">Select Breed</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          onChange={(e) => {
                            if (e.target.value) {
                              fetchBreedData(e.target.value);
                            } else {
                              setSelectedBreed(null);
                            }
                          }}
                          value={selectedBreed ? selectedBreed.id : ""}
                        >
                          <option value="">Select a breed</option>
                          {breeds.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          type="submit"
                          disabled={!selectedBreed}
                          className="p-3 px-4 mt-2 rounded-xl border bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 disabled:hover:bg-red-500"
                        >
                          Delete Category
                        </button>
                        <button
                          type="reset"
                          onClick={resetForm}
                          className=" p-3 px-4 rounded-xl border bg-red-500 hover:bg-red-600 text-white"
                        >
                          Cancel
                        </button>
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
