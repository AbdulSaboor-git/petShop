"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import useAuthUser from "@/hooks/authUser";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@/redux/notificationThunk";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

export default function ManageBreedsPage() {
  const { user, userLoading } = useAuthUser();
  const dispatch = useDispatch();
  const router = useRouter();
  // UI state for tabs
  const [focused, setFocused] = useState("add");
  const [addBreed, setAddBreed] = useState(true);
  const [editBreed, setEditBreed] = useState(false);
  const [deleteBreed, setDeleteBreed] = useState(false);

  // Data state
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [name, setName] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [breedLoading, setBreedLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form validation

  const isAddFormValid = useMemo(() => name.trim().length >= 1, [name]);
  const isEditFormValid = useMemo(
    () => selectedBreed !== null && name.trim().length >= 1,
    [selectedBreed, name]
  );

  // Redux notification helper
  const showMessage = (msg, successState) => {
    dispatch(triggerNotification({ msg, success: successState }));
  };

  // Reset form fields
  const resetForm = () => {
    setName("");
    setSelectedBreed(null);
  };

  // Handlers to switch between tabs
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

  // Fetch all breeds (from categories_breeds API)
  const fetchBreeds = useCallback(async () => {
    try {
      const response = await fetch(`/api/categories_breeds`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch breeds.");
      }
      const data = await response.json();
      setBreeds(data.breeds);
    } catch (err) {
      setError(err.message);
      showMessage(err.message, false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single breed's data (for edit and delete forms)
  const fetchBreedData = async (breedId) => {
    if (!breedId || breedId === "null") {
      setSelectedBreed(null);
      resetForm();
      return;
    }
    const existingBreed = breeds.find((b) => b.id === breedId);
    if (existingBreed) {
      setSelectedBreed(existingBreed);
      setName(existingBreed.name);
      return;
    }
    setBreedLoading(true);
    try {
      const response = await fetch(`/api/breed/${breedId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Breed not found");
      }
      const data = await response.json();
      setSelectedBreed(data);
      setName(data.name || "");
    } catch (err) {
      setError(err.message);
      showMessage(err.message, false);
    } finally {
      setBreedLoading(false);
    }
  };

  // Fetch breeds when user is loaded
  useEffect(() => {
    if (!userLoading && user && breeds.length === 0) {
      fetchBreeds();
    }
  }, [userLoading, user, fetchBreeds]);

  // Handler for add breed form submission
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
      const newBreed = await res.json();
      setBreeds([...breeds, newBreed]);
      showMessage(`Breed "${name}" added successfully!`, true);
      resetForm();
      // fetchBreeds();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  // Handler for edit breed form submission
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
      const updatedBreed = await res.json();
      setBreeds(
        breeds.map((b) => (b.id === updatedBreed.id ? updatedBreed : b))
      );
      showMessage(`Breed "${selectedBreed.name}" updated successfully!`, true);
      resetForm();
      // fetchBreeds();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  // Handler for delete breed form submission
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
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to delete breed.");
      }
      setBreeds(breeds.filter((b) => b.id !== selectedBreed.id));
      showMessage(`Breed "${selectedBreed.name}" deleted successfully!`, true);
      resetForm();
      // fetchBreeds();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

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
            <h1 className="font-semibold text-center">Manage Breeds</h1>
            {/* Tab selectors */}
            <div className="flex flex-col md:flex-row gap-6 h-fit">
              <div className="flex flex-row md:flex-col h-fit gap-2 text-sm w-full md:w-fit border-b md:border-b-0 border-[#00000060] pb-6 md:pb-0 md:min-w-[200px]">
                <button
                  onClick={handleAddBreed}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] flex-1 text-center ${
                    focused === "add"
                      ? "bg-[#9e6e3b] text-white"
                      : "hover:bg-[#c29a6e] hover:text-white"
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={handleEditBreed}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] flex-1 text-center ${
                    focused === "edit"
                      ? "bg-[#9e6e3b] text-white"
                      : "hover:bg-[#c29a6e] hover:text-white"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteBreed}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] flex-1 text-center ${
                    focused === "delete"
                      ? "bg-[#9e6e3b] text-white"
                      : "hover:bg-[#c29a6e] hover:text-white"
                  }`}
                >
                  Delete
                </button>
              </div>
              <div className="w-full">
                {addBreed && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleAddBreedSubmit}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-orange-800 text-base">
                          Add Breed
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
                        <label className="mx-0.5">Breed Name</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={1}
                          maxLength={50}
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />
                      </div>
                    </form>
                  </div>
                )}
                {editBreed && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleEditBreedSubmit}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-orange-800 text-base">
                          Edit Breed
                        </h3>
                        <div className="flex gap-2  text-xs">
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
                            Update
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="mx-0.5">Select Breed</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full bg-[#9e6e3b2e]"
                          required
                          onChange={(e) => {
                            if (e.target.value) {
                              fetchBreedData(e.target.value);
                            } else {
                              setSelectedBreed(null);
                            }
                          }}
                          value={selectedBreed ? selectedBreed.id : "null"}
                        >
                          <option value="null">Select a breed</option>
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
                    </form>
                  </div>
                )}
                {deleteBreed && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleDeleteBreedSubmit}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-orange-800 text-base">
                          Delete Breed
                        </h3>
                        <div className="flex gap-2  text-xs">
                          <button
                            type="reset"
                            onClick={resetForm}
                            className="p-1.5 px-4 rounded-xl border bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!selectedBreed || breedLoading}
                            className="p-1.5 px-4 rounded-xl border bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 disabled:hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
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
                          value={selectedBreed ? selectedBreed.id : "null"}
                        >
                          <option value="null">Select a breed</option>
                          {breeds.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
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
