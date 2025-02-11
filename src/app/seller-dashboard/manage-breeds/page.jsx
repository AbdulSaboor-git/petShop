"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import useAuthUser from "@/hooks/authUser";

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

  const handleAddBreed = () => {
    setAddBreed(true);
    setEditBreed(false);
    setDeleteBreed(false);
    setName("");
    setSelectedBreed(null);
    setFocused("add");
  };

  const handleEditBreed = () => {
    setAddBreed(false);
    setEditBreed(true);
    setDeleteBreed(false);
    setName("");
    setSelectedBreed(null);
    setFocused("edit");
  };

  const handleDeleteBreed = () => {
    setAddBreed(false);
    setEditBreed(false);
    setDeleteBreed(true);
    setSelectedBreed(null);
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
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  // Fetch a single breed's data
  const fetchBreedData = async (breedId) => {
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
      alert(err.message);
    }
  };

  const handleAddBreedSubmit = async (e) => {
    e.preventDefault();
    if (!isAddFormValid) {
      alert("Please enter a valid breed name.");
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
      alert(`Breed "${name}" added successfully!`);
      setName("");
      fetchBreeds();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler for edit category form submission.
  const handleEditBreedSubmit = async (e) => {
    e.preventDefault();
    if (!isEditFormValid) {
      alert("Select a breed and enter a valid name.");
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
      alert(`Breed "${selectedBreed.name}" updated successfully!`);
      setName("");
      setSelectedBreed(null);
      fetchBreeds();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler for delete category form submission.
  const handleDeleteBreedSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBreed) {
      alert("Select a breed to delete.");
      return;
    }
    try {
      const res = await fetch(`/api/breed/${selectedBreed.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete breed.");
      }
      alert(`Breed "${name}" deleted successfully!`);
      setSelectedBreed(null);
      fetchBreeds();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 md:gap-10">
      <Header />
      <div className="w-full max-w-[1200px] px-4">
        {loading ? (
          <div className="text-sm md:text-base text-gray-500 p-2 self-start">
            loading...
          </div>
        ) : !user ? (
          <div className="text-sm md:text-base text-gray-500 p-2 self-start">
            Login with a seller account to proceed.
          </div>
        ) : user?.role !== "SELLER" ? (
          <div className="text-sm md:text-base text-gray-500 p-2 self-start">
            Access denied! Login with a seller account to proceed.
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
                      <button
                        type="submit"
                        className="mt-4 p-3 px-4 rounded-xl border bg-[#9e6e3b] hover:bg-[#8a6034] text-white"
                      >
                        Add Breed
                      </button>
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
                      <button
                        type="submit"
                        className="mt-4 p-3 px-4 rounded-xl border bg-[#9e6e3b] hover:bg-[#8a6034] text-white"
                      >
                        Update Breed
                      </button>
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
                        >
                          <option value="">Select a breed</option>
                          {breeds.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={!selectedBreed}
                        className="p-3 px-4 mt-2 rounded-xl border bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 disabled:hover:bg-red-500"
                      >
                        Delete Breed
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
