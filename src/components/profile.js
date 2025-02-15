"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useAuthUser from "@/hooks/authUser";
import { triggerNotification } from "@/redux/notificationThunk";

function Profile() {
  const dispatch = useDispatch();
  const { user, userLoading, logout } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const defaultProfilePictureLink =
    "https://lh3.googleusercontent.com/pw/AP1GczM2cnSQPHG8oKKskeSFKCFjs3z_NG31Tt4bQPqb4Fp-Qdteh0m-84BjSvDgQTkscceDPu1eD1Rs2OxUSd0InRuqnowixs1x8kqSVIcu_7BbkBi4XFK13ZqIeq56OxPw0bzq0hoUgYtTHteuYB1cTI-K=w883-h883-s-no-gm";

  const username = user?.firstName + " " + user?.lastName;

  const showMessage = (msg, state) => {
    dispatch(
      triggerNotification({
        msg: msg,
        success: state,
      })
    );
  };

  const handleLogout = () => {
    logout();
    showMessage("Successfully loged out", true);
  };

  return (
    <div className=" backdrop-blur-lg bg-[#0000002c] shadow-lg drop-shadow rounded-xl p-8 w-full max-w-[300px] ">
      <div className="w-full flex flex-col gap-3 items-center justify-center text-white">
        <div className="flex flex-col gap-1 items-center justify-center">
          <img
            className="aspect-square h-20 bg-gray-100 rounded-full "
            alt={username}
            src={user?.profilePicture || defaultProfilePictureLink}
          />
          <p className="text-lg md:text-xl font-bold text-center text-white">
            {username}
          </p>
        </div>
        <div className="flex flex-col gap-1 items-start justify-center text-sm">
          <p>
            <strong>Email: </strong> {user?.email}
          </p>
          <p>
            <strong>Phone Number: </strong> {user?.phoneNo}
          </p>
          <p>
            <strong>Role: </strong> {user?.role.toLowerCase()}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg p-1 px-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
