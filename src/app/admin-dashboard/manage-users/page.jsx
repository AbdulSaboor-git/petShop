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

export default function ManageUsersPage() {
  const { user, userLoading, logout } = useAuthUser();

  const [focused, setFocused] = useState("add");
  const [addUser, setAddUser] = useState(true);
  const [editUser, setEditUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserLoading, setSelectedUserLoading] = useState(true);
  const [userLoadingError, setUserLoadingError] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [uploadingErrorMsg, setUploadingErrorMsg] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedPage", "");
    }
  }, []);

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
      let idParam = params.get("id");
      let ID = parseInt(idParam, 10);

      if (functionParam && functionParam != "undefined") {
        if (functionParam == "add") {
          handleAddUser();
        } else if (functionParam == "edit") {
          handleEditUser();
        } else {
          handleDeleteUser();
        }
      }
      if (ID && ID != "undefined") {
        fetchUserData(ID);
      }
    }
  }, []);

  // Form validation states.
  const isAddFormValid =
    firstName.trim().length >= 3 &&
    phoneNo.trim().length === 13 &&
    password.length >= 3;
  const isEditFormValid =
    firstName.trim().length >= 3 &&
    phoneNo.trim().length === 13 &&
    password.length >= 3;

  function resetForm() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNo("");
    setPassword("");
    setProfilePicture("");
    setRole("");
    setIsActive(true);
    setSelectedUser(null);
    setImageSrc(null);
    setShowCropper(false);
  }

  // Handlers to switch forms.
  const handleAddUser = () => {
    setAddUser(true);
    setEditUser(false);
    setDeleteUser(false);
    setFocused("add");
    // Reset form fields.
    resetForm();
  };

  const handleEditUser = () => {
    setAddUser(false);
    setEditUser(true);
    setDeleteUser(false);
    setFocused("edit");
    // Reset form fields.
    resetForm();
  };

  const handleDeleteUser = () => {
    setAddUser(false);
    setEditUser(false);
    setDeleteUser(true);
    setFocused("delete");
    setSelectedUser(null);
  };

  // Fetch all products, categories, and breeds.
  const fetchAllUsersData = async () => {
    try {
      const response = await fetch(`/api/user`);
      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }
      const data = await response.json();

      setUsers(data.users);
    } catch (err) {
      setError(err.message);
      showMessage(err.message, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role != "ADMIN") return;
    fetchAllUsersData();
  }, [user]);

  const payload = {
    firstName: firstName.trim(),
    lastName:
      lastName && lastName.toString().trim() != "" ? lastName.trim() : null,
    email: email.trim(),
    phoneNo: phoneNo.trim(),
    password: password,
    profilePicture: profilePicture,
    role: role && role.toString().trim() !== "" ? role.trim() : null,
    isActive: isActive,
  };

  // Fetch a single product's data using the user API.
  const fetchUserData = async (userId) => {
    setSelectedUserLoading(true);
    try {
      const response = await fetch(`/api/user?userId=${userId}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setSelectedUser(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setPhoneNo(data.phoneNo || "");
      setPassword(data.password || "");
      setRole(data.role || "");
      setIsActive(data.isActive);
      setProfilePicture(data.profilePicture || "");
    } catch (err) {
      setUserLoadingError(err.message);
      showMessage(err.message, false);
    } finally {
      setSelectedUserLoading(false);
    }
  };

  // Handler for adding a product.
  // Handler for adding a product.
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!isAddFormValid) {
      showMessage(
        "Please fill out all required fields with valid values.",
        false
      );
      return;
    }
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to add user.");
      }
      resetForm();
      showMessage(`User "${firstName}" added successfully!`, true);
      fetchAllUsersData();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!isEditFormValid || !selectedUser) {
      showMessage(
        "Please select a user and fill out all required fields with valid values.",
        false
      );
      return;
    }
    try {
      const res = await fetch(`/api/user?userId=${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to update user.");
      }
      showMessage(
        `User "${selectedUser.firstName}" updated successfully!`,
        true
      );
      resetForm();
      fetchAllUsersData();
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  // Handler for deleting a user.
  const handleDeleteUserSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      showMessage("Please select a user to delete.", false);
      return;
    }
    try {
      const res = await fetch(`/api/user?userId=${selectedUser.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to delete user.");
      }
      showMessage(
        `User "${selectedUser.firstName}" deleted successfully!`,
        true
      );
      fetchAllUsersData();
      setSelectedUser(null);
    } catch (err) {
      showMessage(err.message, false);
    }
  };

  function removeImage() {
    setProfilePicture("");
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
      setProfilePicture(data.secure_url);
      setUploadingErrorMsg("");
      setImageSrc(null);
    } catch (error) {
      console.error("Error cropping/uploading image:", error);
      setUploadingErrorMsg("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!user && !userLoading) {
      showMessage("Unauthorized Access", false);
    } else if (user && user.role != "ADMIN") {
      showMessage("Unauthorized Access", false);
    }
  }, [userLoading]);

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
            <h1 className="text-xl md:2xl font-semibold text-center">
              Admin Dashboard
            </h1>
            <h1 className="font-semibold text-center">Manage Users</h1>

            {/* Navigation buttons for Add, Edit, Delete */}
            <div className="flex flex-col md:flex-row gap-6 h-fit">
              <div className="flex flex-row md:flex-col h-fit gap-2 text-sm w-full md:w-fit border-b md:border-b-0 border-[#00000060] pb-6 md:pb-0 md:min-w-[200px]">
                <button
                  onClick={handleAddUser}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] text-[#9e6e3b] hover:text-white flex-1 text-center ${
                    focused === "add"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e]"
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={handleEditUser}
                  className={`p-2 px-4 rounded-xl border border-[#9e6e3b] hover:text-white flex-1 text-center text-[#9e6e3b] ${
                    focused === "edit"
                      ? "bg-[#9e6e3b] text-white hover:bg-[#9e6e3b]"
                      : "hover:bg-[#c29a6e]"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteUser}
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
                {addUser && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <h3 className="font-bold text-orange-800">Add User</h3>
                    <form
                      className="flex flex-col gap-2.5 text-sm"
                      onSubmit={handleAddUserSubmit}
                    >
                      <div>
                        <label className="mx-0.5">First Name*</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={3}
                          maxLength={100}
                          onChange={(e) => setFirstName(e.target.value)}
                          value={firstName}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Last Name</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          minLength={3}
                          maxLength={100}
                          onChange={(e) => setLastName(e.target.value)}
                          value={lastName}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Email*</label>
                        <input
                          type="email"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={3}
                          maxLength={100}
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Phone no*</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={13}
                          maxLength={13}
                          placeholder="+923001234567"
                          onChange={(e) => setPhoneNo(e.target.value)}
                          value={phoneNo}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Password*</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={3}
                          maxLength={20}
                          placeholder="********"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Role</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="">select a role</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SELLER">Seller</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Is Active</label>
                        <select
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                          value={isActive ? "true" : "false"}
                          onChange={(e) =>
                            setIsActive(e.target.value === "true")
                          }
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Profile Picture</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          value={""}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        />
                        {uploading && (
                          <p className="text-sm text-gray-500 mt-3">
                            Uploading...
                          </p>
                        )}
                        {uploadingErrorMsg && (
                          <p className="text-sm text-red-500 mt-3">
                            {uploadingErrorMsg}
                          </p>
                        )}
                        {/* Image Preview */}
                        {profilePicture != "" && (
                          <div className="relative w-fit mt-3">
                            <img
                              src={profilePicture}
                              alt={`Profile Picture`}
                              className="w-20 h-20 object-cover rounded-md border"
                            />
                            <div
                              onClick={() => {
                                removeImage();
                              }}
                              className="absolute p-0.5 right-0.5 top-0.5 bg-gray-50 cursor-pointer rounded-full text-red-500"
                            >
                              <FaMinus size={10} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          type="submit"
                          disabled={uploading}
                          className="p-3 px-4 rounded-xl border bg-[#9e6e3b] hover:bg-[#8a6034] text-white"
                        >
                          Add User
                        </button>
                        <button
                          type="reset"
                          onClick={resetForm}
                          className=" p-3 px-4 rounded-xl border bg-red-500 hover:bg-red-600 text-white"
                        >
                          Cancel
                        </button>
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
                {editUser && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <h3 className="font-bold text-orange-800">Edit User</h3>
                    <form
                      className="flex flex-col gap-2.5 text-sm"
                      onSubmit={handleEditUserSubmit}
                    >
                      <div>
                        <label className="mx-0.5">User*</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          onChange={(e) => {
                            if (e.target.value) {
                              fetchUserData(e.target.value);
                            }
                          }}
                          value={selectedUser ? selectedUser.id : ""}
                        >
                          <option value="">Select a user</option>
                          {users.map((user, i) => (
                            <option key={i} value={user.id}>
                              {user.firstName +
                                (user.lastName && " " + user.lastName) +
                                " (" +
                                user.email +
                                ")"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">User Id</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          value={selectedUser ? selectedUser.id : ""}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">First Name*</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={3}
                          maxLength={100}
                          onChange={(e) => setFirstName(e.target.value)}
                          value={firstName}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Last Name</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          minLength={3}
                          maxLength={100}
                          onChange={(e) => setLastName(e.target.value)}
                          value={lastName}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Email*</label>
                        <input
                          type="email"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={3}
                          maxLength={100}
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Phone no*</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={13}
                          maxLength={13}
                          placeholder="+923001234567"
                          onChange={(e) => setPhoneNo(e.target.value)}
                          value={phoneNo}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Password*</label>
                        <input
                          type="text"
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          minLength={3}
                          maxLength={20}
                          placeholder="********"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />
                      </div>
                      <div>
                        <label className="mx-0.5">Role</label>
                        <select
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                          required
                          value={role}
                          onChange={(e) =>
                            user?.id === selectedUser?.id
                              ? setRole("ADMIN")
                              : setRole(e.target.value)
                          }
                        >
                          <option value="">select a role</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SELLER">Seller</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Is Active</label>
                        <select
                          className="p-2 mt-0.5 px-4 rounded-xl border border-[#9e6e3b] w-full"
                          value={isActive ? "true" : "false"}
                          onChange={(e) =>
                            user?.id === selectedUser?.id
                              ? setIsActive(true)
                              : setIsActive(e.target.value === "true")
                          }
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                      <div>
                        <label className="mx-0.5">Profile Picture</label>
                        <input
                          type="file"
                          accept="image/*"
                          value={""}
                          onChange={handleFileChange}
                          className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        />
                        {uploading && (
                          <p className="text-sm text-gray-500 mt-3">
                            Uploading...
                          </p>
                        )}
                        {uploadingErrorMsg && (
                          <p className="text-sm text-red-500 mt-3">
                            {uploadingErrorMsg}
                          </p>
                        )}
                        {/* Image Preview */}
                        {profilePicture != "" && (
                          <div className="relative w-fit mt-3">
                            <img
                              src={profilePicture}
                              alt={`Profile Picture`}
                              className="w-20 h-20 object-cover rounded-md border"
                            />
                            <div
                              onClick={() => {
                                removeImage();
                              }}
                              className="absolute p-0.5 right-0.5 top-0.5 bg-gray-50 cursor-pointer rounded-full text-red-500"
                            >
                              <FaMinus size={10} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          type="submit"
                          disabled={uploading || selectedUserLoading}
                          className="p-3 px-4 rounded-xl border bg-[#9e6e3b] hover:bg-[#8a6034] text-white"
                        >
                          Update User
                        </button>
                        <button
                          type="reset"
                          onClick={resetForm}
                          className=" p-3 px-4 rounded-xl border bg-red-500 hover:bg-red-600 text-white"
                        >
                          Cancel
                        </button>
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
                {deleteUser && (
                  <div className="flex flex-col gap-4 md:max-w-[500px] md:border-l border-[#00000060] md:pl-6">
                    <h3 className="font-bold text-orange-800">Delete User</h3>
                    <form
                      className="flex flex-col gap-2 text-sm"
                      onSubmit={handleDeleteUserSubmit}
                    >
                      <label>Select User</label>
                      <select
                        className="p-2 px-4 mt-0.5 rounded-xl border border-[#9e6e3b] w-full"
                        required
                        onChange={(e) => {
                          if (e.target.value) {
                            fetchUserData(e.target.value);
                          }
                        }}
                        value={selectedUser ? selectedUser.id : ""}
                      >
                        <option value="">Select a user</option>
                        {users.map((user, i) => (
                          <option key={i} value={user.id}>
                            {user.firstName +
                              (user.lastName && " " + user.lastName) +
                              " (" +
                              user.email +
                              ")"}
                          </option>
                        ))}
                      </select>
                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          type="submit"
                          disabled={
                            !selectedUser ||
                            user?.id === selectedUser?.id ||
                            selectedUserLoading
                          }
                          className="p-3 px-4 mt-2 rounded-xl border bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 disabled:hover:bg-red-500"
                        >
                          Delete User
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
