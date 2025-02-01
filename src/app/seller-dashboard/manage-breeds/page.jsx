"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ManageBreedsPage() {
  const [addBreed, setAddBreed] = useState(true);
  const [editBreed, setEditBreed] = useState(false);
  const [deleteBreed, setDeleteBreed] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState(null);

  const [name, setName] = useState("");

  // ADDED: Basic validation – breed name must be at least 1 character.
  const isAddFormValid = name.trim().length >= 1;
  const isEditFormValid = selectedBreed !== null && name.trim().length >= 1;

  const handleAddBreed = () => {
    setAddBreed(true);
    setEditBreed(false);
    setDeleteBreed(false);
    setName("");
    setSelectedBreed(null);
  };

  const handleEditBreed = () => {
    setAddBreed(false);
    setEditBreed(true);
    setDeleteBreed(false);
    setName("");
    setSelectedBreed(null);
  };

  const handleDeleteBreed = () => {
    setAddBreed(false);
    setEditBreed(false);
    setDeleteBreed(true);
    setSelectedBreed(null);
  };

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    fetchBreeds();
  }, []);

  // ADDED: Fetch a single breed's data
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
              Manage Breeds
            </h1>

            {/* ADDED: Responsive container */}
            <div className="flex flex-col md:flex-row gap-6 h-fit">
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-fit border-b md:border-b-0 md:border-r border-gray-400 pb-4 md:pr-6 md:pb-0">
                <button
                  onClick={handleAddBreed}
                  className="p-2 px-4 rounded-xl border border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex-1 text-center"
                >
                  Add Breed
                </button>
                <button
                  onClick={handleEditBreed}
                  className="p-2 px-4 rounded-xl border border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex-1 text-center"
                >
                  Edit Breed
                </button>
                <button
                  onClick={handleDeleteBreed}
                  className="p-2 px-4 rounded-xl border border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex-1 text-center"
                >
                  Delete Breed
                </button>
              </div>
              <div className="w-full">
                {addBreed && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-orange-800">Add Breed</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!isAddFormValid) {
                          alert("Please enter a valid breed name.");
                          return;
                        }
                        // ADDED: Insert your add-breed submission logic here.
                        console.log("Breed Added:", name);
                      }}
                    >
                      <div>
                        <label className="mx-0.5">Breed Name</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-green-500 w-full"
                          required
                          minLength={1}
                          maxLength={50}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 p-2 px-4 rounded-xl border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                      >
                        Add Breed
                      </button>
                    </form>
                  </div>
                )}
                {editBreed && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-orange-800">Edit Breed</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!isEditFormValid) {
                          alert("Select a breed and enter a valid name.");
                          return;
                        }
                        // ADDED: Insert your update-breed submission logic here.
                        console.log("Breed Updated:", selectedBreed.id, name);
                      }}
                    >
                      <div>
                        <label className="mx-0.5">Select Breed</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-green-500 w-full"
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
                          className="p-2 px-4 mt-0.5 rounded-xl border border-green-500 w-full"
                          required
                          value={name}
                          minLength={1}
                          maxLength={50}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 p-2 px-4 rounded-xl border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                      >
                        Update Breed
                      </button>
                    </form>
                  </div>
                )}
                {deleteBreed && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-orange-800">Delete Breed</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!selectedBreed) {
                          alert("Select a breed to delete.");
                          return;
                        }
                        // ADDED: Insert your deletion logic here.
                        console.log("Breed Deleted:", selectedBreed.id);
                      }}
                    >
                      <div>
                        <label className="mx-0.5">Select Breed</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-green-500 w-full"
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
                        className="mt-4 p-2 px-4 rounded-xl border border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-80"
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
